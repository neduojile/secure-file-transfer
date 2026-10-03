"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  Building2,
  Check,
  FileCheck2,
  FileStack,
  FileText,
  Fingerprint,
  Lock,
  Mail,
  Network,
  ShieldAlert,
  ShieldCheck,
  Upload,
  X,
  Zap,
  Activity,
  ScanLine,
  Radio,
  Send,
} from "lucide-react";
import { toast } from "sonner";

import NetworkTransferAnimation from "@/components/dashboard/network-transfer-animation";

const documentTypes = [
  ["EXAMINATION", "Examination Document"],
  ["RESULT", "Result / Grade Sheet"],
  ["PROJECT", "Project Document"],
  ["ASSIGNMENT", "Assignment"],
  ["STUDENT_RECORD", "Student Record"],
  ["DEPARTMENTAL", "Departmental Document"],
  ["ADMINISTRATIVE", "Administrative Document"],
  ["RESEARCH", "Research Document"],
  ["OTHER", "Other"],
];

const confidentialityLevels = [
  ["PUBLIC", "Public"],
  ["INTERNAL", "Internal"],
  ["CONFIDENTIAL", "Confidential"],
  ["HIGHLY_CONFIDENTIAL", "Highly Confidential"],
];

const stages = [
  ["01", "Capture", "Document enters secure workspace"],
  ["02", "Encrypt", "AES-256 protection applied"],
  ["03", "Transmit", "Channel activity monitored"],
  ["04", "Verify", "SHA-256 integrity checked"],
];

