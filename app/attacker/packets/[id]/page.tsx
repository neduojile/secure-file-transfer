import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FileText,
  Fingerprint,
  HardDrive,
  LockKeyhole,
  Network,
  Radio,
  ShieldAlert,
  UserRound,
  UnlockKeyhole,
  Zap,
} from "lucide-react";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PacketActions from "@/components/attacker/packet-actions";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function PacketPage({ params }: Props) {
  const { id } = await params;

  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  if (session.user.role !== "ATTACKER") {
    redirect("/auth/login");
  }

  const packet = await prisma.fileTransfer.findUnique({
    where: { id },
    include: {
      sender: true,
      receiver: true,
    },
  });

  if (!packet) {
    notFound();
  }

  const fileSize = (packet.fileSize / 1024).toFixed(2);
  const isEncrypted = packet.encrypted;

  return (
    <main className="dashboard-shell dashboard-grid">
      <div className="pointer-events-none absolute left-[-180px] top-20 h-[520px] w-[520px] rounded-full bg-red-500/[0.045] blur-[150px]" />
      <div className="pointer-events-none absolute right-[-180px] top-[35%] h-[520px] w-[520px] rounded-full bg-blue-500/[0.045] blur-[150px]" />

      <div className="page-container relative space-y-6">
        <section className="relative overflow-hidden rounded-[30px] border border-red-500/10 bg-[#080b12] text-white shadow-2xl shadow-red-950/10">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute right-[-5%] top-[-55%] h-[620px] w-[620px] rounded-full border border-red-400/[0.06]" />
            <div className="absolute right-[7%] top-[-30%] h-[430px] w-[430px] rounded-full border border-red-400/[0.05] border-dashed" />
            <div className="absolute left-[5%] top-[48%] h-px w-[80%] bg-gradient-to-r from-transparent via-red-400/10 to-transparent" />
            <span className="absolute right-[18%] top-[28%] h-2 w-2 animate-pulse rounded-full bg-red-400 shadow-[0_0_20px_rgba(248,113,113,.9)]" />
            <span className="absolute right-[31%] top-[66%] h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,.8)]" />
          </div>

          <div className="relative z-10 p-7 sm:p-9 lg:p-11">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-red-300">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" />
                    Packet under inspection
                  </span>

                  <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.035] px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                    <Radio size={11} />
                    MITM node
                  </span>
                </div>

                <p className="mt-6 text-[9px] font-black uppercase tracking-[0.22em] text-red-300">
                  Transmission forensics
                </p>

                <h1 className="mt-2 max-w-4xl break-words text-3xl font-black tracking-[-0.05em] text-white sm:text-4xl">
                  Packet Inspection
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
                  Inspect a captured academic document transmission before it
                  reaches the intended receiver.
                </p>
              </div>

              <div className="relative flex h-36 w-36 shrink-0 items-center justify-center self-start lg:self-auto">
                <div className="absolute inset-0 rounded-full border border-red-400/10" />
                <div className="absolute inset-4 rounded-full border border-red-400/10 border-dashed" />
                <div className="absolute inset-9 rounded-full border border-blue-400/10" />
                <div className="absolute inset-0 animate-[spin_14s_linear_infinite] rounded-full border border-transparent border-t-red-400/30" />

                <div className="relative flex h-20 w-20 flex-col items-center justify-center rounded-full border border-red-400/20 bg-red-500/[0.06]">
                  <ShieldAlert size={24} className="text-red-400" />
                  <span className="mt-1 text-[7px] font-black uppercase tracking-[0.18em] text-red-300">
                    Captured
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  label: "Packet state",
                  value: packet.status,
                  icon: Activity,
                },
                {
                  label: "Payload",
                  value: isEncrypted ? "AES protected" : "Plain text",
                  icon: isEncrypted ? LockKeyhole : UnlockKeyhole,
                },
                {
                  label: "Integrity",
                  value: packet.integrity,
                  icon: Fingerprint,
                },
                {
                  label: "File size",
                  value: `${fileSize} KB`,
                  icon: HardDrive,
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/[0.07] bg-white/[0.035] p-4"
                  >
                    <div className="flex items-center gap-2 text-slate-500">
                      <Icon size={13} />
                      <span className="text-[8px] font-black uppercase tracking-[0.16em]">
                        {item.label}
                      </span>
                    </div>

                    <p className="mt-3 truncate text-xs font-black uppercase tracking-wider text-white">
                      {item.value}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="ui-panel overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FileText size={18} />
                </div>

                <div>
                  <p className="eyebrow !text-blue-600">
                    Payload identity
                  </p>

                  <h2 className="mt-1 text-lg font-black text-slate-950">
                    File Information
                  </h2>
                </div>
              </div>
            </div>

            <div className="space-y-5 p-6">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
                <p className="text-[8px] font-black uppercase tracking-[0.17em] text-slate-400">
                  File name
                </p>

                <p className="mt-2 break-all text-sm font-black text-slate-950">
                  {packet.fileName}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 p-4">
                  <p className="text-[8px] font-black uppercase tracking-[0.17em] text-slate-400">
                    File type
                  </p>

                  <p className="mt-2 text-xs font-black text-slate-900">
                    {packet.fileType}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 p-4">
                  <p className="text-[8px] font-black uppercase tracking-[0.17em] text-slate-400">
                    Size
                  </p>

                  <p className="mt-2 text-xs font-black text-slate-900">
                    {fileSize} KB
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[8px] font-black uppercase tracking-[0.17em] text-slate-400">
                      Transfer status
                    </p>

                    <p className="mt-2 text-xs font-black uppercase tracking-wider text-slate-900">
                      {packet.status}
                    </p>
                  </div>

                  <span className="h-2 w-2 animate-pulse rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,.6)]" />
                </div>
              </div>
            </div>
          </div>

          <div className="ui-panel overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Network size={18} />
                </div>

                <div>
                  <p className="eyebrow !text-emerald-600">
                    Transmission route
                  </p>

                  <h2 className="mt-1 text-lg font-black text-slate-950">
                    Sender → Receiver
                  </h2>
                </div>
              </div>
            </div>

            <div className="space-y-4 p-6">
              <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                    <UserRound size={17} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[8px] font-black uppercase tracking-[0.17em] text-blue-500">
                      Sender
                    </p>

                    <p className="mt-1 truncate text-sm font-black text-slate-950">
                      {packet.sender.fullName}
                    </p>

                    <p className="mt-1 truncate text-[9px] text-slate-400">
                      {packet.sender.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 px-4">
                <div className="h-px flex-1 bg-slate-200" />

                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-red-100 bg-red-50 text-red-500">
                  <ShieldAlert size={15} />
                </div>

                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                    <UserRound size={17} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[8px] font-black uppercase tracking-[0.17em] text-emerald-600">
                      Receiver
                    </p>

                    <p className="mt-1 truncate text-sm font-black text-slate-950">
                      {packet.receiver?.fullName ?? "Unknown"}
                    </p>

                    <p className="mt-1 truncate text-[9px] text-slate-400">
                      {packet.receiver?.email ?? "No receiver assigned"}
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`flex items-center justify-between rounded-2xl border p-4 ${
                  isEncrypted
                    ? "border-emerald-100 bg-emerald-50/50"
                    : "border-amber-100 bg-amber-50/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                      isEncrypted
                        ? "bg-white text-emerald-600"
                        : "bg-white text-amber-600"
                    }`}
                  >
                    {isEncrypted ? (
                      <LockKeyhole size={16} />
                    ) : (
                      <UnlockKeyhole size={16} />
                    )}
                  </div>

                  <div>
                    <p className="text-[8px] font-black uppercase tracking-[0.16em] text-slate-400">
                      Encryption layer
                    </p>

                    <p className="mt-1 text-[9px] font-black uppercase tracking-wider text-slate-900">
                      {isEncrypted ? "AES protected" : "Plain payload"}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[8px] font-black uppercase tracking-wider ${
                    isEncrypted ? "text-emerald-600" : "text-amber-600"
                  }`}
                >
                  {isEncrypted ? "Secure" : "Exposed"}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="ui-panel overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-5 sm:px-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="eyebrow !text-red-600">
                  Packet forensics
                </p>

                <h2 className="mt-1 text-xl font-black text-slate-950">
                  Analysis & attack controls
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Determine whether this payload can be inspected or modified.
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2">
                <Radio size={12} className="animate-pulse text-red-500" />

                <span className="text-[8px] font-black uppercase tracking-[0.16em] text-red-600">
                  Interception active
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-7">
            {isEncrypted ? (
              <div className="relative overflow-hidden rounded-[24px] border border-emerald-200 bg-emerald-50/60 p-7">
                <div className="absolute right-[-50px] top-[-50px] h-48 w-48 rounded-full bg-emerald-400/[0.07] blur-3xl" />

                <div className="relative">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm">
                      <LockKeyhole size={25} />
                    </div>

                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-600">
                        Encryption barrier
                      </p>

                      <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                        Encrypted Packet
                      </h3>

                      <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                        This packet is protected with AES encryption. The
                        current attacker workflow does not expose its contents
                        for direct modification.
                      </p>
                    </div>
                  </div>

                  <div className="mt-7 grid gap-3 sm:grid-cols-3">
                    {[
                      ["Payload", "Encrypted"],
                      ["Inspection", "Restricted"],
                      ["Modification", "Unavailable"],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="rounded-xl border border-emerald-100 bg-white/70 p-4"
                      >
                        <p className="text-[8px] font-black uppercase tracking-[0.15em] text-slate-400">
                          {label}
                        </p>

                        <p className="mt-2 text-[9px] font-black uppercase tracking-wider text-emerald-600">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative overflow-hidden rounded-[24px] border border-amber-200 bg-amber-50/60 p-7">
                <div className="absolute right-[-50px] top-[-50px] h-48 w-48 rounded-full bg-amber-400/[0.07] blur-3xl" />

                <div className="relative">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-amber-600 shadow-sm">
                      <UnlockKeyhole size={25} />
                    </div>

                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-700">
                        Modification window
                      </p>

                      <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                        Plain Text Packet
                      </h3>

                      <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                        This payload is unencrypted and can be used to
                        demonstrate a controlled MITM modification before the
                        receiver performs integrity verification.
                      </p>
                    </div>
                  </div>

                  <div className="mt-7 rounded-2xl border border-amber-200 bg-white/70 p-5">
                    <div className="mb-5 flex items-center gap-3">
                      <Zap size={16} className="text-amber-600" />

                      <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-950">
                          Attack action
                        </p>

                        <p className="mt-1 text-[9px] text-slate-400">
                          Execute the controlled packet operation below.
                        </p>
                      </div>
                    </div>

                    <PacketActions transferId={packet.id} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="ui-panel-dark overflow-hidden">
          <div className="p-6 sm:p-7">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-red-300">
                  Security pipeline
                </p>

                <h2 className="mt-2 text-xl font-black text-white">
                  What happens after interception
                </h2>
              </div>

              <div className="font-mono text-[8px] text-slate-600">
                PACKET::{packet.id.slice(-10).toUpperCase()}
              </div>
            </div>

            <div className="mt-7 grid gap-3 md:grid-cols-4">
              {[
                {
                  label: "Capture",
                  detail: "Packet intercepted",
                  icon: Radio,
                },
                {
                  label: "Inspection",
                  detail: isEncrypted
                    ? "Encryption detected"
                    : "Payload exposed",
                  icon: Activity,
                },
                {
                  label: "Action",
                  detail: isEncrypted
                    ? "Forward available"
                    : "Modify available",
                  icon: Zap,
                },
                {
                  label: "Verification",
                  detail: "SHA-256 comparison",
                  icon: Fingerprint,
                },
              ].map((stage, index) => {
                const Icon = stage.icon;

                return (
                  <div
                    key={stage.label}
                    className="relative rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.05] text-slate-300">
                      <Icon size={15} />
                    </div>

                    <p className="mt-4 text-xs font-black text-white">
                      {stage.label}
                    </p>

                    <p className="mt-1 text-[8px] font-bold uppercase tracking-wider text-slate-600">
                      {stage.detail}
                    </p>

                    <span className="absolute right-4 top-4 font-mono text-[8px] text-slate-700">
                      0{index + 1}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="rounded-[24px] border border-red-100 bg-red-50/60 p-6 sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-red-600 shadow-sm">
              <AlertTriangle size={19} />
            </div>

            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-red-600">
                Controlled security environment
              </p>

              <h2 className="mt-2 text-lg font-black text-slate-950">
                This packet exists inside the SATIM MITM simulation.
              </h2>

              <p className="mt-2 max-w-4xl text-xs leading-6 text-slate-600">
                The attacker role is isolated from normal users. Actions on
                this screen are recorded as part of the system&apos;s security
                monitoring and integrity verification workflow.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}