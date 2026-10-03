"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  FileText,
  Fingerprint,
  Loader2,
  LockKeyhole,
  Network,
  Radio,
  RefreshCw,
  Search,
  Send,
  ShieldAlert,
  UserRound,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

interface TransitFile {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  encrypted: boolean;
  status: string;
  sender: string;
  receiver: string;
  createdAt: string;
}

export default function AttackerDashboardPage() {
  const [files, setFiles] = useState<TransitFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState("");
  const [search, setSearch] = useState("");

  async function loadFiles() {
    try {
      setLoading(true);

      const res = await fetch("/api/attacker");

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Unable to load files.");
      }

      setFiles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFiles();

    const interval = window.setInterval(() => {
      loadFiles();
    }, 3000);

    return () => window.clearInterval(interval);
  }, []);

  async function forwardFile(id: string) {
    try {
      setProcessingId(id);

      const res = await fetch("/api/attacker/forward", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      await loadFiles();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setProcessingId("");
    }
  }

  async function replaceFile(id: string) {
    const confirmed = window.confirm(
      "Replace this file with a tampered copy?",
    );

    if (!confirmed) return;

    try {
      setProcessingId(id);

      const res = await fetch("/api/attacker/replace", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      await loadFiles();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setProcessingId("");
    }
  }

  const filteredFiles = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return files;

    return files.filter((file) => {
      return (
        file.fileName.toLowerCase().includes(value) ||
        file.sender.toLowerCase().includes(value) ||
        file.receiver.toLowerCase().includes(value)
      );
    });
  }, [files, search]);

  const encryptedCount = filteredFiles.filter(
    (file) => file.encrypted,
  ).length;

  const plainCount = filteredFiles.filter(
    (file) => !file.encrypted,
  ).length;

  if (loading && files.length === 0) {
    return (
      <main className="dashboard-shell dashboard-grid flex min-h-[calc(100vh-5rem)] items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="ui-panel flex items-center gap-4 px-7 py-6"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <Loader2 size={20} className="animate-spin" />
          </div>

          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-red-600">
              MITM security console
            </p>

            <p className="mt-1 text-sm font-black text-slate-950">
              Scanning transmission network...
            </p>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="dashboard-shell dashboard-grid">
      <div className="pointer-events-none absolute left-[-180px] top-16 h-[520px] w-[520px] rounded-full bg-red-500/[0.045] blur-[150px]" />
      <div className="pointer-events-none absolute right-[-180px] top-[30%] h-[520px] w-[520px] rounded-full bg-blue-500/[0.045] blur-[150px]" />

      <div className="page-container relative space-y-6">
        <section className="relative overflow-hidden rounded-[30px] border border-red-500/10 bg-[#080b12] text-white shadow-2xl shadow-red-950/10">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute right-[5%] top-[-35%] h-[600px] w-[600px] rounded-full border border-red-400/[0.06]" />
            <div className="absolute right-[12%] top-[-18%] h-[420px] w-[420px] rounded-full border border-red-400/[0.05] border-dashed" />

            <div className="absolute left-[5%] top-[35%] h-px w-[75%] bg-gradient-to-r from-transparent via-red-400/10 to-transparent" />
            <div className="absolute left-[20%] top-[65%] h-px w-[50%] bg-gradient-to-r from-transparent via-blue-400/10 to-transparent" />

            <div className="absolute right-[18%] top-[26%] h-2 w-2 animate-pulse rounded-full bg-red-400 shadow-[0_0_22px_rgba(248,113,113,.9)]" />
            <div className="absolute right-[30%] top-[61%] h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_18px_rgba(96,165,250,.8)]" />
          </div>

          <div className="relative z-10 grid gap-10 p-7 sm:p-9 lg:grid-cols-[1fr_auto] lg:items-center lg:p-11">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-red-300">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400 shadow-[0_0_10px_rgba(248,113,113,.9)]" />
                  Attack simulation active
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.035] px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                  <Radio size={11} />
                  Packet interception node
                </span>
              </div>

              <h1 className="mt-5 max-w-4xl text-3xl font-black tracking-[-0.05em] text-white sm:text-4xl lg:text-5xl">
                MITM Interception Console
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
                Observe academic document packets while they are in transit.
                Forward the original payload or simulate an attacker modifying
                the document before delivery.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.035] px-4 py-3">
                  <Network size={14} className="text-red-400" />

                  <span className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-300">
                    Interception node online
                  </span>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.035] px-4 py-3">
                  <Fingerprint size={14} className="text-blue-400" />

                  <span className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-300">
                    Integrity observable
                  </span>
                </div>
              </div>
            </div>

            <div className="relative flex h-48 w-48 items-center justify-center sm:h-56 sm:w-56">
              <div className="absolute inset-0 rounded-full border border-red-400/10" />
              <div className="absolute inset-4 rounded-full border border-red-400/10 border-dashed" />
              <div className="absolute inset-9 rounded-full border border-blue-400/10" />

              <div className="absolute inset-0 animate-[spin_15s_linear_infinite] rounded-full border border-transparent border-t-red-400/30" />

              <div className="relative flex h-28 w-28 flex-col items-center justify-center rounded-full border border-red-400/20 bg-red-500/[0.06] shadow-[0_0_70px_rgba(239,68,68,.08)]">
                <ShieldAlert size={31} className="text-red-400" />

                <span className="mt-2 text-[8px] font-black uppercase tracking-[0.18em] text-red-300">
                  Intercept
                </span>
              </div>

              <span className="absolute right-1 top-10 h-2 w-2 animate-pulse rounded-full bg-red-400 shadow-[0_0_15px_rgba(248,113,113,.9)]" />
              <span className="absolute bottom-8 left-2 h-1.5 w-1.5 rounded-full bg-blue-400" />
              <span className="absolute left-4 top-14 h-1.5 w-1.5 rounded-full bg-amber-400" />
            </div>
          </div>

          <div className="relative z-10 border-t border-white/[0.07] px-7 py-4 sm:px-9 lg:px-11">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Activity size={13} className="text-red-400" />

                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Interception telemetry
                </span>
              </div>

              <span className="font-mono text-[8px] text-slate-600">
                NODE::MITM-01 / CHANNEL::ACTIVE / POLLING::3S
              </span>
            </div>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Packets in transit",
              value: filteredFiles.length,
              detail: "available",
              icon: Radio,
              tone: "red",
            },
            {
              label: "Encrypted",
              value: encryptedCount,
              detail: "AES protected",
              icon: LockKeyhole,
              tone: "emerald",
            },
            {
              label: "Plain payloads",
              value: plainCount,
              detail: "test documents",
              icon: AlertTriangle,
              tone: "amber",
            },
            {
              label: "Attack actions",
              value: 2,
              detail: "forward / replace",
              icon: Zap,
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
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}
                  >
                    <Icon size={17} />
                  </div>

                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" />
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

        <section className="ui-panel overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-5 sm:px-7">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="eyebrow !text-red-600">
                  Interception queue
                </p>

                <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950">
                  Packets awaiting attacker action
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Select a transmission to forward unchanged or simulate
                  malicious replacement.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative min-w-[260px]">
                  <Search
                    size={15}
                    className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    placeholder="Search packets..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="ui-input ui-input-icon !h-10 !rounded-xl !text-xs"
                  />
                </div>

                <button
                  onClick={loadFiles}
                  disabled={loading}
                  className="ui-button-secondary !h-10 !px-4 !text-[9px]"
                >
                  <RefreshCw
                    size={13}
                    className={loading ? "animate-spin" : ""}
                  />
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {filteredFiles.length === 0 ? (
            <div className="relative overflow-hidden px-6 py-24 text-center sm:px-10">
              <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/[0.035] blur-3xl" />

              <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-[24px] border border-red-100 bg-red-50 text-red-500">
                <ShieldAlert size={31} />
              </div>

              <p className="eyebrow mt-7 !text-red-600">
                Channel clear
              </p>

              <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                No packets available
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
                There are currently no matching documents in transit. New
                transfers will appear automatically in the interception queue.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredFiles.map((file) => {
                const processing = processingId === file.id;

                return (
                  <motion.article
                    key={file.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group relative overflow-hidden transition-colors hover:bg-slate-50/70"
                  >
                    <div className="absolute left-0 top-0 h-full w-1 bg-red-500" />

                    <div className="grid gap-6 p-5 sm:p-6 xl:grid-cols-[1.2fr_.75fr_auto] xl:items-center">
                      <div className="min-w-0">
                        <div className="flex items-start gap-4">
                          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                            <FileText size={21} />

                            <span className="absolute -right-1 -top-1 h-3 w-3 animate-pulse rounded-full border-2 border-white bg-red-500" />
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="max-w-[500px] truncate text-sm font-black text-slate-950">
                                {file.fileName}
                              </h3>

                              <span className="rounded-full border border-red-100 bg-red-50 px-2 py-1 text-[7px] font-black uppercase tracking-[0.14em] text-red-600">
                                IN TRANSIT
                              </span>
                            </div>

                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-[9px] font-bold text-slate-400">
                              <span className="flex items-center gap-1.5">
                                <UserRound size={11} />
                                {file.sender}
                              </span>

                              <ArrowRight
                                size={11}
                                className="hidden text-slate-300 sm:block"
                              />

                              <span className="flex items-center gap-1.5">
                                <Send size={11} />
                                {file.receiver}
                              </span>

                              <span>
                                {(file.fileSize / 1024).toFixed(2)} KB
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                              file.encrypted
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-red-50 text-red-600"
                            }`}
                          >
                            {file.encrypted ? (
                              <LockKeyhole size={14} />
                            ) : (
                              <AlertTriangle size={14} />
                            )}
                          </div>

                          <div>
                            <p className="text-[8px] font-black uppercase tracking-[0.14em] text-slate-400">
                              Payload
                            </p>

                            <p
                              className={`mt-1 text-[9px] font-black uppercase tracking-wider ${
                                file.encrypted
                                  ? "text-emerald-600"
                                  : "text-red-600"
                              }`}
                            >
                              {file.encrypted
                                ? "AES encrypted"
                                : "Plain test file"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 xl:justify-end">
                        <button
                          disabled={processing}
                          onClick={() => forwardFile(file.id)}
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-[9px] font-black uppercase tracking-[0.12em] text-white shadow-lg shadow-emerald-600/15 transition-all hover:-translate-y-0.5 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {processing ? (
                            <Loader2
                              size={14}
                              className="animate-spin"
                            />
                          ) : (
                            <CheckCircle2 size={14} />
                          )}

                          Forward
                        </button>

                        <button
                          disabled={processing}
                          onClick={() => replaceFile(file.id)}
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-[9px] font-black uppercase tracking-[0.12em] text-white shadow-lg shadow-red-600/15 transition-all hover:-translate-y-0.5 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {processing ? (
                            <Loader2
                              size={14}
                              className="animate-spin"
                            />
                          ) : (
                            <Zap size={14} />
                          )}

                          Modify
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-3 sm:px-6">
                      <div className="flex flex-wrap items-center gap-4 text-[8px] font-black uppercase tracking-[0.14em] text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <Activity size={10} className="text-red-500" />
                          Packet captured
                        </span>

                        <span className="h-1 w-1 rounded-full bg-slate-300" />

                        <span className="flex items-center gap-1.5">
                          <Network size={10} className="text-blue-500" />
                          MITM node active
                        </span>

                        <span className="h-1 w-1 rounded-full bg-slate-300" />

                        <span className="flex items-center gap-1.5">
                          <Fingerprint
                            size={10}
                            className="text-emerald-500"
                          />
                          Integrity pending
                        </span>

                        <span className="ml-auto">
                          {new Date(file.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}
        </section>

        <section className="ui-panel-dark overflow-hidden">
          <div className="relative p-6 sm:p-7">
            <div className="absolute left-[42%] top-1/2 hidden h-px w-[30%] bg-gradient-to-r from-blue-400/20 via-red-400/20 to-emerald-400/20 lg:block" />

            <div className="relative">
              <div className="mb-7">
                <p className="text-[9px] font-black uppercase tracking-[0.22em] text-red-300">
                  Transmission topology
                </p>

                <h2 className="mt-2 text-xl font-black text-white">
                  Observe the interception point
                </h2>
              </div>

              <div className="grid gap-4 lg:grid-cols-3 lg:items-center">
                {[
                  {
                    label: "Sender",
                    detail: "Original payload",
                    icon: Send,
                    tone: "blue",
                  },
                  {
                    label: "MITM Node",
                    detail: "Inspect / modify",
                    icon: ShieldAlert,
                    tone: "red",
                  },
                  {
                    label: "Receiver",
                    detail: "Integrity verification",
                    icon: Fingerprint,
                    tone: "emerald",
                  },
                ].map((node, index) => {
                  const Icon = node.icon;

                  return (
                    <div key={node.label} className="relative">
                      <div
                        className={`rounded-2xl border p-5 ${
                          node.tone === "red"
                            ? "border-red-400/15 bg-red-500/[0.06]"
                            : node.tone === "emerald"
                              ? "border-emerald-400/10 bg-emerald-500/[0.04]"
                              : "border-blue-400/10 bg-blue-500/[0.04]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                              node.tone === "red"
                                ? "bg-red-500/10 text-red-400"
                                : node.tone === "emerald"
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : "bg-blue-500/10 text-blue-400"
                            }`}
                          >
                            <Icon size={17} />
                          </div>

                          <div>
                            <p className="text-xs font-black text-white">
                              {node.label}
                            </p>

                            <p className="mt-1 text-[8px] font-bold uppercase tracking-wider text-slate-600">
                              {node.detail}
                            </p>
                          </div>
                        </div>
                      </div>

                      {index < 2 && (
                        <div className="hidden lg:absolute lg:-right-7 lg:top-1/2 lg:flex lg:-translate-y-1/2 lg:items-center lg:gap-1">
                          <span className="h-1 w-1 animate-pulse rounded-full bg-blue-400" />
                          <span className="h-px w-8 bg-slate-700" />
                          <ArrowRight
                            size={12}
                            className="text-slate-600"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden rounded-[24px] border border-amber-200 bg-amber-50/60 p-6 sm:p-7">
          <div className="absolute right-[-60px] top-[-60px] h-48 w-48 rounded-full bg-amber-400/[0.06] blur-3xl" />

          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-start">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-amber-600 shadow-sm">
              <AlertTriangle size={19} />
            </div>

            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-700">
                Controlled attack simulation
              </p>

              <h2 className="mt-2 text-lg font-black text-slate-950">
                Forward preserves the payload. Modify simulates tampering.
              </h2>

              <p className="mt-2 max-w-4xl text-xs leading-6 text-slate-600">
                This workspace demonstrates a controlled Man-in-the-Middle
                scenario. Forwarding allows the original document to continue
                unchanged. Modification replaces the payload and allows the
                receiver-side SHA-256 comparison to demonstrate how document
                integrity failure is detected.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}