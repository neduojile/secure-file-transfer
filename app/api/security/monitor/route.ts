import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
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
    });

    const securityLogs = await prisma.securityLog.findMany({
      where: {
        OR: [
          {
            userId: session.user.id,
          },
          {
            transfer: {
              senderId: session.user.id,
            },
          },
          {
            transfer: {
              receiverId: session.user.id,
            },
          },
        ],
      },
      include: {
        transfer: {
          select: {
            fileName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 15,
    });

    return NextResponse.json({
      success: true,
      transfers,
      securityLogs,
    });
  } catch (error) {
    console.error("SECURITY MONITOR ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to fetch security data.",
      },
      {
        status: 500,
      }
    );
  }
}
