import {
  Activity,
  CheckCircle2,
  Clock3,
  Database,
  Fingerprint,
  LockKeyhole,
  Mail,
  Network,
  Server,
  ShieldCheck,
  Sparkles,
  UserRound,
  Zap,
} from "lucide-react";

export default function SettingsPage() {
  const securityControls = [
    {
      label: "AES-256 File Encryption",
      description: "Academic payload protection",
      icon: LockKeyhole,
    },
    {
      label: "SHA-256 Integrity Verification",
      description: "Content tamper detection",
      icon: Fingerprint,
    },
    {
      label: "Secure Authentication",
      description: "Protected account access",
      icon: ShieldCheck,
    },
    {
      label: "Protected File Transfer",
      description: "Controlled transmission pipeline",
      icon: Network,
    },
  ];

  const infrastructure = [
    {
      label: "Encryption engine",
      value: "AES-256",
      description: "Payload protection",
      icon: Database,
      tone: "blue",
    },
    {
      label: "Transfer layer",
      value: "SECURE",
      description: "Protected endpoints",
      icon: Server,
      tone: "amber",
    },
    {
      label: "Integrity engine",
      value: "SHA-256",
      description: "Hash verification",
      icon: Fingerprint,
      tone: "emerald",
    },
  ];

  return (
    <main className="dashboard-shell dashboard-grid">
      <div className="pointer-events-none absolute left-[-180px] top-16 h-[500px] w-[500px] rounded-full bg-blue-500/[0.06] blur-[140px]" />
      <div className="pointer-events-none absolute right-[-180px] top-[30%] h-[500px] w-[500px] rounded-full bg-emerald-500/[0.025] blur-[150px]" />

      <div className="page-container relative space-y-6">
        <section className="ui-hero overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute right-[8%] top-[-20%] h-[470px] w-[470px] rounded-full border border-blue-400/[0.07]" />
            <div className="absolute right-[16%] top-[-4%] h-[320px] w-[320px] rounded-full border border-blue-400/[0.06] border-dashed" />

            <div className="absolute left-[48%] top-[28%] h-px w-[40%] bg-gradient-to-r from-blue-400/15 via-blue-400/5 to-transparent" />

            <div className="absolute right-[18%] top-[27%] h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_20px_rgba(96,165,250,.8)]" />
            <div className="absolute right-[10%] top-[64%] h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,.8)]" />
          </div>

          <div className="relative z-10 grid gap-8 p-7 sm:p-9 lg:grid-cols-[1fr_auto] lg:items-center lg:p-11">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/15 bg-blue-500/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-blue-300">
                  <Sparkles size={11} />
                  Workspace configuration
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-500/[0.06] px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-emerald-300">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  System operational
                </span>
              </div>

              <h1 className="mt-5 text-3xl font-black tracking-[-0.05em] text-white sm:text-4xl lg:text-5xl">
                System Control Center
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
                Review your SATIM identity, protection controls and secure
                academic document infrastructure from one workspace.
              </p>
            </div>

            <div className="relative flex h-36 w-36 items-center justify-center sm:h-44 sm:w-44">
              <div className="absolute inset-0 rounded-full border border-blue-400/10" />
              <div className="absolute inset-4 rounded-full border border-blue-400/10 border-dashed" />
              <div className="absolute inset-10 rounded-full bg-blue-500/[0.04] shadow-[0_0_60px_rgba(59,130,246,.08)]" />

              <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-500/[0.06]">
                <ShieldCheck
                  size={28}
                  className="text-emerald-400"
                />
              </div>

              <span className="absolute right-1 top-7 h-2 w-2 animate-pulse rounded-full bg-blue-400 shadow-[0_0_14px_rgba(96,165,250,.9)]" />
              <span className="absolute bottom-6 left-3 h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </div>
          </div>

          <div className="relative z-10 border-t border-white/[0.07] px-7 py-4 sm:px-9 lg:px-11">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Activity size={13} className="text-blue-400" />

                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500">
                  SATIM control plane
                </span>
              </div>

              <span className="font-mono text-[8px] text-slate-600">
                CONFIG::STABLE / SECURITY::ONLINE / BUILD::1.0
              </span>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_.9fr]">
          <section className="ui-panel overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-5 sm:px-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="eyebrow">Identity layer</p>

                  <h2 className="mt-1 text-xl font-black text-slate-950">
                    Account profile
                  </h2>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <UserRound size={18} />
                </div>
              </div>
            </div>

            <div className="space-y-5 p-6 sm:p-7">
              <div className="relative overflow-hidden rounded-2xl bg-slate-950 p-5">
                <div className="absolute right-[-30px] top-[-40px] h-32 w-32 rounded-full bg-blue-500/[0.08] blur-2xl" />

                <div className="relative flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/10 bg-blue-500/10 text-blue-300">
                    <UserRound size={23} />
                  </div>

                  <div>
                    <p className="text-[8px] font-black uppercase tracking-[0.18em] text-blue-300">
                      Authenticated identity
                    </p>

                    <p className="mt-1 text-lg font-black text-white">
                      Current User
                    </p>

                    <div className="mt-1 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                      <span className="text-[9px] font-bold text-slate-500">
                        Secure session active
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                  <p className="text-[8px] font-black uppercase tracking-[0.16em] text-slate-400">
                    Name
                  </p>

                  <div className="mt-3 flex items-center gap-3">
                    <UserRound size={15} className="text-blue-500" />

                    <span className="text-xs font-black text-slate-900">
                      Current User
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                  <p className="text-[8px] font-black uppercase tracking-[0.16em] text-slate-400">
                    Email
                  </p>

                  <div className="mt-3 flex min-w-0 items-center gap-3">
                    <Mail size={15} className="shrink-0 text-blue-500" />

                    <span className="truncate text-xs font-black text-slate-900">
                      user@example.com
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-emerald-600">
                    <CheckCircle2 size={16} />
                  </div>

                  <div>
                    <p className="text-[8px] font-black uppercase tracking-[0.16em] text-emerald-600">
                      Account status
                    </p>

                    <p className="mt-1 text-xs font-black text-emerald-900">
                      Active and protected
                    </p>
                  </div>
                </div>

                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,.6)]" />
              </div>
            </div>
          </section>

          <section className="ui-panel-dark overflow-hidden">
            <div className="relative p-6 sm:p-7">
              <div className="absolute right-[-70px] top-[-80px] h-64 w-64 rounded-full bg-emerald-500/[0.05] blur-3xl" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.22em] text-blue-300">
                      Protection posture
                    </p>

                    <h2 className="mt-2 text-xl font-black text-white">
                      Security controls
                    </h2>
                  </div>

                  <ShieldCheck
                    size={20}
                    className="text-emerald-400"
                  />
                </div>

                <div className="mt-6 space-y-2">
                  {securityControls.map((control) => {
                    const Icon = control.icon;

                    return (
                      <div
                        key={control.label}
                        className="group flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.035] p-3 transition-all hover:border-emerald-400/10 hover:bg-white/[0.05]"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                          <Icon size={15} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[10px] font-black text-white">
                            {control.label}
                          </p>

                          <p className="mt-0.5 text-[8px] text-slate-600">
                            {control.description}
                          </p>
                        </div>

                        <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[7px] font-black uppercase tracking-[0.12em] text-emerald-400">
                          <span className="h-1 w-1 rounded-full bg-emerald-400" />
                          Enabled
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 border-t border-white/[0.07] pt-5">
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-black uppercase tracking-[0.16em] text-slate-600">
                      Protection state
                    </span>

                    <span className="text-[9px] font-black uppercase tracking-[0.16em] text-emerald-400">
                      All systems nominal
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Infrastructure</p>

              <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950">
                Security architecture
              </h2>
            </div>

            <span className="hidden text-[8px] font-black uppercase tracking-[0.16em] text-slate-400 sm:block">
              Core protection modules
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {infrastructure.map((item) => {
              const Icon = item.icon;

              const iconTone =
                item.tone === "amber"
                  ? "bg-amber-50 text-amber-600"
                  : item.tone === "emerald"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-blue-50 text-blue-600";

              return (
                <div
                  key={item.label}
                  className="ui-panel ui-hover relative overflow-hidden p-6"
                >
                  <div className="absolute right-[-35px] top-[-35px] h-28 w-28 rounded-full bg-blue-500/[0.025] blur-2xl" />

                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconTone}`}
                      >
                        <Icon size={19} />
                      </div>

                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    </div>

                    <p className="mt-7 text-[8px] font-black uppercase tracking-[0.18em] text-slate-400">
                      {item.label}
                    </p>

                    <p className="mt-1 text-xl font-black tracking-tight text-slate-950">
                      {item.value}
                    </p>

                    <p className="mt-2 text-[9px] leading-5 text-slate-400">
                      {item.description}
                    </p>

                    <div className="mt-5 flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((bar) => (
                        <span
                          key={bar}
                          className={`h-1 flex-1 rounded-full ${
                            item.tone === "amber"
                              ? "bg-amber-400"
                              : item.tone === "emerald"
                                ? "bg-emerald-400"
                                : "bg-blue-400"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="ui-panel overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-5 sm:px-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="eyebrow">Runtime state</p>

                <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950">
                  System diagnostics
                </h2>
              </div>

              <Activity size={19} className="text-blue-600" />
            </div>
          </div>

          <div className="grid gap-px bg-slate-100 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Database", "Connected", Database],
              ["Transfer service", "Operational", Server],
              ["Authentication", "Protected", ShieldCheck],
              ["Security monitor", "Active", Activity],
            ].map(([label, value, Icon]) => {
              const ItemIcon = Icon as typeof Database;

              return (
                <div
                  key={label as string}
                  className="bg-white p-5"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <ItemIcon size={16} />
                    </div>

                    <div>
                      <p className="text-[8px] font-black uppercase tracking-[0.16em] text-slate-400">
                        {label as string}
                      </p>

                      <p className="mt-1 text-xs font-black text-slate-900">
                        {value as string}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="ui-panel-dark overflow-hidden">
          <div className="relative p-6 sm:p-7">
            <div className="absolute right-[-100px] top-[-100px] h-72 w-72 rounded-full bg-blue-500/[0.06] blur-3xl" />

            <div className="relative grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                    <Sparkles size={14} />
                  </div>

                  <p className="text-[9px] font-black uppercase tracking-[0.22em] text-blue-300">
                    Application intelligence
                  </p>
                </div>

                <h3 className="mt-3 text-xl font-black text-white">
                  Secure Academic Document Transfer & Integrity Monitoring
                </h3>

                <p className="mt-2 max-w-2xl text-xs leading-6 text-slate-500">
                  SATIM provides encrypted academic document transfer,
                  controlled MITM attack simulation, SHA-256 integrity
                  verification and security monitoring for sensitive
                  institutional documents.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:w-[430px]">
                {[
                  ["SATIM", "Platform"],
                  ["1.0", "Version"],
                  ["ONLINE", "Status"],
                  ["CURRENT", "Build"],
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-white/[0.07] bg-white/[0.035] p-3"
                  >
                    <p className="text-[9px] font-black text-blue-400">
                      {value}
                    </p>

                    <p className="mt-1 text-[8px] font-black uppercase tracking-wider text-slate-500">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mt-7 flex flex-wrap items-center gap-4 border-t border-white/[0.07] pt-5 text-[8px] font-black uppercase tracking-[0.16em] text-slate-600">
              <span className="flex items-center gap-2">
                <Clock3 size={11} />
                Runtime stable
              </span>

              <span className="h-1 w-1 rounded-full bg-slate-700" />

              <span className="flex items-center gap-2">
                <Zap size={11} />
                Security engine online
              </span>

              <span className="h-1 w-1 rounded-full bg-slate-700" />

              <span className="flex items-center gap-2">
                <Network size={11} />
                Transfer network ready
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}