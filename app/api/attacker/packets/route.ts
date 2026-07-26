import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
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

    const packets = await prisma.fileTransfer.findMany({
      where: {
        status: "IN_TRANSIT",
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

    const totalPackets = packets.length;

    const encryptedPackets = packets.filter(
      (packet) => packet.encrypted
    ).length;

    const plainPackets = totalPackets - encryptedPackets;

    return NextResponse.json({
      success: true,
      statistics: {
        totalPackets,
        encryptedPackets,
        plainPackets,
      },
      packets,
    });
  } catch (error) {
    console.error("Packet API Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load intercepted packets.",
      },
      {
        status: 500,
      }
    );
  }
}