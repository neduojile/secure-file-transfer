"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  LockKeyhole,
  Radar,
  ScanSearch,
  ShieldAlert,
  ShieldCheck,
  Upload,
  UserRound,
  Waypoints,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: LockKeyhole,
    title: "AES Encryption",
    description:
      "Academic documents are protected before they enter the transfer channel.",
    tone: "blue",
  },
  {
    icon: FileCheck2,
    title: "SHA-256 Integrity",
    description:
      "Original and received document hashes are compared to expose tampering.",
    tone: "blue",
  },
  {
    icon: ShieldAlert,
    title: "MITM Simulation",
    description:
      "A controlled interception layer demonstrates how an attacker can alter traffic.",
    tone: "red",
  },
  {
    icon: Radar,
    title: "Security Monitoring",
    description:
      "Transfer events, attacks and verification results are recorded for review.",
    tone: "black",
  },
];

const workflow = [
  {
    number: "01",
    icon: Upload,
    title: "Upload",
    description: "A staff member selects an academic document and authorized receiver.",
  },
  {
    number: "02",
    icon: LockKeyhole,
    title: "Encrypt",
    description: "The document is protected before transmission through the channel.",
  },
  {
    number: "03",
    icon: Waypoints,
    title: "Transmit",
    description: "The protected document moves through the simulated network.",
  },
  {
    number: "04",
    icon: ScanSearch,
    title: "Inspect",
    description: "The MITM simulation can forward, modify or interrupt the transfer.",
  },
  {
    number: "05",
    icon: FileCheck2,
    title: "Verify",
    description: "SHA-256 comparison determines whether the received document changed.",
  },
];

