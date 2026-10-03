"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Lock,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Unlock,
  UserRound,
  Users,
} from "lucide-react";

type User = {
  id: string;
  fullName: string;
  email: string;
  role: string;
  department: string | null;
  isBlocked: boolean;
  createdAt: string;
  _count: {
    sentFiles: number;
    receivedFiles: number;
    securityLogs: number;
  };
};

function roleTone(role: string) {
  switch (role) {
    case "ADMIN":
      return "border-violet-500/20 bg-violet-500/10 text-violet-300";
    case "ATTACKER":
      return "border-red-500/20 bg-red-500/10 text-red-300";
    case "LECTURER":
      return "border-blue-500/20 bg-blue-500/10 text-blue-300";
    case "HOD":
      return "border-cyan-500/20 bg-cyan-500/10 text-cyan-300";
    case "EXAM_OFFICER":
      return "border-amber-500/20 bg-amber-500/10 text-amber-300";
    default:
      return "border-slate-700 bg-slate-900 text-slate-400";
  }
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString([], {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AdminUserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  async function loadUsers() {
    try {
      const response = await fetch("/api/admin/users", {
        cache: "no-store",
      });

      const data = await response.json();

      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();

    const interval = setInterval(loadUsers, 3000);

    return () => clearInterval(interval);
  }, []);

  async function toggleBlock(user: User) {
    const action = user.isBlocked ? "unblock" : "block";

    setProcessing(user.id);

    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          action,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update account.");
        return;
      }

      await loadUsers();
    } catch (error) {
      console.error(error);
      alert("Failed to update account.");
    } finally {
      setProcessing(null);
    }
  }

  async function deleteUser(user: User) {
    const confirmed = window.confirm(
      `Delete ${user.fullName}'s account?\n\nThis will permanently remove the account and its associated transfer records.`
    );

    if (!confirmed) {
      return;
    }

    setProcessing(user.id);

    try {
      const response = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to delete account.");
        return;
      }

      await loadUsers();
    } catch (error) {
      console.error(error);
      alert("Failed to delete account.");
    } finally {
      setProcessing(null);
    }
  }

  const activeUsers = useMemo(
    () => users.filter((user) => !user.isBlocked).length,
    [users]
  );

  const blockedUsers = useMemo(
    () => users.filter((user) => user.isBlocked).length,
    [users]
  );

  const totalActivity = useMemo(
    () =>
      users.reduce(
        (total, user) =>
          total +
          user._count.sentFiles +
          user._count.receivedFiles +
          user._count.securityLogs,
        0
      ),
    [users]
  );

  return (
    <section className="relative mt-8 overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#05070b] text-white shadow-2xl shadow-black/20">
      <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-blue-500/[0.06] blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-violet-500/[0.04] blur-[100px]" />

      <div className="relative">
        {/* HEADER */}
        <div className="border-b border-white/[0.06] p-5 sm:p-6 lg:p-7">
          <div className="flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/[0.06] px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-blue-400">
                  <Users className="h-3 w-3" />
                  Identity Control
                </span>

                <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-700">
                  ACCESS / IAM-01
                </span>
              </div>

              <h2 className="text-2xl font-black tracking-[-0.03em] text-white sm:text-3xl">
                User Access Management
              </h2>

              <p className="mt-2 max-w-2xl text-xs leading-5 text-slate-600">
                Monitor academic accounts, security activity and access
                status across the SATIM environment.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <Activity className="h-4 w-4" />
                <span className="absolute inset-0 animate-ping rounded-xl border border-emerald-400/20" />
              </div>

              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-emerald-400">
                  Access Monitor
                </p>
                <p className="mt-1 text-[9px] text-slate-700">
                  Synchronizing every 3 seconds
                </p>
              </div>

              <RefreshCw
                className={`ml-2 h-3.5 w-3.5 text-slate-700 ${
                  loading ? "animate-spin" : ""
                }`}
              />
            </div>
          </div>

          {/* ACCOUNT TELEMETRY */}
          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div className="rounded-2xl border border-white/[0.05] bg-white/[0.015] p-4">
              <div className="flex items-center gap-2 text-blue-400">
                <Users className="h-3.5 w-3.5" />
                <span className="text-[8px] font-black uppercase tracking-[0.16em] text-slate-600">
                  Accounts
                </span>
              </div>
              <p className="mt-2 text-2xl font-black text-white">
                {users.length}
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.025] p-4">
              <div className="flex items-center gap-2 text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span className="text-[8px] font-black uppercase tracking-[0.16em] text-slate-600">
                  Active
                </span>
              </div>
              <p className="mt-2 text-2xl font-black text-emerald-400">
                {activeUsers}
              </p>
            </div>

            <div className="rounded-2xl border border-red-500/10 bg-red-500/[0.025] p-4">
              <div className="flex items-center gap-2 text-red-400">
                <ShieldAlert className="h-3.5 w-3.5" />
                <span className="text-[8px] font-black uppercase tracking-[0.16em] text-slate-600">
                  Restricted
                </span>
              </div>
              <p className="mt-2 text-2xl font-black text-red-400">
                {blockedUsers}
              </p>
            </div>

            <div className="rounded-2xl border border-violet-500/10 bg-violet-500/[0.025] p-4">
              <div className="flex items-center gap-2 text-violet-400">
                <Activity className="h-3.5 w-3.5" />
                <span className="text-[8px] font-black uppercase tracking-[0.16em] text-slate-600">
                  Activity
                </span>
              </div>
              <p className="mt-2 text-2xl font-black text-violet-300">
                {totalActivity}
              </p>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="p-10">
            <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-white/[0.05] bg-white/[0.015]">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-400" />
              <p className="mt-4 text-xs font-bold text-slate-500">
                Loading identity registry...
              </p>
              <p className="mt-1 text-[9px] text-slate-700">
                Synchronizing account telemetry
              </p>
            </div>
          </div>
        ) : users.length === 0 ? (
          <div className="p-10">
            <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-white/[0.05] bg-white/[0.015] text-center">
              <UserRound className="h-8 w-8 text-slate-700" />
              <p className="mt-4 text-sm font-bold text-slate-500">
                No user accounts found
              </p>
              <p className="mt-1 text-[9px] text-slate-700">
                The identity registry is currently empty.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* DESKTOP TABLE */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[1050px]">
                <thead>
                  <tr className="border-b border-white/[0.06] text-left">
                    <th className="px-6 py-4 text-[8px] font-black uppercase tracking-[0.18em] text-slate-700">
                      Identity
                    </th>
                    <th className="px-4 py-4 text-[8px] font-black uppercase tracking-[0.18em] text-slate-700">
                      Role
                    </th>
                    <th className="px-4 py-4 text-[8px] font-black uppercase tracking-[0.18em] text-slate-700">
                      Department
                    </th>
                    <th className="px-4 py-4 text-[8px] font-black uppercase tracking-[0.18em] text-slate-700">
                      Activity
                    </th>
                    <th className="px-4 py-4 text-[8px] font-black uppercase tracking-[0.18em] text-slate-700">
                      Access State
                    </th>
                    <th className="px-6 py-4 text-right text-[8px] font-black uppercase tracking-[0.18em] text-slate-700">
                      Controls
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/[0.04]">
                  {users.map((user) => {
                    const activity =
                      user._count.sentFiles +
                      user._count.receivedFiles +
                      user._count.securityLogs;

                    return (
                      <tr
                        key={user.id}
                        className="group transition hover:bg-white/[0.018]"
                      >
                        {/* IDENTITY */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div
                              className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                                user.isBlocked
                                  ? "border-red-500/15 bg-red-500/10 text-red-400"
                                  : "border-blue-500/15 bg-blue-500/10 text-blue-400"
                              }`}
                            >
                              <UserRound className="h-4 w-4" />

                              <span
                                className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#05070b] ${
                                  user.isBlocked
                                    ? "bg-red-500"
                                    : "bg-emerald-400"
                                }`}
                              />
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-xs font-bold text-slate-200">
                                {user.fullName}
                              </p>
                              <p className="mt-1 truncate text-[9px] text-slate-700">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* ROLE */}
                        <td className="px-4 py-5">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.12em] ${roleTone(
                              user.role
                            )}`}
                          >
                            {user.role}
                          </span>
                        </td>

                        {/* DEPARTMENT */}
                        <td className="px-4 py-5">
                          <p className="max-w-[150px] truncate text-[10px] font-semibold text-slate-400">
                            {user.department || "Not assigned"}
                          </p>
                          <p className="mt-1 text-[8px] text-slate-700">
                            Joined {formatDate(user.createdAt)}
                          </p>
                        </td>

                        {/* ACTIVITY */}
                        <td className="px-4 py-5">
                          <div className="flex items-center gap-4">
                            <div>
                              <p className="text-[10px] font-black text-white">
                                {activity}
                              </p>
                              <p className="mt-1 text-[8px] uppercase tracking-wider text-slate-700">
                                Events
                              </p>
                            </div>

                            <div className="hidden gap-1 xl:flex">
                              <span className="rounded-md bg-blue-500/10 px-1.5 py-1 text-[7px] font-bold text-blue-400">
                                S {user._count.sentFiles}
                              </span>
                              <span className="rounded-md bg-cyan-500/10 px-1.5 py-1 text-[7px] font-bold text-cyan-400">
                                R {user._count.receivedFiles}
                              </span>
                              <span className="rounded-md bg-violet-500/10 px-1.5 py-1 text-[7px] font-bold text-violet-400">
                                L {user._count.securityLogs}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* STATUS */}
                        <td className="px-4 py-5">
                          {user.isBlocked ? (
                            <div>
                              <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.12em] text-red-400">
                                <Lock className="h-2.5 w-2.5" />
                                Restricted
                              </span>
                              <p className="mt-1 text-[8px] text-slate-700">
                                Authentication blocked
                              </p>
                            </div>
                          ) : (
                            <div>
                              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.12em] text-emerald-400">
                                <CheckCircle2 className="h-2.5 w-2.5" />
                                Active
                              </span>
                              <p className="mt-1 text-[8px] text-slate-700">
                                Authentication permitted
                              </p>
                            </div>
                          )}
                        </td>

                        {/* ACTIONS */}
                        <td className="px-6 py-5">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => toggleBlock(user)}
                              disabled={processing === user.id}
                              className={`inline-flex h-9 items-center gap-2 rounded-xl border px-3 text-[8px] font-black uppercase tracking-[0.1em] transition-all disabled:cursor-not-allowed disabled:opacity-40 ${
                                user.isBlocked
                                  ? "border-emerald-500/20 bg-emerald-500/[0.04] text-emerald-400 hover:bg-emerald-500/10"
                                  : "border-amber-500/20 bg-amber-500/[0.04] text-amber-400 hover:bg-amber-500/10"
                              }`}
                            >
                              {processing === user.id ? (
                                <RefreshCw className="h-3 w-3 animate-spin" />
                              ) : user.isBlocked ? (
                                <Unlock className="h-3 w-3" />
                              ) : (
                                <Lock className="h-3 w-3" />
                              )}

                              {processing === user.id
                                ? "Processing"
                                : user.isBlocked
                                  ? "Restore"
                                  : "Restrict"}
                            </button>

                            <button
                              type="button"
                              onClick={() => deleteUser(user)}
                              disabled={processing === user.id}
                              className="inline-flex h-9 items-center gap-2 rounded-xl border border-red-500/15 bg-red-500/[0.025] px-3 text-[8px] font-black uppercase tracking-[0.1em] text-red-400 transition-all hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <Trash2 className="h-3 w-3" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* MOBILE / TABLET */}
            <div className="divide-y divide-white/[0.04] lg:hidden">
              {users.map((user) => {
                const activity =
                  user._count.sentFiles +
                  user._count.receivedFiles +
                  user._count.securityLogs;

                return (
                  <div
                    key={user.id}
                    className="p-5 transition hover:bg-white/[0.018]"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
                          user.isBlocked
                            ? "border-red-500/15 bg-red-500/10 text-red-400"
                            : "border-blue-500/15 bg-blue-500/10 text-blue-400"
                        }`}
                      >
                        <UserRound className="h-4 w-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-xs font-bold text-slate-200">
                            {user.fullName}
                          </p>

                          <span
                            className={`rounded-full border px-2 py-0.5 text-[7px] font-black uppercase tracking-wider ${roleTone(
                              user.role
                            )}`}
                          >
                            {user.role}
                          </span>
                        </div>

                        <p className="mt-1 truncate text-[9px] text-slate-700">
                          {user.email}
                        </p>
                      </div>

                      {user.isBlocked ? (
                        <span className="rounded-full border border-red-500/20 bg-red-500/10 px-2 py-1 text-[7px] font-black uppercase text-red-400">
                          Blocked
                        </span>
                      ) : (
                        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[7px] font-black uppercase text-emerald-400">
                          Active
                        </span>
                      )}
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <div className="rounded-xl border border-white/[0.05] bg-white/[0.015] p-3">
                        <p className="text-[8px] uppercase tracking-wider text-slate-700">
                          Sent
                        </p>
                        <p className="mt-1 text-sm font-black text-blue-400">
                          {user._count.sentFiles}
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/[0.05] bg-white/[0.015] p-3">
                        <p className="text-[8px] uppercase tracking-wider text-slate-700">
                          Received
                        </p>
                        <p className="mt-1 text-sm font-black text-cyan-400">
                          {user._count.receivedFiles}
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/[0.05] bg-white/[0.015] p-3">
                        <p className="text-[8px] uppercase tracking-wider text-slate-700">
                          Events
                        </p>
                        <p className="mt-1 text-sm font-black text-violet-400">
                          {activity}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => toggleBlock(user)}
                        disabled={processing === user.id}
                        className={`flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border text-[8px] font-black uppercase tracking-[0.1em] disabled:opacity-40 ${
                          user.isBlocked
                            ? "border-emerald-500/20 bg-emerald-500/[0.04] text-emerald-400"
                            : "border-amber-500/20 bg-amber-500/[0.04] text-amber-400"
                        }`}
                      >
                        {processing === user.id ? (
                          <RefreshCw className="h-3 w-3 animate-spin" />
                        ) : user.isBlocked ? (
                          <Unlock className="h-3 w-3" />
                        ) : (
                          <Lock className="h-3 w-3" />
                        )}

                        {processing === user.id
                          ? "Processing"
                          : user.isBlocked
                            ? "Restore Access"
                            : "Restrict Access"}
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteUser(user)}
                        disabled={processing === user.id}
                        className="flex h-10 items-center justify-center gap-2 rounded-xl border border-red-500/15 bg-red-500/[0.025] px-4 text-[8px] font-black uppercase tracking-[0.1em] text-red-400 disabled:opacity-40"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* FOOTER */}
        <div className="flex flex-col gap-2 border-t border-white/[0.05] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
            <span className="text-[8px] font-black uppercase tracking-[0.16em] text-slate-700">
              Administrative access control protected
            </span>
          </div>

          <div className="flex items-center gap-3 text-[8px] font-bold uppercase tracking-[0.14em] text-slate-800">
            <span>RBAC</span>
            <span>•</span>
            <span>SESSION GUARD</span>
            <span>•</span>
            <span>LIVE SYNC</span>
          </div>
        </div>
      </div>
    </section>
  );
}