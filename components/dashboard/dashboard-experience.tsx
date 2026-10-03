"use client";

import { motion } from "motion/react";
import {
  IconArrowUpRight,
  IconCircleCheck,
  IconClock,
  IconFileShredder,
  IconFileText,
  IconFingerprint,
  IconLock,
  IconNetwork,
  IconRadar,
  IconRadio,
  IconShieldCheck,
  IconShieldExclamation,
  IconActivity,
  IconCloudUpload,
  IconCloudDownload,
  IconBolt,
} from "@tabler/icons-react";

type Transfer = {
  id: string;
  fileName: string;
  senderId: string;
  receiverEmail: string;
  createdAt: string;
  status: string;
  receiver: { email: string } | null;
  sender: { email: string };
};

type Props = {
  userName: string;
  userId: string;
  totalFiles: number;
  sentFiles: number;
  receivedFiles: number;
  securityLogs: number;
  recentTransfers: Transfer[];
};

const fade = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const statusLabel: Record<string, string> = {
  PENDING: "Pending",
  ENCRYPTING: "Encrypting",
  SENDING: "Sending",
  IN_TRANSIT: "In transit",
  ATTACK_DETECTED: "Threat detected",
  VERIFYING: "Verifying",
  DELIVERED: "Delivered",
  REJECTED: "Rejected",
};

