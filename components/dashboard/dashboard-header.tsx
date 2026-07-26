"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import {
  Bell,
  LogOut,
  Search,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function DashboardHeader() {
  const pathname = usePathname();

  const [loggingOut, setLoggingOut] = useState(false);

  const pages: Record<
    string,
    {
      title: string;
      subtitle: string;
    }
  > = {
    "/dashboard": {
      title: "Dashboard",
      subtitle: "Welcome back. Manage your secure file transfers.",
    },
    "/dashboard/upload": {
      title: "Upload File",
      subtitle: "Securely upload encrypted files.",
    },
    "/dashboard/my-files": {
      title: "My Files",
      subtitle: "View and manage your uploaded files.",
    },
    "/dashboard/received": {
      title: "Received Files",
      subtitle: "Access files securely shared with you.",
    },
    "/dashboard/security": {
      title: "Security",
      subtitle: "Monitor your account security.",
    },
    "/dashboard/settings": {
      title: "Settings",
      subtitle: "Manage your account preferences.",
    },
  };

  const page =
    pathname.startsWith("/dashboard/received/") &&
    pathname !== "/dashboard/received"
      ? {
          title: "View File",
          subtitle: "Inspect and verify received files.",
        }
      : pages[pathname] || pages["/dashboard"];

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);

    const loadingToast = toast.loading(
      "Signing you out...",
      {
        description: "Ending your secure session.",
      }
    );

    toast.dismiss(loadingToast);

    toast.success("Signed Out", {
      description: "You have been logged out successfully.",
      icon: <CheckCircle2 className="h-5 w-5" />,
    });

    setTimeout(async () => {
      await signOut({
        callbackUrl: "/auth/login",
      });
    }, 700);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-background/80 backdrop-blur-xl">
      <div className="flex h-20 items-center justify-between px-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">
            {page.title}
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            {page.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden lg:block">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

            <input
              type="text"
              placeholder="Search..."
              className="h-11 w-64 rounded-xl border border-slate-800 bg-slate-900 pl-11 pr-4 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 transition hover:border-indigo-500 hover:text-white">
            <Bell className="h-5 w-5" />
          </button>

          <div className="hidden xl:flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />

            <div>
              <p className="text-xs text-slate-500">
                Security
              </p>

              <p className="text-sm font-semibold text-emerald-400">
                Protected
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex h-11 items-center gap-2 rounded-xl bg-rose-600 px-5 text-white transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogOut className="h-4 w-4" />

            <span className="hidden sm:block">
              {loggingOut ? "Signing Out..." : "Logout"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}