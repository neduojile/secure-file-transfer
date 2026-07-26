import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import {
  ShieldAlert,
  User,
  Activity,
  Wifi,
  Radar,
  Eye,
} from "lucide-react";

import PacketMonitor from "@/components/attacker/packet-monitor";
import { authOptions } from "@/lib/auth";

export default async function AttackerDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  if (session.user.role !== "ATTACKER") {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-8 py-8">
        {/* Header */}

        <div className="mb-8 rounded-3xl border border-rose-500/20 bg-slate-900 p-8 shadow-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-400">
                <ShieldAlert className="h-4 w-4" />
                ATTACKER CONSOLE
              </div>

              <h1 className="text-4xl font-bold tracking-tight">
                Network Packet Interception Dashboard
              </h1>

              <p className="mt-3 max-w-2xl text-slate-400">
                Monitor packets travelling across the Secure File Transfer
                System and inspect intercepted network traffic in real time.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/15">
                  <User className="h-6 w-6 text-rose-400" />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500">
                    Logged In As
                  </p>

                  <p className="font-semibold text-slate-100">
                    {session.user.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}

        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/15">
              <Activity className="h-6 w-6 text-indigo-400" />
            </div>

            <p className="text-sm text-slate-400">
              Monitoring Status
            </p>

            <h2 className="mt-2 text-2xl font-bold text-emerald-400">
              Active
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/15">
              <Wifi className="h-6 w-6 text-amber-400" />
            </div>

            <p className="text-sm text-slate-400">
              Network
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Secure File Transfer
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/15">
              <Radar className="h-6 w-6 text-rose-400" />
            </div>

            <p className="text-sm text-slate-400">
              Surveillance
            </p>

            <h2 className="mt-2 text-2xl font-bold text-rose-400">
              Packet Inspection
            </h2>
          </div>
        </div>

        {/* Packet Monitor */}

        <div className="rounded-3xl border border-slate-800 bg-slate-900 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-semibold">
                <Eye className="h-5 w-5 text-indigo-400" />
                Live Packet Monitor
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Observe and inspect packets intercepted from the secure network.
              </p>
            </div>
          </div>

          <div className="p-6">
            <PacketMonitor />
          </div>
        </div>
      </div>
    </div>
  );
}