"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  FileCheck2,
  LockKeyhole,
  LogIn,
  Mail,
  Radar,
  ShieldAlert,
  ShieldCheck,
  XCircle,
} from "lucide-react";

export default function LoginForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [adminMode, setAdminMode] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function switchMode() {
    setAdminMode((current) => !current);

    setForm({
      email: "",
      password: "",
    });

    setShowPassword(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    const loadingToast = toast.loading(
      adminMode
        ? "Authenticating administrator..."
        : "Signing you in...",
      {
        description: adminMode
          ? "Verifying privileged credentials."
          : "Please wait while we verify your credentials.",
      }
    );

    try {
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        toast.dismiss(loadingToast);

        toast.error(
          adminMode ? "Administrator Login Failed" : "Login Failed",
          {
            description: "Invalid email or password.",
            icon: <XCircle className="h-5 w-5" />,
          }
        );

        setLoading(false);
        return;
      }

      const session = await getSession();
      const role = session?.user?.role;

      if (adminMode) {
        if (role !== "ADMIN") {
          toast.dismiss(loadingToast);

          toast.error("Access Denied", {
            description:
              "This account does not have administrator privileges.",
            icon: <XCircle className="h-5 w-5" />,
          });

          setLoading(false);
          return;
        }

        toast.dismiss(loadingToast);

        toast.success("Administrator Access Granted", {
          description:
            "Welcome to the Security Operations Center.",
          icon: <CheckCircle2 className="h-5 w-5" />,
        });

        router.push("/admin");
        router.refresh();
        return;
      }

      if (role === "ADMIN") {
        toast.dismiss(loadingToast);

        toast.error("Administrator Account", {
          description:
            "Please use Administrator Login to access the security center.",
          icon: <ShieldCheck className="h-5 w-5" />,
        });

        setLoading(false);
        return;
      }

      switch (role) {
        case "USER":
        case "LECTURER":
        case "HOD":
        case "EXAM_OFFICER":
          toast.dismiss(loadingToast);

          toast.success("Login Successful", {
            description: "Welcome back to SATIM.",
            icon: <CheckCircle2 className="h-5 w-5" />,
          });

          router.push("/dashboard");
          router.refresh();
          return;

        case "ATTACKER":
          toast.dismiss(loadingToast);

          toast.success("Login Successful", {
            description:
              "Welcome to the MITM simulation environment.",
            icon: <CheckCircle2 className="h-5 w-5" />,
          });

          router.push("/attacker/dashboard");
          router.refresh();
          return;

        default:
          toast.dismiss(loadingToast);

          toast.error("Unknown User Role", {
            description:
              "Unable to determine your account permissions.",
            icon: <XCircle className="h-5 w-5" />,
          });

          setLoading(false);
          return;
      }
    } catch (error) {
      console.error(error);

      toast.dismiss(loadingToast);

      toast.error("Authentication Error", {
        description:
          "Something went wrong while signing you in.",
        icon: <XCircle className="h-5 w-5" />,
      });

      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      {/* Mobile brand */}
      <div className="mb-8 flex items-center gap-3 lg:hidden">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
          <ShieldCheck className="h-5 w-5" />
        </div>

        <div>
          <p className="text-sm font-black tracking-[0.18em]">SATIM</p>
          <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-slate-400">
            Academic Security
          </p>
        </div>
      </div>

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div
          className={
            adminMode
              ? "mb-5 inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-red-600"
              : "mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-blue-700"
          }
        >
          {adminMode ? (
            <>
              <ShieldAlert className="h-3.5 w-3.5" />
              Restricted access
            </>
          ) : (
            <>
              <ShieldCheck className="h-3.5 w-3.5" />
              Secure authentication
            </>
          )}
        </div>

        <h1 className="text-4xl font-black tracking-[-0.04em] text-slate-950">
          {adminMode ? "Security starts here." : "Welcome back."}
        </h1>

        <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
          {adminMode
            ? "Authenticate to access the Academic Security Operations Center."
            : "Sign in to securely transfer, receive and monitor academic documents."}
        </p>
      </motion.div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08 }}
        onSubmit={handleSubmit}
        className="mt-8 space-y-5"
      >
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">
            {adminMode ? "Administrator email" : "Email address"}
          </label>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />

            <input
              name="email"
              type="email"
              placeholder={
                adminMode
                  ? "admin@securetransfer.local"
                  : "you@example.com"
              }
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
              className="input-base w-full !pl-11"
            />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Password
            </label>
          </div>

          <div className="relative">
            <LockKeyhole className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />

            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
              className="input-base w-full !pl-11 !pr-12"
            />

            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={
                showPassword ? "Hide password" : "Show password"
              }
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              {showPassword ? (
                <EyeOff className="h-[18px] w-[18px]" />
              ) : (
                <Eye className="h-[18px] w-[18px]" />
              )}
            </button>
          </div>
        </div>

        {adminMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4"
          >
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />

            <div>
              <p className="text-xs font-bold text-red-800">
                Administrator access
              </p>
              <p className="mt-1 text-[11px] leading-5 text-red-700/70">
                This mode is restricted to accounts with administrator
                privileges.
              </p>
            </div>
          </motion.div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={
            adminMode
              ? "flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
              : "flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-xl shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          }
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Authenticating...
            </>
          ) : (
            <>
              {adminMode ? (
                <ShieldCheck className="h-4 w-4" />
              ) : (
                <LogIn className="h-4 w-4" />
              )}

              {adminMode ? "Access security center" : "Sign in"}
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </motion.form>

      {/* Security indicators */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="mt-7 grid grid-cols-3 gap-2"
      >
        {[
          {
            icon: LockKeyhole,
            label: "Encrypted",
          },
          {
            icon: FileCheck2,
            label: "Integrity",
          },
          {
            icon: Radar,
            label: "Monitored",
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="flex flex-col items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 py-3"
            >
              <Icon className="h-4 w-4 text-blue-600" />
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                {item.label}
              </span>
            </div>
          );
        })}
      </motion.div>

      {/* Mode switch */}
      <div className="mt-7 border-t border-slate-100 pt-6 text-center">
        <button
          type="button"
          onClick={switchMode}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-blue-600"
        >
          <ShieldCheck className="h-4 w-4" />

          {adminMode
            ? "Return to user login"
            : "Login as administrator"}
        </button>
      </div>

      {!adminMode && (
        <p className="mt-5 text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link
            href="/auth/register"
            className="font-bold text-blue-600 transition hover:text-blue-700"
          >
            Create one
          </Link>
        </p>
      )}
    </div>
  );
}
