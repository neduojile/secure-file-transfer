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

    const files = await prisma.fileTransfer.findMany({
      where: {
        senderId: session.user.id,
      },
      include: {
        receiver: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      files,
    });
  } catch (error) {
    console.error("MY TRANSFERS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to fetch transfers.",
      },
      {
        status: 500,
      }
    );
  }
}