const useCases = [
  "Examination question papers",
  "Student results and records",
  "Project and research documents",
  "Departmental confidential files",
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-950">
      {/* Navigation */}
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
        <nav className="glass-nav mx-auto flex h-16 max-w-7xl items-center justify-between rounded-2xl px-4 shadow-sm sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <div className="leading-none">
              <p className="text-sm font-black tracking-[0.18em] text-slate-950">
                SATIM
              </p>
              <p className="mt-1 hidden text-[9px] font-medium uppercase tracking-[0.18em] text-slate-400 sm:block">
                Academic Security
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#security"
              className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
            >
              Security
            </a>
            <a
              href="#workflow"
              className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
            >
              How It Works
            </a>
            <a
              href="#use-cases"
              className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
            >
              Use Cases
            </a>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/auth/login"
              className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:block"
            >
              Sign in
            </Link>

            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 hover:bg-blue-600"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="security-grid relative isolate px-4 pb-20 pt-36 sm:px-6 lg:pb-28 lg:pt-44">
        <div className="absolute inset-x-0 top-0 -z-10 h-[600px] bg-[radial-gradient(circle_at_65%_35%,rgba(37,99,235,0.14),transparent_35%),radial-gradient(circle_at_20%_10%,rgba(15,23,42,0.06),transparent_28%)]" />

        <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.02fr_0.98fr] lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-600/15 bg-blue-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-blue-700">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600" />
              </span>
              Secure academic infrastructure
            </div>

            <h1 className="max-w-4xl text-5xl font-black tracking-[-0.045em] text-slate-950 sm:text-6xl lg:text-7xl">
              Transfer academic documents with{" "}
              <span className="text-blue-600">security you can verify.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-slate-500 sm:text-lg">
              SATIM protects sensitive academic documents with encryption,
              integrity verification, controlled MITM attack simulation and
              security monitoring — all inside one academic security platform.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/auth/register"
                className="group inline-flex items-center justify-center gap-3 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Start secure transfer
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>

              <a
                href="#workflow"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
              >
                Explore how it works
              </a>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-slate-500">
              {[
                "AES protected",
                "SHA-256 verified",
                "MITM monitored",
                "Audit logged",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Security visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -inset-10 rounded-[3rem] bg-blue-500/10 blur-3xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.13)]">
              {/* window header */}
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                </div>

                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                  Live security channel
                </div>
              </div>

              <div className="p-5 sm:p-7">
                <div className="mb-7 flex items-end justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                      Transfer monitor
                    </p>
                    <h2 className="mt-2 text-xl font-black tracking-tight">
                      Document #ST-2841
                    </h2>
                  </div>

                  <span className="status-success">
                    <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-blue-600" />
                    Protected
                  </span>
                </div>

                {/* Pipeline */}
                <div className="relative">
                  <div className="absolute left-[12%] right-[12%] top-7 hidden h-px bg-slate-200 sm:block" />

                  <div className="grid grid-cols-2 gap-5 sm:grid-cols-5">
                    {[
                      {
                        icon: UserRound,
                        label: "Sender",
                        sub: "Staff",
                        type: "normal",
                      },
                      {
                        icon: LockKeyhole,
                        label: "Encrypt",
                        sub: "AES-256",
                        type: "normal",
                      },
                      {
                        icon: Waypoints,
                        label: "Transmit",
                        sub: "In transit",
                        type: "normal",
                      },
                      {
                        icon: ShieldAlert,
                        label: "MITM",
                        sub: "Monitored",
                        type: "danger",
                      },
                      {
                        icon: FileCheck2,
                        label: "Verify",
                        sub: "SHA-256",
                        type: "normal",
                      },
                    ].map((node, index) => {
                      const Icon = node.icon;

                      return (
                        <motion.div
                          key={node.label}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + index * 0.12 }}
                          className="relative z-10 flex flex-col items-center text-center"
                        >
                          <div
                            className={
                              node.type === "danger"
                                ? "flex h-14 w-14 items-center justify-center rounded-2xl border border-red-200 bg-red-50 text-red-600 shadow-sm"
                                : "flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600 shadow-sm"
                            }
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <p className="mt-3 text-xs font-bold text-slate-900">
                            {node.label}
                          </p>
                          <p className="mt-1 text-[10px] text-slate-400">
                            {node.sub}
                          </p>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Telemetry */}
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {[
                    ["Encryption", "AES-256"],
                    ["Integrity", "SHA-256"],
                    ["Detection", "ACTIVE"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                    >
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {label}
                      </p>
                      <p className="mt-2 text-sm font-black text-slate-900">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Event */}
                <div className="mt-3 flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-red-600 shadow-sm">
                    <ShieldAlert className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-red-800">
                      MITM simulation layer active
                    </p>
                    <p className="mt-0.5 truncate text-[10px] text-red-600/70">
                      Traffic is being inspected before integrity verification.
                    </p>
                  </div>
                  <div className="ml-auto h-2 w-2 shrink-0 animate-pulse rounded-full bg-red-500" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Security strip */}
      <section className="border-y border-slate-100 bg-slate-950 px-4 py-5 text-white sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-3 text-center text-xs font-semibold sm:justify-between sm:text-left">
          <span className="text-slate-400">BUILT FOR ACADEMIC SECURITY</span>
          <span className="text-white">AES ENCRYPTION</span>
          <span className="text-white">SHA-256 INTEGRITY</span>
          <span className="text-red-400">MITM SIMULATION</span>
          <span className="text-white">SECURITY AUDIT TRAIL</span>
        </div>
      </section>

      {/* Security Features */}
      <section id="security" className="px-4 py-24 sm:px-6 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
              Security architecture
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-[-0.035em] text-slate-950 sm:text-5xl">
              Protection is not just encryption.
            </h2>

            <p className="mt-5 text-base leading-8 text-slate-500">
              SATIM combines confidentiality, integrity verification, controlled
              attack simulation and monitoring to demonstrate what happens when
              protected academic traffic is intercepted.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const danger = feature.tone === "red";
              const dark = feature.tone === "black";

              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ delay: index * 0.08 }}
                  whileHover={{ y: -6 }}
                  className={
                    dark
                      ? "premium-card-dark p-7"
                      : danger
                        ? "danger-card p-7"
                        : "security-card p-7"
                  }
                >
                  <div
                    className={
                      dark
                        ? "flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white"
                        : danger
                          ? "flex h-11 w-11 items-center justify-center rounded-xl bg-white text-red-600 shadow-sm"
                          : "flex h-11 w-11 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm"
                    }
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <p
                    className={
                      dark
                        ? "mt-8 text-[10px] font-bold uppercase tracking-[0.18em] text-white/40"
                        : danger
                          ? "mt-8 text-[10px] font-bold uppercase tracking-[0.18em] text-red-500"
                          : "mt-8 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600"
                    }
                  >
                    0{index + 1}
                  </p>

                  <h3
                    className={
                      dark
                        ? "mt-3 text-xl font-black text-white"
                        : "mt-3 text-xl font-black text-slate-950"
                    }
                  >
                    {feature.title}
                  </h3>

                  <p
                    className={
                      dark
                        ? "mt-3 text-sm leading-7 text-white/55"
                        : "mt-3 text-sm leading-7 text-slate-500"
                    }
                  >
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section
        id="workflow"
        className="security-grid border-y border-slate-100 bg-slate-50 px-4 py-24 sm:px-6 lg:py-32"
      >
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
              Transfer lifecycle
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-[-0.035em] text-slate-950 sm:text-5xl">
              From upload to verification.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-500">
              Every stage creates a security event so the system can demonstrate
              how confidentiality and integrity are maintained during transfer.
            </p>
          </div>

          <div className="mt-16 grid gap-4 lg:grid-cols-5">
            {workflow.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black tracking-widest text-blue-600">
                      {step.number}
                    </span>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>

                  <h3 className="mt-8 text-lg font-black">{step.title}</h3>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {step.description}
                  </p>

                  {index < workflow.length - 1 && (
                    <div className="absolute -right-3 top-1/2 z-20 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-blue-600 shadow-sm lg:flex">
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* MITM spotlight */}
      <section className="bg-slate-950 px-4 py-24 text-white sm:px-6 lg:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-red-400">
              Controlled attack simulation
            </p>

            <h2 className="mt-5 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
              What happens when the channel is compromised?
            </h2>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-400">
              Instead of only claiming that a transfer is secure, SATIM provides
              a controlled MITM simulation where intercepted traffic can be
              forwarded or modified and the resulting integrity state can be
              observed.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Original SHA-256 hash is recorded.",
                "Traffic passes through the simulation layer.",
                "The received document is hashed again.",
                "Hash mismatch exposes unauthorized modification.",
              ].map((item, index) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-xs font-bold text-red-400">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-6 text-slate-300">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-[2rem] bg-red-500/10 blur-3xl" />

            <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl sm:p-7">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
                    Attack simulation
                  </p>
                  <p className="mt-2 font-bold">Transfer inspection</p>
                </div>

                <span className="status-danger">INTERCEPTED</span>
              </div>

              <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <div className="flex-1 rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-[10px] uppercase tracking-wider text-white/40">
                    Original
                  </p>
                  <p className="mt-3 font-mono text-xs text-white/70">
                    SHA256
                  </p>
                  <p className="mt-2 truncate font-mono text-[10px] text-blue-300">
                    8f31...c91a
                  </p>
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center self-center rounded-full border border-red-500/30 bg-red-500/10 text-red-400">
                  <ShieldAlert className="h-4 w-4" />
                </div>

                <div className="flex-1 rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
                  <p className="text-[10px] uppercase tracking-wider text-red-400/70">
                    Received
                  </p>
                  <p className="mt-3 font-mono text-xs text-white/70">
                    SHA256
                  </p>
                  <p className="mt-2 truncate font-mono text-[10px] text-red-300">
                    b42d...7e10
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                <ShieldAlert className="h-4 w-4 text-red-400" />
                <span className="text-xs font-semibold text-red-300">
                  Integrity mismatch detected — document compromised
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section id="use-cases" className="px-4 py-24 sm:px-6 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
                Built for the institution
              </p>

              <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
                Sensitive academic information deserves visibility.
              </h2>

              <p className="mt-5 text-base leading-8 text-slate-500">
                SATIM provides a practical environment for demonstrating secure
                document exchange within an academic institution.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {useCases.map((item, index) => (
                <motion.div
                  key={item}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      0{index + 1}
                    </p>
                    <p className="mt-1 text-sm font-bold text-slate-900">
                      {item}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-20 sm:px-6 lg:pb-28">
        <motion.div
          whileHover={{ y: -3 }}
          className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-blue-600 px-6 py-14 text-white shadow-2xl shadow-blue-600/20 sm:px-10 lg:px-16 lg:py-20"
        >
          <div className="relative z-10 flex flex-col justify-between gap-10 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-100">
                Secure the transfer
              </p>

              <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
                Make document integrity visible.
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-blue-100 sm:text-base">
                Upload a document, select an authorized receiver and observe
                the complete security lifecycle.
              </p>
            </div>

            <Link
              href="/auth/register"
              className="group inline-flex shrink-0 items-center justify-center gap-3 rounded-xl bg-white px-6 py-4 text-sm font-black text-blue-700 shadow-xl transition hover:-translate-y-0.5 hover:bg-slate-50"
            >
              Create secure account
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 px-4 py-10 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 text-white">
              <ShieldCheck className="h-4 w-4" />
            </div>

            <div>
              <p className="text-sm font-black tracking-[0.14em]">SATIM</p>
              <p className="text-[10px] text-slate-400">
                Secure Academic Transfer & Integrity Monitoring
              </p>
            </div>
          </div>

          <div className="text-left text-xs text-slate-400 sm:text-right">
            <p>Computer Science with Statistics</p>
            <p className="mt-1">
              Next.js · Prisma · PostgreSQL · AES · SHA-256
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
