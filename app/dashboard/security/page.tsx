import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Fingerprint,
  FileCheck2,
  LockKeyhole,
  Network,
  Radio,
  ScanLine,
  ShieldAlert,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function SecurityPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const transfers = await prisma.fileTransfer.findMany({
    where: {
      OR: [
        {
          senderId: session.user.id,
        },
        {
          receiverId: session.user.id,
        },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const securityLogs = await prisma.securityLog.findMany({
    where: {
      OR: [
        {
          userId: session.user.id,
        },
        {
          transfer: {
            senderId: session.user.id,
          },
        },
        {
          transfer: {
            receiverId: session.user.id,
          },
        },
      ],
    },
    include: {
      transfer: {
        select: {
          fileName: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 15,
  });

  const totalTransfers = transfers.length;

  const intercepted = transfers.filter(
    (file) => file.interceptedAt !== null,
  ).length;

  const modified = transfers.filter(
    (file) => file.attackAction === "MODIFIED",
  ).length;

  const compromised = transfers.filter(
    (file) => file.integrity === "COMPROMISED",
  ).length;

  const verified = transfers.filter(
    (file) => file.integrity === "VERIFIED",
  ).length;

  const attacksDetected = securityLogs.filter(
    (log) => log.attackDetected,
  ).length;

  const encrypted = transfers.filter(
    (file) => file.encrypted,
  ).length;

  const delivered = transfers.filter(
    (file) => file.status === "DELIVERED",
  ).length;

  const securityScore =
    totalTransfers === 0
      ? 100
      : Math.max(
          0,
          Math.round(
            ((verified + delivered - compromised) /
              Math.max(totalTransfers, 1)) *
              100,
          ),
        );

  return (
    <main className="dashboard-shell dashboard-grid">
      <div className="pointer-events-none absolute left-[-220px] top-20 h-[550px] w-[550px] rounded-full bg-blue-500/[0.06] blur-[150px]" />
      <div className="pointer-events-none absolute right-[-180px] top-[28%] h-[500px] w-[500px] rounded-full bg-red-500/[0.035] blur-[150px]" />

      <div className="page-container relative space-y-6">
        <section className="ui-hero overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute right-[8%] top-[-20%] h-[480px] w-[480px] rounded-full border border-blue-400/[0.07]" />
            <div className="absolute right-[15%] top-[-5%] h-[330px] w-[330px] rounded-full border border-blue-400/[0.06]" />

            <div className="absolute left-[7%] top-[28%] h-px w-[55%] bg-gradient-to-r from-blue-400/20 via-blue-400/5 to-transparent" />
            <div className="absolute left-[20%] top-[60%] h-px w-[35%] bg-gradient-to-r from-transparent via-emerald-400/10 to-transparent" />

            <div className="absolute right-[25%] top-[24%] h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_24px_rgba(96,165,250,.9)]" />
            <div className="absolute right-[11%] top-[57%] h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,.9)]" />
            <div className="absolute left-[42%] top-[74%] h-1.5 w-1.5 rounded-full bg-red-400 shadow-[0_0_20px_rgba(248,113,113,.7)]" />
          </div>

          <div className="relative z-10 grid gap-10 p-7 sm:p-9 lg:grid-cols-[1fr_auto] lg:items-center lg:p-11">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-500/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-emerald-300">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,.9)]" />
                  Monitoring active
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/10 bg-blue-500/[0.06] px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-blue-300">
                  <Network size={11} />
                  SATIM security core
                </span>
              </div>

              <h1 className="mt-5 max-w-4xl text-3xl font-black tracking-[-0.05em] text-white sm:text-4xl lg:text-5xl">
                Security Operations Center
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
                Monitor transmission activity, MITM interception, integrity
                changes and security events across your academic document
                network.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.035] px-4 py-3">
                  <ScanLine size={14} className="text-blue-400" />
                  <span className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-300">
                    SHA-256 active
                  </span>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.035] px-4 py-3">
                  <LockKeyhole size={14} className="text-emerald-400" />
                  <span className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-300">
                    Encrypted transport
                  </span>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.035] px-4 py-3">
                  <Zap size={14} className="text-amber-400" />
                  <span className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-300">
                    MITM simulation
                  </span>
                </div>
              </div>
            </div>

            <div className="relative flex h-44 w-44 items-center justify-center sm:h-52 sm:w-52">
              <div className="absolute inset-0 rounded-full border border-blue-400/10" />
              <div className="absolute inset-4 rounded-full border border-blue-400/10 border-dashed" />
              <div className="absolute inset-9 rounded-full border border-emerald-400/10" />

              <div className="absolute inset-0 animate-[spin_18s_linear_infinite] rounded-full border border-transparent border-t-blue-400/30" />

              <div className="relative flex h-28 w-28 flex-col items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-500/[0.05] shadow-[0_0_60px_rgba(52,211,153,.08)]">
                <ShieldCheck
                  size={30}
                  className="text-emerald-400"
                />

                <span className="mt-2 text-[8px] font-black uppercase tracking-[0.18em] text-emerald-300">
                  Protected
                </span>
              </div>

              <span className="absolute right-1 top-8 h-2 w-2 animate-pulse rounded-full bg-blue-400 shadow-[0_0_14px_rgba(96,165,250,.9)]" />
              <span className="absolute bottom-8 left-3 h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,.8)]" />
              <span className="absolute left-5 top-12 h-1.5 w-1.5 rounded-full bg-red-400 shadow-[0_0_12px_rgba(248,113,113,.7)]" />
            </div>
          </div>

          <div className="relative z-10 border-t border-white/[0.07] px-7 py-4 sm:px-9 lg:px-11">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Activity size={14} className="text-blue-400" />
                <span className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-500">
                  Security telemetry stream
                </span>
              </div>

              <span className="font-mono text-[9px] text-slate-600">
                NODE::ACADEMIC-SECURITY / MONITORING::ONLINE
              </span>
            </div>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {[
            {
              label: "Transfers",
              value: totalTransfers,
              detail: "tracked",
              icon: Activity,
              tone: "blue",
            },
            {
              label: "Intercepted",
              value: intercepted,
              detail: "MITM events",
              icon: Radio,
              tone: "amber",
            },
            {
              label: "Attacks",
              value: attacksDetected,
              detail: "detected",
              icon: ShieldAlert,
              tone: "red",
            },
            {
              label: "Verified",
              value: verified,
              detail: "integrity passed",
              icon: FileCheck2,
              tone: "emerald",
            },
            {
              label: "Protected",
              value: `${securityScore}%`,
              detail: "security index",
              icon: Fingerprint,
              tone: "blue",
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
                    : "bg-blue-50 text-blue-600";

            return (
              <div
                key={metric.label}
                className="ui-panel ui-hover p-4"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${tone}`}
                  >
                    <Icon size={16} />
                  </div>

                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                </div>

                <p className="mt-5 text-[8px] font-black uppercase tracking-[0.18em] text-slate-400">
                  {metric.label}
                </p>

                <div className="mt-1 flex items-end gap-2">
                  <span className="text-2xl font-black tracking-tight text-slate-950">
                    {metric.value}
                  </span>

                  <span className="mb-1 text-[8px] font-black uppercase tracking-wider text-slate-400">
                    {metric.detail}
                  </span>
                </div>
              </div>
            );
          })}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
          <div className="ui-panel overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-5 sm:px-7">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="eyebrow">Integrity intelligence</p>

                  <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950">
                    Document protection layers
                  </h2>
                </div>

                <Fingerprint
                  size={21}
                  className="text-blue-600"
                />
              </div>
            </div>

            <div className="grid gap-3 p-5 sm:p-6">
              {[
                {
                  number: "01",
                  title: "Encrypted transport",
                  description:
                    "Academic payloads are protected before transmission.",
                  icon: LockKeyhole,
                  state: encrypted > 0 ? "ACTIVE" : "STANDBY",
                  tone: "blue",
                },
                {
                  number: "02",
                  title: "MITM interception layer",
                  description:
                    "Controlled interception events are recorded during transfer.",
                  icon: Network,
                  state: intercepted > 0 ? "EVENTS DETECTED" : "READY",
                  tone: intercepted > 0 ? "amber" : "blue",
                },
                {
                  number: "03",
                  title: "SHA-256 integrity engine",
                  description:
                    "Original and current document hashes are compared.",
                  icon: Fingerprint,
                  state: compromised > 0 ? "ALERT" : "ACTIVE",
                  tone: compromised > 0 ? "red" : "emerald",
                },
                {
                  number: "04",
                  title: "Security audit trail",
                  description:
                    "Transfer and attack events remain available for review.",
                  icon: FileCheck2,
                  state: `${securityLogs.length} EVENTS`,
                  tone: "blue",
                },
              ].map((layer) => {
                const Icon = layer.icon;

                const iconTone =
                  layer.tone === "red"
                    ? "bg-red-50 text-red-600"
                    : layer.tone === "amber"
                      ? "bg-amber-50 text-amber-600"
                      : layer.tone === "emerald"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-blue-50 text-blue-600";

                return (
                  <div
                    key={layer.number}
                    className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/60 p-4 transition-all hover:-translate-y-0.5 hover:border-blue-100 hover:bg-white hover:shadow-lg hover:shadow-blue-500/[0.05]"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-[9px] font-black text-slate-300">
                        {layer.number}
                      </span>

                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconTone}`}
                      >
                        <Icon size={17} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-xs font-black text-slate-900">
                          {layer.title}
                        </h3>

                        <p className="mt-1 text-[9px] leading-5 text-slate-400">
                          {layer.description}
                        </p>
                      </div>

                      <div className="hidden text-right sm:block">
                        <span
                          className={`text-[8px] font-black uppercase tracking-[0.14em] ${
                            layer.tone === "red"
                              ? "text-red-600"
                              : layer.tone === "amber"
                                ? "text-amber-600"
                                : layer.tone === "emerald"
                                  ? "text-emerald-600"
                                  : "text-blue-600"
                          }`}
                        >
                          {layer.state}
                        </span>

                        <div className="mt-2 flex justify-end gap-1">
                          {[1, 2, 3, 4].map((dot) => (
                            <span
                              key={dot}
                              className={`h-1 w-4 rounded-full ${
                                layer.tone === "red"
                                  ? "bg-red-400"
                                  : layer.tone === "amber"
                                    ? "bg-amber-400"
                                    : layer.tone === "emerald"
                                      ? "bg-emerald-400"
                                      : "bg-blue-400"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="ui-panel-dark overflow-hidden">
            <div className="relative p-6 sm:p-7">
              <div className="absolute right-[-90px] top-[-100px] h-72 w-72 rounded-full bg-blue-500/[0.06] blur-3xl" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.22em] text-blue-300">
                      Threat intelligence
                    </p>

                    <h2 className="mt-2 text-xl font-black text-white">
                      Integrity state
                    </h2>
                  </div>

                  <ShieldCheck
                    size={21}
                    className="text-emerald-400"
                  />
                </div>

                <div className="mt-7 flex items-center gap-6">
                  <div className="relative flex h-36 w-36 shrink-0 items-center justify-center">
                    <div className="absolute inset-0 rounded-full border border-white/[0.07]" />
                    <div className="absolute inset-3 rounded-full border border-white/[0.06] border-dashed" />
                    <div className="absolute inset-7 rounded-full bg-emerald-500/[0.05] shadow-[0_0_50px_rgba(52,211,153,.08)]" />

                    <div className="relative text-center">
                      <p className="text-3xl font-black text-white">
                        {securityScore}
                      </p>

                      <p className="text-[8px] font-black uppercase tracking-[0.16em] text-emerald-400">
                        index
                      </p>
                    </div>
                  </div>

                  <div className="min-w-0 flex-1 space-y-3">
                    {[
                      ["Verified", verified, "bg-emerald-400"],
                      ["Intercepted", intercepted, "bg-amber-400"],
                      ["Modified", modified, "bg-red-400"],
                      ["Compromised", compromised, "bg-red-500"],
                    ].map(([label, value, dot]) => (
                      <div
                        key={label as string}
                        className="flex items-center gap-2"
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${dot as string}`}
                        />

                        <span className="flex-1 text-[9px] font-bold text-slate-500">
                          {label as string}
                        </span>

                        <span className="font-mono text-[10px] font-black text-white">
                          {value as number}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-7 h-px bg-white/[0.07]" />

                <div className="mt-5 flex items-center justify-between">
                  <span className="text-[8px] font-black uppercase tracking-[0.16em] text-slate-600">
                    Security posture
                  </span>

                  <span
                    className={`text-[9px] font-black uppercase tracking-[0.16em] ${
                      compromised > 0
                        ? "text-red-400"
                        : "text-emerald-400"
                    }`}
                  >
                    {compromised > 0 ? "Review required" : "Protected"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="ui-panel overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-5 sm:px-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="eyebrow">Threat response</p>

                <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950">
                  Integrity results
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Current state of every monitored transmission.
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
                <Radio size={13} className="text-blue-500" />

                <span className="text-[8px] font-black uppercase tracking-[0.14em] text-slate-500">
                  Live telemetry
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-px bg-slate-100 sm:grid-cols-3">
            {[
              {
                label: "Intercepted",
                value: intercepted,
                description: "Transmission events",
                icon: Radio,
                tone: "amber",
              },
              {
                label: "Modified",
                value: modified,
                description: "MITM modifications",
                icon: ShieldAlert,
                tone: "red",
              },
              {
                label: "Compromised",
                value: compromised,
                description: "Hash mismatches",
                icon: Fingerprint,
                tone: "red",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="bg-white p-6"
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        item.tone === "amber"
                          ? "bg-amber-50 text-amber-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      <Icon size={18} />
                    </div>

                    <ArrowRight
                      size={15}
                      className="text-slate-200"
                    />
                  </div>

                  <p className="mt-6 text-[8px] font-black uppercase tracking-[0.18em] text-slate-400">
                    {item.label}
                  </p>

                  <p
                    className={`mt-1 text-3xl font-black ${
                      item.tone === "amber"
                        ? "text-amber-600"
                        : "text-red-600"
                    }`}
                  >
                    {item.value}
                  </p>

                  <p className="mt-1 text-[9px] font-bold text-slate-400">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="ui-panel overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-5 sm:px-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="eyebrow">Audit trail</p>

                <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950">
                  Security activity
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Recent events recorded by the SATIM monitoring engine.
                </p>
              </div>

              <div className="hidden h-9 items-center gap-2 rounded-xl bg-slate-50 px-3 sm:flex">
                <Activity size={13} className="text-blue-500" />
                <span className="text-[8px] font-black uppercase tracking-[0.15em] text-slate-500">
                  {securityLogs.length} events
                </span>
              </div>
            </div>
          </div>

          {securityLogs.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <ShieldCheck size={27} />
              </div>

              <p className="eyebrow mt-6">
                Audit trail clear
              </p>

              <h3 className="mt-2 text-xl font-black text-slate-950">
                No security events recorded
              </h3>

              <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-slate-400">
                Security activity will appear here when transfers,
                interceptions, integrity checks or attack simulations occur.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {securityLogs.map((log) => (
                <div
                  key={log.id}
                  className="group relative flex flex-col gap-4 px-6 py-5 transition-colors hover:bg-slate-50/70 sm:px-7 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="flex min-w-0 items-start gap-4">
                    <div
                      className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        log.attackDetected
                          ? "bg-red-50 text-red-600"
                          : "bg-blue-50 text-blue-600"
                      }`}
                    >
                      {log.attackDetected ? (
                        <AlertTriangle size={17} />
                      ) : (
                        <Activity size={17} />
                      )}

                      <span
                        className={`absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white ${
                          log.attackDetected
                            ? "bg-red-500"
                            : "bg-blue-500"
                        }`}
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-xs font-black text-slate-950">
                          {log.action}
                        </p>

                        {log.attackDetected && (
                          <span className="rounded-full bg-red-50 px-2 py-1 text-[7px] font-black uppercase tracking-[0.12em] text-red-600">
                            Attack detected
                          </span>
                        )}
                      </div>

                      <p className="mt-1 max-w-3xl text-[10px] leading-5 text-slate-400">
                        {log.description}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-3 text-[8px] font-bold uppercase tracking-wider text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <FileCheck2 size={10} />
                          {log.transfer.fileName}
                        </span>

                        <span>
                          {log.createdAt.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center justify-between gap-5 lg:justify-end">
                    <span
                      className={`rounded-full px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.12em] ${
                        log.attackDetected
                          ? "bg-red-50 text-red-600"
                          : log.securityLevel === "HIGH"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {log.attackDetected
                        ? "ATTACK DETECTED"
                        : log.securityLevel}
                    </span>

                    <ArrowRight
                      size={14}
                      className="text-slate-200 transition-transform group-hover:translate-x-1 group-hover:text-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="ui-panel-dark overflow-hidden">
          <div className="relative p-6 sm:p-7">
            <div className="absolute right-[-100px] top-[-120px] h-72 w-72 rounded-full bg-blue-500/[0.06] blur-3xl" />

            <div className="relative grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                    <Network size={15} />
                  </div>

                  <p className="text-[9px] font-black uppercase tracking-[0.22em] text-blue-300">
                    SATIM security architecture
                  </p>
                </div>

                <h3 className="mt-3 text-xl font-black text-white">
                  Detect the attack. Prove the change.
                </h3>

                <p className="mt-2 max-w-2xl text-xs leading-6 text-slate-500">
                  SATIM combines encrypted academic document transfer,
                  controlled MITM simulation and SHA-256 integrity comparison
                  to make unauthorized modification observable.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  ["AES", "Encryption"],
                  ["MITM", "Simulation"],
                  ["SHA-256", "Verification"],
                  ["AUDIT", "Evidence"],
                ].map(([value, label]) => (
                  <div
                    key={value}
                    className="min-w-[90px] rounded-xl border border-white/[0.07] bg-white/[0.035] px-4 py-3"
                  >
                    <p className="text-[9px] font-black text-blue-400">
                      {value}
                    </p>

                    <p className="mt-1 text-[8px] font-black uppercase tracking-wider text-slate-500">
                      {label}
                    </p>
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