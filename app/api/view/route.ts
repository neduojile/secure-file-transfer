import fs from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { decryptBuffer } from "@/lib/encryption/aes";
import { calculateSHA256 } from "@/lib/hash/sha256";

const TEXT_TYPES = [
  "text/plain",
  "text/markdown",
  "application/json",
  "application/xml",
  "text/xml",
  "text/csv",
];

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          error: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    const id = req.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          error: "Missing file id.",
        },
        {
          status: 400,
        }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found.",
        },
        {
          status: 404,
        }
      );
    }

    const transfer = await prisma.fileTransfer.findUnique({
      where: {
        id,
      },
      include: {
        sender: true,
      },
    });

    if (!transfer) {
      return NextResponse.json(
        {
          error: "File not found.",
        },
        {
          status: 404,
        }
      );
    }

    if (transfer.receiverId !== user.id) {
      return NextResponse.json(
        {
          error: "Access denied.",
        },
        {
          status: 403,
        }
      );
    }

    // File must have been delivered before it can be viewed
    if (transfer.status !== "DELIVERED") {
      return NextResponse.json(
        {
          error: "File has not been delivered yet.",
        },
        {
          status: 403,
        }
      );
    }

    let buffer = await fs.readFile(transfer.filePath);

    if (transfer.encrypted) {
      buffer = decryptBuffer(
        buffer,
        Buffer.from(transfer.iv!, "hex")
      );
    }

    const currentHash = calculateSHA256(buffer);

    const integrityVerified =
      currentHash === transfer.hash;

    let preview =
      "Preview is not available for this file type.";

    if (TEXT_TYPES.includes(transfer.fileType)) {
      preview = buffer.toString("utf8");
    }

    return NextResponse.json({
      id: transfer.id,
      fileName: transfer.fileName,
      fileType: transfer.fileType,
      fileSize: transfer.fileSize,

      encrypted: transfer.encrypted,

      sender: transfer.sender.fullName,
      senderEmail: transfer.sender.email,

      status: transfer.status,
      downloadCount: transfer.downloadCount,
      deliveredAt: transfer.updatedAt,

      storedHash: transfer.hash,
      currentHash,
      integrityVerified,

      preview,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Unable to preview file.",
      },
      {
        status: 500,
      }
    );
  }
}