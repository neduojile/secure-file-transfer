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

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          error: "Administrator access required.",
        },
        {
          status: 403,
        }
      );
    }

    const [
      totalTransfers,
      inTransit,
      detectedAttacks,
      compromised,
      verified,
      delivered,
      intercepted,
      modified,
      forwarded,
      encrypted,
      recentTransfers,
      recentLogs,
    ] = await Promise.all([
      prisma.fileTransfer.count(),

      prisma.fileTransfer.count({
        where: {
          status: {
            in: [
              "PENDING",
              "ENCRYPTING",
              "SENDING",
              "IN_TRANSIT",
              "ATTACK_DETECTED",
              "VERIFYING",
            ],
          },
        },
      }),

      prisma.securityLog.count({
        where: {
          attackDetected: true,
        },
      }),

      prisma.fileTransfer.count({
        where: {
          integrity: "COMPROMISED",
        },
      }),

      prisma.fileTransfer.count({
        where: {
          integrity: "VERIFIED",
        },
      }),

      prisma.fileTransfer.count({
        where: {
          status: "DELIVERED",
        },
      }),

      prisma.fileTransfer.count({
        where: {
          interceptedAt: {
            not: null,
          },
        },
      }),

      prisma.fileTransfer.count({
        where: {
          attackAction: "MODIFIED",
        },
      }),

      prisma.fileTransfer.count({
        where: {
          attackAction: "FORWARDED",
        },
      }),

      prisma.fileTransfer.count({
        where: {
          encrypted: true,
        },
      }),

      prisma.fileTransfer.findMany({
        orderBy: {
          updatedAt: "desc",
        },
        take: 40,
        include: {
          sender: {
            select: {
              id: true,
              fullName: true,
              email: true,
              role: true,
              department: true,
            },
          },
          receiver: {
            select: {
              id: true,
              fullName: true,
              email: true,
              role: true,
              department: true,
            },
          },
        },
      }),

      prisma.securityLog.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: 50,
        include: {
          user: {
            select: {
              fullName: true,
              email: true,
              role: true,
            },
          },
          transfer: {
            select: {
              id: true,
              fileName: true,
              status: true,
              attackAction: true,
              integrity: true,
              encrypted: true,
              hash: true,
              currentHash: true,
              interceptedAt: true,
              verifiedAt: true,
            },
          },
        },
      }),
    ]);

    const activeTransfers = recentTransfers.filter(
      (transfer) =>
        transfer.status !== "DELIVERED" &&
        transfer.status !== "REJECTED"
    );

    const latestAttacks = recentLogs.filter(
      (log) => log.attackDetected
    );

    const networkEvents = recentLogs.slice(0, 20).map((log) => ({
      id: log.id,
      timestamp: log.createdAt,
      action: log.action,
      attackDetected: log.attackDetected,
      securityLevel: log.securityLevel,
      description: log.description,
      user: log.user,
      transfer: log.transfer,
    }));

    return NextResponse.json({
      success: true,

      statistics: {
        totalTransfers,
        inTransit,
        detectedAttacks,
        compromised,
        verified,
        delivered,
        intercepted,
        modified,
        forwarded,
        encrypted,
        activeConnections: activeTransfers.length,
      },

      network: {
        activeTransfers,
        latestAttacks,
        events: networkEvents,
      },

      recentTransfers,
      recentLogs,

      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("ADMIN SECURITY API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to load administrator security data.",
      },
      {
        status: 500,
      }
    );
  }
}
