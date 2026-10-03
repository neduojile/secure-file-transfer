import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Download,
  FileCheck2,
  FileText,
  HardDrive,
  Inbox,
  ShieldAlert,
  ShieldCheck,
  UserRound,
  Fingerprint,
  Lock,
  Activity,
  Clock3,
  ChevronRight,
} from "lucide-react";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const stages = ["VERIFYING", "DELIVERED"];

function statusStyle(status: string) {
  if (status === "DELIVERED") {
    return "ui-status ui-status-success";
  }

  return "ui-status ui-status-blue";
}

function formatDate(value: Date) {
  return value.toLocaleString([], {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function ReceivedFilesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) redirect("/auth/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) redirect("/auth/login");

  const receivedFiles = await prisma.fileTransfer.findMany({
    where: {
      receiverId: user.id,
      status: { in: ["VERIFYING", "DELIVERED"] },
    },
    include: { sender: true },
    orderBy: { createdAt: "desc" },
  });

  const deliveredCount = receivedFiles.filter(
    (file) => file.status === "DELIVERED"
  ).length;

  const verifyingCount = receivedFiles.filter(
    (file) => file.status === "VERIFYING"
  ).length;

  return (
    <main className="dashboard-shell dashboard-grid">
      <div className="pointer-events-none absolute -left-40 top-24 h-[430px] w-[430px] rounded-full bg-blue-500/[0.065] blur-[120px]" />
      <div className="pointer-events-none absolute right-[-160px] top-[40%] h-[500px] w-[500px] rounded-full bg-red-500/[0.03] blur-[130px]" />

      <div className="page-container relative">
        <div className="space-y-6">
          {/* HERO */}
          <section className="ui-hero">
            <div className="absolute inset-0">
              <div className="absolute left-[8%] top-[58%] h-px w-[55%] bg-gradient-to-r from-transparent via-blue-400/20 to-transparent" />
              <div className="absolute right-[8%] top-[20%] h-48 w-48 rounded-full border border-blue-400/[0.09]" />
              <div className="absolute right-[12%] top-[27%] h-32 w-32 rounded-full border border-blue-400/[0.07]" />
              <div className="absolute right-[17%] top-[37%] h-14 w-14 rounded-full bg-blue-500/10 blur-xl" />
            </div>

            <div className="relative z-10 grid gap-8 p-7 sm:p-9 lg:grid-cols-[1fr_390px] lg:p-11">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,.8)]" />
                  <span className="text-[9px] font-black uppercase tracking-[0.28em] text-emerald-300">
                    Secure academic inbox
                  </span>
                </div>

                <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-[-0.055em] text-white sm:text-5xl lg:text-[3.7rem] lg:leading-[1.02]">
                  Your received
                  <span className="block text-blue-400">
                    document perimeter.
                  </span>
                </h1>

                <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400">
                  Review documents that have passed through the monitored
                  transfer pipeline and reached your authorized academic
                  workspace.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 self-end">
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5 backdrop-blur-xl">
                  <Inbox size={19} className="text-blue-400" />
                  <p className="mt-5 text-3xl font-black text-white">
                    {receivedFiles.length}
                  </p>
                  <p className="mt-1 text-[9px] font-black uppercase tracking-[0.16em] text-slate-500">
                    Total received
                  </p>
                </div>

                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5 backdrop-blur-xl">
                  <ShieldCheck size={19} className="text-emerald-400" />
                  <p className="mt-5 text-3xl font-black text-white">
                    {deliveredCount}
                  </p>
                  <p className="mt-1 text-[9px] font-black uppercase tracking-[0.16em] text-slate-500">
                    Verified
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* TELEMETRY STRIP */}
          <section className="grid gap-3 sm:grid-cols-3">
            {[
              [
                "VERIFIED DELIVERY",
                `${deliveredCount} documents`,
                ShieldCheck,
                "text-emerald-600 bg-emerald-50",
              ],
              [
                "INTEGRITY PIPELINE",
                "SHA-256 monitored",
                Fingerprint,
                "text-blue-600 bg-blue-50",
              ],
              [
                "UNDER VERIFICATION",
                `${verifyingCount} documents`,
                Activity,
                "text-amber-600 bg-amber-50",
              ],
            ].map(([label, value, Icon, iconStyle]) => {
              const ItemIcon = Icon as typeof ShieldCheck;

              return (
                <div
                  key={label as string}
                  className="ui-panel flex items-center gap-4 p-4"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconStyle as string}`}
                  >
                    <ItemIcon size={18} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[8px] font-black uppercase tracking-[0.18em] text-slate-400">
                      {label as string}
                    </p>
                    <p className="mt-1 text-xs font-black text-slate-900">
                      {value as string}
                    </p>
                  </div>
                </div>
              );
            })}
          </section>

          {/* SECURITY NOTICE */}
          <section className="relative overflow-hidden rounded-[24px] border border-blue-100 bg-blue-50/60 p-5 sm:p-6">
            <div className="pointer-events-none absolute right-0 top-0 h-36 w-36 rounded-full bg-blue-400/10 blur-3xl" />

            <div className="relative flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                <ShieldCheck size={19} />
              </div>

              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-600">
                  Delivery verification
                </p>

                <h2 className="mt-1 text-base font-black text-slate-950">
                  Only monitored delivery states appear here.
                </h2>

                <p className="mt-1 max-w-3xl text-xs leading-5 text-slate-500">
                  Documents shown in this workspace have reached the
                  verification or delivered stage of the SATIM transfer
                  pipeline.
                </p>
              </div>
            </div>
          </section>

          {/* EMPTY */}
          {receivedFiles.length === 0 ? (
            <section className="ui-panel flex min-h-[430px] flex-col items-center justify-center px-8 text-center">
              <div className="relative flex h-24 w-24 items-center justify-center rounded-[28px] bg-slate-950 text-blue-400 shadow-[0_20px_60px_rgba(15,23,42,.14)]">
                <Inbox size={36} />

                <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-4 border-white bg-blue-500" />
              </div>

              <p className="eyebrow mt-7">Inbox clear</p>

              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                No delivered documents
              </h2>

              <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
                Documents will appear here after they complete secure
                transmission and reach your authorized academic inbox.
              </p>

              <Link
                href="/dashboard/transfer"
                className="ui-button-primary mt-7"
              >
                Start a secure transfer
                <ArrowRight size={16} />
              </Link>
            </section>
          ) : (
            <section className="space-y-4">
              <div className="flex flex-wrap items-end justify-between gap-4 px-1">
                <div>
                  <p className="eyebrow">Document registry</p>
                  <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950">
                    Incoming documents
                  </h2>
                </div>

                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  {receivedFiles.length} record
                  {receivedFiles.length === 1 ? "" : "s"}
                </p>
              </div>

              {receivedFiles.map((file) => {
                const currentStage = stages.indexOf(file.status);

                return (
                  <article
                    key={file.id}
                    className="ui-panel ui-hover"
                  >
                    {/* DOCUMENT HEADER */}
                    <div className="border-b border-slate-100 p-6 sm:p-7">
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex min-w-0 items-center gap-4">
                          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-blue-400">
                            <FileText size={23} />

                            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h2 className="truncate text-lg font-black tracking-tight text-slate-950 sm:text-xl">
                                {file.fileName}
                              </h2>

                              <span className={statusStyle(file.status)}>
                                {file.status.replaceAll("_", " ")}
                              </span>
                            </div>

                            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-400">
                              <span className="flex items-center gap-1.5">
                                <UserRound size={12} />
                                {file.sender.fullName}
                              </span>

                              <span className="hidden text-slate-200 sm:inline">
                                /
                              </span>

                              <span>{file.sender.email}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
                          <Clock3 size={14} className="text-slate-400" />
                          <span className="text-[9px] font-bold text-slate-500">
                            {formatDate(file.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* DOCUMENT BODY */}
                    <div className="grid gap-6 p-6 sm:p-7 xl:grid-cols-[1fr_1.05fr]">
                      {/* TELEMETRY */}
                      <div>
                        <div className="mb-4 flex items-center justify-between">
                          <div>
                            <p className="eyebrow">
                              Document telemetry
                            </p>
                            <h3 className="mt-1 text-sm font-black text-slate-950">
                              Payload profile
                            </h3>
                          </div>

                          <FileCheck2
                            size={18}
                            className="text-blue-600"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          {[
                            [
                              "Size",
                              `${(file.fileSize / 1024).toFixed(2)} KB`,
                              HardDrive,
                            ],
                            ["Type", file.fileType, FileText],
                            [
                              "Encryption",
                              file.encrypted
                                ? "AES-256"
                                : "Disabled",
                              Lock,
                            ],
                            [
                              "Downloads",
                              String(file.downloadCount),
                              Download,
                            ],
                          ].map(([label, value, Icon]) => {
                            const ItemIcon = Icon as typeof FileText;

                            return (
                              <div
                                key={label as string}
                                className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition-colors hover:border-blue-100 hover:bg-blue-50/40"
                              >
                                <ItemIcon
                                  size={15}
                                  className="text-blue-600"
                                />

                                <p className="mt-3 text-[8px] font-black uppercase tracking-[0.16em] text-slate-400">
                                  {label as string}
                                </p>

                                <p className="mt-1 truncate text-xs font-black text-slate-900">
                                  {value as string}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* PIPELINE */}
                      <div>
                        <div className="mb-4 flex items-center justify-between">
                          <div>
                            <p className="eyebrow">
                              Receiver pipeline
                            </p>
                            <h3 className="mt-1 text-sm font-black text-slate-950">
                              Integrity state
                            </h3>
                          </div>

                          <span className="font-mono text-[9px] text-slate-400">
                            SHA-256
                          </span>
                        </div>

                        <div className="rounded-[24px] border border-slate-100 bg-slate-50/60 p-5">
                          <div className="relative">
                            <div className="absolute left-4 top-4 h-[calc(100%-32px)] w-px bg-slate-200" />

                            <div className="space-y-5">
                              {stages.map((stage, index) => {
                                const complete =
                                  index <= currentStage;

                                return (
                                  <div
                                    key={stage}
                                    className="relative flex items-center gap-4"
                                  >
                                    <div
                                      className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
                                        complete
                                          ? "border-emerald-500 bg-emerald-500 text-white"
                                          : "border-slate-200 bg-white text-slate-300"
                                      }`}
                                    >
                                      {complete ? (
                                        <Check size={13} />
                                      ) : (
                                        <span className="text-[9px] font-black">
                                          {index + 1}
                                        </span>
                                      )}
                                    </div>

                                    <div className="flex-1">
                                      <div className="flex items-center justify-between gap-3">
                                        <p
                                          className={`text-xs font-black ${
                                            complete
                                              ? "text-slate-900"
                                              : "text-slate-400"
                                          }`}
                                        >
                                          {stage.replaceAll(
                                            "_",
                                            " "
                                          )}
                                        </p>

                                        <span
                                          className={`text-[8px] font-black uppercase tracking-wider ${
                                            complete
                                              ? "text-emerald-600"
                                              : "text-slate-300"
                                          }`}
                                        >
                                          {complete
                                            ? "Complete"
                                            : "Pending"}
                                        </span>
                                      </div>

                                      <p className="mt-1 text-[9px] text-slate-400">
                                        {complete
                                          ? "Pipeline checkpoint passed"
                                          : "Awaiting checkpoint"}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                            <FileCheck2
                              size={16}
                              className="mt-0.5 shrink-0 text-emerald-600"
                            />

                            <div>
                              <p className="text-xs font-black text-emerald-800">
                                Secure delivery state confirmed
                              </p>

                              <p className="mt-1 text-[9px] leading-5 text-emerald-700/70">
                                The document reached the monitored
                                receiver pipeline.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* FOOTER */}
                    <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/40 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
                          <Fingerprint size={14} />
                        </div>

                        <span className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-400">
                          Integrity monitored
                        </span>
                      </div>

                      <div className="flex flex-col gap-2 sm:flex-row">
                        <Link
                          href={`/dashboard/received/${file.id}`}
                          className="ui-button-secondary h-11 px-4"
                        >
                          View details
                          <ChevronRight size={15} />
                        </Link>

                        <a
                          href={`/api/download?id=${file.id}`}
                          className="ui-button-primary h-11 px-4"
                        >
                          <Download size={15} />
                          Download file
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
