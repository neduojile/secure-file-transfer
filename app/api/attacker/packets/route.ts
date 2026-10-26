import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized", statistics: null, packets: [] },
        { status: 401 }
      );
    }

    if (session.user.role !== "ATTACKER") {
      return NextResponse.json(
        { success: false, error: "Forbidden", statistics: null, packets: [] },
        { status: 403 }
      );
    }

    const packets = await prisma.fileTransfer.findMany({
      where: { status: "IN_TRANSIT" },
      include: {
        sender: {
          select: { id: true, fullName: true, email: true },
        },
        receiver: {
          select: { id: true, fullName: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const encryptedPackets = packets.filter(
      (packet) => packet.encrypted
    ).length;

    return NextResponse.json(
      {
        success: true,
        statistics: {
          totalPackets: packets.length,
          encryptedPackets,
          plainPackets: packets.length - encryptedPackets,
        },
        packets,
      },
      {
        headers: { "Cache-Control": "no-store, max-age=0" },
      }
    );
  } catch (error) {
    console.error("Packet API Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load intercepted packets.",
        statistics: {
          totalPackets: 0,
          encryptedPackets: 0,
          plainPackets: 0,
        },
        packets: [],
      },
      { status: 500 }
    );
  }
}
