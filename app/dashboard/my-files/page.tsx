import {
  ArrowRight,
  ArrowUpRight,
  Clock3,
  Download,
  FileCheck2,
  FileText,
  Fingerprint,
  Inbox,
  LockKeyhole,
  Radio,
  ScanLine,
  Send,
  ShieldAlert,
  ShieldCheck,
  Activity,
  UserRound,
  Network,
} from "lucide-react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function MyFilesPage() {
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

  const files = await prisma.fileTransfer.findMany({
    where: {
      senderId: user.id,
    },
    include: {
      receiver: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  function getSecurityState(file: (typeof files)[number]) {
    if (file.integrity === "COMPROMISED") {
      return {
        label: "INTEGRITY COMPROMISED",
        description: "Document was modified during transmission.",
        tone: "danger",
        icon: ShieldAlert,
      };
    }

    if (file.attackAction === "MODIFIED") {
      return {
        label: "MITM MODIFIED",
        description: "Transmission content was altered during interception.",
        tone: "danger",
        icon: ShieldAlert,
      };
    }

    if (file.attackAction === "FORWARDED") {
      return {
        label: "INTEGRITY VERIFIED",
        description: "Intercepted and forwarded without modification.",
        tone: "success",
        icon: ShieldCheck,
      };
    }

    if (file.interceptedAt) {
      return {
        label: "INTERCEPTED",
        description: "Packet was intercepted during transmission.",
        tone: "warning",
        icon: Radio,
      };
    }

    if (file.status === "DELIVERED") {
      return {
        label: "DELIVERED",
        description: "Document delivered successfully.",
        tone: "success",
        icon: ShieldCheck,
      };
    }

    return {
      label: file.status.replaceAll("_", " "),
      description: "Transfer is being processed.",
      tone: "warning",
      icon: Radio,
    };
  }

  const total = files.length;
  const delivered = files.filter((file) => file.status === "DELIVERED").length;
  const compromised = files.filter(
    (file) => file.integrity === "COMPROMISED",
  ).length;
  const intercepted = files.filter((file) => Boolean(file.interceptedAt)).length;
  const encrypted = files.filter((file) => file.encrypted).length;

  return (
    <main className="dashboard-shell dashboard-grid">
      <div className="pointer-events-none absolute left-[-180px] top-20 h-[500px] w-[500px] rounded-full bg-blue-500/[0.06] blur-[140px]" />
      <div className="pointer-events-none absolute right-[-200px] top-[32%] h-[500px] w-[500px] rounded-full bg-red-500/[0.035] blur-[150px]" />

      <div className="page-container relative space-y-6">
        <section className="ui-hero overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute left-[52%] top-[-20%] h-[500px] w-[500px] rounded-full border border-blue-400/[0.07]" />
            <div className="absolute left-[58%] top-[-5%] h-[340px] w-[340px] rounded-full border border-blue-400/[0.06]" />
            <div className="absolute right-[8%] top-[32%] h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_24px_rgba(96,165,250,.9)]" />
            <div className="absolute right-[22%] top-[58%] h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,.9)]" />

            <div className="absolute bottom-[18%] left-[48%] h-px w-[40%] bg-gradient-to-r from-transparent via-blue-400/20 to-transparent" />
            <div className="absolute right-[15%] top-[22%] h-[65%] w-px bg-gradient-to-b from-transparent via-blue-400/10 to-transparent" />
          </div>

          <div className="relative z-10 grid gap-8 p-7 sm:p-9 lg:grid-cols-[1fr_auto] lg:items-end lg:p-11">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/15 bg-blue-500/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-blue-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,.9)]" />
                  Document intelligence
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-500/[0.06] px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-emerald-300">
                  <Activity size={11} />
                  Monitoring active
                </span>
              </div>

              <h1 className="mt-5 max-w-4xl text-3xl font-black tracking-[-0.05em] text-white sm:text-4xl lg:text-5xl">
                Secure Document Registry
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
                Monitor every academic document you transmit, from encrypted
                dispatch to receiver delivery and integrity verification.
              </p>
            </div>

            <Link
              href="/dashboard/upload"
              className="ui-button-primary w-full sm:w-fit"
            >
              <Send size={16} />
              New secure transfer
              <ArrowUpRight size={15} />
            </Link>
          </div>

          <div className="relative z-10 border-t border-white/[0.07] bg-black/10 px-7 py-4 sm:px-9 lg:px-11">
            <div className="grid gap-4 sm:grid-cols-4">
              {[
                ["Transfers", total, "registered"],
                ["Delivered", delivered, "completed"],
                ["Intercepted", intercepted, "MITM events"],
                ["Encrypted", encrypted, "protected"],
              ].map(([label, value, detail]) => (
                <div key={label as string} className="flex items-center gap-3">
                  <div className="h-8 w-px bg-blue-400/20" />

                  <div>
                    <p className="text-[8px] font-black uppercase tracking-[0.18em] text-slate-500">
                      {label as string}
                    </p>

                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-lg font-black text-white">
                        {value as number}
                      </span>

                      <span className="text-[8px] font-bold uppercase tracking-wider text-slate-600">
                        {detail as string}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Registry state",
              value: total ? "ACTIVE" : "EMPTY",
              detail: total ? "Transfer history online" : "Awaiting first transfer",
              icon: FileText,
              tone: "blue",
            },
            {
              label: "Encryption layer",
              value: total ? `${Math.round((encrypted / total) * 100)}%` : "0%",
              detail: "AES protected transfers",
              icon: LockKeyhole,
              tone: "emerald",
            },
            {
              label: "Threat surface",
              value: intercepted,
              detail: "Interception events",
              icon: Network,
              tone: intercepted ? "amber" : "slate",
            },
            {
              label: "Integrity alerts",
              value: compromised,
              detail: compromised ? "Action required" : "No compromise detected",
              icon: Fingerprint,
              tone: compromised ? "red" : "emerald",
            },
          ].map((metric) => {
            const Icon = metric.icon;

            const tone =
              metric.tone === "red"
                ? "bg-red-50 text-red-600"
                : metric.tone === "amber"
                  ? "bg-amber-50 text-amber-600"
                  : metric.tone === "emerald"
                    ? "bg-emerald-50 text-emerald-600"
                    : metric.tone === "blue"
                      ? "bg-blue-50 text-blue-600"
                      : "bg-slate-100 text-slate-600";

            return (
              <div
                key={metric.label}
                className="ui-panel ui-hover flex items-center gap-4 p-4"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone}`}
                >
                  <Icon size={17} />
                </div>

                <div className="min-w-0">
                  <p className="text-[8px] font-black uppercase tracking-[0.18em] text-slate-400">
                    {metric.label}
                  </p>

                  <div className="mt-1 flex items-center gap-2">
                    <p className="text-sm font-black text-slate-950">
                      {metric.value}
                    </p>

                    <span className="truncate text-[8px] font-bold uppercase tracking-wider text-slate-400">
                      {metric.detail}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        <section className="ui-panel overflow-hidden">
          <div className="flex flex-col gap-5 border-b border-slate-100 px-6 py-5 lg:flex-row lg:items-center lg:justify-between sm:px-7">
            <div>
              <p className="eyebrow">Transmission registry</p>

              <div className="mt-1 flex items-center gap-3">
                <h2 className="text-xl font-black tracking-tight text-slate-950">
                  Academic documents
                </h2>

                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-black text-slate-500">
                  {total}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 sm:flex">
                <ScanLine size={14} className="text-blue-500" />
                <span className="text-[8px] font-black uppercase tracking-[0.15em] text-slate-500">
                  SHA-256 telemetry enabled
                </span>
              </div>

              <Link
                href="/dashboard/upload"
                className="ui-button-secondary !h-10 !px-4 !text-[10px]"
              >
                <Send size={14} />
                Transfer
              </Link>
            </div>
          </div>

          {files.length === 0 ? (
            <div className="relative overflow-hidden px-6 py-24 text-center sm:px-10">
              <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/[0.05] blur-3xl" />

              <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-[24px] border border-blue-100 bg-blue-50 text-blue-600">
                <Inbox size={32} />
              </div>

              <p className="eyebrow mt-7">Registry empty</p>

              <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                No secure documents yet
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
                Start your first academic document transfer and SATIM will
                begin recording its encryption, transmission and integrity
                telemetry.
              </p>

              <Link
                href="/dashboard/upload"
                className="ui-button-primary mt-7"
              >
                <Send size={16} />
                Start secure transfer
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {files.map((file) => {
                const security = getSecurityState(file);
                const SecurityIcon = security.icon;

                const isCompromised =
                  file.integrity === "COMPROMISED" ||
                  file.attackAction === "MODIFIED";

                const isVerified =
                  file.integrity === "VERIFIED" ||
                  file.attackAction === "FORWARDED";

                return (
                  <article
                    key={file.id}
                    className="group relative overflow-hidden transition-colors hover:bg-slate-50/70"
                  >
                    <div
                      className={`absolute left-0 top-0 h-full w-1 ${
                        isCompromised
                          ? "bg-red-500"
                          : isVerified
                            ? "bg-emerald-500"
                            : file.interceptedAt
                              ? "bg-amber-400"
                              : "bg-blue-500"
                      }`}
                    />

                    <div className="grid gap-6 p-5 sm:p-6 xl:grid-cols-[1.35fr_.8fr_.65fr] xl:items-center">
                      <div className="min-w-0">
                        <div className="flex items-start gap-4">
                          <div
                            className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                              isCompromised
                                ? "bg-red-50 text-red-600"
                                : isVerified
                                  ? "bg-emerald-50 text-emerald-600"
                                  : "bg-blue-50 text-blue-600"
                            }`}
                          >
                            <FileText size={21} />

                            <span
                              className={`absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white ${
                                isCompromised
                                  ? "bg-red-500"
                                  : isVerified
                                    ? "bg-emerald-500"
                                    : "bg-blue-500"
                              }`}
                            />
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="max-w-[520px] truncate text-sm font-black text-slate-950">
                                {file.fileName}
                              </h3>

                              <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-[7px] font-black uppercase tracking-[0.14em] text-slate-400">
                                {file.documentType.replaceAll("_", " ")}
                              </span>
                            </div>

                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-[9px] font-bold text-slate-400">
                              <span className="flex items-center gap-1.5">
                                <UserRound size={12} />
                                {file.receiver?.email ?? file.receiverEmail}
                              </span>

                              <span className="flex items-center gap-1.5">
                                <Clock3 size={12} />
                                {file.createdAt.toLocaleString()}
                              </span>

                              <span className="flex items-center gap-1.5">
                                <Download size={12} />
                                {file.downloadCount}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.12em] ${
                              isCompromised
                                ? "bg-red-50 text-red-600"
                                : isVerified
                                  ? "bg-emerald-50 text-emerald-600"
                                  : file.interceptedAt
                                    ? "bg-amber-50 text-amber-600"
                                    : "bg-blue-50 text-blue-600"
                            }`}
                          >
                            <SecurityIcon size={12} />
                            {security.label}
                          </span>

                          {file.encrypted && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1.5 text-[8px] font-black uppercase tracking-[0.1em] text-slate-500">
                              <LockKeyhole size={10} />
                              AES
                            </span>
                          )}
                        </div>

                        <p className="mt-2 max-w-sm text-[9px] leading-5 text-slate-400">
                          {security.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-4 xl:justify-end">
                        <div className="hidden text-right xl:block">
                          <p className="text-[8px] font-black uppercase tracking-[0.16em] text-slate-400">
                            Transfer state
                          </p>

                          <p className="mt-1 text-[10px] font-black uppercase tracking-wider text-slate-800">
                            {file.status.replaceAll("_", " ")}
                          </p>
                        </div>

                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all group-hover:translate-x-1 ${
                            isCompromised
                              ? "bg-red-50 text-red-600"
                              : "bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600"
                          }`}
                        >
                          <ArrowUpRight size={16} />
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-4 sm:px-6">
                      <div className="flex flex-wrap items-center gap-2">
                        <div
                          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-[8px] font-black uppercase tracking-[0.12em] ${
                            file.interceptedAt
                              ? "bg-amber-50 text-amber-600"
                              : "bg-white text-slate-400"
                          }`}
                        >
                          <Radio size={11} />
                          {file.interceptedAt
                            ? "Intercepted"
                            : "No interception"}
                        </div>

                        <ArrowRight
                          size={13}
                          className="text-slate-300"
                        />

                        <div
                          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-[8px] font-black uppercase tracking-[0.12em] ${
                            file.attackAction === "MODIFIED"
                              ? "bg-red-50 text-red-600"
                              : file.attackAction === "FORWARDED"
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-white text-slate-400"
                          }`}
                        >
                          <Network size={11} />
                          {file.attackAction === "MODIFIED"
                            ? "Modified"
                            : file.attackAction === "FORWARDED"
                              ? "Forwarded"
                              : "Awaiting MITM action"}
                        </div>

                        <ArrowRight
                          size={13}
                          className="text-slate-300"
                        />

                        <div
                          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-[8px] font-black uppercase tracking-[0.12em] ${
                            file.integrity === "COMPROMISED"
                              ? "bg-red-50 text-red-600"
                              : file.integrity === "VERIFIED"
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-white text-slate-400"
                          }`}
                        >
                          <Fingerprint size={11} />
                          {file.integrity === "COMPROMISED"
                            ? "Integrity compromised"
                            : file.integrity === "VERIFIED"
                              ? "Integrity verified"
                              : "Awaiting verification"}
                        </div>

                        <ArrowRight
                          size={13}
                          className="text-slate-300"
                        />

                        <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-[8px] font-black uppercase tracking-[0.12em] text-slate-500">
                          <FileCheck2 size={11} />
                          {file.status.replaceAll("_", " ")}
                        </div>

                        <div className="ml-auto flex flex-wrap items-center gap-4 text-[8px] font-bold text-slate-400">
                          {file.interceptedAt && (
                            <span className="flex items-center gap-1.5">
                              <Radio size={11} className="text-amber-500" />
                              {file.interceptedAt.toLocaleString()}
                            </span>
                          )}

                          {file.verifiedAt && (
                            <span className="flex items-center gap-1.5">
                              <ShieldCheck
                                size={11}
                                className="text-emerald-500"
                              />
                              {file.verifiedAt.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="ui-panel-dark overflow-hidden">
          <div className="relative p-6 sm:p-7">
            <div className="absolute right-[-50px] top-[-80px] h-64 w-64 rounded-full bg-blue-500/[0.06] blur-3xl" />

            <div className="relative grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                    <Network size={15} />
                  </span>

                  <p className="text-[9px] font-black uppercase tracking-[0.22em] text-blue-300">
                    Secure transmission architecture
                  </p>
                </div>

                <h3 className="mt-3 text-xl font-black tracking-tight text-white">
                  Every transfer leaves an integrity trail.
                </h3>

                <p className="mt-2 max-w-2xl text-xs leading-6 text-slate-500">
                  Documents move through encryption, transmission, MITM
                  simulation, attack detection and SHA-256 verification before
                  the receiver accepts the academic payload.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:w-[430px]">
                {[
                  ["01", "Encrypt"],
                  ["02", "Transmit"],
                  ["03", "Inspect"],
                  ["04", "Verify"],
                ].map(([number, label], index) => (
                  <div
                    key={number}
                    className="relative rounded-xl border border-white/[0.07] bg-white/[0.035] p-3"
                  >
                    <span className="text-[8px] font-black text-blue-400">
                      {number}
                    </span>

                    <p className="mt-2 text-[9px] font-black uppercase tracking-wider text-white">
                      {label}
                    </p>

                    {index < 3 && (
                      <ArrowRight
                        size={10}
                        className="absolute -right-1.5 top-1/2 hidden -translate-y-1/2 text-slate-700 lg:block"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}