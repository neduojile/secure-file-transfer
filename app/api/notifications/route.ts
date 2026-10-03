import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized." },
        { status: 401 }
      );
    }

    const notifications = await prisma.notification.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    });

    const unreadCount = notifications.filter(
      (notification) => !notification.isRead
    ).length;

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error("NOTIFICATIONS GET ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to load notifications.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized." },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));

    if (body.all === true) {
      await prisma.notification.updateMany({
        where: {
          userId: session.user.id,
          isRead: false,
        },
        data: {
          isRead: true,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Notifications marked as read.",
      });
    }

    if (body.id) {
      await prisma.notification.updateMany({
        where: {
          id: body.id,
          userId: session.user.id,
        },
        data: {
          isRead: true,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Notification marked as read.",
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: "Notification ID or all=true is required.",
      },
      {
        status: 400,
      }
    );
  } catch (error) {
    console.error("NOTIFICATIONS PATCH ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to update notifications.",
      },
      {
        status: 500,
      }
    );
  }
}