function formatDate(value: string) {
  return new Date(value).toLocaleString([], {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusClass(status: string) {
  if (status === "DELIVERED") {
    return "ui-status ui-status-success";
  }

  if (status === "ATTACK_DETECTED" || status === "REJECTED") {
    return "ui-status ui-status-danger";
  }

  if (
    status === "ENCRYPTING" ||
    status === "VERIFYING" ||
    status === "IN_TRANSIT"
  ) {
    return "ui-status ui-status-blue";
  }

  return "ui-status ui-status-warning";
}

export default function DashboardExperience({
  userName,
  totalFiles,
  sentFiles,
  receivedFiles,
  securityLogs,
  recentTransfers,
}: Props) {
  const firstName = userName.split(" ")[0];

  const metrics = [
    {
      label: "Documents secured",
      value: totalFiles,
      icon: IconFileShredder,
      detail: "Encrypted transfers",
    },
    {
      label: "Sent",
      value: sentFiles,
      icon: IconCloudUpload,
      detail: "Outgoing documents",
    },
    {
      label: "Received",
      value: receivedFiles,
      icon: IconCloudDownload,
      detail: "Incoming documents",
    },
    {
      label: "Security events",
      value: securityLogs,
      icon: IconShieldExclamation,
      detail: "Recorded activity",
    },
  ];

  return (
    <main className="dashboard-shell dashboard-grid">
      <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-0 h-[520px] w-[520px] rounded-full bg-red-500/[0.045] blur-3xl" />

      <div className="page-container relative">
        <motion.section
          variants={fade}
          initial="hidden"
          animate="show"
          className="mb-6"
        >
          <div className="ui-hero min-h-[330px]">
            <div className="absolute inset-0 opacity-40">
              <div className="absolute left-[12%] top-[30%] h-px w-[72%] bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />
              <div className="absolute left-[20%] top-[58%] h-px w-[58%] bg-gradient-to-r from-transparent via-blue-300/30 to-transparent" />
              <div className="absolute left-[32%] top-[15%] h-[70%] w-px bg-gradient-to-b from-transparent via-blue-400/20 to-transparent" />
              <div className="absolute right-[25%] top-[10%] h-[80%] w-px bg-gradient-to-b from-transparent via-blue-400/15 to-transparent" />
            </div>

            {[...Array(7)].map((_, index) => (
              <motion.span
                key={index}
                className="absolute h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_18px_rgba(96,165,250,.9)]"
                style={{
                  left: `${12 + index * 12}%`,
                  top: `${25 + (index % 3) * 19}%`,
                }}
                animate={{
                  opacity: [0.25, 1, 0.25],
                  scale: [0.8, 1.5, 0.8],
                }}
                transition={{
                  duration: 2.4 + index * 0.25,
                  repeat: Infinity,
                  delay: index * 0.2,
                }}
              />
            ))}

            <div className="relative z-10 flex min-h-[330px] flex-col justify-between p-7 sm:p-10">
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div>
                  <div className="mb-4 flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,.9)]" />
                    <span className="text-[9px] font-black uppercase tracking-[0.28em] text-emerald-300">
                      Secure network operational
                    </span>
                  </div>

                  <h1 className="max-w-3xl text-4xl font-black tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
                    Good afternoon,
                    <span className="block text-blue-400">{firstName}.</span>
                  </h1>

                  <p className="mt-5 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
                    Your academic document security environment is active.
                    Transfers, encryption, integrity and threat activity are
                    being monitored from one workspace.
                  </p>
                </div>

                <div className="ui-glass hidden rounded-2xl px-5 py-4 lg:block">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
                      <IconRadar size={19} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                        Security mode
                      </p>
                      <p className="mt-1 text-sm font-black text-slate-900">
                        Active monitoring
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ["AES-256", "Encryption"],
                  ["SHA-256", "Integrity"],
                  ["MITM", "Simulation"],
                ].map(([value, label]) => (
                  <div
                    key={value}
                    className="rounded-2xl border border-white/[0.07] bg-white/[0.035] px-4 py-3 backdrop-blur-md"
                  >
                    <p className="text-sm font-black text-white">{value}</p>
                    <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          variants={fade}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.08 }}
          className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {metrics.map((metric, index) => {
            const Icon = metric.icon;

            return (
              <motion.div
                key={metric.label}
                whileHover={{ y: -5 }}
                className="ui-panel ui-hover group p-5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white transition-colors group-hover:bg-blue-600">
                    <Icon size={20} />
                  </div>

                  <span className="text-[9px] font-black tracking-widest text-slate-300">
                    0{index + 1}
                  </span>
                </div>

                <p className="mt-6 text-3xl font-black tracking-[-0.04em] text-slate-950">
                  {metric.value}
                </p>

                <p className="mt-1 text-sm font-bold text-slate-800">
                  {metric.label}
                </p>

                <p className="mt-1 text-xs text-slate-400">{metric.detail}</p>
              </motion.div>
            );
          })}
        </motion.section>

        <section className="grid gap-6 xl:grid-cols-[1.55fr_.85fr]">
          <motion.div
            variants={fade}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.14 }}
            className="ui-panel overflow-hidden"
          >
            <div className="border-b border-slate-100 px-6 py-5 sm:px-7">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="eyebrow">Transfer telemetry</div>
                  <h2 className="section-title mt-2">Recent secure activity</h2>
                  <p className="mt-1 text-xs text-slate-400">
                    Latest document movement across your security perimeter.
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[9px] font-black uppercase tracking-wider text-emerald-700">
                    Live
                  </span>
                </div>
              </div>
            </div>

            {recentTransfers.length === 0 ? (
              <div className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <IconFileText size={28} />
                </div>
                <h3 className="mt-5 text-base font-black text-slate-900">
                  No transfers yet
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
                  Your secure document activity will appear here once you
                  initiate or receive a transfer.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentTransfers.map((transfer, index) => {
                  const isOutgoing = transfer.senderId !== transfer.receiver?.email;

                  return (
                    <motion.div
                      key={transfer.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.06 }}
                      className="group px-6 py-5 transition-colors hover:bg-slate-50/70 sm:px-7"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white">
                          <IconFileText size={18} />
                          <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-blue-500" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="truncate text-sm font-black text-slate-900">
                              {transfer.fileName}
                            </p>
                            <span className={statusClass(transfer.status)}>
                              {statusLabel[transfer.status] ?? transfer.status}
                            </span>
                          </div>

                          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-medium text-slate-400">
                            <span>
                              {isOutgoing ? "Outgoing" : "Incoming"}
                            </span>
                            <span>{formatDate(transfer.createdAt)}</span>
                            <span className="font-mono">
                              {transfer.id.slice(0, 10)}
                            </span>
                          </div>
                        </div>

                        <IconArrowUpRight
                          size={17}
                          className="hidden text-slate-300 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 sm:block"
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>

          <motion.div
            variants={fade}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.2 }}
            className="ui-panel-dark relative min-h-[420px] p-6 sm:p-7"
          >
            <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-blue-600/15 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-red-500/10 blur-3xl" />

            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_14px_rgba(96,165,250,.9)]" />
                    <span className="text-[9px] font-black uppercase tracking-[0.25em] text-blue-300">
                      Security core
                    </span>
                  </div>
                  <h2 className="mt-3 text-2xl font-black tracking-tight text-white">
                    Protection stack
                  </h2>
                </div>

                <IconActivity className="text-blue-400" size={22} />
              </div>

              <div className="relative mx-auto my-10 flex h-48 w-48 items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border border-blue-400/20 border-t-blue-400/80"
                />

                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-5 rounded-full border border-white/10 border-r-blue-300/70"
                />

                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 2.8, repeat: Infinity }}
                  className="flex h-24 w-24 items-center justify-center rounded-full border border-blue-400/30 bg-blue-500/10 shadow-[0_0_70px_rgba(37,99,235,.22)]"
                >
                  <IconShieldCheck size={39} className="text-blue-300" />
                </motion.div>

                <span className="absolute left-1 top-20 h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,.9)]" />
                <span className="absolute right-2 top-10 h-1.5 w-1.5 rounded-full bg-red-400 shadow-[0_0_12px_rgba(248,113,113,.9)]" />
                <span className="absolute bottom-6 right-8 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,.9)]" />
              </div>

              <div className="space-y-2">
                {[
                  [IconLock, "AES-256 encryption", "ACTIVE", "blue"],
                  [IconFingerprint, "SHA-256 integrity", "ACTIVE", "green"],
                  [IconNetwork, "MITM detection", "ARMED", "red"],
                  [IconRadio, "Audit telemetry", "LIVE", "blue"],
                ].map(([Icon, label, state, tone]) => {
                  const ItemIcon = Icon as typeof IconLock;

                  return (
                    <div
                      key={label as string}
                      className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-3"
                    >
                      <ItemIcon
                        size={16}
                        className={
                          tone === "red"
                            ? "text-red-400"
                            : tone === "green"
                              ? "text-emerald-400"
                              : "text-blue-400"
                        }
                      />
                      <span className="flex-1 text-xs font-bold text-slate-300">
                        {label as string}
                      </span>
                      <span className="text-[8px] font-black tracking-[0.18em] text-slate-500">
                        {state as string}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </section>

        <motion.section
          variants={fade}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.26 }}
          className="mt-6 grid gap-6 lg:grid-cols-[.9fr_1.1fr]"
        >
          <div className="ui-panel p-6 sm:p-7">
            <div className="eyebrow">Quick operations</div>
            <h2 className="section-title mt-2">Launch workspace</h2>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <a
                href="/dashboard/transfer"
                className="group flex items-center gap-4 rounded-2xl border border-slate-200 p-4 transition-all hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50/50"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                  <IconCloudUpload size={19} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-black text-slate-900">
                    Secure transfer
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Encrypt and send a document
                  </p>
                </div>
                <IconArrowUpRight
                  size={17}
                  className="text-slate-300 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </a>

              <a
                href="/dashboard/received"
                className="group flex items-center gap-4 rounded-2xl border border-slate-200 p-4 transition-all hover:-translate-y-1 hover:border-slate-300 hover:bg-slate-50"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white">
                  <IconCloudDownload size={19} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-black text-slate-900">
                    Received documents
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Review incoming files
                  </p>
                </div>
                <IconArrowUpRight
                  size={17}
                  className="text-slate-300 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </a>
            </div>
          </div>

          <div className="ui-panel-blue relative overflow-hidden rounded-[26px] p-6 sm:p-7">
            <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-blue-500/15 blur-3xl" />

            <div className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <div className="eyebrow">System integrity</div>
                  <h2 className="section-title mt-2">Academic security perimeter</h2>
                </div>
                <IconBolt className="text-blue-600" size={23} />
              </div>

              <div className="mt-8 grid grid-cols-3 gap-3">
                {[
                  ["01", "Encrypt", "AES-256"],
                  ["02", "Transmit", "Protected"],
                  ["03", "Verify", "SHA-256"],
                ].map(([number, title, detail]) => (
                  <div
                    key={number}
                    className="rounded-2xl border border-blue-100 bg-white/70 p-4 backdrop-blur"
                  >
                    <span className="text-[9px] font-black text-blue-500">
                      {number}
                    </span>
                    <p className="mt-4 text-sm font-black text-slate-900">
                      {title}
                    </p>
                    <p className="mt-1 text-[10px] font-medium text-slate-400">
                      {detail}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center gap-3 rounded-2xl border border-blue-100 bg-white/70 p-4 backdrop-blur">
                <IconClock size={18} className="text-blue-600" />
                <p className="text-xs leading-5 text-slate-600">
                  Every transfer is recorded as a traceable security event,
                  allowing integrity failures and simulated interception to be
                  investigated.
                </p>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}

