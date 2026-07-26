import type { ReactNode } from "react";
import { ShieldCheck, LockKeyhole, FileCheck } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
}

const features = [
  {
    icon: ShieldCheck,
    title: "AES-256 Encryption",
    description: "Protect every file with enterprise-grade encryption.",
  },
  {
    icon: FileCheck,
    title: "SHA-256 Integrity",
    description: "Verify file integrity and detect unauthorized changes.",
  },
  {
    icon: LockKeyhole,
    title: "Attack Simulation",
    description: "Demonstrate secure communication against common attacks.",
  },
];

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-background">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left Branding Panel */}
        <section className="relative hidden overflow-hidden border-r border-slate-800 bg-slate-950 lg:flex">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-transparent to-transparent" />

          <div className="relative flex w-full flex-col justify-between p-14">
            <div>
              <div className="mb-10 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
                <ShieldCheck className="h-7 w-7" />
              </div>

              <h1 className="max-w-md text-5xl font-bold tracking-tight text-slate-100">
                Secure Transfer
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-8 text-slate-400">
                A secure file transfer platform built with AES-256 encryption,
                SHA-256 integrity verification, and attack simulation for secure
                communication.
              </p>
            </div>

            <div className="space-y-5">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className="flex items-start gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600/15 text-indigo-400">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-100">
                        {feature.title}
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-slate-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Right Form Panel */}
        <section className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-14">
          <div className="w-full max-w-md">{children}</div>
        </section>
      </div>
    </main>
  );
}