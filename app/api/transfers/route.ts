import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
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

    const transfers = await prisma.fileTransfer.findMany({
      where: {
        OR: [
          {
            senderId: session.user.id,
          },
          {
            receiverId: session.user.id,
          },
        ],
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
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      count: transfers.length,
      transfers,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Unable to fetch transfers.",
      },
      {
        status: 500,
      }
    );
  }
}