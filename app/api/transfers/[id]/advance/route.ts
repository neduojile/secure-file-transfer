import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const stateMachine = {
  PENDING: "ENCRYPTING",
  ENCRYPTING: "SENDING",
  SENDING: "IN_TRANSIT",
  VERIFYING: "DELIVERED",
} as const;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const transfer = await prisma.fileTransfer.findUnique({
      where: {
        id,
      },
    });

    if (!transfer) {
      return NextResponse.json(
        {
          error: "Transfer not found.",
        },
        {
          status: 404,
        }
      );
    }

    const currentStatus = transfer.status;

    // Final states cannot be advanced
    if (
      currentStatus === "DELIVERED" ||
      currentStatus === "REJECTED" ||
      currentStatus === "ATTACK_DETECTED" ||
      currentStatus === "IN_TRANSIT"
    ) {
      return NextResponse.json({
        success: true,
        completed: true,
        status: currentStatus,
      });
    }

    const nextStatus =
      stateMachine[
        currentStatus as keyof typeof stateMachine
      ];

    if (!nextStatus) {
      return NextResponse.json(
        {
          error: "Invalid transfer state.",
        },
        {
          status: 400,
        }
      );
    }

    const updatedTransfer = await prisma.fileTransfer.update({
      where: {
        id,
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
    userId: transfer.senderId,
    transferId: transfer.id,
  },
});

    return NextResponse.json({
      success: true,
      completed: false,
      status: updatedTransfer.status,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Unable to advance transfer.",
      },
      {
        status: 500,
      }
    );
  }
}