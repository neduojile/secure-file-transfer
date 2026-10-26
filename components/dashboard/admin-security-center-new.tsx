"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowDownToLine,
  ArrowLeftRight,
  CheckCircle2,
  Clock3,
  FileSearch,
  LayoutDashboard,
  ListChecks,
  Radio,
  Shield,
  ShieldAlert,
  Users,
} from "lucide-react";
import AdminUserManagement from "@/components/dashboard/admin-user-management";

type Transfer = {
  id: string;
  status?: string;
  integrity?: string;
  attackAction?: string;
  fileName?: string;
  filename?: string;
  originalName?: string;
  sender?: { name?: string; email?: string };
  receiver?: { name?: string; email?: string };
  createdAt?: string;
  updatedAt?: string;
  interceptedAt?: string | null;
  verifiedAt?: string | null;
  [key: string]: unknown;
};

type SecurityLog = {
  id?: string;
  event?: string;
  action?: string;
  message?: string;
  type?: string;
  severity?: string;
  createdAt?: string;
  timestamp?: string;
  [key: string]: unknown;
};

type SecurityData = {
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

const navigation = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "pipeline", label: "Transfer Pipeline", icon: ArrowLeftRight },
  { id: "registry", label: "Transfer Registry", icon: ListChecks },
  { id: "attacks", label: "Attack Intelligence", icon: ShieldAlert },
  { id: "forensics", label: "Forensics & Integrity", icon: FileSearch },
  { id: "events", label: "Live Event Stream", icon: Radio },
  { id: "users", label: "User Management", icon: Users },
] as const;

type PageId = (typeof navigation)[number]["id"];

function timeLabel(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
}

function displayValue(value: unknown) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "string" || typeof value === "number") return String(value);
  return "—";
}

