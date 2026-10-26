import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized." },
        { status: 401 }
      );
    }

    if (session.user.role !== "ATTACKER") {
      return NextResponse.json(
        { success: false, error: "Forbidden." },
        { status: 403 }
      );
    }

    const { transferId } = await req.json();

    if (!transferId) {
      return NextResponse.json(
        { success: false, error: "Transfer ID is required." },
        { status: 400 }
      );
    }

    const transfer = await prisma.fileTransfer.findUnique({
      where: {
        id: transferId,
      },
      include: {
        sender: true,
      },
    });

    if (!transfer) {
      return NextResponse.json(
        { success: false, error: "Packet not found." },
        { status: 404 }
      );
    }

    if (transfer.status !== "IN_TRANSIT") {
      return NextResponse.json(
        {
          success: false,
          error: "Packet is no longer in transit.",
        },
        { status: 400 }
      );
    }

    const updated = await prisma.fileTransfer.update({
      where: {
        id: transfer.id,
      },
      data: {
        status: "VERIFYING",
        attackAction: "FORWARDED",
        interceptedAt: new Date(),
        currentHash: transfer.hash,
      },
    });

    await prisma.securityLog.create({
      data: {
        action: "PACKET_INTERCEPTED",
        description:
          `Packet "${transfer.fileName}" was intercepted and forwarded without modification.`,
        securityLevel: "MEDIUM",
        attackDetected: false,
        userId: session.user.id,
        transferId: transfer.id,
      },
    });

    const verified = transfer.hash === updated.currentHash;

    const finalTransfer = await prisma.fileTransfer.update({
      where: {
        id: transfer.id,
      },
      data: {
        status: "DELIVERED",
        integrity: verified ? "VERIFIED" : "COMPROMISED",
        verifiedAt: new Date(),
      },
    });

    await prisma.securityLog.create({
      data: {
        action: verified
          ? "INTEGRITY_VERIFIED"
          : "INTEGRITY_COMPROMISED",
        description: verified
          ? `SHA-256 verification passed for "${transfer.fileName}". The document was delivered without modification.`
          : `SHA-256 verification failed for "${transfer.fileName}".`,
        securityLevel: verified ? "LOW" : "HIGH",
        attackDetected: !verified,
        userId: session.user.id,
        transferId: transfer.id,
      },
    });

    await prisma.securityLog.create({
      data: {
        action: "DELIVERED",
        description:
          `Packet "${transfer.fileName}" delivered after integrity verification.`,
        securityLevel: verified ? "LOW" : "HIGH",
        attackDetected: !verified,
        userId: transfer.senderId,
        transferId: transfer.id,
      },
    });

    await prisma.notification.createMany({
      data: [
        {
          userId: transfer.senderId,
          title: "Document Forwarded",
          message: `"${transfer.fileName}" was forwarded. Integrity: ${finalTransfer.integrity}.`,
        },
        ...(transfer.receiverId
          ? [{
              userId: transfer.receiverId,
              title: "Incoming Academic Document",
              message: `"${transfer.fileName}" from ${transfer.sender.fullName} has arrived. Integrity: ${finalTransfer.integrity}.`,
            }]
          : []),
      ],
    });

    return NextResponse.json({
      success: true,
      delivered: true,
      attackDetected: !verified,
      integrity: finalTransfer.integrity,
      attackAction: finalTransfer.attackAction,
      status: finalTransfer.status,
      message:
        "Packet intercepted, forwarded, and integrity verified successfully.",
    });
  } catch (error) {
    console.error("FORWARD ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to forward packet.",
      },
      {
        status: 500,
      }
    );
  }
}
