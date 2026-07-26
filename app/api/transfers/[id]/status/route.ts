import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        {
          error: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    const { id } = await params;

    const transfer = await prisma.fileTransfer.findUnique({
      where: {
        id,
      },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        receiver: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        securityLogs: {
          orderBy: {
            createdAt: "desc",
          },
        },
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

    // Only the sender or receiver can view this transfer
    if (
      transfer.senderId !== session.user.id &&
      transfer.receiverId !== session.user.id
    ) {
      return NextResponse.json(
        {
          error: "Forbidden.",
        },
        {
          status: 403,
        }
      );
    }

    return NextResponse.json({
      success: true,
      transfer,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Unable to fetch transfer.",
      },
      {
        status: 500,
      }
    );
  }
}