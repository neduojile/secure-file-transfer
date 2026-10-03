"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Bell,
  ChevronDown,
  FileText,
  Grid2X2,
  LogOut,
  Menu,
  Radar,
  Settings,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

const navigation = [
  {
    href: "/dashboard",
    label: "Overview",
    description: "Your security workspace",
    icon: Grid2X2,
  },
  {
    href: "/dashboard/upload",
    label: "Transfer",
    description: "Encrypt and send documents",
    icon: FileText,
  },
  {
    href: "/dashboard/my-files",
    label: "Documents",
    description: "Manage transfer history",
    icon: FileText,
  },
  {
    href: "/dashboard/received",
    label: "Received",
    description: "Review incoming documents",
    icon: Activity,
  },
  {
    href: "/dashboard/security",
    label: "Security Center",
    description: "Integrity and attack monitoring",
    icon: ShieldCheck,
  },
  {
    href: "/dashboard/settings",
    label: "Workspace settings",
    description: "Account and preferences",
    icon: Settings,
  },
];

export default function AppNavigation() {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleOpen = () => setOpen(true);

    window.addEventListener("open-command-menu", handleOpen);

    return () => {
      window.removeEventListener("open-command-menu", handleOpen);
    };
  }, []);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }

      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, []);

  const activeItem =
    navigation.find((item) =>
      item.href === "/dashboard"
        ? pathname === "/dashboard"
        : pathname.startsWith(item.href)
    ) ?? navigation[0];

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/auth/login" });
  };

  return (
    <>
      {/* =========================================================
          TOP FLOATING NAV
      ========================================================= */}

      <header className="sticky top-0 z-[120] px-4 pt-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex h-[68px] max-w-[1480px] items-center justify-between rounded-[22px] border border-slate-200/80 bg-white/90 px-3 shadow-[0_18px_60px_rgba(15,23,42,0.10)] backdrop-blur-2xl sm:px-4">
          
          {/* LEFT */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen((current) => !current)}
              className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-md"
              aria-expanded={open}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white shadow-lg shadow-slate-950/15">
                <Radar className="h-4 w-4" />
              </span>

              <span className="hidden text-left sm:block">
                <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">
                  SATIM
                </span>
                <span className="block text-sm font-semibold text-slate-900">
                  {activeItem.label}
                </span>
              </span>

              <ChevronDown
                className={`hidden h-4 w-4 text-slate-400 transition-transform duration-300 sm:block ${
                  open ? "rotate-180 text-blue-600" : ""
                }`}
              />
            </button>

            <div className="hidden h-8 w-px bg-slate-200 lg:block" />

            <div className="hidden lg:flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.55)]" />
              <span className="text-xs font-medium text-slate-500">
                Systems operational
              </span>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                window.dispatchEvent(new Event("open-command-menu"))
              }
              className="hidden h-10 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 md:flex"
            >
              <span className="text-xs">Search workspace</span>
              <kbd className="rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-400">
                ⌘K
              </kbd>
            </button>

            <button
              type="button"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-600" />
            </button>

            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white shadow-lg shadow-slate-950/15 transition hover:bg-blue-600"
            >
              <UserRound className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================
          FULL SCREEN OVERLAY
      ========================================================= */}

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label="Close workspace navigation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[100] cursor-default bg-slate-950/30 backdrop-blur-[6px]"
            />

            {/* =====================================================
                COMMAND WORKSPACE
            ===================================================== */}

            <motion.div
              initial={{
                opacity: 0,
                x: -24,
                y: -8,
                scale: 0.97,
              }}
              animate={{
                opacity: 1,
                x: 0,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                x: -18,
                y: -6,
                scale: 0.98,
              }}
              transition={{
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="fixed left-4 top-[92px] z-[110] w-[calc(100vw-32px)] max-w-[420px] overflow-hidden rounded-[30px] border border-white/80 bg-white/95 shadow-[0_35px_100px_rgba(15,23,42,0.25)] backdrop-blur-3xl sm:left-6 sm:w-[420px] lg:left-8"
            >
              {/* ambient glow */}
              <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-500/10 blur-[80px]" />
              <div className="pointer-events-none absolute -bottom-32 -left-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-[80px]" />

              <div className="relative">
                
                {/* HEADER */}
                <div className="flex items-start justify-between border-b border-slate-100 px-6 pb-5 pt-6">
                  <div>
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.28em] text-blue-600">
                      Command workspace
                    </p>

                    <h2 className="font-serif text-[25px] font-black tracking-[-0.03em] text-slate-950">
                      Navigate SATIM
                    </h2>

                    <p className="mt-1 text-xs text-slate-400">
                      Move through your secure academic workspace.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white shadow-lg transition hover:bg-blue-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* NAVIGATION */}
                <div className="space-y-1 px-3 py-4">
                  {navigation.map((item, index) => {
                    const Icon = item.icon;

                    const active =
                      item.href === "/dashboard"
                        ? pathname === "/dashboard"
                        : pathname.startsWith(item.href);

                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: index * 0.035,
                          duration: 0.25,
                        }}
                      >
                        <Link
                          href={item.href}
                          className={`group relative flex items-center gap-4 rounded-2xl px-3 py-3.5 transition-all duration-300 ${
                            active
                              ? "bg-blue-50 shadow-[inset_0_0_0_1px_rgba(37,99,235,0.10)]"
                              : "hover:bg-slate-50"
                          }`}
                        >
                          {/* active rail */}
                          {active && (
                            <motion.span
                              layoutId="satim-active-rail"
                              className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-blue-600 shadow-[0_0_14px_rgba(37,99,235,0.45)]"
                            />
                          )}

                          <span
                            className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 ${
                              active
                                ? "bg-blue-600 text-white shadow-[0_10px_25px_rgba(37,99,235,0.28)]"
                                : "bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600"
                            }`}
                          >
                            <Icon className="h-[19px] w-[19px]" />

                            {active && (
                              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-blue-500 shadow-[0_0_12px_rgba(37,99,235,0.55)]" />
                            )}
                          </span>

                          <span className="min-w-0 flex-1">
                            <span
                              className={`block text-[15px] font-bold ${
                                active
                                  ? "text-blue-700"
                                  : "text-slate-800 group-hover:text-slate-950"
                              }`}
                            >
                              {item.label}
                            </span>

                            <span className="mt-0.5 block truncate text-[11px] text-slate-400">
                              {item.description}
                            </span>
                          </span>

                          <ArrowRight
                            className={`h-4 w-4 shrink-0 transition-all duration-300 ${
                              active
                                ? "translate-x-0 text-blue-500 opacity-100"
                                : "-translate-x-1 text-slate-300 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                            }`}
                          />
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* SYSTEM STATUS */}
                <div className="px-4 pb-4">
                  <div className="relative overflow-hidden rounded-[22px] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
                    <div className="absolute right-[-30px] top-[-35px] h-28 w-28 rounded-full bg-blue-500/10 blur-2xl" />

                    <div className="relative flex items-center gap-3">
                      <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg">
                        <Activity className="h-5 w-5" />

                        <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-blue-600">
                          Security systems
                        </p>

                        <p className="text-sm font-bold text-slate-900">
                          Operational and monitoring
                        </p>
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-semibold text-emerald-600">
                          LIVE
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* FOOTER */}
                <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign out
                  </button>

                  <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-300">
                    <ShieldCheck className="h-3 w-3" />
                    Secure workspace
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile trigger */}
      {mounted && (
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="fixed bottom-5 right-5 z-[90] flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_15px_40px_rgba(15,23,42,0.25)] transition hover:bg-blue-600 md:hidden"
          aria-label="Open workspace navigation"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      )}
    </>
  );
}
