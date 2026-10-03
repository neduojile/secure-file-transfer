"use client";

import { useState } from "react";
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
  Mail,
  ShieldCheck,
  UserPlus,
  UserRound,
  XCircle,
} from "lucide-react";

export default function RegisterForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    const loadingToast = toast.loading("Creating your account...", {
      description: "Please wait while we set everything up.",
    });

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      toast.dismiss(loadingToast);

      if (!res.ok) {
        toast.error("Registration Failed", {
          description:
            data.message || "Unable to create your account.",
          icon: <XCircle className="h-5 w-5" />,
        });

        return;
      }

      toast.success("Account Created", {
        description: "Your account has been created successfully.",
        icon: <CheckCircle2 className="h-5 w-5" />,
      });

      setTimeout(() => {
        router.push("/auth/login");
      }, 1200);
    } catch (err) {
      console.error(err);

      toast.dismiss(loadingToast);

      toast.error("Unexpected Error", {
        description:
          "Something went wrong. Please try again.",
        icon: <XCircle className="h-5 w-5" />,
      });
    } finally {
      setLoading(false);
    }
  };

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
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-blue-700">
          <UserPlus className="h-3.5 w-3.5" />
          Create secure account
        </div>

        <h1 className="text-4xl font-black tracking-[-0.04em] text-slate-950">
          Your secure workspace starts here.
        </h1>

        <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
          Create an account to securely transfer, receive and verify
          academic documents.
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
            Full name
          </label>

          <div className="relative">
            <UserRound className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />

            <input
              name="fullName"
              type="text"
              required
              placeholder="Enter your full name"
              value={form.fullName}
              onChange={handleChange}
              autoComplete="name"
              className="input-base w-full !pl-11"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">
            Email address
          </label>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />

            <input
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              className="input-base w-full !pl-11"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">
            Password
          </label>

          <div className="relative">
            <LockKeyhole className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />

            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
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

        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <ShieldCheck className="h-4 w-4" />
            </div>

            <div>
              <p className="text-xs font-bold text-slate-800">
                Your account is protected
              </p>

              <p className="mt-1 text-[11px] leading-5 text-slate-500">
                SATIM uses authenticated access controls for academic
                document transfers and security monitoring.
              </p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-xl shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Creating account...
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" />
              Create secure account
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
        className="mt-7 grid grid-cols-2 gap-2 sm:grid-cols-3"
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
            icon: ShieldCheck,
            label: "Protected",
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-100 bg-white py-3 sm:flex-col sm:gap-1.5"
            >
              <Icon className="h-4 w-4 text-blue-600" />
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                {item.label}
              </span>
            </div>
          );
        })}
      </motion.div>

      {/* Login */}
      <p className="mt-7 border-t border-slate-100 pt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="font-bold text-blue-600 transition hover:text-blue-700"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
