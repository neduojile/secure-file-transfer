import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardExperience from "@/components/dashboard/dashboard-experience";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/auth/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    redirect("/auth/login");
  }

  const [
    totalFiles,
    receivedFiles,
    securityLogs,
    recentTransfers,
  ] = await Promise.all([
    prisma.fileTransfer.count({
      where: {
        senderId: user.id,
      },
    }),

    prisma.fileTransfer.count({
      where: {
        receiverId: user.id,
      },
    }),

    prisma.securityLog.count({
      where: {
        userId: user.id,
      },
    }),

    prisma.fileTransfer.findMany({
      where: {
        OR: [
          {
            senderId: user.id,
          },
          {
            receiverId: user.id,
          },
        ],
      },
      include: {
        sender: true,
        receiver: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 6,
    }),
  ]);

  return (
    <DashboardExperience
      userName={session.user.name ?? user.fullName}
      userId={user.id}
      totalFiles={totalFiles}
      sentFiles={totalFiles}
      receivedFiles={receivedFiles}
      securityLogs={securityLogs}
      recentTransfers={recentTransfers.map((transfer) => ({
        id: transfer.id,
        fileName: transfer.fileName,
        senderId: transfer.senderId,
        receiverEmail: transfer.receiverEmail,
        createdAt: transfer.createdAt.toISOString(),
        status: transfer.status,
        receiver: transfer.receiver
          ? {
              email: transfer.receiver.email,
            }
          : null,
        sender: {
          email: transfer.sender.email,
        },
      }))}
    />
  );
}
