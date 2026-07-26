import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.user.role !== "ATTACKER") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const { transferId } = await req.json();

    if (!transferId) {
      return NextResponse.json(
        { error: "Transfer ID is required." },
        { status: 400 }
      );
    }

    const transfer = await prisma.fileTransfer.findUnique({
      where: {
        id: transferId,
      },
    });

    if (!transfer) {
      return NextResponse.json(
        { error: "Packet not found." },
        { status: 404 }
      );
    }

    if (transfer.status !== "IN_TRANSIT") {
      return NextResponse.json(
        { error: "Packet is no longer in transit." },
        { status: 400 }
      );
    }

// Move packet to VERIFYING
const updatedTransfer = await prisma.fileTransfer.update({
  where: {
    id: transferId,
  },
  data: {
    status: "VERIFYING",
  },
});

// Log forwarding
await prisma.securityLog.create({
  data: {
    action: "PACKET_FORWARDED",
    description: `Packet ${transfer.fileName} forwarded by attacker.`,
    securityLevel: "MEDIUM",
    attackDetected: false,
    userId: session.user.id,
    transferId: transfer.id,
  },
});

// Simulate receiver verification
await prisma.fileTransfer.update({
  where: {
    id: transferId,
  },
  data: {
    status: "DELIVERED",
  },
});

await prisma.securityLog.create({
  data: {
    action: "DELIVERED",
    description: `Packet delivered successfully after verification.`,
    securityLevel: "LOW",
    attackDetected: false,
    userId: transfer.senderId,
    transferId: transfer.id,
  },
});

    await prisma.securityLog.create({
      data: {
        action: "PACKET_FORWARDED",
        description: `Packet ${transfer.fileName} forwarded by attacker.`,
        securityLevel: "MEDIUM",
        attackDetected: true,
        userId: session.user.id,
        transferId: transfer.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Packet forwarded successfully.",
    });
  } catch (error) {
    console.error(error);

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