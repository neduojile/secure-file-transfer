import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";

import {
  Inbox,
  ShieldCheck,
  FileText,
  Download,
  Clock,
  User,
  ArrowRight,
  HardDrive,
} from "lucide-react";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function getStatusColor(status: string) {
  switch (status) {
    case "DELIVERED":
      return "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30";

    case "DOWNLOADED":
      return "bg-indigo-500/15 text-indigo-400 ring-1 ring-indigo-500/30";

    default:
      return "bg-slate-700 text-slate-300";
  }
}

const receiverStages = [
  "VERIFYING",
  "DELIVERED",
];

export default async function ReceivedFilesPage() {
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

  const receivedFiles = await prisma.fileTransfer.findMany({
    where: {
      receiverId: user.id,
      status: {
        in: ["VERIFYING", "DELIVERED"],
      },
    },
    include: {
      sender: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-8">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-slate-100">
          Received Files
        </h1>

        <p className="mt-2 text-slate-400">
          Files securely delivered to your encrypted inbox.
        </p>
      </div>

      {/* Information Card */}

      <div className="card-base flex items-start gap-4 border-l-4 border-l-indigo-500 p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/15">
          <ShieldCheck className="h-6 w-6 text-indigo-400" />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-100">
            Network Delivery Status
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Only files that have successfully completed transmission and
            reached the <strong className="text-emerald-400">
              DELIVERED
            </strong>{" "}
            state are displayed here.
          </p>
        </div>
      </div>

      {/* Empty State */}

      {receivedFiles.length === 0 ? (
        <div className="card-base flex flex-col items-center justify-center px-8 py-20 text-center">
          <Inbox className="h-16 w-16 text-slate-600" />

          <h2 className="mt-6 text-2xl font-semibold text-slate-100">
            No Delivered Files
          </h2>

          <p className="mt-3 max-w-md text-slate-400">
            Files will appear here after they have successfully passed
            through the network and reached your secure inbox.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {receivedFiles.map((file) => {
            const currentStage = receiverStages.indexOf(file.status);

            return (
         <div
  key={file.id}
  className="card-base overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/5"
>
                {/* Card Header */}

                <div className="flex flex-col gap-6 border-b border-slate-800 p-6 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/15">
                        <FileText className="h-6 w-6 text-indigo-400" />
                      </div>

                      <div>
                        <h2 className="text-2xl font-semibold text-slate-100">
                          {file.fileName}
                        </h2>

                        <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">
                          <User className="h-4 w-4" />

                          {file.sender.fullName}
                        </div>

                        <p className="text-sm text-slate-500">
                          {file.sender.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-semibold ${getStatusColor(
                      file.status
                    )}`}
                  >
                    {file.status.replaceAll("_", " ")}
                  </span>
                </div>

                {/* Content */}

                <div className="grid gap-8 p-6 lg:grid-cols-2">
                  {/* File Information */}

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-100">
                      File Information
                    </h3>

                    <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-5">
                      <div className="flex items-center gap-3">
                        <HardDrive className="h-5 w-5 text-indigo-400" />

                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-500">
                            Size
                          </p>

                          <p className="text-slate-200">
                            {(file.fileSize / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-indigo-400" />

                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-500">
                            File Type
                          </p>

                          <p className="text-slate-200">
                            {file.fileType}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <ShieldCheck className="h-5 w-5 text-emerald-400" />

                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-500">
                            Encryption
                          </p>

                          <p className="text-slate-200">
                            {file.encrypted
                              ? "AES-256 Enabled"
                              : "Not Encrypted"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Download className="h-5 w-5 text-indigo-400" />

                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-500">
                            Downloads
                          </p>

                          <p className="text-slate-200">
                            {file.downloadCount}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-indigo-400" />

                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-500">
                            Delivered
                          </p>

                          <p className="text-slate-200">
                            {file.updatedAt.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Receiver Timeline */}

                  <div>
                    <h3 className="text-lg font-semibold text-slate-100">
                      Receiver Timeline
                    </h3>

                    <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-5">
                      <div className="space-y-5">
                        {receiverStages.map((stage, index) => (
                          <div
                            key={stage}
                            className="flex items-center gap-4"
                          >
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                                index <= currentStage
                                  ? "bg-emerald-500 text-white"
                                  : "bg-slate-700 text-slate-400"
                              }`}
                            >
                              {index <= currentStage
                                ? "✓"
                                : index + 1}
                            </div>

                            <div>
                              <p
                                className={
                                  index <= currentStage
                                    ? "font-semibold text-emerald-400"
                                    : "text-slate-400"
                                }
                              >
                                {stage.replaceAll("_", " ")}
                              </p>

                              <p className="text-xs text-slate-500">
                                {index <= currentStage
                                  ? "Completed"
                                  : "Pending"}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-8 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                        <div className="flex items-center gap-3">
                          <ShieldCheck className="h-5 w-5 text-emerald-400" />

                          <div>
                            <p className="font-medium text-emerald-400">
                              Secure Delivery Confirmed
                            </p>

                            <p className="mt-1 text-sm text-slate-300">
                              This file successfully completed the secure
                              transfer process.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}

                <div className="flex flex-col gap-4 border-t border-slate-800 p-6 sm:flex-row sm:justify-end">
                  <Link
                    href={`/dashboard/received/${file.id}`}
                    className="btn-secondary flex items-center justify-center gap-2"
                  >
                    View Details

                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <a
                    href={`/api/download?id=${file.id}`}
                    className="btn-primary flex items-center justify-center gap-2"
                  >
                    <Download className="h-4 w-4" />

                    Download File
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

                