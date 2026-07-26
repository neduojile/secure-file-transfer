import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { saveUploadedFile } from "@/lib/storage/upload";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const senderId = session.user.id;

    const formData = await req.formData();

    const file = formData.get("file") as File | null;

    const receiverEmail = formData
      .get("receiverEmail")
      ?.toString()
      .trim()
      .toLowerCase();

    const encrypt = formData.get("encrypt") === "true";

    if (!file) {
      return NextResponse.json(
        { error: "Please select a file." },
        { status: 400 }
      );
    }

    if (!receiverEmail) {
      return NextResponse.json(
        { error: "Receiver email is required." },
        { status: 400 }
      );
    }

    const sender = await prisma.user.findUnique({
      where: {
        id: senderId,
      },
    });

    if (!sender) {
      return NextResponse.json(
        { error: "Sender not found." },
        { status: 404 }
      );
    }

    if (sender.email.toLowerCase() === receiverEmail) {
      return NextResponse.json(
        {
          error: "You cannot send a file to yourself.",
        },
        { status: 400 }
      );
    }

    const receiver = await prisma.user.findUnique({
      where: {
        email: receiverEmail,
      },
    });

    if (!receiver) {
      return NextResponse.json(
        {
          error: "Receiver account not found.",
        },
        { status: 404 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadedFile = await saveUploadedFile(
      buffer,
      file.name,
      encrypt
    );

    const transfer = await prisma.fileTransfer.create({
      data: {
        fileName: file.name,
        storedName: uploadedFile.storedName,
        filePath: uploadedFile.filePath,
        fileSize: file.size,
        fileType: file.type,
        encrypted: uploadedFile.encrypted,
        hash: uploadedFile.hash,
        iv: uploadedFile.iv,
        senderId: sender.id,
        receiverId: receiver.id,
        receiverEmail: receiver.email,
        status: "PENDING",
      },
    });

    await prisma.securityLog.create({
      data: {
        action: "UPLOAD_STARTED",
        description: `Upload started for ${file.name}`,
        securityLevel: "LOW",
        attackDetected: false,
        userId: sender.id,
        transferId: transfer.id,
      },
    });

// Automatically move the transfer to IN_TRANSIT
let currentStatus = transfer.status;

const transitions = {
  PENDING: "ENCRYPTING",
  ENCRYPTING: "SENDING",
  SENDING: "IN_TRANSIT",
} as const;

while (currentStatus !== "IN_TRANSIT") {
  const nextStatus =
    transitions[currentStatus as keyof typeof transitions];

  if (!nextStatus) break;

  const updated = await prisma.fileTransfer.update({
    where: {
      id: transfer.id,
    },
    data: {
      status: nextStatus,
    },
  });

  await prisma.securityLog.create({
    data: {
      action: nextStatus,
      description: `Transfer moved from ${currentStatus} to ${nextStatus}`,
      securityLevel: "LOW",
      attackDetected: false,
      userId: sender.id,
      transferId: transfer.id,
    },
  });

  currentStatus = updated.status;
}

return NextResponse.json({
  success: true,
  transferId: transfer.id,
  status: currentStatus,
  message: "Packet intercepted by attacker.",
});
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Something went wrong while uploading the file.",
      },
      {
        status: 500,
      }
    );
  }
}