"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import {
  ArrowLeft,
  Download,
  FileText,
  ShieldCheck,
  User,
  Mail,
  HardDrive,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

interface ViewResponse {
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

export default function ViewReceivedFilePage() {
  const params = useParams();

  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<ViewResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadFile() {
      try {
        const res = await fetch(`/api/view?id=${id}`);

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error);
        }

        setFile(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadFile();
  }, [id]);
if (loading) {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-10 w-72 rounded-xl bg-slate-800" />

      <div className="card-base overflow-hidden">
        <div className="border-b border-slate-800 p-8">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-slate-800" />

            <div className="space-y-3">
              <div className="h-6 w-64 rounded bg-slate-800" />
              <div className="h-4 w-40 rounded bg-slate-800" />
            </div>
          </div>
        </div>

        <div className="grid gap-8 p-8 lg:grid-cols-2">
          {[1, 2].map((column) => (
            <div key={column} className="space-y-5">
              <div className="h-6 w-48 rounded bg-slate-800" />

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <div className="space-y-5">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div
                      key={item}
                      className="space-y-2"
                    >
                      <div className="h-3 w-28 rounded bg-slate-800" />
                      <div className="h-5 w-full rounded bg-slate-800" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 p-8">
          <div className="mb-5 h-6 w-40 rounded bg-slate-800" />

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6, 7].map((item) => (
                <div
                  key={item}
                  className="h-4 rounded bg-slate-800"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

  if (error || !file) {
    return (
      <div className="card-base flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-14 w-14 text-rose-400" />

          <h2 className="mt-5 text-2xl font-semibold text-slate-100">
            Unable to Load File
          </h2>

          <p className="mt-3 text-slate-400">
            {error || "Something went wrong while loading this file."}
          </p>

          <Link
            href="/dashboard/received"
            className="btn-secondary mt-8 inline-flex"
          >
            Back to Inbox
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">
            View Secure File
          </h1>

          <p className="mt-2 text-slate-400">
            Secure preview and integrity verification.
          </p>
        </div>

        <Link
          href="/dashboard/received"
          className="btn-secondary inline-flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      <div className="card-base overflow-hidden">
        {/* File Header */}

        <div className="border-b border-slate-800 p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/15">
                <FileText className="h-7 w-7 text-indigo-400" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-100">
                  {file.fileName}
                </h2>

                <div className="mt-3 flex items-center gap-2 text-slate-400">
                  <User className="h-4 w-4" />

                  {file.sender}
                </div>

                <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                  <Mail className="h-4 w-4" />

                  {file.senderEmail}
                </div>
              </div>
            </div>

            <span
              className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${
                file.status === "DOWNLOADED"
                  ? "bg-indigo-500/15 text-indigo-400 ring-1 ring-indigo-500/30"
                  : "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30"
              }`}
            >
              {file.status}
            </span>
          </div>
        </div>

        {/* Main Content */}

        <div className="grid gap-8 p-8 lg:grid-cols-2">
          {/* File Information */}

          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-slate-100">
              File Information
            </h3>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-5">
              <div className="flex items-center gap-3">
                <HardDrive className="h-5 w-5 text-indigo-400" />

                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    File Size
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
                      ? "AES-256 Protected"
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
                    {new Date(file.deliveredAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

                    {/* Integrity Verification */}

          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-slate-100">
              Integrity Verification
            </h3>

            <div
              className={`rounded-2xl border p-6 ${
                file.integrityVerified
                  ? "border-emerald-500/30 bg-emerald-500/10"
                  : "border-rose-500/30 bg-rose-500/10"
              }`}
            >
              <div className="flex items-center gap-3">
                {file.integrityVerified ? (
                  <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                ) : (
                  <AlertTriangle className="h-6 w-6 text-rose-400" />
                )}

                <div>
                  <h4
                    className={`text-lg font-semibold ${
                      file.integrityVerified
                        ? "text-emerald-400"
                        : "text-rose-400"
                    }`}
                  >
                    {file.integrityVerified
                      ? "Integrity Verified"
                      : "Integrity Verification Failed"}
                  </h4>

                  <p className="mt-1 text-sm text-slate-300">
                    {file.integrityVerified
                      ? "The SHA-256 hash matches the original uploaded file."
                      : "The current file hash does not match the stored hash."}
                  </p>
                </div>
              </div>

              <div className="mt-8 space-y-5">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Stored SHA-256 Hash
                  </p>

                  <div className="overflow-auto rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <code className="break-all text-xs text-slate-300">
                      {file.storedHash}
                    </code>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Current SHA-256 Hash
                  </p>

                  <div className="overflow-auto rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <code className="break-all text-xs text-slate-300">
                      {file.currentHash}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}

        <div className="border-t border-slate-800 p-8">
          <h3 className="mb-5 text-xl font-semibold text-slate-100">
            File Preview
          </h3>

          <div className="max-h-[550px] overflow-auto rounded-2xl border border-slate-800 bg-slate-950 p-6">
            <pre className="whitespace-pre-wrap break-words font-mono text-sm leading-7 text-slate-300">
              {file.preview}
            </pre>
          </div>
        </div>

        {/* Actions */}

        <div className="flex flex-col gap-4 border-t border-slate-800 p-8 sm:flex-row sm:justify-end">
          <Link
            href="/dashboard/received"
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />

            Back to Inbox
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
    </div>
  );
}