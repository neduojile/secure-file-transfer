"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import {
  Bell,
  LogOut,
  Search,
  ShieldCheck,
  CheckCircle2,
  ShieldAlert,
  X,
} from "lucide-react";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export default function DashboardHeader() {
  const pathname = usePathname();

  const [loggingOut, setLoggingOut] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const pages: Record<
    string,
    {
      title: string;
      subtitle: string;
    }
  > = {
    "/dashboard": {
      title: "Dashboard",
      subtitle: "Welcome back. Manage your secure academic transfers.",
    },
    "/dashboard/upload": {
      title: "Upload Document",
      subtitle: "Securely transfer academic documents.",
    },
    "/dashboard/my-files": {
      title: "My Documents",
      subtitle: "View and monitor your academic document transfers.",
    },
    "/dashboard/received": {
      title: "Received Documents",
      subtitle: "Access documents securely shared with you.",
    },
    "/dashboard/security": {
      title: "Security",
      subtitle: "Monitor document transfer security and integrity.",
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
          title: "View Document",
          subtitle: "Inspect and verify the received document.",
        }
      : pages[pathname] || pages["/dashboard"];

  async function loadNotifications() {
    try {
      setLoadingNotifications(true);

      const response = await fetch("/api/notifications", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Unable to load notifications.");
      }

      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error("NOTIFICATION LOAD ERROR:", error);
    } finally {
      setLoadingNotifications(false);
    }
  }

  useEffect(() => {
    loadNotifications();

    const interval = setInterval(() => {
      loadNotifications();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  async function markNotificationAsRead(id: string) {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      setNotifications((current) =>
        current.map((notification) =>
          notification.id === id
            ? { ...notification, isRead: true }
            : notification
        )
      );

      setUnreadCount((current) => Math.max(0, current - 1));
    } catch (error) {
      console.error("NOTIFICATION READ ERROR:", error);
    }
  }

  async function markAllAsRead() {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ all: true }),
      });

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error("MARK ALL READ ERROR:", error);
    }
  }

  function formatNotificationDate(date: string) {
    return new Date(date).toLocaleString();
  }

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);

    const loadingToast = toast.loading("Signing you out...", {
      description: "Ending your secure session.",
    });

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

          {/* Notifications */}

          <div className="relative">
            <button
              onClick={() => {
                setNotificationsOpen((current) => !current);

                if (!notificationsOpen) {
                  loadNotifications();
                }
              }}
              className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 transition hover:border-indigo-500 hover:text-white"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />

              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white ring-2 ring-background">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 top-14 z-50 w-96 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl shadow-black/40">
                <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
                  <div>
                    <h3 className="font-semibold text-slate-100">
                      Security Notifications
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      {unreadCount} unread notification
                      {unreadCount !== 1 ? "s" : ""}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs font-medium text-indigo-400 hover:text-indigo-300"
                      >
                        Mark all read
                      </button>
                    )}

                    <button
                      onClick={() => setNotificationsOpen(false)}
                      className="rounded-lg p-1 text-slate-500 hover:bg-slate-900 hover:text-slate-200"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {loadingNotifications ? (
                    <div className="px-5 py-10 text-center text-sm text-slate-500">
                      Loading security notifications...
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center px-5 py-10 text-center">
                      <ShieldCheck className="h-10 w-10 text-emerald-500/60" />

                      <p className="mt-3 font-medium text-slate-200">
                        No security alerts
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Your document transfers have no new notifications.
                      </p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <button
                        key={notification.id}
                        onClick={() => {
                          if (!notification.isRead) {
                            markNotificationAsRead(notification.id);
                          }
                        }}
                        className={`w-full border-b border-slate-800 px-5 py-4 text-left transition hover:bg-slate-900/70 ${
                          notification.isRead
                            ? "bg-slate-950"
                            : "bg-indigo-500/5"
                        }`}
                      >
                        <div className="flex gap-3">
                          <div
                            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                              notification.title
                                .toLowerCase()
                                .includes("critical")
                                ? "bg-rose-500/15 text-rose-400"
                                : "bg-indigo-500/15 text-indigo-400"
                            }`}
                          >
                            {notification.title
                              .toLowerCase()
                              .includes("critical") ? (
                              <ShieldAlert className="h-4 w-4" />
                            ) : (
                              <ShieldCheck className="h-4 w-4" />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <p className="text-sm font-semibold text-slate-200">
                                {notification.title}
                              </p>

                              {!notification.isRead && (
                                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-400" />
                              )}
                            </div>

                            <p className="mt-1 text-xs leading-5 text-slate-400">
                              {notification.message}
                            </p>

                            <p className="mt-2 text-[10px] text-slate-600">
                              {formatNotificationDate(
                                notification.createdAt
                              )}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

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

