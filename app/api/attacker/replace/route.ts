import { calculateSHA256 } from "@/lib/hash/sha256";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { saveUploadedFile } from "@/lib/storage/upload";

import fs from "fs/promises";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    if (session.user.role !== "ATTACKER") {
      return NextResponse.json(
        {
          success: false,
          error: "Access denied.",
        },
        {
          status: 403,
        }
      );
    }

    const formData = await req.formData();

    const transferId = formData.get("transferId")?.toString();
    const replacement = formData.get("file");

    if (
      !transferId ||
      !(replacement instanceof File)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing replacement file.",
        },
        {
          status: 400,
        }
      );
    }

    const transfer = await prisma.fileTransfer.findUnique({
      where: {
        id: transferId,
      },
    });

    if (!transfer) {
      return NextResponse.json(
        {
          success: false,
          error: "Packet not found.",
        },
        {
          status: 404,
        }
      );
    }

    if (transfer.status !== "IN_TRANSIT") {
      return NextResponse.json(
        {
          success: false,
          error: "Only packets in transit can be modified.",
        },
        {
          status: 400,
        }
      );
    }

    if (transfer.encrypted) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Encrypted files cannot be replaced in this simulation. Use an unencrypted test document to demonstrate modification detection.",
        },
        {
          status: 403,
        }
      );
    }

    const replacementBuffer = Buffer.from(
      await replacement.arrayBuffer()
    );

    const replacementHash =
      calculateSHA256(replacementBuffer);

    const upload = await saveUploadedFile(
      replacementBuffer,
      replacement.name,
      false
    );

    try {
      await fs.unlink(transfer.filePath);
    } catch {
      // The original file may already be unavailable.
    }

    const attackDetected = transfer.hash !== replacementHash;

    const modifiedTransfer =
      await prisma.fileTransfer.update({
        where: {
          id: transfer.id,
        },
        data: {
          fileName: replacement.name,
          fileSize: replacement.size,
          fileType:
            replacement.type ||
            "application/octet-stream",

          storedName: upload.storedName,
          filePath: upload.filePath,

          currentHash: replacementHash,
          attackAction: "MODIFIED",
          interceptedAt: new Date(),
          integrity: attackDetected
            ? "COMPROMISED"
            : "VERIFIED",

          status: "ATTACK_DETECTED",
        },
      });

    await prisma.securityLog.create({
      data: {
        action: "FILE_MODIFIED",
        attackDetected,
        securityLevel: "HIGH",
        description:
          `MITM simulation replaced "${transfer.fileName}" with "${replacement.name}". Original and replacement SHA-256 hashes were compared.`,
        userId: session.user.id,
        transferId: transfer.id,
      },
    });

    await prisma.fileTransfer.update({
      where: {
        id: transfer.id,
      },
      data: {
        status: "VERIFYING",
      },
    });

    await prisma.securityLog.create({
      data: {
        action: "INTEGRITY_CHECK",
        attackDetected,
        securityLevel: "HIGH",
        description:
          `Receiver compared the original SHA-256 hash with the intercepted document hash.`,
        userId: session.user.id,
        transferId: transfer.id,
      },
    });

    const finalTransfer =
      await prisma.fileTransfer.update({
        where: {
          id: transfer.id,
        },
        data: {
          status: "DELIVERED",
          integrity: attackDetected
            ? "COMPROMISED"
            : "VERIFIED",
          verifiedAt: new Date(),
        },
      });

    await prisma.securityLog.create({
      data: {
        action: attackDetected
          ? "INTEGRITY_COMPROMISED"
          : "INTEGRITY_VERIFIED",
        attackDetected,
        securityLevel: attackDetected
          ? "HIGH"
          : "LOW",
        description: attackDetected
          ? `Integrity verification detected that "${replacement.name}" differs from the original document.`
          : `Integrity verification passed for "${replacement.name}".`,
        userId: session.user.id,
        transferId: transfer.id,
      },
    });

    await prisma.securityLog.create({
      data: {
        action: "DELIVERED",
        attackDetected,
        securityLevel: attackDetected
          ? "HIGH"
          : "LOW",
        description: attackDetected
          ? `Modified document "${replacement.name}" was delivered after the simulated MITM attack was recorded.`
          : `Document "${replacement.name}" was delivered after verification.`,
        userId: transfer.senderId,
        transferId: transfer.id,
      },
    });

    return NextResponse.json({
      success: true,
      delivered: true,
      attackDetected,
      integrity: finalTransfer.integrity,
      attackAction: finalTransfer.attackAction,
      status: finalTransfer.status,
      originalHash: transfer.hash,
      currentHash: replacementHash,
      message: attackDetected
        ? "File replaced and forwarded. Integrity compromise detected."
        : "File replaced and forwarded. Integrity verification passed.",
    });
  } catch (error) {
    console.error("REPLACE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to replace file.",
      },
      {
        status: 500,
      }
    );
  }
}

