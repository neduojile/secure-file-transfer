"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function LoginForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);

    const loadingToast = toast.loading("Signing you in...", {
      description: "Please wait while we verify your credentials.",
    });

    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (result?.error) {
      toast.dismiss(loadingToast);

      toast.error("Login Failed", {
        description: result.error,
        icon: <XCircle className="h-5 w-5" />,
      });

      setLoading(false);
      return;
    }

    const session = await getSession();

    toast.dismiss(loadingToast);

    toast.success("Login Successful", {
      description: "Welcome back to Secure Transfer.",
      icon: <CheckCircle2 className="h-5 w-5" />,
    });

    const role = session?.user?.role;

    switch (role) {
      case "USER":
        router.push("/dashboard");
        break;

      case "ADMIN":
        router.push("/admin/dashboard");
        break;

      case "ATTACKER":
        router.push("/attacker/dashboard");
        break;

      default:
        toast.error("Unknown User Role", {
          description:
            "Unable to determine your account permissions.",
          icon: <XCircle className="h-5 w-5" />,
        });

        setLoading(false);
        return;
    }

    router.refresh();
    setLoading(false);
  }

  return (
    <div className="card-base p-8">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
          <LogIn className="h-8 w-8" />
        </div>

        <h1 className="text-3xl font-bold text-slate-100">
          Welcome Back
        </h1>

        <p className="mt-2 text-slate-400">
          Sign in to continue to Secure Transfer.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Email Address
          </label>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
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
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
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
          <LogIn className="h-5 w-5" />

          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <div className="mt-8 border-t border-slate-800 pt-6 text-center">
        <p className="text-sm text-slate-400">
          Don't have an account?{" "}
          <Link
            href="/auth/register"
            className="font-semibold text-indigo-400 transition hover:text-indigo-300"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}