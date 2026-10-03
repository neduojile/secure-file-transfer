import type { ReactNode } from "react";
import {
  Activity,
  FileCheck2,
  LockKeyhole,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
}

const securityItems = [
  {
    icon: LockKeyhole,
    title: "Encrypted before transmission",
    description:
      "Sensitive academic documents are protected before entering the transfer channel.",
  },
  {
    icon: FileCheck2,
    title: "Integrity verified",
    description:
      "SHA-256 comparison exposes unauthorized document modification.",
  },
  {
    icon: ShieldAlert,
    title: "Attacks are observable",
    description:
      "Controlled MITM simulation makes interception and tampering visible.",
  },
];

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-white">
      <div className="grid min-h-screen lg:grid-cols-[0.92fr_1.08fr]">
        <section className="security-grid relative hidden overflow-hidden bg-slate-950 text-white lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_30%,rgba(37,99,235,0.25),transparent_30%),radial-gradient(circle_at_80%_80%,rgba(220,38,38,0.10),transparent_28%)]" />

          <div className="relative flex min-h-screen flex-col justify-between p-10 xl:p-14">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-950">
                  <ShieldCheck className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm font-black tracking-[0.18em]">
                    SATIM
                  </p>
                  <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-white/40">
                    Academic Security
                  </p>
                </div>
              </div>

              <div className="mt-20 max-w-xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                  Secure access layer
                </div>

                <h1 className="mt-6 text-5xl font-black tracking-[-0.045em] xl:text-6xl">
                  Protect the document.
                  <br />
                  <span className="text-blue-400">
                    Verify the transfer.
                  </span>
                </h1>

                <p className="mt-6 max-w-lg text-sm leading-7 text-white/50">
                  SATIM is an academic document security environment built
                  around encryption, integrity verification, attack simulation
                  and security monitoring.
                </p>
              </div>
            </div>

            <div className="mt-12 space-y-3">
              {securityItems.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                      <Icon className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-xs font-bold text-white">
                        {item.title}
                      </p>

                      <p className="mt-1 text-[11px] leading-5 text-white/40">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-400" />
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">
                  Security systems operational
                </span>
              </div>

              <span className="flex items-center gap-2 text-[10px] font-bold text-blue-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />
                ONLINE
              </span>
            </div>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-14 xl:px-20">
          <div className="w-full max-w-[480px]">{children}</div>
        </section>
      </div>
    </main>
  );
}
