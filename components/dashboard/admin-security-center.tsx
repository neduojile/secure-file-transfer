"use client";
import AdminUserManagement from "@/components/dashboard/admin-user-management";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  CircleDot,
  Clock3,
  FileCheck2,
  FileWarning,
  LockKeyhole,
  Network,
  Radio,
  RefreshCw,
  ScanSearch,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  UserRound,
  XCircle,
  Zap,
} from "lucide-react";

type Transfer = {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  documentType: string;
  department: string | null;
  confidentiality: string;
  status: string;
  integrity: string;
  attackAction: string;
  encrypted: boolean;
  hash: string;
  currentHash: string | null;
  interceptedAt: string | null;
  verifiedAt: string | null;
  createdAt: string;
  sender: {
    fullName: string;
    email: string;
  };
  receiver: {
    fullName: string;
    email: string;
  } | null;
  receiverEmail: string;
};

type SecurityLog = {
  id: string;
  transferId: string;
  action: string;
  attackDetected: boolean;
  securityLevel: string;
  description: string;
  createdAt: string;
  user: {
    fullName: string;
    email: string;
  };
  transfer: {
    fileName: string;
  };
};

type SecurityResponse = {
  success: boolean;
  statistics: {
    totalTransfers: number;
    inTransit: number;
    detectedAttacks: number;
    compromised: number;
    verified: number;
    delivered: number;
    intercepted: number;
    modified: number;
    forwarded: number;
    encrypted: number;
  };
  recentTransfers: Transfer[];
  recentLogs: SecurityLog[];
  network?: {
    activeTransfers: Transfer[];
    latestAttacks: Transfer[];
    events: SecurityLog[];
  };
  updatedAt: string;
};

type PipelineStage =
  | "sender"
  | "encrypting"
  | "transmitting"
  | "intercepted"
  | "integrity"
  | "receiver"
  | "compromised";

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";

  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );

  return `${(bytes / Math.pow(1024, index)).toFixed(index === 0 ? 0 : 1)} ${
    units[index]
  }`;
}

