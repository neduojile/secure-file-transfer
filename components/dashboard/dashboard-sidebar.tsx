"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Upload,
  FolderOpen,
  Inbox,
  ShieldCheck,
  Settings,
  Shield,
  ChevronRight,
} from "lucide-react";

const links = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Upload",
    href: "/dashboard/upload",
    icon: Upload,
  },
  {
    name: "My Files",
    href: "/dashboard/my-files",
    icon: FolderOpen,
  },
  {
    name: "Received Files",
    href: "/dashboard/received",
    icon: Inbox,
  },
  {
    name: "Security Logs",
    href: "/dashboard/security",
    icon: ShieldCheck,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
 <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-950">
      {/* Logo */}

      <div className="border-b border-slate-800 px-6 py-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-600/20">
            <Shield className="h-6 w-6 text-white" />
          </div>

          <div>
            <h1 className="text-lg font-semibold tracking-tight text-slate-100">
              Secure Transfer
            </h1>

            <p className="text-xs text-slate-400">
              Cyber Security Platform
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}

      <nav className="flex-1 space-y-1.5 p-4">
        {links.map((link) => {
          const isActive = pathname === link.href;

          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`group flex items-center justify-between rounded-xl px-4 py-3 transition-all duration-200 ${
                isActive
                  ? "border border-indigo-500/30 bg-indigo-600/15 text-indigo-300"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`h-5 w-5 transition-transform duration-200 ${
                    !isActive && "group-hover:scale-110"
                  }`}
                />

                <span className="text-sm font-medium">
                  {link.name}
                </span>
              </div>

              {isActive && (
                <ChevronRight className="h-4 w-4" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}

      <div className="border-t border-slate-800 p-5">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <div className="mb-2 flex items-center gap-2">
            <Shield className="h-4 w-4 text-indigo-400" />

            <span className="text-sm font-semibold text-slate-100">
              Security Active
            </span>
          </div>

          <p className="text-xs leading-6 text-slate-400">
            AES-256 Encryption
            <br />
            SHA-256 Integrity Verification
          </p>
        </div>

        <p className="mt-5 text-center text-xs text-slate-500">
          © 2026 Secure Transfer
        </p>
      </div>
    </aside>
  );
}