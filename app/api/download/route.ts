import fs from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { decryptBuffer } from "@/lib/encryption/aes";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const searchParams = req.nextUrl.searchParams;

    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing file id." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    const transfer = await prisma.fileTransfer.findUnique({
      where: {
        id,
      },
    });

    if (!transfer) {
      return NextResponse.json(
        { error: "File not found." },
        { status: 404 }
      );
    }

    if (transfer.receiverId !== user.id) {
      return NextResponse.json(
        { error: "Access denied." },
        { status: 403 }
      );
    }

    let fileBuffer = await fs.readFile(
      transfer.filePath
    );

    if (transfer.encrypted) {
      fileBuffer = decryptBuffer(
        fileBuffer,
        Buffer.from(transfer.iv!, "hex")
      );
    }
await prisma.fileTransfer.update({
    where: {
        id,
    },
    data: {
        downloadCount: {
            increment: 1,
        },
    },
});
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Disposition": `attachment; filename="${transfer.fileName}"`,
        "Content-Type":
          transfer.fileType ||
          "application/octet-stream",
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Download failed.",
      },
      {
        status: 500,
      }
    );
  }
}