export default function UploadForm() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<File[]>([]);
  const [receiverEmail, setReceiverEmail] = useState("");
  const [documentType, setDocumentType] = useState("OTHER");
  const [department, setDepartment] = useState("");
  const [confidentiality, setConfidentiality] =
    useState("CONFIDENTIAL");
  const [description, setDescription] = useState("");
  const [encrypt, setEncrypt] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [dragging, setDragging] = useState(false);

  function addFiles(selected: FileList | null) {
    if (!selected) return;

    const incoming = Array.from(selected);

    setFiles((current) => {
      const existing = new Set(
        current.map((file) => `${file.name}-${file.size}`)
      );

      return [
        ...current,
        ...incoming.filter(
          (file) =>
            !existing.has(`${file.name}-${file.size}`)
        ),
      ];
    });
  }

  function removeFile(index: number) {
    setFiles((current) =>
      current.filter((_, i) => i !== index)
    );
  }

  function clearFiles() {
    setFiles([]);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function handleUpload() {
    if (!receiverEmail.trim()) {
      toast.warning("Receiver email required", {
        description:
          "Enter the recipient's academic email address.",
      });
      return;
    }

    if (!department.trim()) {
      toast.warning("Department required", {
        description:
          "Enter the department responsible for this document.",
      });
      return;
    }

    if (!files.length) {
      toast.warning("Documents required", {
        description:
          "Select at least one academic document.",
      });
      return;
    }

    setLoading(true);
    setShowAnimation(true);

    try {
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("files", file);
      });

      formData.append("receiverEmail", receiverEmail);
      formData.append("documentType", documentType);
      formData.append("department", department);
      formData.append("confidentiality", confidentiality);
      formData.append("description", description);
      formData.append("encrypt", encrypt.toString());

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setShowAnimation(false);

        toast.error("Transfer failed", {
          description:
            data.error ||
            "Unable to start the secure transfer.",
        });

        return;
      }

      setTimeout(() => {
        setShowAnimation(false);
        clearFiles();
        setReceiverEmail("");
        setDocumentType("OTHER");
        setDepartment("");
        setConfidentiality("CONFIDENTIAL");
        setDescription("");
        setEncrypt(true);

        toast.success("Secure transfer started", {
          description:
            data.message ||
            "Your academic document is now in transit.",
        });
      }, 1800);
    } catch (error) {
      console.error(error);

      setShowAnimation(false);

      toast.error("Unexpected error", {
        description: "Please try the transfer again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="dashboard-shell dashboard-grid">
      <div className="pointer-events-none absolute -left-40 top-24 h-[420px] w-[420px] rounded-full bg-blue-500/[0.07] blur-[120px]" />
      <div className="pointer-events-none absolute right-[-160px] top-[35%] h-[480px] w-[480px] rounded-full bg-red-500/[0.035] blur-[130px]" />

      <div className="page-container relative">
        <AnimatePresence mode="wait">
          {showAnimation ? (
            <motion.div
              key="transfer-animation"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-2"
            >
              <NetworkTransferAnimation
                isRunning={showAnimation}
                encrypted={encrypt}
                onComplete={() => {}}
              />
            </motion.div>
          ) : (
            <motion.div
              key="transfer-workspace"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="space-y-6"
            >
              {/* COMMAND HEADER */}
              <section className="ui-hero">
                <div className="absolute inset-0 overflow-hidden">
                  <motion.div
                    animate={{ x: ["-10%", "100%"] }}
                    transition={{
                      duration: 7,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute top-[42%] h-px w-[45%] bg-gradient-to-r from-transparent via-blue-400/40 to-transparent"
                  />

                  <motion.div
                    animate={{ x: ["100%", "-20%"] }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute top-[68%] h-px w-[35%] bg-gradient-to-r from-transparent via-blue-300/20 to-transparent"
                  />

                  <div className="absolute right-[8%] top-[15%] h-48 w-48 rounded-full border border-blue-400/10" />
                  <div className="absolute right-[11%] top-[22%] h-32 w-32 rounded-full border border-blue-400/[0.07]" />
                  <div className="absolute right-[16%] top-[31%] h-14 w-14 rounded-full bg-blue-500/[0.08] blur-xl" />
                </div>

                <div className="relative z-10 grid gap-10 p-7 sm:p-9 lg:grid-cols-[1fr_380px] lg:p-11">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,.9)]" />
                      <span className="text-[9px] font-black uppercase tracking-[0.28em] text-blue-300">
                        Secure transfer protocol
                      </span>
                    </div>

                    <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-[-0.055em] text-white sm:text-5xl lg:text-[3.7rem] lg:leading-[1.02]">
                      Move sensitive academic
                      <span className="block text-blue-400">
                        data with control.
                      </span>
                    </h1>

                    <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400">
                      Configure the recipient, classify the document,
                      encrypt the payload and place the transfer under
                      continuous integrity monitoring.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 self-end">
                    {[
                      [Lock, "AES-256", "Encrypted"],
                      [Fingerprint, "SHA-256", "Integrity"],
                      [Network, "MITM", "Simulated"],
                      [Radio, "AUDIT", "Tracked"],
                    ].map(([Icon, title, detail]) => {
                      const SecurityIcon = Icon as typeof Lock;

                      return (
                        <div
                          key={title as string}
                          className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 backdrop-blur-xl"
                        >
                          <SecurityIcon
                            size={17}
                            className={
                              title === "MITM"
                                ? "text-red-400"
                                : "text-blue-400"
                            }
                          />

                          <p className="mt-4 text-xs font-black text-white">
                            {title as string}
                          </p>

                          <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500">
                            {detail as string}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* WORKSPACE */}
              <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
                {/* FORM SURFACE */}
                <div className="ui-panel">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-6 py-5 sm:px-8">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white shadow-lg shadow-slate-950/10">
                        <FileStack size={18} />
                      </div>

                      <div>
                        <p className="eyebrow">
                          Transfer configuration
                        </p>
                        <h2 className="mt-1 text-lg font-black tracking-tight text-slate-950">
                          Document payload
                        </h2>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,.7)]" />
                      <span className="text-[9px] font-black uppercase tracking-[0.16em] text-emerald-700">
                        Channel ready
                      </span>
                    </div>
                  </div>

                  <div className="space-y-7 p-6 sm:p-8">
                    {/* RECEIVER */}
                    <div>
                      <label className="mb-2.5 block text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
                        Authorized receiver
                      </label>

                      <div className="relative">
                        <Mail
                          size={17}
                          className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-blue-500"
                        />

                        <input
                          type="email"
                          value={receiverEmail}
                          onChange={(e) =>
                            setReceiverEmail(e.target.value)
                          }
                          placeholder="receiver@university.edu"
                          className="ui-input ui-input-icon pr-4"
                        />
                      </div>

                      <p className="mt-2 text-[10px] text-slate-400">
                        Delivery is restricted to a registered account.
                      </p>
                    </div>

                    {/* CLASSIFICATION */}
                    <div className="grid gap-5 md:grid-cols-2">
                      <div>
                        <label className="mb-2.5 block text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
                          Document type
                        </label>

                        <select
                          value={documentType}
                          onChange={(e) =>
                            setDocumentType(e.target.value)
                          }
                          className="ui-input w-full appearance-none"
                        >
                          {documentTypes.map(
                            ([value, label]) => (
                              <option
                                key={value}
                                value={value}
                              >
                                {label}
                              </option>
                            )
                          )}
                        </select>
                      </div>

                      <div>
                        <label className="mb-2.5 block text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
                          Responsible department
                        </label>

                        <div className="relative">
                          <Building2
                            size={17}
                            className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-blue-500"
                          />

                          <input
                            type="text"
                            value={department}
                            onChange={(e) =>
                              setDepartment(e.target.value)
                            }
                            placeholder="Computer Science"
                            className="ui-input ui-input-icon pr-4"
                          />
                        </div>
                      </div>
                    </div>

                    {/* CLASSIFICATION LEVEL */}
                    <div>
                      <div className="mb-3 flex items-center justify-between">
                        <label className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
                          Confidentiality level
                        </label>

                        <span className="text-[9px] font-bold text-slate-400">
                          Policy classification
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
                        {confidentialityLevels.map(
                          ([value, label]) => {
                            const selected =
                              confidentiality === value;

                            return (
                              <button
                                key={value}
                                type="button"
                                onClick={() =>
                                  setConfidentiality(value)
                                }
                                className={`relative overflow-hidden rounded-2xl border p-4 text-left transition-all ${
                                  selected
                                    ? "border-blue-300 bg-blue-50 shadow-[0_12px_30px_rgba(37,99,235,.08)]"
                                    : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-blue-200 hover:bg-slate-50"
                                }`}
                              >
                                {selected && (
                                  <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
                                    <Check size={12} />
                                  </span>
                                )}

                                <span
                                  className={`block pr-5 text-[10px] font-black ${
                                    selected
                                      ? "text-blue-700"
                                      : "text-slate-600"
                                  }`}
                                >
                                  {label}
                                </span>

                                <span className="mt-2 block text-[8px] font-bold uppercase tracking-wider text-slate-400">
                                  {value.replaceAll("_", " ")}
                                </span>
                              </button>
                            );
                          }
                        )}
                      </div>
                    </div>

                    {/* DESCRIPTION */}
                    <div>
                      <label className="mb-2.5 block text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
                        Transfer context
                      </label>

                      <textarea
                        value={description}
                        onChange={(e) =>
                          setDescription(e.target.value)
                        }
                        placeholder="Briefly describe what this document contains or why it is being transferred..."
                        rows={4}
                        className="ui-textarea"
                      />
                    </div>

                    {/* FILE PAYLOAD */}
                    <div>
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
                          Document payload
                        </label>

                        {files.length > 0 && (
                          <button
                            type="button"
                            onClick={clearFiles}
                            className="text-[10px] font-black uppercase tracking-wider text-red-500 transition hover:text-red-700"
                          >
                            Clear
                          </button>
                        )}
                      </div>

                      <label
                        htmlFor="fileInput"
                        onDragOver={(e) => {
                          e.preventDefault();
                          setDragging(true);
                        }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setDragging(false);
                          addFiles(e.dataTransfer.files);
                        }}
                        className={`group relative flex min-h-[230px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[26px] border border-dashed p-8 text-center transition-all ${
                          dragging
                            ? "border-blue-500 bg-blue-50 shadow-[0_0_0_5px_rgba(37,99,235,.06)]"
                            : "border-slate-200 bg-slate-50/70 hover:border-blue-300 hover:bg-blue-50/30"
                        }`}
                      >
                        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
                          <div className="absolute left-[15%] top-1/2 h-px w-[70%] bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />
                          <div className="absolute left-1/2 top-[15%] h-[70%] w-px bg-gradient-to-b from-transparent via-blue-400/20 to-transparent" />
                        </div>

                        <div className="relative flex h-16 w-16 items-center justify-center rounded-[20px] bg-white text-blue-600 shadow-[0_15px_40px_rgba(15,23,42,.09)] transition duration-300 group-hover:-translate-y-1 group-hover:shadow-blue-500/15">
                          <Upload size={27} />
                        </div>

                        <h3 className="relative mt-5 text-sm font-black text-slate-900">
                          Drop academic documents
                        </h3>

                        <p className="relative mt-2 max-w-sm text-xs leading-5 text-slate-400">
                          Drag files into the secure workspace or
                          browse your device. Multiple documents are
                          supported.
                        </p>

                        <span className="relative mt-4 rounded-full bg-slate-950 px-5 py-2.5 text-[9px] font-black uppercase tracking-[0.14em] text-white transition group-hover:bg-blue-600">
                          Select documents
                        </span>
                      </label>

                      <input
                        ref={inputRef}
                        id="fileInput"
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) =>
                          addFiles(e.target.files)
                        }
                      />

                      {files.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {files.map((file, index) => (
                            <motion.div
                              key={`${file.name}-${file.size}-${index}`}
                              initial={{
                                opacity: 0,
                                y: 8,
                              }}
                              animate={{
                                opacity: 1,
                                y: 0,
                              }}
                              className="group flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
                            >
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <FileText size={17} />
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="truncate text-xs font-black text-slate-900">
                                  {file.name}
                                </p>

                                <p className="mt-1 font-mono text-[9px] text-slate-400">
                                  {(file.size / 1024 / 1024).toFixed(
                                    2
                                  )}{" "}
                                  MB
                                </p>
                              </div>

                              <span className="hidden rounded-full bg-emerald-50 px-2.5 py-1 text-[8px] font-black uppercase tracking-wider text-emerald-700 sm:block">
                                Ready
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  removeFile(index)
                                }
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                                aria-label={`Remove ${file.name}`}
                              >
                                <X size={15} />
                              </button>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* ENCRYPTION */}
                    <div className="relative overflow-hidden rounded-[24px] border border-blue-100 bg-blue-50/70 p-5">
                      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-400/10 blur-3xl" />

                      <div className="relative flex items-center justify-between gap-5">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                            <Lock size={19} />
                          </div>

                          <div>
                            <p className="text-xs font-black text-slate-900">
                              Encrypt before transmission
                            </p>

                            <p className="mt-1 text-[10px] leading-5 text-slate-500">
                              AES-256 encryption protects the
                              document during transfer.
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          role="switch"
                          aria-checked={encrypt}
                          onClick={() =>
                            setEncrypt((value) => !value)
                          }
                          className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                            encrypt
                              ? "bg-blue-600"
                              : "bg-slate-300"
                          }`}
                        >
                          <span
                            className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                              encrypt ? "left-6" : "left-1"
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* SUBMIT */}
                    <button
                      type="button"
                      onClick={handleUpload}
                      disabled={loading}
                      className="group relative flex h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-slate-950 px-6 font-black text-white shadow-[0_18px_45px_rgba(15,23,42,.16)] transition-all hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-blue-600/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent opacity-0 transition group-hover:opacity-100" />

                      {loading ? (
                        <>
                          <Activity
                            size={18}
                            className="relative animate-pulse"
                          />
                          <span className="relative">
                            Establishing secure channel...
                          </span>
                        </>
                      ) : (
                        <>
                          <Send
                            size={17}
                            className="relative"
                          />
                          <span className="relative">
                            {files.length > 1
                              ? `Encrypt & send ${files.length} documents`
                              : "Encrypt & send document"}
                          </span>
                          <ArrowRight
                            size={17}
                            className="relative transition-transform group-hover:translate-x-1"
                          />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* SECURITY COMMAND RAIL */}
                <aside className="space-y-5">
                  <div className="ui-panel-dark p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,.8)]" />
                          <span className="text-[9px] font-black uppercase tracking-[0.24em] text-blue-300">
                            Security rail
                          </span>
                        </div>

                        <h2 className="mt-3 text-xl font-black text-white">
                          Protection matrix
                        </h2>
                      </div>

                      <ShieldCheck
                        size={22}
                        className="text-blue-400"
                      />
                    </div>

                    <div className="mt-7 space-y-2">
                      {[
                        [
                          Lock,
                          "AES-256",
                          "Encryption layer",
                          "blue",
                        ],
                        [
                          Fingerprint,
                          "SHA-256",
                          "Integrity tracking",
                          "blue",
                        ],
                        [
                          Network,
                          "MITM",
                          "Interception simulation",
                          "red",
                        ],
                        [
                          FileCheck2,
                          "AUDIT",
                          "Security event trail",
                          "blue",
                        ],
                      ].map(
                        ([
                          Icon,
                          title,
                          detail,
                          tone,
                        ]) => {
                          const SecurityIcon =
                            Icon as typeof Lock;

                          return (
                            <div
                              key={title as string}
                              className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.035] p-3"
                            >
                              <div
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                                  tone === "red"
                                    ? "bg-red-500/10 text-red-400"
                                    : "bg-blue-500/10 text-blue-400"
                                }`}
                              >
                                <SecurityIcon size={16} />
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-black text-white">
                                  {title as string}
                                </p>

                                <p className="mt-0.5 text-[9px] text-slate-500">
                                  {detail as string}
                                </p>
                              </div>

                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  tone === "red"
                                    ? "bg-red-400 shadow-[0_0_8px_rgba(248,113,113,.8)]"
                                    : "bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,.8)]"
                                }`}
                              />
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>

                  {/* LIVE CHANNEL */}
                  <div className="ui-panel p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="eyebrow">Transmission path</p>
                        <h3 className="mt-1 text-sm font-black text-slate-950">
                          Secure lifecycle
                        </h3>
                      </div>

                      <ScanLine
                        size={19}
                        className="text-blue-600"
                      />
                    </div>

                    <div className="relative mt-7 space-y-5">
                      <div className="absolute bottom-6 left-[15px] top-6 w-px bg-gradient-to-b from-blue-500 via-blue-200 to-transparent" />

                      {stages.map(
                        ([number, title, description], index) => (
                          <motion.div
                            key={number}
                            initial={{
                              opacity: 0,
                              x: 10,
                            }}
                            animate={{
                              opacity: 1,
                              x: 0,
                            }}
                            transition={{
                              delay:
                                0.15 + index * 0.08,
                            }}
                            className="relative flex gap-3"
                          >
                            <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-blue-100 bg-white text-[8px] font-black text-blue-600 shadow-sm">
                              {number}
                            </div>

                            <div className="pt-0.5">
                              <p className="text-xs font-black text-slate-900">
                                {title}
                              </p>

                              <p className="mt-1 text-[9px] leading-4 text-slate-400">
                                {description}
                              </p>
                            </div>
                          </motion.div>
                        )
                      )}
                    </div>
                  </div>

                  {/* THREAT MODEL */}
                  <div className="relative overflow-hidden rounded-[24px] border border-red-100 bg-white p-6">
                    <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-red-500/[0.06] blur-2xl" />

                    <div className="relative flex gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                        <ShieldAlert size={18} />
                      </div>

                      <div>
                        <p className="text-xs font-black text-red-950">
                          Integrity threat model
                        </p>

                        <p className="mt-2 text-[10px] leading-5 text-slate-500">
                          A simulated intermediary may forward or
                          modify traffic. SHA-256 comparison exposes
                          changes to the transferred document.
                        </p>
                      </div>
                    </div>
                  </div>
                </aside>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