function Status({ value }: { value: unknown }) {
  const status = displayValue(value).toUpperCase();
  const danger = /COMPROMISED|MODIFIED|INTERCEPTED|FAILED|BLOCKED|ATTACK|CRITICAL/.test(status);
  const safe = /VERIFIED|DELIVERED|SUCCESS|SECURE|CONFIRMED|COMPLETED/.test(status);

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${
        danger
          ? "border-red-200 bg-red-50 text-red-700"
          : safe
            ? "border-green-200 bg-green-50 text-green-700"
            : "border-blue-200 bg-blue-50 text-blue-700"
      }`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
        <h2 className="font-bold text-slate-950">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

function Empty({ children = "No records available yet." }: { children?: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
      {children}
    </div>
  );
}

export default function AdminSecurityCenter() {
  const [data, setData] = useState<SecurityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [activePage, setActivePage] = useState<PageId>("overview");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function refresh() {
      try {
        const response = await fetch("/api/admin/security", {
          cache: "no-store",
        });
        if (!response.ok) return;

        const json = (await response.json()) as SecurityData;
        if (!mounted) return;

        setData(json);
        setLastUpdated(new Date());
        setSelectedId((current) => current ?? json.recentTransfers?.[0]?.id ?? null);
      } catch (error) {
        console.error("Admin security monitor error:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void refresh();
    const interval = window.setInterval(() => void refresh(), 1000);

    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, []);

  const stats = data?.statistics;
  const transfers = data?.recentTransfers ?? [];
  const logs = data?.network?.events ?? data?.recentLogs ?? [];
  const attacks =
    data?.network?.latestAttacks ??
    transfers.filter(
      (item) =>
        Boolean(item.interceptedAt) ||
        (item.attackAction && item.attackAction !== "NONE") ||
        item.integrity === "COMPROMISED",
    );
  const selected =
    transfers.find((item) => item.id === selectedId) ?? transfers[0] ?? null;
  const activeTransfers =
    data?.network?.activeTransfers ??
    transfers.filter((item) =>
      ["IN_TRANSIT", "SENDING", "ENCRYPTING", "VERIFYING"].includes(
        String(item.status ?? "").toUpperCase(),
      ),
    );

  const pageTitle = navigation.find((item) => item.id === activePage)?.label ?? "Overview";

  const metrics = [
    {
      label: "Total transfers",
      value: stats?.totalTransfers ?? 0,
      note: "Recorded transfers",
      icon: ArrowLeftRight,
      color: "text-blue-700 bg-blue-50",
    },
    {
      label: "In transit",
      value: stats?.inTransit ?? 0,
      note: "Current transfer activity",
      icon: Activity,
      color: "text-blue-700 bg-blue-50",
    },
    {
      label: "Verified",
      value: stats?.verified ?? 0,
      note: "Integrity verified",
      icon: CheckCircle2,
      color: "text-green-700 bg-green-50",
    },
    {
      label: "Detected attacks",
      value: stats?.detectedAttacks ?? 0,
      note: "Security detections",
      icon: ShieldAlert,
      color: "text-red-700 bg-red-50",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-slate-950 text-white lg:flex">
          <div className="border-b border-white/10 px-6 py-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600">
                <Shield size={23} />
              </div>
              <div>
                <p className="text-lg font-black tracking-wide">SATIM</p>
                <p className="text-xs text-slate-400">Security operations</p>
              </div>
            </div>
          </div>

          <div className="px-4 pt-6">
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              Administration
            </p>
            <nav className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActivePage(item.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${
                      active
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-950/30"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                    {item.id === "attacks" && (stats?.detectedAttacks ?? 0) > 0 && (
                      <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-[10px] text-white">
                        {stats?.detectedAttacks}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="mt-auto p-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
                </span>
                Live monitoring
              </div>
              <p className="mt-2 text-xs text-slate-400">
                Refreshing security data every second.
              </p>
              <p className="mt-3 text-[10px] text-slate-500">
                {lastUpdated ? `Updated ${timeLabel(lastUpdated.toISOString())}` : "Connecting…"}
              </p>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 lg:hidden">
                  <Shield size={21} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-blue-700">
                    SATIM / Admin
                  </p>
                  <h1 className="mt-1 text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
                    {pageTitle}
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden text-xs text-slate-500 sm:inline">
                  {lastUpdated ? `Last update ${timeLabel(lastUpdated.toISOString())}` : "Connecting to monitor…"}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-2 text-xs font-bold text-green-700">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Live
                </span>
              </div>
            </div>
            <div className="flex gap-1 overflow-x-auto border-t border-slate-100 px-3 py-2 lg:hidden">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActivePage(item.id)}
                  className={`shrink-0 rounded-lg px-3 py-2 text-xs font-semibold ${
                    activePage === item.id
                      ? "bg-blue-600 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </header>

          <main className="mx-auto max-w-[1700px] space-y-6 p-4 sm:p-6 lg:p-8">
            {activePage === "overview" && (
              <>
                <section className="overflow-hidden rounded-2xl bg-slate-950 p-6 text-white sm:p-8">
                  <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                    <div className="max-w-2xl">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300">
                        Security command center
                      </p>
                      <h2 className="mt-3 text-2xl font-black leading-tight sm:text-3xl">
                        Monitor document transfers.
                        <span className="block text-blue-400">Protect document integrity.</span>
                      </h2>
                      <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
                        Track transfer activity, review integrity results, and monitor detected security events from one workspace.
                      </p>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                      <div className="rounded-lg bg-green-500/15 p-3 text-green-400">
                        <Radio size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-bold">Monitoring active</p>
                        <p className="mt-1 text-xs text-slate-400">
                          {loading ? "Loading current data…" : "Automatic refresh enabled"}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
                    <div>
                      <h3 className="font-bold text-slate-950">Live Network Traffic</h3>
                      <p className="mt-1 text-xs text-slate-500">Sender → Secure Gateway → Receiver</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <span className={`h-2 w-2 rounded-full ${loading ? "bg-amber-400" : "animate-pulse bg-green-500"}`} />
                      <span className="text-slate-600">
                        {loading ? "Updating network..." : `${data?.network?.activeTransfers?.length ?? data?.statistics?.inTransit ?? 0} active transfers`}
                      </span>
                    </div>
                  </div>

                  <div className="relative overflow-hidden bg-slate-950 px-5 py-8 sm:px-8">
                    <div
                      className="pointer-events-none absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: "radial-gradient(circle, #60a5fa 1px, transparent 1px)",
                        backgroundSize: "22px 22px",
                      }}
                    />

                    <div className="relative mb-6 mt-2 h-8">
                      <div className="absolute left-[16.6%] right-[16.6%] top-1/2 h-px -translate-y-1/2 bg-slate-700" />
                      <div className="absolute left-[16.6%] right-[16.6%] top-1/2 h-px -translate-y-1/2 overflow-hidden">
                        <div className={`satim-packet-flow h-full w-1/3 ${
                          attacks.length > 0 || (stats?.detectedAttacks ?? 0) > 0
                            ? "bg-red-400"
                            : "bg-blue-400"
                        }`} />
                      </div>
                      <div className={`satim-packet satim-packet-one absolute left-[16.6%] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full ${
                        attacks.length > 0 || (stats?.detectedAttacks ?? 0) > 0
                          ? "bg-red-400 text-red-400"
                          : "bg-cyan-300 text-cyan-300"
                      } shadow-[0_0_12px_currentColor]`} />
                      <div className={`satim-packet satim-packet-two absolute left-[16.6%] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full ${
                        attacks.length > 0 || (stats?.detectedAttacks ?? 0) > 0
                          ? "bg-red-400 text-red-400"
                          : "bg-blue-400 text-blue-400"
                      } shadow-[0_0_12px_currentColor]`} />
                      <div className={`satim-packet satim-packet-three absolute left-[16.6%] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full ${
                        attacks.length > 0 || (stats?.detectedAttacks ?? 0) > 0
                          ? "bg-red-300"
                          : "bg-green-300"
                      }`} />
                    </div>
                    <div className="relative grid grid-cols-3 items-center gap-2 sm:gap-6">
                      {[
                        { label: "SENDER", detail: "Origin node", icon: "01" },
                        { label: "SECURE GATEWAY", detail: "Inspection node", icon: "02" },
                        { label: "RECEIVER", detail: "Destination node", icon: "03" },
                      ].map((node, index) => (
                        <div key={node.label} className="relative flex min-w-0 flex-col items-center text-center">
                          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border text-sm font-black sm:h-16 sm:w-16 ${
                            index === 1
                              ? "border-blue-400 bg-blue-500/20 text-blue-300"
                              : "border-slate-600 bg-slate-800 text-slate-200"
                          }`}>
                            {node.icon}
                          </div>
                          <p className="mt-3 text-[10px] font-black tracking-wider text-white sm:text-xs">{node.label}</p>
                          <p className="mt-1 text-[10px] text-slate-400">{node.detail}</p>
                        </div>
                      ))}
                    </div>

                    <div className="relative mt-7 grid grid-cols-3 gap-2 sm:gap-6">
                      {[
                        { label: "TRANSFER RECORDS", value: data?.statistics?.totalTransfers ?? 0, color: "text-blue-300" },
                        { label: "IN TRANSIT", value: data?.statistics?.inTransit ?? 0, color: "text-amber-300" },
                        { label: "DETECTED ATTACKS", value: data?.statistics?.detectedAttacks ?? 0, color: "text-red-300" },
                      ].map((item) => (
                        <div key={item.label} className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
                          <p className={`text-xl font-black tabular-nums sm:text-2xl ${item.color}`}>{item.value}</p>
                          <p className="mt-1 text-[9px] font-semibold tracking-wide text-slate-400 sm:text-[10px]">{item.label}</p>
                        </div>
                      ))}
                    </div>

                    <div className="relative mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4 text-xs text-slate-400">
                      <span>Security API telemetry</span>
                      <span>Refresh interval: 1s</span>
                    </div>
                  </div>
                </section>

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {metrics.map((metric) => {
                    const Icon = metric.icon;
                    return (
                      <div key={metric.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium text-slate-500">{metric.label}</p>
                            <p className="mt-3 text-3xl font-black tabular-nums text-slate-950">
                              {metric.value}
                            </p>
                          </div>
                          <div className={`rounded-xl p-3 ${metric.color}`}>
                            <Icon size={21} />
                          </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
                          <Activity size={14} />
                          {metric.note}
                        </div>
                      </div>
                    );
                  })}
                </section>

                <section className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
                  <Panel title="Recent transfer activity" subtitle="Latest records from the security API">
                    {transfers.length === 0 ? (
                      <Empty>{loading ? "Loading transfers…" : "No transfers have been recorded yet."}</Empty>
                    ) : (
                      <div className="space-y-3">
                        {transfers.slice(0, 6).map((transfer) => (
                          <button
                            type="button"
                            key={transfer.id}
                            onClick={() => {
                              setSelectedId(transfer.id);
                              setActivePage("forensics");
                            }}
                            className="flex w-full flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50/50"
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              <div className="rounded-lg bg-blue-50 p-2.5 text-blue-700">
                                <ArrowDownToLine size={18} />
                              </div>
                              <div className="min-w-0">
                                <p className="truncate text-sm font-bold text-slate-900">
                                  {displayValue(transfer.fileName ?? transfer.filename ?? transfer.originalName)}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                  ID: {transfer.id.slice(0, 12)}
                                </p>
                              </div>
                            </div>
                            <Status value={transfer.integrity ?? transfer.status} />
                          </button>
                        ))}
                      </div>
                    )}
                  </Panel>

                  <Panel title="Security activity" subtitle="Most recent system events">
                    {logs.length === 0 ? (
                      <Empty>No security events have been recorded yet.</Empty>
                    ) : (
                      <div className="space-y-4">
                        {logs.slice(0, 6).map((log, index) => (
                          <div key={log.id ?? `${log.timestamp ?? log.createdAt ?? "event"}-${index}`} className="flex gap-3">
                            <div className="mt-0.5 rounded-lg bg-blue-50 p-2 text-blue-700">
                              <Activity size={16} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-slate-800">
                                {displayValue(log.message ?? log.event ?? log.action ?? log.type)}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                {timeLabel(log.timestamp ?? log.createdAt)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Panel>
                </section>
              </>
            )}

            {activePage === "pipeline" && (
              <Panel title="Transfer pipeline" subtitle="Live transfer stages derived from current transfer statuses">
                {activeTransfers.length === 0 ? (
                  <Empty>No transfers are currently in transit.</Empty>
                ) : (
                  <div className="space-y-4">
                    {activeTransfers.map((transfer) => (
                      <div key={transfer.id} className="rounded-xl border border-slate-200 p-4 sm:p-5">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="font-bold text-slate-900">
                              {displayValue(transfer.fileName ?? transfer.filename ?? transfer.originalName)}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">Transfer ID: {transfer.id}</p>
                          </div>
                          <Status value={transfer.status} />
                        </div>
                        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                          {["SENDING", "IN_TRANSIT", "VERIFYING", "DELIVERED"].map((stage, index) => {
                            const current = String(transfer.status ?? "").toUpperCase();
                            const activeIndex = ["SENDING", "IN_TRANSIT", "VERIFYING", "DELIVERED"].indexOf(current);
                            const passed = activeIndex >= index && activeIndex !== -1;
                            return (
                              <div key={stage} className={`rounded-lg border p-3 ${passed ? "border-blue-200 bg-blue-50" : "border-slate-200 bg-slate-50"}`}>
                                <div className={`mb-2 h-2 rounded-full ${passed ? "bg-blue-600" : "bg-slate-200"}`} />
                                <p className={`text-xs font-bold ${passed ? "text-blue-800" : "text-slate-400"}`}>
                                  {stage.replaceAll("_", " ")}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedId(transfer.id);
                            setActivePage("forensics");
                          }}
                          className="mt-4 text-sm font-bold text-blue-700 hover:text-blue-900"
                        >
                          View transfer details →
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </Panel>
            )}

            {activePage === "registry" && (
              <Panel title="Transfer registry" subtitle={`${transfers.length} transfer records returned by the API`}>
                {transfers.length === 0 ? (
                  <Empty>{loading ? "Loading registry…" : "No transfer records found."}</Empty>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[650px] text-left text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                          <th className="px-3 py-3 font-bold">Document / ID</th>
                          <th className="px-3 py-3 font-bold">Status</th>
                          <th className="px-3 py-3 font-bold">Integrity</th>
                          <th className="px-3 py-3 font-bold">Last activity</th>
                          <th className="px-3 py-3 font-bold">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transfers.map((transfer) => (
                          <tr key={transfer.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                            <td className="px-3 py-4">
                              <p className="font-bold text-slate-900">{displayValue(transfer.fileName ?? transfer.filename ?? transfer.originalName)}</p>
                              <p className="mt-1 text-xs text-slate-500">{transfer.id}</p>
                            </td>
                            <td className="px-3 py-4"><Status value={transfer.status} /></td>
                            <td className="px-3 py-4"><Status value={transfer.integrity} /></td>
                            <td className="px-3 py-4 text-slate-500">{timeLabel(transfer.updatedAt ?? transfer.createdAt)}</td>
                            <td className="px-3 py-4">
                              <button type="button" onClick={() => { setSelectedId(transfer.id); setActivePage("forensics"); }} className="font-bold text-blue-700 hover:underline">
                                Inspect
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Panel>
            )}

            {activePage === "attacks" && (
              <>
                <section className="grid gap-4 sm:grid-cols-3">
                  {[
                    { label: "Detected attacks", value: stats?.detectedAttacks ?? attacks.length, danger: true },
                    { label: "Intercepted", value: stats?.intercepted ?? 0, danger: true },
                    { label: "Modified", value: stats?.modified ?? 0, danger: true },
                  ].map((item) => (
                    <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <p className="text-sm text-slate-500">{item.label}</p>
                      <p className={`mt-3 text-3xl font-black ${item.danger && item.value > 0 ? "text-red-600" : "text-slate-950"}`}>{item.value}</p>
                    </div>
                  ))}
                </section>
                <Panel title="Attack intelligence" subtitle="Transfers with interception, attack actions, or compromised integrity">
                  {attacks.length === 0 ? (
                    <Empty>No attack indicators are present in the currently returned transfer records.</Empty>
                  ) : (
                    <div className="space-y-3">
                      {attacks.map((transfer) => (
                        <div key={transfer.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50/50 p-4">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="mt-1 text-red-600" size={20} />
                            <div>
                              <p className="font-bold text-slate-900">{displayValue(transfer.fileName ?? transfer.filename ?? transfer.originalName)}</p>
                              <p className="mt-1 text-xs text-slate-500">Transfer ID: {transfer.id}</p>
                              <p className="mt-2 text-sm text-red-700">
                                Action: {displayValue(transfer.attackAction)} · Integrity: {displayValue(transfer.integrity)}
                              </p>
                            </div>
                          </div>
                          <button type="button" onClick={() => { setSelectedId(transfer.id); setActivePage("forensics"); }} className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-bold text-red-700 hover:bg-red-100">
                            Inspect record
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </Panel>
              </>
            )}

            {activePage === "forensics" && (
              <Panel title="Forensics & integrity" subtitle="Inspect the transfer data returned by the existing security endpoint">
                {transfers.length === 0 ? (
                  <Empty>No transfer data is available for inspection.</Empty>
                ) : (
                  <div className="grid gap-6 xl:grid-cols-[300px_1fr]">
                    <div className="space-y-2">
                      {transfers.map((transfer) => (
                        <button
                          type="button"
                          key={transfer.id}
                          onClick={() => setSelectedId(transfer.id)}
                          className={`w-full rounded-xl border p-3 text-left ${selected?.id === transfer.id ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:bg-slate-50"}`}
                        >
                          <p className="truncate text-sm font-bold text-slate-900">{displayValue(transfer.fileName ?? transfer.filename ?? transfer.originalName)}</p>
                          <p className="mt-1 truncate text-xs text-slate-500">{transfer.id}</p>
                          <div className="mt-2"><Status value={transfer.integrity ?? transfer.status} /></div>
                        </button>
                      ))}
                    </div>
                    {selected ? (
                      <div className="min-w-0 space-y-5">
                        <div className="rounded-xl bg-slate-950 p-5 text-white">
                          <p className="text-xs font-bold uppercase tracking-widest text-blue-300">Selected transfer</p>
                          <h3 className="mt-2 break-all text-lg font-black">{displayValue(selected.fileName ?? selected.filename ?? selected.originalName)}</h3>
                          <p className="mt-2 break-all text-xs text-slate-400">{selected.id}</p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            <Status value={selected.status} />
                            <Status value={selected.integrity} />
                          </div>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {[
                            ["Status", selected.status],
                            ["Integrity", selected.integrity],
                            ["Attack action", selected.attackAction],
                            ["Intercepted at", selected.interceptedAt],
                            ["Verified at", selected.verifiedAt],
                            ["Created at", selected.createdAt],
                            ["Updated at", selected.updatedAt],
                          ].map(([label, value]) => (
                            <div key={label} className="rounded-xl border border-slate-200 bg-white p-4">
                              <p className="text-xs font-semibold text-slate-500">{label}</p>
                              <p className="mt-2 break-all text-sm font-bold text-slate-900">{(label ?? "").toLowerCase().includes("at") ? timeLabel(typeof value === "string" ? value : null) : displayValue(value)}</p>
                            </div>
                          ))}
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-white p-5">
                          <h3 className="font-bold text-slate-900">Available record fields</h3>
                          <p className="mt-1 text-xs text-slate-500">Values below are read-only. No transfer or security operations are performed here.</p>
                          <pre className="mt-4 max-h-[480px] overflow-auto rounded-lg bg-slate-950 p-4 text-xs leading-5 text-green-300">{JSON.stringify(selected, null, 2)}</pre>
                        </div>
                      </div>
                    ) : <Empty>Select a transfer to inspect its details.</Empty>}
                  </div>
                )}
              </Panel>
            )}

            {activePage === "events" && (
              <Panel title="Live event stream" subtitle={`Showing ${logs.length} events returned by the security API`}>
                {logs.length === 0 ? (
                  <Empty>No security events are available yet.</Empty>
                ) : (
                  <div className="space-y-0">
                    {logs.map((log, index) => {
                      const label = displayValue(log.message ?? log.event ?? log.action ?? log.type);
                      const danger = /attack|compromis|fail|intercept|modif/i.test(`${label} ${displayValue(log.severity)}`);
                      return (
                        <div key={log.id ?? `${log.timestamp ?? log.createdAt ?? "event"}-${index}`} className="flex gap-4 border-b border-slate-100 py-4 last:border-0">
                          <div className={`mt-0.5 rounded-xl p-2.5 ${danger ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-700"}`}>
                            {danger ? <AlertTriangle size={18} /> : <Activity size={18} />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="break-words text-sm font-semibold text-slate-900">{label}</p>
                            <p className="mt-1 text-xs text-slate-500">{timeLabel(log.timestamp ?? log.createdAt)}</p>
                          </div>
                          {log.severity && <Status value={log.severity} />}
                        </div>
                      );
                    })}
                  </div>
                )}
              </Panel>
            )}

            {activePage === "users" && (
              <Panel title="User management" subtitle="Existing user-management interface and operations">
                <AdminUserManagement />
              </Panel>
            )}

            <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 py-4 text-xs text-slate-500">
              <span>SATIM · Secure Academic Document Transfer & Integrity Monitoring</span>
              <span className="inline-flex items-center gap-2">
                <Clock3 size={14} />
                {lastUpdated ? `Live data updated ${timeLabel(lastUpdated.toISOString())}` : "Waiting for live data"}
              </span>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}
