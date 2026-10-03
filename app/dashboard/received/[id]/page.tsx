"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Download,
  ShieldCheck,
  ShieldAlert,
  FileText,
  User,
  Calendar,
  Hash,
  CheckCircle2,
  Loader2,
  Fingerprint,
  Lock,
  Activity,
  Eye,
  HardDrive,
  Network,
  ScanLine,
  Clock3,
} from "lucide-react";
import { motion } from "motion/react";

interface FileDetails {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  encrypted: boolean;
  sender: string;
  senderEmail: string;
  status: string;
  downloadCount: number;
  deliveredAt: string;
  storedHash: string;
  currentHash: string;
  integrityVerified: boolean;
  preview: string;
}

export default function ReceivedFilePage() {
  const params = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [file, setFile] = useState<FileDetails | null>(null);

  useEffect(() => {
    async function loadFile() {
      try {
        const res = await fetch(`/api/view?id=${params.id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Unable to load file.");
        }

        setFile(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadFile();
  }, [params.id]);

  if (loading) {
    return (
      <main className="dashboard-shell dashboard-grid flex min-h-[calc(100vh-5rem)] items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          className="ui-panel flex items-center gap-4 px-7 py-6"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Loader2 size={20} className="animate-spin" />
          </div>

          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-600">
              Security workspace
            </p>

            <p className="mt-1 text-sm font-black text-slate-950">
              Loading document telemetry...
            </p>
          </div>
        </motion.div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="dashboard-shell dashboard-grid flex min-h-[calc(100vh-5rem)] items-center justify-center px-5">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="ui-panel w-full max-w-xl overflow-hidden"
        >
          <div className="h-1 bg-red-500" />

          <div className="p-8 text-center sm:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <ShieldAlert size={28} />
            </div>

            <p className="eyebrow mt-6 !text-red-600">
              Access failure
            </p>

            <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
              Unable to open document
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
              {error}
            </p>

            <Link
              href="/dashboard/received"
              className="ui-button-primary mt-7"
            >
              <ArrowLeft size={16} />
              Back to received files
            </Link>
          </div>
        </motion.div>
      </main>
    );
  }

  if (!file) return null;

  const verified = file.integrityVerified;

  return (
    <main className="dashboard-shell dashboard-grid">
      <div className="pointer-events-none absolute -left-40 top-20 h-[430px] w-[430px] rounded-full bg-blue-500/[0.06] blur-[120px]" />
      <div className="pointer-events-none absolute right-[-180px] top-[30%] h-[500px] w-[500px] rounded-full bg-red-500/[0.03] blur-[140px]" />

      <div className="page-container relative">
        <div className="space-y-6">
          <Link
            href="/dashboard/received"
            className="group inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 transition hover:text-blue-600"
          >
            <ArrowLeft
              size={14}
              className="transition-transform group-hover:-translate-x-1"
            />
            Received documents
          </Link>

          <section className="ui-hero">
            <div className="absolute inset-0">
              <div
                className={`absolute right-[7%] top-[15%] h-52 w-52 rounded-full border ${
                  verified
                    ? "border-emerald-400/[0.10]"
                    : "border-red-400/[0.12]"
                }`}
              />

              <div
                className={`absolute right-[12%] top-[23%] h-36 w-36 rounded-full border ${
                  verified
                    ? "border-emerald-400/[0.08]"
                    : "border-red-400/[0.09]"
                }`}
              />

              <div
                className={`absolute right-[18%] top-[35%] h-16 w-16 rounded-full blur-xl ${
                  verified ? "bg-emerald-500/10" : "bg-red-500/10"
                }`}
              />
            </div>

            <div className="relative z-10 grid gap-8 p-7 sm:p-9 lg:grid-cols-[1fr_auto] lg:items-center lg:p-11">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.18em] ${
                      verified
                        ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
                        : "border-red-400/20 bg-red-500/10 text-red-300"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        verified
                          ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,.8)]"
                          : "bg-red-400 shadow-[0_0_10px_rgba(248,113,113,.8)]"
                      }`}
                    />
                    {verified ? "Integrity verified" : "Integrity failure"}
                  </span>

                  <span className="rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">
                    {file.status.replaceAll("_", " ")}
                  </span>
                </div>

                <h1 className="mt-5 max-w-4xl break-words text-3xl font-black tracking-[-0.05em] text-white sm:text-4xl lg:text-5xl">
                  {file.fileName}
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
                  Security telemetry, integrity evidence and delivery
                  information for this academic document.
                </p>
              </div>

              <div
                className={`flex h-28 w-28 shrink-0 items-center justify-center rounded-full border ${
                  verified
                    ? "border-emerald-400/20 bg-emerald-500/[0.04]"
                    : "border-red-400/20 bg-red-500/[0.04]"
                }`}
              >
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-full ${
                    verified
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {verified ? (
                    <ShieldCheck size={29} />
                  ) : (
                    <ShieldAlert size={29} />
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              [
                "Integrity",
                verified ? "Verified" : "Failed",
                Fingerprint,
                verified
                  ? "text-emerald-600 bg-emerald-50"
                  : "text-red-600 bg-red-50",
              ],
              [
                "Encryption",
                file.encrypted ? "AES-256" : "Disabled",
                Lock,
                file.encrypted
                  ? "text-blue-600 bg-blue-50"
                  : "text-red-600 bg-red-50",
              ],
              [
                "Downloads",
                String(file.downloadCount),
                Download,
                "text-slate-700 bg-slate-100",
              ],
              [
                "File size",
                `${(file.fileSize / 1024).toFixed(2)} KB`,
                HardDrive,
                "text-blue-600 bg-blue-50",
              ],
            ].map(([label, value, Icon, iconStyle]) => {
              const MetricIcon = Icon as typeof Fingerprint;

              return (
                <div
                  key={label as string}
                  className="ui-panel flex items-center gap-4 p-4"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconStyle as string}`}
                  >
                    <MetricIcon size={17} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[8px] font-black uppercase tracking-[0.18em] text-slate-400">
                      {label as string}
                    </p>

                    <p className="mt-1 truncate text-sm font-black text-slate-950">
                      {value as string}
                    </p>
                  </div>
                </div>
              );
            })}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.45fr_.75fr]">
            <div className="space-y-6">
              <section className="ui-panel overflow-hidden">
                <div className="border-b border-slate-100 px-6 py-5 sm:px-7">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="eyebrow">Document identity</p>
                      <h2 className="mt-1 text-lg font-black text-slate-950">
                        File information
                      </h2>
                    </div>

                    <FileText size={20} className="text-blue-600" />
                  </div>
                </div>

                <div className="grid gap-px bg-slate-100 sm:grid-cols-2">
                  {[
                    [FileText, "File type", file.fileType],
                    [User, "Sender", file.sender],
                    [
                      Calendar,
                      "Delivered",
                      new Date(file.deliveredAt).toLocaleString(),
                    ],
                    [
                      Download,
                      "Downloads",
                      String(file.downloadCount),
                    ],
                  ].map(([Icon, label, value]) => {
                    const ItemIcon = Icon as typeof FileText;

                    return (
                      <div
                        key={label as string}
                        className="bg-white p-5 sm:p-6"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-blue-600">
                            <ItemIcon size={16} />
                          </div>

                          <div className="min-w-0">
                            <p className="text-[8px] font-black uppercase tracking-[0.16em] text-slate-400">
                              {label as string}
                            </p>

                            <p className="mt-2 break-words text-xs font-black text-slate-900">
                              {value as string}
                            </p>

                            {label === "Sender" && (
                              <p className="mt-1 break-all text-[9px] text-slate-400">
                                {file.senderEmail}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-slate-100 p-5 sm:p-6">
                  <a
                    href={`/api/download?id=${file.id}`}
                    className="ui-button-primary w-full sm:w-auto"
                  >
                    <Download size={16} />
                    Download document
                    <ArrowUpRight size={15} />
                  </a>
                </div>
              </section>

              <section className="ui-panel overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 sm:px-7">
                  <div>
                    <p className="eyebrow">Content inspection</p>
                    <h2 className="mt-1 text-lg font-black text-slate-950">
                      File preview
                    </h2>
                  </div>

                  <Eye size={19} className="text-blue-600" />
                </div>

                <div className="p-5 sm:p-7">
                  <div className="relative overflow-hidden rounded-[22px] border border-slate-200 bg-slate-950">
                    <div className="flex items-center gap-2 border-b border-white/[0.07] px-4 py-3">
                      <span className="h-2 w-2 rounded-full bg-red-400/70" />
                      <span className="h-2 w-2 rounded-full bg-amber-400/70" />
                      <span className="h-2 w-2 rounded-full bg-emerald-400/70" />

                      <span className="ml-2 font-mono text-[8px] uppercase tracking-[0.18em] text-slate-500">
                        secure-preview
                      </span>
                    </div>

                    <pre className="max-h-[500px] min-h-[180px] overflow-auto whitespace-pre-wrap break-words p-5 font-mono text-xs leading-6 text-slate-300">
                      {file.preview}
                    </pre>
                  </div>
                </div>
              </section>
            </div>

            <aside className="space-y-6">
              <section
                className={`relative overflow-hidden rounded-[26px] border p-6 ${
                  verified
                    ? "border-emerald-200 bg-white"
                    : "border-red-200 bg-white"
                }`}
              >
                <div
                  className={`absolute right-0 top-0 h-44 w-44 rounded-full blur-3xl ${
                    verified
                      ? "bg-emerald-500/[0.07]"
                      : "bg-red-500/[0.07]"
                  }`}
                />

                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="eyebrow">Integrity core</p>
                      <h2 className="mt-1 text-lg font-black text-slate-950">
                        SHA-256 verification
                      </h2>
                    </div>

                    {verified ? (
                      <CheckCircle2 size={22} className="text-emerald-500" />
                    ) : (
                      <ShieldAlert size={22} className="text-red-500" />
                    )}
                  </div>

                  <div
                    className={`mt-6 rounded-2xl border p-4 ${
                      verified
                        ? "border-emerald-100 bg-emerald-50"
                        : "border-red-100 bg-red-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {verified ? (
                        <ShieldCheck size={20} className="text-emerald-600" />
                      ) : (
                        <ShieldAlert size={20} className="text-red-600" />
                      )}

                      <div>
                        <p
                          className={`text-sm font-black ${
                            verified
                              ? "text-emerald-800"
                              : "text-red-800"
                          }`}
                        >
                          {verified ? "File Verified" : "Integrity Failed"}
                        </p>

                        <p
                          className={`mt-1 text-[9px] ${
                            verified
                              ? "text-emerald-700/70"
                              : "text-red-700/70"
                          }`}
                        >
                          {verified
                            ? "Current content matches the stored hash."
                            : "Current content differs from the stored hash."}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div>
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <span className="text-[8px] font-black uppercase tracking-[0.16em] text-slate-400">
                          Original SHA-256
                        </span>

                        <Hash size={13} className="text-slate-300" />
                      </div>

                      <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 font-mono text-[9px] leading-5 break-all text-slate-500">
                        {file.storedHash}
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <span className="text-[8px] font-black uppercase tracking-[0.16em] text-slate-400">
                          Current SHA-256
                        </span>

                        <Fingerprint
                          size={13}
                          className={
                            verified
                              ? "text-emerald-500"
                              : "text-red-500"
                          }
                        />
                      </div>

                      <div
                        className={`rounded-xl border p-3 font-mono text-[9px] leading-5 break-all ${
                          verified
                            ? "border-emerald-100 bg-emerald-50/60 text-emerald-700"
                            : "border-red-100 bg-red-50/60 text-red-700"
                        }`}
                      >
                        {file.currentHash}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="ui-panel-dark p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.22em] text-blue-300">
                      Security telemetry
                    </p>

                    <h2 className="mt-2 text-lg font-black text-white">
                      Protection status
                    </h2>
                  </div>

                  <Activity size={20} className="text-blue-400" />
                </div>

                <div className="mt-6 space-y-2">
                  {[
                    [
                      Lock,
                      "Encryption",
                      file.encrypted ? "AES-256 enabled" : "Disabled",
                    ],
                    [
                      Fingerprint,
                      "Integrity",
                      verified ? "Verified" : "Failed",
                    ],
                    [
                      Network,
                      "Transfer status",
                      file.status.replaceAll("_", " "),
                    ],
                    [
                      Download,
                      "Access count",
                      `${file.downloadCount} download${
                        file.downloadCount === 1 ? "" : "s"
                      }`,
                    ],
                  ].map(([Icon, label, value]) => {
                    const ItemIcon = Icon as typeof Lock;

                    return (
                      <div
                        key={label as string}
                        className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.035] p-3"
                      >
                        <ItemIcon
                          size={15}
                          className={
                            label === "Integrity"
                              ? verified
                                ? "text-emerald-400"
                                : "text-red-400"
                              : "text-blue-400"
                          }
                        />

                        <span className="flex-1 text-[10px] font-bold text-slate-400">
                          {label as string}
                        </span>

                        <span className="max-w-[130px] truncate text-[9px] font-black uppercase tracking-wider text-white">
                          {value as string}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="ui-panel p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Clock3 size={18} />
                  </div>

                  <div>
                    <p className="eyebrow">Delivery record</p>
                    <h3 className="mt-1 text-sm font-black text-slate-950">
                      Secure handoff
                    </h3>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <p className="text-[8px] font-black uppercase tracking-[0.16em] text-slate-400">
                      Delivered
                    </p>

                    <p className="mt-1 text-xs font-black text-slate-900">
                      {new Date(file.deliveredAt).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-[8px] font-black uppercase tracking-[0.16em] text-slate-400">
                      Sender account
                    </p>

                    <p className="mt-1 break-all text-xs font-black text-slate-900">
                      {file.senderEmail}
                    </p>
                  </div>
                </div>
              </section>
            </aside>
          </section>

          <section
            className={`relative overflow-hidden rounded-[24px] border p-6 ${
              verified
                ? "border-blue-100 bg-blue-50/60"
                : "border-red-100 bg-red-50/60"
            }`}
          >
            <div className="relative flex items-start gap-4">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                  verified
                    ? "bg-white text-blue-600"
                    : "bg-white text-red-600"
                }`}
              >
                <ScanLine size={19} />
              </div>

              <div>
                <p
                  className={`text-[9px] font-black uppercase tracking-[0.2em] ${
                    verified ? "text-blue-600" : "text-red-600"
                  }`}
                >
                  Security notice
                </p>

                <h3 className="mt-1 text-sm font-black text-slate-950">
                  Integrity evidence retained for this transfer.
                </h3>

                <p className="mt-2 max-w-4xl text-xs leading-6 text-slate-500">
                  The received document is evaluated against its stored
                  SHA-256 hash. A matching hash indicates that the document
                  content remained consistent with the recorded transfer state.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}