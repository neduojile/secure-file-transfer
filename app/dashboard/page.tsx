import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";

import {
  ShieldCheck,
  Clock,
  FileLock2,
  Files,
  Send,
  Inbox,
  Upload,
  ArrowRight,
} from "lucide-react";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import StatsCard from "@/components/dashboard/stats-card";

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

  const totalFiles = await prisma.fileTransfer.count({
    where: {
      senderId: user.id,
    },
  });

  const sentFiles = totalFiles;

  const receivedFiles = await prisma.fileTransfer.count({
    where: {
      receiverId: user.id,
    },
  });

  const securityLogs = await prisma.securityLog.count({
    where: {
      userId: user.id,
    },
  });

  const recentTransfers = await prisma.fileTransfer.findMany({
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
    take: 5,
  });

  return (
    <div className="space-y-10">
      {/* Hero Section */}

      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 p-8">
        <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-indigo-600/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-indigo-400">
              Secure File Transfer Platform
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">
              Welcome back, {session.user.name}
            </h1>

            <p className="mt-3 max-w-2xl text-slate-400">
              Monitor encrypted file transfers, verify integrity, and review
              security events from one centralized dashboard.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4">
              <div className="flex items-center gap-3">
                <ShieldCheck
                  className="text-emerald-400"
                  size={22}
                />

                <div>
                  <p className="text-xs text-slate-400">
                    Encryption
                  </p>

                  <p className="font-semibold text-emerald-400">
                    AES-256 Active
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 px-5 py-4">
              <div className="flex items-center gap-3">
                <FileLock2
                  className="text-indigo-400"
                  size={22}
                />

                <div>
                  <p className="text-xs text-slate-400">
                    Integrity
                  </p>

                  <p className="font-semibold text-indigo-300">
                    SHA-256 Verified
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Total Files"
          value={totalFiles}
          description="Encrypted files stored"
          icon={Files}
          color="indigo"
        />

        <StatsCard
          title="Sent Files"
          value={sentFiles}
          description="Files you've shared"
          icon={Send}
          color="emerald"
        />

        <StatsCard
          title="Received Files"
          value={receivedFiles}
          description="Files received"
          icon={Inbox}
          color="amber"
        />

        <StatsCard
          title="Security Logs"
          value={securityLogs}
          description="Security events"
          icon={ShieldCheck}
          color="rose"
        />
      </section>

      {/* Quick Actions */}

      <section>
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-slate-100">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Frequently used features.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Link
            href="/dashboard/upload"
            className="card-base flex items-center justify-between p-6 transition hover:border-indigo-500/40"
          >
            <div>
              <h3 className="font-semibold text-slate-100">
                Upload File
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Encrypt and securely send files.
              </p>
            </div>

            <Upload className="h-6 w-6 text-indigo-400" />
          </Link>




          <Link
            href="/dashboard/security"
            className="card-base flex items-center justify-between p-6 transition hover:border-indigo-500/40"
          >
            <div>
              <h3 className="font-semibold text-slate-100">
                Security Logs
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Review recent security events.
              </p>
            </div>

            <ArrowRight className="h-6 w-6 text-indigo-400" />
          </Link>
        </div>
      </section>

      {/* Recent Activity */}

      <section className="card-base overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 px-8 py-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-100">
              Recent Activity
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Latest encrypted file transfers.
            </p>
          </div>

          <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">
            {recentTransfers.length} Items
          </span>
        </div>

        {recentTransfers.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-8 py-20 text-center">
            <Clock className="h-16 w-16 text-slate-600" />

            <h3 className="mt-6 text-2xl font-semibold text-slate-100">
              No recent activity
            </h3>

            <p className="mt-3 max-w-md text-slate-400">
              Your encrypted transfers will appear here after you upload or
              receive files.
            </p>

            <Link
              href="/dashboard/upload"
              className="btn-primary mt-8"
            >
              Upload Your First File
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {recentTransfers.map((transfer) => (
              <div
                key={transfer.id}
                className="flex flex-col gap-6 px-8 py-6 transition-colors hover:bg-slate-800/40 lg:flex-row lg:items-center lg:justify-between"
              >
                <div>
                  <h3 className="text-lg font-semibold text-slate-100">
                    {transfer.fileName}
                  </h3>

                  <p className="mt-2 text-sm text-slate-400">
                    {transfer.senderId === user.id
                      ? `Sent to ${transfer.receiver?.email ?? transfer.receiverEmail}`
                      : `Received from ${transfer.sender.email}`}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {transfer.createdAt.toLocaleString()}
                  </p>
                </div>

                <span
                  className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-semibold ${
                    transfer.status === "DELIVERED"
                      ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30"
                      : "bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30"
                  }`}
                >
                  {transfer.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}