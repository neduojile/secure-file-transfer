"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  CheckCircle2,
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);

    const loadingToast = toast.loading(
      "Creating your account...",
      {
        description: "Please wait while we set everything up.",
      }
    );

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
            data.message ||
            "Unable to create your account.",
          icon: <XCircle className="h-5 w-5" />,
        });

        return;
      }

      toast.success("Account Created", {
        description:
          "Your account has been created successfully.",
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
    <div className="card-base p-8">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
          <UserPlus className="h-8 w-8" />
        </div>

        <h1 className="text-3xl font-bold text-slate-100">
          Create Account
        </h1>

        <p className="mt-2 text-slate-400">
          Create your Secure Transfer account.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Full Name
          </label>

          <div className="relative">
            <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

            <input
              name="fullName"
              type="text"
              required
              placeholder="Enter your full name"
              value={form.fullName}
              onChange={handleChange}
              className="input-base w-full pl-11"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Email Address
          </label>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

            <input
              name="email"
              type="email"
              required
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              className="input-base w-full pl-11"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Password
          </label>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
              className="input-base w-full pl-11 pr-12"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-300"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex h-12 w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <UserPlus className="h-5 w-5" />

          {loading
            ? "Creating Account..."
            : "Create Account"}
        </button>
      </form>

      <div className="mt-8 border-t border-slate-800 pt-6 text-center">
        <p className="text-sm text-slate-400">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-semibold text-indigo-400 transition hover:text-indigo-300"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}