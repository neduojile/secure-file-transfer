import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { saveUploadedFile } from "@/lib/storage/upload";


import fs from "fs/promises";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    console.log("SESSION:", session);
console.log("ROLE:", session?.user?.role);
console.log("EMAIL:", session?.user?.email);

    if (!session?.user?.email) {
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

    const attacker = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!attacker) {
      return NextResponse.json(
        {
          success: false,
          error: "Attacker not found.",
        },
        {
          status: 404,
        }
      );
    }

    const formData = await req.formData();

    const transferId = formData.get("transferId") as string;
    const replacement = formData.get("file") as File;

    if (!transferId || !replacement) {
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
          error: "Encrypted files cannot be replaced.",
        },
        {
          status: 403,
        }
      );
    }

    const bytes = await replacement.arrayBuffer();

    const buffer = Buffer.from(bytes);

    const upload = await saveUploadedFile(
      buffer,
      replacement.name,
      false
    );

    try {
      await fs.unlink(transfer.filePath);
    } catch {
      // Ignore if the old file cannot be deleted.
    }

await prisma.fileTransfer.update({
  where: {
    id: transfer.id,
  },
  data: {
    fileName: replacement.name,
    fileSize: replacement.size,
    fileType: replacement.type || "application/octet-stream",

    storedName: upload.storedName,
    filePath: upload.filePath,

    status: "ATTACK_DETECTED",
  },
});


    await prisma.securityLog.create({
      data: {
        action: "FILE_REPLACED",
        attackDetected: true,
        securityLevel: "HIGH",
        description: `Attacker replaced "${transfer.fileName}" with "${replacement.name}".`,
        userId: attacker.id,
        transferId: transfer.id,
      },
    });

    // Simulate integrity verification after attack detection
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
    action: "VERIFYING",
    description: "Receiver is verifying the integrity of the modified file.",
    securityLevel: "HIGH",
    attackDetected: true,
    userId: attacker.id,
    transferId: transfer.id,
  },
});

await prisma.fileTransfer.update({
  where: {
    id: transfer.id,
  },
  data: {
    status: "DELIVERED",
  },
});

await prisma.securityLog.create({
  data: {
    action: "DELIVERED",
    description: "Modified file delivered after verification.",
    securityLevel: "HIGH",
    attackDetected: true,
    userId: attacker.id,
    transferId: transfer.id,
  },
});

    return NextResponse.json({
      success: true,
      message: "Replacement uploaded successfully.",
    });
  } catch (error) {
    console.error(error);

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