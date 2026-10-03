import AppNavigation from "@/components/dashboard/app-navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#f7f9fc] text-slate-950">
      {/* Global ambient security field */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-40 top-24 h-[420px] w-[420px] rounded-full bg-blue-500/[0.07] blur-[110px]" />
        <div className="absolute -right-40 top-[18%] h-[520px] w-[520px] rounded-full bg-blue-400/[0.055] blur-[130px]" />
        <div className="absolute bottom-[-180px] left-[35%] h-[420px] w-[420px] rounded-full bg-red-500/[0.025] blur-[120px]" />
      </div>

      {/* Fine security grid */}
      <div className="dashboard-grid pointer-events-none fixed inset-0 z-0 opacity-60" />

      <div className="relative z-10">
        <AppNavigation />

        <main className="min-h-[calc(100vh-5rem)] pb-20 lg:pb-10">
          {children}
        </main>
      </div>

      {/* Bottom system signal */}
      <div className="pointer-events-none fixed bottom-3 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-slate-200/70 bg-white/70 px-4 py-2 shadow-lg shadow-slate-900/[0.04] backdrop-blur-xl lg:flex">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,.7)]" />
        <span className="text-[8px] font-black uppercase tracking-[0.22em] text-slate-400">
          SATIM secure network
        </span>
        <span className="h-3 w-px bg-slate-200" />
        <span className="font-mono text-[8px] font-bold text-slate-500">
          AES / SHA / MITM
        </span>
      </div>
    </div>
  );
}