function formatTime(value: string | null) {
  if (!value) return "â€”";

  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function getPipelineStage(transfer: Transfer): PipelineStage {
  if (
    transfer.integrity === "COMPROMISED" ||
    transfer.attackAction === "MODIFIED"
  ) {
    return "compromised";
  }

  if (
    transfer.integrity === "VERIFIED" &&
    transfer.status === "DELIVERED"
  ) {
    return "receiver";
  }

  if (transfer.status === "VERIFYING" || transfer.verifiedAt) {
    return "integrity";
  }

  if (transfer.interceptedAt) {
    return "intercepted";
  }

  if (
    transfer.status === "IN_TRANSIT" ||
    transfer.status === "SENDING"
  ) {
    return "transmitting";
  }

  if (transfer.status === "ENCRYPTING") {
    return "encrypting";
  }

  return "sender";
}

function stageIndex(stage: PipelineStage) {
  const stages: PipelineStage[] = [
    "sender",
    "encrypting",
    "transmitting",
    "intercepted",
    "integrity",
    "receiver",
  ];

  if (stage === "compromised") return 4;

  return stages.indexOf(stage);
}

function Stat({
  label,
  value,
  icon,
  tone = "blue",
}: {
  label: string;
  value: number;
  icon: ReactNode;
  tone?: "blue" | "green" | "red" | "amber";
}) {
  const tones = {
    blue: "border-blue-500/15 bg-blue-500/[0.06] text-blue-400",
    green: "border-emerald-500/15 bg-emerald-500/[0.06] text-emerald-400",
    red: "border-red-500/20 bg-red-500/[0.07] text-red-400",
    amber: "border-amber-500/15 bg-amber-500/[0.06] text-amber-400",
  };

  return (
    <div
      className={`group relative isolate overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_18px_rgba(15,23,42,0.035)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:bg-[#151F2D] hover:shadow-xl hover:shadow-black/20 ${tones[tone]}`}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 -z-10 h-24 w-24 rounded-full bg-current opacity-[0.05] blur-2xl" />

      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-current/10 bg-current/[0.07]">
          {icon}
        </div>

        <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          Live
        </span>
      </div>

      <div className="mt-6 text-4xl font-extrabold tracking-tight text-slate-100">
        {value}
      </div>

      <div className="mt-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
        {label}
      </div>
    </div>
  );
}

function PipelineNode({
  label,
  sub,
  icon,
  active,
  complete,
  danger,
}: {
  label: string;
  sub: string;
  icon: ReactNode;
  active?: boolean;
  complete?: boolean;
  danger?: boolean;
}) {
  return (
    <div className="relative z-10 flex min-w-[105px] flex-col items-center">
      <div
        className={[
          "relative flex h-14 w-14 items-center justify-center rounded-2xl border transition-all duration-500",
          danger
            ? "border-red-500/60 bg-red-500/10 text-red-400 shadow-[0_0_30px_rgba(239,68,68,0.18)]"
            : active
              ? "border-blue-400/60 bg-blue-500/10 text-blue-300 shadow-[0_0_30px_rgba(59,130,246,0.18)]"
              : complete
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                : "border-slate-800 bg-slate-950 text-slate-400",
        ].join(" ")}
      >
        {icon}

        {danger && (
          <span className="absolute -right-1 -top-1 h-3 w-3 animate-ping rounded-full bg-red-500" />
        )}

        {active && !danger && (
          <span className="absolute -right-1 -top-1 h-3 w-3 animate-pulse rounded-full bg-blue-400 shadow-lg shadow-blue-400/60" />
        )}
      </div>

      <p
        className={`mt-3 text-[10px] font-black uppercase tracking-[0.16em] ${
          danger
            ? "text-red-400"
            : active
              ? "text-blue-300"
              : complete
                ? "text-emerald-400"
                : "text-slate-400"
        }`}
      >
        {label}
      </p>

      <p className="mt-1 text-center text-[9px] text-slate-400">{sub}</p>
    </div>
  );
}

function PipelineLine({
  active,
  danger,
}: {
  active?: boolean;
  danger?: boolean;
}) {
  return (
    <div className="relative hidden h-px flex-1 overflow-hidden bg-slate-800 lg:block">
      <div
        className={`absolute inset-y-0 left-0 w-full ${
          danger ? "bg-red-500" : active ? "bg-blue-500" : "bg-slate-800"
        }`}
      />

      {active && (
        <div
          className={`absolute inset-y-0 left-0 w-16 animate-[telemetry-flow_1.4s_linear_infinite] blur-sm ${
            danger ? "bg-red-300" : "bg-blue-300"
          }`}
        />
      )}
    </div>
  );
}

function StatusPill({
  children,
  tone = "blue",
}: {
  children: ReactNode;
  tone?: "blue" | "green" | "red" | "amber";
}) {
  const styles = {
    blue: "border-blue-500/20 bg-blue-500/10 text-blue-300",
    green: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
    red: "border-red-500/20 bg-red-500/10 text-red-300",
    amber: "border-amber-500/20 bg-amber-500/10 text-amber-300",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em] ${styles[tone]}`}
    >
      {children}
    </span>
  );
}

export default function AdminSecurityCenter() {
  const [data, setData] = useState<SecurityResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activePage, setActivePage] = useState("overview");

  async function loadSecurityData() {
    try {
      const response = await fetch("/api/admin/security", {
        cache: "no-store",
      });

      if (!response.ok) return;

      const json = (await response.json()) as SecurityResponse;

      setData(json);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Admin security monitor error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSecurityData();

    const interval = setInterval(loadSecurityData, 1000);

    return () => clearInterval(interval);
  }, []);

  const transfers = data?.recentTransfers || [];
  const logs = data?.recentLogs || [];

  const selectedTransfer =
    transfers.find((transfer) => transfer.id === selectedId) || transfers[0];

  const selectedLogs = useMemo(() => {
    if (!selectedTransfer) return [];

    return logs
      .filter((log) => log.transferId === selectedTransfer.id)
      .slice(0, 10);
  }, [logs, selectedTransfer]);

  const activeAttacks = transfers.filter(
    (transfer) =>
      transfer.interceptedAt || transfer.attackAction !== "NONE"
  );

  const stage = selectedTransfer
    ? getPipelineStage(selectedTransfer)
    : "sender";

  const currentStageIndex = stageIndex(stage);

  const attackDetected =
    Boolean(selectedTransfer?.interceptedAt) ||
    selectedTransfer?.attackAction !== "NONE";

  const compromised = selectedTransfer?.integrity === "COMPROMISED";

  const stats = data?.statistics;

  return (
    <main className="min-h-screen overflow-hidden bg-[#0B1018] text-slate-100">
      {/* Ambient security field */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[8%] top-[-15%] h-[520px] w-[520px] rounded-full bg-blue-500/[0.045] blur-[140px]" />
        <div className="absolute right-[-8%] top-[15%] h-[460px] w-[460px] rounded-full bg-indigo-500/[0.035] blur-[130px]" />
        <div className="absolute bottom-[-20%] left-[35%] h-[500px] w-[500px] rounded-full bg-cyan-500/[0.025] blur-[150px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-[2000px]">
        <aside className="sticky top-0 hidden h-screen w-[250px] shrink-0 flex-col border-r border-slate-800/90 bg-[#0A0F17]/95 px-4 py-6 backdrop-blur-xl lg:flex">
          <a href="/admin" className="mb-8 flex items-center gap-3 rounded-xl px-2 py-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-sm font-black text-blue-400">S</span>
            <span>
              <span className="block text-sm font-extrabold tracking-[0.18em] text-slate-100">SATIM</span>
              <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">Admin workspace</span>
            </span>
          </a>

          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Security operations</p>
          <nav className="flex flex-col gap-1">
            {[
              { id: "overview", label: "Command Center", index: 0 },
              { id: "pipeline", label: "Transfer Pipeline", index: 1 },
              { id: "transfers", label: "Transfer Registry", index: 2 },
              { id: "attacks", label: "Attack Intelligence", index: 3 },
              { id: "forensics", label: "Forensics & Integrity", index: 4 },
              { id: "events", label: "Live Event Stream", index: 5 },
            ].map((item, index) => (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  const headings = document.querySelectorAll("h2");
                  headings[item.index]?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[12px] font-semibold transition-colors ${
                  index === 0
                    ? "border border-blue-500/20 bg-blue-500/10 text-blue-300"
                    : "text-slate-400 hover:bg-slate-800/70 hover:text-slate-100"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${activePage === item.id ? "bg-blue-400" : "bg-slate-600 group-hover:bg-blue-400"}`} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="mt-auto rounded-xl border border-emerald-500/15 bg-emerald-500/[0.04] p-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              <span className="text-[11px] font-bold text-emerald-300">Monitoring workspace</span>
            </div>
            <p className="mt-2 text-[10px] leading-5 text-slate-500">Live security telemetry and document integrity monitoring.</p>
          </div>
        </aside>

        <div className="min-w-0 flex-1 space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* COMMAND HEADER */}
        <header className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#111925] p-6 shadow-2xl shadow-black/20 sm:p-8" style={{ display: activePage === "overview" ? undefined : 'none' }}>
          <div className="absolute right-[-100px] top-[-100px] h-72 w-72 rounded-full bg-blue-500/[0.08] blur-[80px]" />

          <div className="relative flex flex-col justify-between gap-7 xl:flex-row xl:items-end">
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  Command Center Online
                </span>

                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  SATIM / ADMIN / SOC-01
                </span>
              </div>

              <h1 className="max-w-4xl text-3xl font-extrabold tracking-tight text-slate-100 sm:text-4xl lg:text-5xl">
                Academic Security
                <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-slate-100 bg-clip-text text-transparent">
                  Command Center
                </span>
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-400">
                Real-time supervision of encrypted academic document
                transmission, MITM interception activity and SHA-256 integrity
                verification.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-[#0C131D] px-4 py-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <Radio className="h-4 w-4" />
                <span className="absolute inset-0 animate-ping rounded-xl border border-emerald-400/20" />
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-emerald-400">
                  Network Monitor
                </p>
                <p className="mt-1 text-[10px] text-slate-400">
                  {lastUpdated
                    ? `Updated ${lastUpdated.toLocaleTimeString()}`
                    : "Establishing telemetry..."}
                </p>
              </div>

              <RefreshCw
                className={`ml-3 h-4 w-4 text-slate-400 ${
                  loading ? "animate-spin" : ""
                }`}
              />
            </div>
          </div>

          <div className="relative mt-7 grid grid-cols-2 gap-4 border-t border-slate-800 pt-5 sm:grid-cols-3 lg:grid-cols-6">
            {[
              ["ENCRYPTION", "AES"],
              ["INTEGRITY", "SHA-256"],
              ["INTERCEPTION", "MONITORED"],
              ["AUTHORITY", "ADMIN"],
              ["POLL RATE", "1 SEC"],
              ["STATUS", "OPERATIONAL"],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">
                  {label}
                </p>
                <p className="mt-1 text-[10px] font-bold text-slate-400">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </header>

        {/* METRICS */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" style={{ display: activePage === "overview" ? undefined : 'none' }}>
          <Stat
            label="Total Transfers"
            value={stats?.totalTransfers || 0}
            icon={<Network className="h-5 w-5" />}
          />
          <Stat
            label="In Transit"
            value={stats?.inTransit || 0}
            icon={<Radio className="h-5 w-5" />}
            tone="blue"
          />
          <Stat
            label="Interceptions"
            value={stats?.intercepted || 0}
            icon={<ScanSearch className="h-5 w-5" />}
            tone="red"
          />
          <Stat
            label="Modified"
            value={stats?.modified || 0}
            icon={<FileWarning className="h-5 w-5" />}
            tone="red"
          />
          <Stat
            label="Detected Attacks"
            value={stats?.detectedAttacks || 0}
            icon={<ShieldAlert className="h-5 w-5" />}
            tone="red"
          />
          <Stat
            label="Compromised"
            value={stats?.compromised || 0}
            icon={<XCircle className="h-5 w-5" />}
            tone="red"
          />
          <Stat
            label="Verified"
            value={stats?.verified || 0}
            icon={<ShieldCheck className="h-5 w-5" />}
            tone="green"
          />
          <Stat
            label="Delivered"
            value={stats?.delivered || 0}
            icon={<CheckCircle2 className="h-5 w-5" />}
            tone="green"
          />
        </section>

        {/* LIVE TRANSFER */}
        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#111925] shadow-xl shadow-black/10 transition-colors duration-300 hover:border-slate-700">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-800/90 p-5 sm:p-6 lg:flex-row lg:items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <Network className="h-5 w-5" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-black tracking-tight text-white">
                    Live Transfer Pipeline
                  </h2>
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />
                </div>

                <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-slate-400">
                  Real-time transmission topology
                </p>
              </div>
            </div>

            {selectedTransfer ? (
              <div className="flex items-center gap-2">
                <StatusPill tone={compromised ? "red" : "green"}>
                  {compromised ? "Integrity Compromised" : "Transfer Observed"}
                </StatusPill>
                <StatusPill tone={attackDetected ? "red" : "blue"}>
                  {attackDetected ? "Attack Signal" : selectedTransfer.status}
                </StatusPill>
              </div>
            ) : (
              <StatusPill>No Active Selection</StatusPill>
            )}
          </div>

          <div className="p-5 sm:p-7 lg:p-10">
            {selectedTransfer ? (
              <>
                <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-800 bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                      Selected Transmission
                    </p>
                    <p className="mt-1 truncate text-sm font-bold text-white">
                      {selectedTransfer.fileName}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    <span>{selectedTransfer.documentType}</span>
                    <span className="text-slate-800">â€¢</span>
                    <span>{formatBytes(selectedTransfer.fileSize)}</span>
                    <span className="text-slate-800">â€¢</span>
                    <span>{selectedTransfer.confidentiality}</span>
                  </div>
                </div>

                <div className="relative flex flex-col items-center justify-center gap-5 lg:flex-row lg:gap-2">
                  <PipelineNode
                    label="Sender"
                    sub={selectedTransfer.sender.fullName}
                    icon={<UserRound className="h-5 w-5" />}
                    complete={currentStageIndex >= 0}
                    active={stage === "sender"}
                  />

                  <PipelineLine active={currentStageIndex >= 1} />

                  <PipelineNode
                    label="Encrypt"
                    sub="AES protected"
                    icon={<LockKeyhole className="h-5 w-5" />}
                    complete={currentStageIndex >= 1}
                    active={stage === "encrypting"}
                  />

                  <PipelineLine active={currentStageIndex >= 2} />

                  <PipelineNode
                    label="Transmit"
                    sub="Secure channel"
                    icon={<Zap className="h-5 w-5" />}
                    complete={currentStageIndex >= 2}
                    active={stage === "transmitting"}
                  />

                  <PipelineLine
                    active={currentStageIndex >= 3}
                    danger={attackDetected}
                  />

                  <PipelineNode
                    label="MITM"
                    sub={
                      attackDetected
                        ? selectedTransfer.attackAction
                        : "Monitoring"
                    }
                    icon={<ShieldAlert className="h-5 w-5" />}
                    danger={Boolean(attackDetected)}
                    active={stage === "intercepted"}
                  />

                  <PipelineLine
                    active={currentStageIndex >= 4}
                    danger={compromised}
                  />

                  <PipelineNode
                    label="Integrity"
                    sub={
                      compromised
                        ? "Hash mismatch"
                        : selectedTransfer.integrity === "VERIFIED"
                          ? "Hash verified"
                          : "Awaiting check"
                    }
                    icon={
                      compromised ? (
                        <AlertTriangle className="h-5 w-5" />
                      ) : (
                        <FileCheck2 className="h-5 w-5" />
                      )
                    }
                    danger={compromised}
                    active={stage === "integrity"}
                    complete={
                      selectedTransfer.integrity === "VERIFIED" &&
                      !compromised
                    }
                  />

                  <PipelineLine active={currentStageIndex >= 5} />

                  <PipelineNode
                    label="Receiver"
                    sub={
                      selectedTransfer.receiver?.fullName ||
                      selectedTransfer.receiverEmail
                    }
                    icon={<CheckCircle2 className="h-5 w-5" />}
                    complete={stage === "receiver"}
                    active={stage === "receiver"}
                  />
                </div>
              </>
            ) : (
              <div className="flex min-h-[220px] flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-800 bg-white/[0.02] text-slate-400">
                  <Network className="h-7 w-7" />
                </div>
                <p className="mt-4 text-sm font-bold text-slate-400">
                  No transfer telemetry available
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  New transmissions will appear here automatically.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* INTELLIGENCE GRID */}
        <div className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]" style={{ display: (activePage === "transfers" || activePage === "attacks") ? undefined : 'none' }}>
          {/* TRANSFER REGISTRY */}
          <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#111925] shadow-xl shadow-black/10 transition-colors duration-300 hover:border-slate-700" style={{ display: activePage === "transfers" ? undefined : 'none' }}>
            <div className="flex items-center justify-between border-b border-slate-800/90 p-5 sm:p-6">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-400">
                  Transmission Registry
                </p>
                <h2 className="mt-1 text-lg font-black text-white">
                  Recent Secure Activity
                </h2>
              </div>

              <span className="rounded-full border border-white/[0.07] px-3 py-1 text-[9px] font-bold text-slate-400">
                {transfers.length} RECORDS
              </span>
            </div>

            <div className="divide-y divide-white/[0.04]">
              {transfers.slice(0, 8).map((transfer) => {
                const selected = transfer.id === selectedTransfer?.id;
                const compromisedRow =
                  transfer.integrity === "COMPROMISED" ||
                  transfer.attackAction === "MODIFIED";
                const attacked =
                  Boolean(transfer.interceptedAt) ||
                  transfer.attackAction !== "NONE";

                return (
                  <button
                    key={transfer.id}
                    type="button"
                    onClick={() => setSelectedId(transfer.id)}
                    className={`group flex w-full items-center gap-4 px-5 py-4 text-left transition-all sm:px-6 ${
                      selected
                        ? "bg-blue-500/[0.06]"
                        : "hover:bg-slate-800/60"
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                        compromisedRow
                          ? "border-red-500/20 bg-red-500/10 text-red-400"
                          : attacked
                            ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
                            : "border-blue-500/15 bg-blue-500/10 text-blue-400"
                      }`}
                    >
                      {compromisedRow ? (
                        <AlertTriangle className="h-4 w-4" />
                      ) : attacked ? (
                        <ShieldAlert className="h-4 w-4" />
                      ) : (
                        <FileCheck2 className="h-4 w-4" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                        <p className="truncate text-xs font-bold text-slate-200">
                          {transfer.fileName}
                        </p>

                        <span className="w-fit rounded border border-slate-800 px-1.5 py-0.5 text-[8px] font-bold uppercase text-slate-400">
                          {transfer.documentType}
                        </span>
                      </div>

                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[9px] text-slate-400">
                        <span>{transfer.sender.fullName}</span>
                        <span>{formatBytes(transfer.fileSize)}</span>
                        <span>{formatTime(transfer.createdAt)}</span>
                      </div>
                    </div>

                    <div className="hidden items-end gap-2 sm:flex sm:flex-col">
                      <StatusPill
                        tone={
                          compromisedRow
                            ? "red"
                            : attacked
                              ? "amber"
                              : transfer.integrity === "VERIFIED"
                                ? "green"
                                : "blue"
                        }
                      >
                        {compromisedRow
                          ? "Compromised"
                          : attacked
                            ? "Intercepted"
                            : transfer.integrity}
                      </StatusPill>
                    </div>

                    <ArrowRight
                      className={`h-4 w-4 shrink-0 transition ${
                        selected
                          ? "translate-x-1 text-blue-400"
                          : "text-slate-800 group-hover:text-slate-400"
                      }`}
                    />
                  </button>
                );
              })}

              {transfers.length === 0 && (
                <div className="p-10 text-center text-xs text-slate-400">
                  No transfer records available.
                </div>
              )}
            </div>
          </section>

          {/* ATTACK INTELLIGENCE */}
          <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#111925] shadow-xl shadow-black/10 transition-colors duration-300 hover:border-slate-700" style={{ display: activePage === "attacks" ? undefined : 'none' }}>
            <div className="border-b border-slate-800/90 p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-red-400">
                    Threat Intelligence
                  </p>
                  <h2 className="mt-1 text-lg font-black text-white">
                    MITM Activity
                  </h2>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                  <ShieldAlert className="h-4 w-4" />
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-xl border border-red-500/10 bg-red-500/[0.04] p-3">
                  <p className="text-xl font-black text-red-400">
                    {activeAttacks.length}
                  </p>
                  <p className="mt-1 text-[8px] font-bold uppercase tracking-wider text-slate-400">
                    Signals
                  </p>
                </div>

                <div className="rounded-xl border border-amber-500/10 bg-amber-500/[0.04] p-3">
                  <p className="text-xl font-black text-amber-400">
                    {stats?.modified || 0}
                  </p>
                  <p className="mt-1 text-[8px] font-bold uppercase tracking-wider text-slate-400">
                    Modified
                  </p>
                </div>

                <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/[0.04] p-3">
                  <p className="text-xl font-black text-emerald-400">
                    {stats?.forwarded || 0}
                  </p>
                  <p className="mt-1 text-[8px] font-bold uppercase tracking-wider text-slate-400">
                    Forwarded
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-2">
                {activeAttacks.slice(0, 5).map((transfer) => (
                  <button
                    key={transfer.id}
                    type="button"
                    onClick={() => setSelectedId(transfer.id)}
                    className="group flex w-full items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.015] p-3 text-left transition hover:border-red-500/20 hover:bg-red-500/[0.03]"
                  >
                    <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span className="absolute inset-0 animate-ping rounded-lg border border-red-500/20" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[10px] font-bold text-slate-300">
                        {transfer.fileName}
                      </p>
                      <p className="mt-0.5 text-[8px] uppercase tracking-wider text-slate-400">
                        {transfer.attackAction} Â·{" "}
                        {formatTime(transfer.interceptedAt)}
                      </p>
                    </div>

                    <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-red-400" />
                  </button>
                ))}

                {activeAttacks.length === 0 && (
                  <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/[0.03] p-6 text-center">
                    <ShieldCheck className="mx-auto h-6 w-6 text-emerald-500/60" />
                    <p className="mt-3 text-xs font-bold text-emerald-400">
                      No active threat signals
                    </p>
                    <p className="mt-1 text-[9px] text-slate-400">
                      The monitored transfer perimeter is clear.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* SELECTED TRANSFER FORENSICS */}
        {selectedTransfer && (
          <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#111925] shadow-xl shadow-black/10 transition-colors duration-300 hover:border-slate-700" style={{ display: activePage === "forensics" ? undefined : 'none' }}>
            <div className="flex flex-col justify-between gap-4 border-b border-slate-800/90 p-5 sm:p-6 lg:flex-row lg:items-center">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-cyan-400">
                  Transfer Forensics
                </p>
                <h2 className="mt-1 truncate text-lg font-black text-white">
                  {selectedTransfer.fileName}
                </h2>
              </div>

              <div className="flex flex-wrap gap-2">
                <StatusPill>
                  {selectedTransfer.status}
                </StatusPill>
                <StatusPill tone={selectedTransfer.encrypted ? "green" : "amber"}>
                  {selectedTransfer.encrypted ? "AES Encrypted" : "Unencrypted"}
                </StatusPill>
                <StatusPill
                  tone={compromised ? "red" : selectedTransfer.integrity === "VERIFIED" ? "green" : "amber"}
                >
                  {selectedTransfer.integrity}
                </StatusPill>
              </div>
            </div>

            <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.2fr_.8fr]">
              <div className="rounded-2xl border border-slate-800 bg-black/20 p-5">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                    <FileCheck2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">
                      Integrity Intelligence
                    </p>
                    <p className="text-xs font-bold text-white">
                      SHA-256 comparison
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="rounded-xl border border-white/[0.05] bg-white/[0.015] p-4">
                    <p className="mb-2 text-[8px] font-black uppercase tracking-[0.18em] text-slate-400">
                      Original Hash
                    </p>
                    <p className="break-all font-mono text-[9px] leading-5 text-slate-400">
                      {selectedTransfer.hash || "Not available"}
                    </p>
                  </div>

                  <div
                    className={`rounded-xl border p-4 ${
                      compromised
                        ? "border-red-500/20 bg-red-500/[0.035]"
                        : "border-emerald-500/10 bg-emerald-500/[0.025]"
                    }`}
                  >
                    <p className="mb-2 text-[8px] font-black uppercase tracking-[0.18em] text-slate-400">
                      Current Hash
                    </p>
                    <p
                      className={`break-all font-mono text-[9px] leading-5 ${
                        compromised ? "text-red-300" : "text-emerald-300"
                      }`}
                    >
                      {selectedTransfer.currentHash ||
                        selectedTransfer.hash ||
                        "Awaiting verification"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-2xl border border-slate-800 bg-black/20 p-5">
                  <p className="text-[8px] font-black uppercase tracking-[0.18em] text-slate-400">
                    Transmission Identity
                  </p>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[10px] text-slate-400">Sender</span>
                      <span className="truncate text-right text-[10px] font-bold text-slate-300">
                        {selectedTransfer.sender.fullName}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[10px] text-slate-400">Receiver</span>
                      <span className="truncate text-right text-[10px] font-bold text-slate-300">
                        {selectedTransfer.receiver?.fullName ||
                          selectedTransfer.receiverEmail}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[10px] text-slate-400">Department</span>
                      <span className="text-right text-[10px] font-bold text-slate-300">
                        {selectedTransfer.department || "Unassigned"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[10px] text-slate-400">Created</span>
                      <span className="text-right text-[10px] font-bold text-slate-300">
                        {formatTime(selectedTransfer.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className={`rounded-2xl border p-5 ${
                    compromised
                      ? "border-red-500/20 bg-red-500/[0.04]"
                      : attackDetected
                        ? "border-amber-500/20 bg-amber-500/[0.04]"
                        : "border-emerald-500/10 bg-emerald-500/[0.03]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {compromised ? (
                      <XCircle className="h-5 w-5 text-red-400" />
                    ) : attackDetected ? (
                      <AlertTriangle className="h-5 w-5 text-amber-400" />
                    ) : (
                      <ShieldCheck className="h-5 w-5 text-emerald-400" />
                    )}

                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">
                        Security Assessment
                      </p>
                      <p
                        className={`mt-1 text-sm font-black ${
                          compromised
                            ? "text-red-400"
                            : attackDetected
                              ? "text-amber-400"
                              : "text-emerald-400"
                        }`}
                      >
                        {compromised
                          ? "DOCUMENT COMPROMISED"
                          : attackDetected
                            ? "INTERCEPTION DETECTED"
                            : "SECURE TRANSMISSION"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* EVENT STREAM */}
        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#111925] shadow-xl shadow-black/10 transition-colors duration-300 hover:border-slate-700" style={{ display: activePage === "events" ? undefined : 'none' }}>
          <div className="flex items-center justify-between border-b border-slate-800/90 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                <Terminal className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-violet-400">
                  Security Telemetry
                </p>
                <h2 className="mt-1 text-lg font-black text-white">
                  Live Event Stream
                </h2>
              </div>
            </div>

            <div className="hidden items-center gap-2 text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400 sm:flex">
              <Activity className="h-3.5 w-3.5" />
              Streaming
            </div>
          </div>

          <div className="grid gap-0 lg:grid-cols-2">
            <div className="divide-y divide-white/[0.04]">
              {logs.slice(0, 8).map((log) => (
                <div
                  key={log.id}
                  className="flex gap-3 px-5 py-4 transition hover:bg-white/[0.02] sm:px-6"
                >
                  <div
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                      log.attackDetected
                        ? "bg-red-500/10 text-red-400"
                        : log.securityLevel === "HIGH"
                          ? "bg-amber-500/10 text-amber-400"
                          : "bg-blue-500/10 text-blue-400"
                    }`}
                  >
                    {log.attackDetected ? (
                      <ShieldAlert className="h-3.5 w-3.5" />
                    ) : (
                      <CircleDot className="h-3.5 w-3.5" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[10px] font-bold text-slate-300">
                        {log.action}
                      </p>

                      {log.attackDetected && (
                        <StatusPill tone="red">Attack</StatusPill>
                      )}
                    </div>

                    <p className="mt-1 line-clamp-2 text-[9px] leading-4 text-slate-400">
                      {log.description}
                    </p>

                    <div className="mt-1 flex gap-2 text-[8px] text-slate-800">
                      <span>{log.user.fullName}</span>
                      <span>â€¢</span>
                      <span>{formatTime(log.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}

              {logs.length === 0 && (
                <div className="p-8 text-center text-xs text-slate-400">
                  No security events recorded.
                </div>
              )}
            </div>

            <div className="border-t border-white/[0.06] bg-black/10 p-5 sm:p-6 lg:border-l lg:border-t-0">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Selected Transfer
                  </p>
                  <p className="mt-1 text-xs font-bold text-slate-300">
                    Event chronology
                  </p>
                </div>

                <Clock3 className="h-4 w-4 text-slate-400" />
              </div>

              <div className="space-y-3">
                {selectedLogs.map((log, index) => (
                  <div key={log.id} className="relative flex gap-3">
                    {index !== selectedLogs.length - 1 && (
                      <div className="absolute left-[5px] top-4 h-full w-px bg-slate-800" />
                    )}

                    <span
                      className={`relative z-10 mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                        log.attackDetected
                          ? "bg-red-500 shadow-lg shadow-red-500/30"
                          : "bg-blue-500"
                      }`}
                    />

                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-slate-400">
                        {log.action}
                      </p>
                      <p className="mt-0.5 text-[8px] leading-4 text-slate-400">
                        {log.description}
                      </p>
                    </div>
                  </div>
                ))}

                {selectedLogs.length === 0 && (
                  <div className="rounded-xl border border-white/[0.05] bg-white/[0.015] p-6 text-center text-[9px] text-slate-400">
                    Select a transfer to inspect its event chronology.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {activePage === "users" && <AdminUserManagement />}
        {/* SYSTEM FOOTER */}
        <footer className="grid gap-3 pb-4 sm:grid-cols-3">
          {[
            {
              icon: LockKeyhole,
              label: "Cryptographic Layer",
              value: "AES protected",
            },
            {
              icon: ShieldCheck,
              label: "Integrity Layer",
              value: "SHA-256 monitoring",
            },
            {
              icon: Network,
              label: "Network Layer",
              value: "MITM simulation active",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 rounded-2xl border border-white/[0.05] bg-white/[0.015] px-4 py-3"
            >
              <item.icon className="h-4 w-4 text-blue-400" />
              <div>
                <p className="text-[8px] font-black uppercase tracking-[0.15em] text-slate-400">
                  {item.label}
                </p>
                <p className="mt-0.5 text-[10px] font-bold text-slate-400">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </footer>
        </div>
      </div>
    </main>
  );
}
