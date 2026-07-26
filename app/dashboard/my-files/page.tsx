import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import {
  FileText,
  ShieldCheck,
  Download,
  Clock,
  Inbox,
} from "lucide-react";

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

  return (
    <div className="space-y-8">
      {/* Page Header */}

      <div>
        <h1 className="text-3xl font-bold text-slate-100">
          My Files
        </h1>

        <p className="mt-2 text-slate-400">
          View and manage all encrypted files you've shared.
        </p>
      </div>

      {/* Empty State */}

      {files.length === 0 ? (
        <div className="card-base flex flex-col items-center justify-center px-8 py-20 text-center">
          <Inbox className="h-16 w-16 text-slate-600" />

          <h2 className="mt-6 text-2xl font-semibold text-slate-100">
            No Files Yet
          </h2>

          <p className="mt-3 max-w-md text-slate-400">
            Upload your first secure file to begin transferring encrypted
            documents.
          </p>
        </div>
      ) : (
        <div className="card-base overflow-hidden">
          {/* Table Header */}

          <div className="border-b border-slate-800 px-8 py-6">
            <h2 className="text-xl font-semibold text-slate-100">
              Sent Files
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              {files.length} file{files.length !== 1 ? "s" : ""} found
            </p>
          </div>

          {/* Desktop Table */}

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-b border-slate-800 bg-slate-900">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                    File
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                    Receiver
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                    Encryption
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                    Downloads
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {files.map((file) => (
                  <tr
                    key={file.id}
                    className="transition hover:bg-slate-900/60"
                  >
                    {/* File */}

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/15">
                          <FileText className="h-5 w-5 text-indigo-400" />
                        </div>

                        <div>
                          <p className="font-medium text-slate-100">
                            {file.fileName}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Receiver */}

                    <td className="px-6 py-5 text-slate-300">
                      {file.receiver?.email ??
                        file.receiverEmail}
                    </td>

                    {/* Encryption */}

                    <td className="px-6 py-5">
                      {file.encrypted ? (
                        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-medium text-emerald-400 ring-1 ring-emerald-500/30">
                          <ShieldCheck className="h-4 w-4" />
                          Encrypted
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-rose-500/15 px-3 py-1 text-sm font-medium text-rose-400 ring-1 ring-rose-500/30">
                          Not Encrypted
                        </span>
                      )}
                    </td>

                    {/* Downloads */}

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Download className="h-4 w-4 text-slate-500" />
                        {file.downloadCount}
                      </div>
                    </td>

                    {/* Status */}

                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                          file.status === "DELIVERED"
                            ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30"
                            : "bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30"
                        }`}
                      >
                        {file.status}
                      </span>
                    </td>

                    {/* Date */}

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Clock className="h-4 w-4" />
                        {file.createdAt.toLocaleString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}