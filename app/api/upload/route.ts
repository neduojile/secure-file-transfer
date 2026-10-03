import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { saveUploadedFile } from "@/lib/storage/upload";

const DOCUMENT_TYPES = [
  "EXAMINATION",
  "RESULT",
  "PROJECT",
  "ASSIGNMENT",
  "STUDENT_RECORD",
  "DEPARTMENTAL",
  "ADMINISTRATIVE",
  "RESEARCH",
  "OTHER",
] as const;

const CONFIDENTIALITY_LEVELS = [
  "PUBLIC",
  "INTERNAL",
  "CONFIDENTIAL",
  "HIGHLY_CONFIDENTIAL",
] as const;

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const formData = await req.formData();

    const files = formData
      .getAll("files")
      .filter((item): item is File => item instanceof File);

    const singleFile = formData.get("file");

    if (
      files.length === 0 &&
      singleFile instanceof File
    ) {
      files.push(singleFile);
    }

    const receiverEmail = formData
      .get("receiverEmail")
      ?.toString()
      .trim()
      .toLowerCase();

    const documentType =
      formData.get("documentType")?.toString() || "OTHER";

    const department =
      formData.get("department")?.toString().trim() || null;

    const confidentiality =
      formData.get("confidentiality")?.toString() || "CONFIDENTIAL";

    const description =
      formData.get("description")?.toString().trim() || null;

    const encrypt = formData.get("encrypt") !== "false";

    if (files.length === 0) {
      return NextResponse.json(
        { error: "Please select at least one document." },
        { status: 400 }
      );
    }

    if (!receiverEmail) {
      return NextResponse.json(
        { error: "Receiver email is required." },
        { status: 400 }
      );
    }

    if (
      !DOCUMENT_TYPES.includes(
        documentType as (typeof DOCUMENT_TYPES)[number]
      )
    ) {
      return NextResponse.json(
        { error: "Invalid document type." },
        { status: 400 }
      );
    }

    if (
      !CONFIDENTIALITY_LEVELS.includes(
        confidentiality as (typeof CONFIDENTIALITY_LEVELS)[number]
      )
    ) {
      return NextResponse.json(
        { error: "Invalid confidentiality level." },
        { status: 400 }
      );
    }

    const sender = await prisma.user.findUnique({
      where: {
        id: session.user.id,
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
          error: "You cannot send a document to yourself.",
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

    const batchId = files.length > 1 ? randomUUID() : null;

    const transfers = [];

    for (const file of files) {
      if (file.size === 0) {
        continue;
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
          fileType:
            file.type || "application/octet-stream",
          encrypted: uploadedFile.encrypted,
          hash: uploadedFile.hash,
          iv: uploadedFile.iv,

          documentType:
            documentType as (typeof DOCUMENT_TYPES)[number],

          department,
          confidentiality:
            confidentiality as (typeof CONFIDENTIALITY_LEVELS)[number],

          description,

          senderId: sender.id,
          receiverId: receiver.id,
          receiverEmail: receiver.email,

          batchId,

          status: "PENDING",
          integrity: "PENDING",
          attackAction: "NONE",
        },
      });

      await prisma.securityLog.create({
        data: {
          action: "UPLOAD_STARTED",
          description:
            `Academic document "${file.name}" upload started.`,
          securityLevel:
            confidentiality === "HIGHLY_CONFIDENTIAL"
              ? "HIGH"
              : confidentiality === "CONFIDENTIAL"
                ? "MEDIUM"
                : "LOW",
          attackDetected: false,
          userId: sender.id,
          transferId: transfer.id,
        },
      });

      let currentStatus = transfer.status;

      const transitions = {
        PENDING: "ENCRYPTING",
        ENCRYPTING: "SENDING",
        SENDING: "IN_TRANSIT",
      } as const;

      while (currentStatus !== "IN_TRANSIT") {
        const nextStatus =
          transitions[
            currentStatus as keyof typeof transitions
          ];

        if (!nextStatus) {
          break;
        }

        const updated =
          await prisma.fileTransfer.update({
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
            description:
              `Document "${file.name}" moved from ${currentStatus} to ${nextStatus}.`,
            securityLevel:
              confidentiality === "HIGHLY_CONFIDENTIAL"
                ? "HIGH"
                : confidentiality === "CONFIDENTIAL"
                  ? "MEDIUM"
                  : "LOW",
            attackDetected: false,
            userId: sender.id,
            transferId: transfer.id,
          },
        });

        currentStatus = updated.status;
      }

      transfers.push({
        id: transfer.id,
        fileName: transfer.fileName,
        status: currentStatus,
        batchId,
      });
    }

    if (transfers.length === 0) {
      return NextResponse.json(
        {
          error: "No valid files were uploaded.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      batchId,
      totalFiles: transfers.length,
      transfers,
      status: "IN_TRANSIT",
      message:
        transfers.length > 1
          ? `${transfers.length} academic documents are now in transit.`
          : "Academic document is now in transit.",
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return NextResponse.json(
      {
        error:
          "Something went wrong while uploading the academic document.",
      },
      {
        status: 500,
      }
    );
  }
}
