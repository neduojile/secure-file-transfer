import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import {
  FileText,
  User,
  Users,
  Shield,
  HardDrive,
  Activity,
  Lock,
  Unlock,
} from "lucide-react";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PacketActions from "@/components/attacker/packet-actions";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function PacketPage({
  params,
}: Props) {
  const { id } = await params;

  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  if (session.user.role !== "ATTACKER") {
    redirect("/auth/login");
  }

  const packet = await prisma.fileTransfer.findUnique({
    where: {
      id,
    },
    include: {
      sender: true,
      receiver: true,
    },
  });

  if (!packet) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-8 py-8">
        {/* Header */}

        <div className="mb-8 rounded-3xl border border-rose-500/20 bg-slate-900 p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/15">
              <Activity className="h-8 w-8 text-rose-400" />
            </div>

            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                Packet Inspection
              </h1>

              <p className="mt-2 text-slate-400">
                Analyze an intercepted packet travelling across the Secure File
                Transfer System.
              </p>
            </div>
          </div>
        </div>

        {/* Packet Details */}

        <div className="mb-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-4 flex items-center gap-2 text-indigo-400">
              <FileText className="h-5 w-5" />
              <h2 className="font-semibold">File Information</h2>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase text-slate-500">File Name</p>
                <p className="font-medium">{packet.fileName}</p>
              </div>

              <div>
                <p className="text-xs uppercase text-slate-500">File Size</p>
                <p>{(packet.fileSize / 1024).toFixed(2)} KB</p>
              </div>

              <div>
                <p className="text-xs uppercase text-slate-500">Status</p>
                <span className="inline-flex rounded-full bg-indigo-500/15 px-3 py-1 text-sm text-indigo-300">
                  {packet.status}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-4 flex items-center gap-2 text-emerald-400">
              <Users className="h-5 w-5" />
              <h2 className="font-semibold">Transmission</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="mt-1 h-5 w-5 text-slate-500" />
                <div>
                  <p className="text-xs uppercase text-slate-500">Sender</p>
                  <p>{packet.sender.fullName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="mt-1 h-5 w-5 text-slate-500" />
                <div>
                  <p className="text-xs uppercase text-slate-500">Receiver</p>
                  <p>{packet.receiver?.fullName ?? "Unknown"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <HardDrive className="mt-1 h-5 w-5 text-slate-500" />
                <div>
                  <p className="text-xs uppercase text-slate-500">
                    Encryption
                  </p>

                  {packet.encrypted ? (
                    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1 text-sm text-emerald-400">
                      <Lock className="h-4 w-4" />
                      AES-256 Protected
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/15 px-3 py-1 text-sm text-amber-400">
                      <Unlock className="h-4 w-4" />
                      Plain Text
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Inspection Panel */}

        <div className="rounded-3xl border border-slate-800 bg-slate-900">
          <div className="border-b border-slate-800 px-6 py-5">
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <Shield className="h-5 w-5 text-indigo-400" />
              Packet Analysis
            </h2>
          </div>

          <div className="p-6">
            {packet.encrypted ? (
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
                <div className="mb-3 flex items-center gap-2 text-emerald-400">
                  <Lock className="h-5 w-5" />
                  <h3 className="text-xl font-semibold">
                    Encrypted Packet
                  </h3>
                </div>

                <p className="text-slate-400">
                  This packet is protected with AES-256 encryption.
                </p>

                <p className="mt-2 text-slate-400">
                  The contents cannot be inspected or modified until decrypted.
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
                <div className="mb-3 flex items-center gap-2 text-amber-400">
                  <Unlock className="h-5 w-5" />
                  <h3 className="text-xl font-semibold">
                    Plain Text Packet
                  </h3>
                </div>

                <p className="mb-6 text-slate-400">
                  This packet is unencrypted and can be inspected or modified.
                </p>

                <PacketActions transferId={packet.id} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}