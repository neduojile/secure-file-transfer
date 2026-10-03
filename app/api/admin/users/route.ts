import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return null;
  }

  if (session.user.role !== "ADMIN") {
    return null;
  }

  return session;
}

export async function GET() {
  const session = await requireAdmin();

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 403 }
    );
  }

  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      department: true,
      isBlocked: true,
      createdAt: true,
      _count: {
        select: {
          sentFiles: true,
          receivedFiles: true,
          securityLogs: true,
        },
      },
    },
  });

  return NextResponse.json({
    success: true,
    users,
  });
}

export async function PATCH(request: Request) {
  const session = await requireAdmin();

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();

    const { userId, action } = body;

    if (!userId || !["block", "unblock"].includes(action)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid user action.",
        },
        { status: 400 }
      );
    }

    if (userId === session.user.id) {
      return NextResponse.json(
        {
          success: false,
          message: "You cannot change the status of your own admin account.",
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isBlocked: action === "block",
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        department: true,
        isBlocked: true,
      },
    });

    return NextResponse.json({
      success: true,
      message:
        action === "block"
          ? "User account blocked successfully."
          : "User account unblocked successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("ADMIN USER STATUS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update user account.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const session = await requireAdmin();

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const userId = body.userId;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required.",
        },
        { status: 400 }
      );
    }

    if (userId === session.user.id) {
      return NextResponse.json(
        {
          success: false,
          message: "You cannot delete your own admin account.",
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        sentFiles: true,
        receivedFiles: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 }
      );
    }

    const transferIds = [
      ...user.sentFiles.map((transfer) => transfer.id),
      ...user.receivedFiles.map((transfer) => transfer.id),
    ];

    await prisma.$transaction(async (tx) => {
      if (transferIds.length > 0) {
        await tx.securityLog.deleteMany({
          where: {
            transferId: {
              in: transferIds,
            },
          },
        });
      }

      await tx.securityLog.deleteMany({
        where: {
          userId,
        },
      });

      await tx.notification.deleteMany({
        where: {
          userId,
        },
      });

      if (transferIds.length > 0) {
        await tx.fileTransfer.deleteMany({
          where: {
            id: {
              in: transferIds,
            },
          },
        });
      }

      await tx.user.delete({
        where: {
          id: userId,
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: "User account deleted successfully.",
    });
  } catch (error) {
    console.error("ADMIN USER DELETE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to delete this account. The account may still have protected records.",
      },
      { status: 500 }
    );
  }
}
