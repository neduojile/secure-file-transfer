"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import {
  ShieldCheck,
  Lock,
  FileCheck,
  ArrowRight,
  Cpu,
  Wifi,
  Server,
} from "lucide-react";



export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#020617] text-white">

      {/* ========================= */}
      {/* Animated Background */}
      {/* ========================= */}

      <div className="absolute inset-0 overflow-hidden">

        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,.05)_1px,transparent_1px)] bg-[size:45px_45px]" />

        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -left-40 top-20 h-[600px] w-[600px] rounded-full border border-cyan-500/10"
        />

        <motion.div
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 55,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute right-[-220px] bottom-[-120px] h-[700px] w-[700px] rounded-full border border-cyan-500/10"
        />

        <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-b from-transparent via-slate-950/30 to-slate-950" />

      </div>

      {/* ========================= */}
      {/* Navbar */}
      {/* ========================= */}

      <header className="fixed top-0 z-50 w-full border-b border-cyan-500/10 bg-slate-950/60 backdrop-blur-xl">

        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

          <motion.div
            initial={{
              opacity: 0,
              x: -40,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            className="flex items-center gap-4"
          >

            <motion.div
              animate={{
                rotate: 360,
                boxShadow: [
                  "0 0 10px cyan",
                  "0 0 25px cyan",
                  "0 0 10px cyan",
                ],
              }}
              transition={{
                rotate: {
                  repeat: Infinity,
                  duration: 18,
                  ease: "linear",
                },
                boxShadow: {
                  repeat: Infinity,
                  duration: 2,
                },
              }}
              className="rounded-xl bg-cyan-500/10 p-3"
            >
              <ShieldCheck
                size={30}
                className="text-cyan-400"
              />
            </motion.div>

            <div>

              <h1 className="text-xl font-bold">
                Secure File Transfer
              </h1>

              <p className="text-xs text-cyan-300">
                Military Grade Encryption
              </p>

            </div>

          </motion.div>

          <div className="flex gap-4">

            <Link
              href="/auth/login"
              className="rounded-xl border border-cyan-500/30 px-6 py-3 transition hover:bg-cyan-500/10"
            >
              Login
            </Link>

            <Link
              href="/auth/register"
              className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Get Started
            </Link>

          </div>

        </div>

      </header>

      {/* ========================= */}
      {/* HERO */}
      {/* ========================= */}

      <section className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6 pt-24">

        <div className="grid w-full items-center gap-20 lg:grid-cols-2">

          {/* LEFT SIDE */}

        

            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-5 py-2 text-cyan-300">

              <ShieldCheck size={18} />

              Secure Transmission Platform

            </div>

            <TypeAnimation
              sequence={[
                "Secure File Transfer System",
                2000,
                "AES-256 Encryption",
                2000,
                "SHA-256 Integrity Verification",
                2000,
                "Attack Detection & Recovery",
                2000,
              ]}
              wrapper="h1"
              speed={45}
              repeat={Infinity}
              className="text-5xl font-extrabold leading-tight md:text-7xl"
            />

            <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300">

              Protect confidential documents using
              end-to-end encryption, integrity
              verification, real-time packet monitoring
              and attack detection built with modern
              cybersecurity principles.

            </p>

            <div className="mt-10 flex flex-wrap gap-5">

              <Link
                href="/auth/register"
                className="group inline-flex items-center rounded-xl bg-cyan-500 px-8 py-4 font-bold text-slate-950 transition hover:bg-cyan-400"
              >
                Get Started

                <ArrowRight className="ml-3 transition group-hover:translate-x-2" />

              </Link>

              <Link
                href="/auth/login"
                className="rounded-xl border border-cyan-500/30 px-8 py-4 hover:bg-cyan-500/10"
              >
                Sign In
              </Link>

            </div>

                      {/* RIGHT SIDE */}

          <motion.div
            initial={{
              opacity: 0,
              x: 80,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 1,
            }}
            className="relative flex items-center justify-center"
          >

            {/* Glow */}

            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.25, 0.55, 0.25],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
              className="absolute h-[520px] w-[520px] rounded-full bg-cyan-500 blur-[120px]"
            />

            {/* Radar Sweep */}

            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute h-[460px] w-[460px] rounded-full"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0deg, rgba(34,211,238,.8) 55deg, transparent 90deg)",
              }}
            />

            {/* Rings */}

            {[460, 360, 260, 160].map((size) => (
              <div
                key={size}
                className="absolute rounded-full border border-cyan-500/20"
                style={{
                  width: size,
                  height: size,
                }}
              />
            ))}

            {/* Crosshair */}

            <div className="absolute h-[460px] w-px bg-cyan-500/20" />
            <div className="absolute h-px w-[460px] bg-cyan-500/20" />

            {/* Center */}

            <motion.div
              animate={{
                scale: [1, 1.08, 1],
                rotate: [0, 4, -4, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
              className="z-20 rounded-full border border-cyan-500/30 bg-slate-900 p-10 shadow-[0_0_50px_rgba(34,211,238,.5)]"
            >
              <ShieldCheck
                size={80}
                className="text-cyan-400"
              />
            </motion.div>

            {/* Orbit */}

            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute h-[360px] w-[360px]"
            >

              <div className="absolute left-1/2 -top-5 -translate-x-1/2 rounded-full border border-cyan-500/30 bg-slate-900 p-3">
                <Lock className="text-cyan-400" />
              </div>

              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full border border-cyan-500/30 bg-slate-900 p-3">
                <FileCheck className="text-cyan-400" />
              </div>

              <div className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full border border-cyan-500/30 bg-slate-900 p-3">
                <Wifi className="text-cyan-400" />
              </div>

              <div className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full border border-cyan-500/30 bg-slate-900 p-3">
                <Server className="text-cyan-400" />
              </div>

            </motion.div>

            {/* Status */}

            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
              className="absolute bottom-6 rounded-xl border border-cyan-500/20 bg-slate-900/80 px-6 py-4 backdrop-blur-xl"
            >

              <div className="flex items-center gap-3">

                <div className="h-3 w-3 rounded-full bg-green-400 shadow-[0_0_15px_lime]" />

                <span className="text-sm text-cyan-300">
                  Secure Channel Active
                </span>

              </div>

              <div className="mt-3 space-y-2 text-sm">

                <div className="flex justify-between gap-8">
                  <span className="text-slate-400">
                    Encryption
                  </span>

                  <span className="font-semibold text-cyan-400">
                    AES-256
                  </span>
                </div>

                <div className="flex justify-between gap-8">
                  <span className="text-slate-400">
                    Integrity
                  </span>

                  <span className="font-semibold text-cyan-400">
                    SHA-256
                  </span>
                </div>

                <div className="flex justify-between gap-8">
                  <span className="text-slate-400">
                    Status
                  </span>

                  <span className="font-semibold text-green-400">
                    Protected
                  </span>
                </div>

              </div>

            </motion.div>

          </motion.div>

        </div>

      </section>

      {/* ========================= */}
      {/* FEATURES */}
      {/* ========================= */}

      <section className="mx-auto max-w-7xl px-6 py-24">

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center text-4xl font-bold"
        >
          Enterprise Security Features
        </motion.h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {[
            {
              icon: <Lock className="h-10 w-10 text-cyan-400" />,
              title: "AES-256 Encryption",
              desc: "Military-grade encryption protects files before transmission.",
            },
            {
              icon: <FileCheck className="h-10 w-10 text-cyan-400" />,
              title: "Integrity Verification",
              desc: "SHA-256 hashing detects any unauthorized modification.",
            },
            {
              icon: <ShieldCheck className="h-10 w-10 text-cyan-400" />,
              title: "Attack Detection",
              desc: "Continuously monitors packets during transfer.",
            },
            {
              icon: <Cpu className="h-10 w-10 text-cyan-400" />,
              title: "Real-Time Monitoring",
              desc: "Observe every transfer from sender to receiver instantly.",
            },
          ].map((feature) => (
            <motion.div
              key={feature.title}
              whileHover={{
                scale: 1.05,
                y: -8,
              }}
              className="rounded-3xl border border-cyan-500/20 bg-slate-900/60 p-8 backdrop-blur-xl"
            >
              {feature.icon}

              <h3 className="mt-6 text-xl font-bold">
                {feature.title}
              </h3>

              <p className="mt-4 leading-7 text-slate-400">
                {feature.desc}
              </p>
            </motion.div>
          ))}

        </div>

      </section>

      {/* ========================= */}
      {/* WORKFLOW */}
      {/* ========================= */}

      <section className="mx-auto max-w-7xl px-6 py-24">

        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-20 text-center text-4xl font-bold"
        >
          Secure Transfer Workflow
        </motion.h2>

        <div className="grid gap-10 md:grid-cols-5">

          {[
            "Upload",
            "Encrypt",
            "Transfer",
            "Verify",
            "Download",
          ].map((step, index) => (
            <motion.div
              key={step}
              whileHover={{
                scale: 1.08,
              }}
              className="rounded-2xl border border-cyan-500/20 bg-slate-900/60 p-8 text-center backdrop-blur"
            >

              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500 font-bold text-slate-950">

                {index + 1}

              </div>

              <h3 className="text-xl font-bold">
                {step}
              </h3>

            </motion.div>
          ))}

        </div>

      </section>

      {/* ========================= */}
      {/* STATS */}
      {/* ========================= */}

      <section className="mx-auto max-w-7xl px-6 py-24">

        <div className="grid gap-8 md:grid-cols-4">

          {[
            ["AES-256", "Encryption"],
            ["SHA-256", "Integrity"],
            ["24/7", "Monitoring"],
            ["100%", "Protection"],
          ].map(([value, label]) => (

            <motion.div
              key={label}
              whileHover={{
                scale: 1.05,
              }}
              className="rounded-3xl border border-cyan-500/20 bg-slate-900/60 p-10 text-center backdrop-blur-xl"
            >

              <h3 className="text-5xl font-black text-cyan-400">
                {value}
              </h3>

              <p className="mt-4 text-slate-400">
                {label}
              </p>

            </motion.div>

          ))}

        </div>

      </section>

      {/* ========================= */}
      {/* CTA */}
      {/* ========================= */}

      <section className="mx-auto max-w-5xl px-6 py-24">

        <motion.div
          whileHover={{
            scale: 1.02,
          }}
          className="rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 to-slate-900 p-14 text-center"
        >

          <h2 className="text-5xl font-bold">
            Ready to Secure Your Files?
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
            Experience encrypted file sharing with
            integrity verification and real-time
            monitoring.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-5">

            <Link
              href="/auth/register"
              className="rounded-xl bg-cyan-500 px-10 py-4 font-bold text-slate-950 transition hover:bg-cyan-400"
            >
              Create Account
            </Link>

            <Link
              href="/auth/login"
              className="rounded-xl border border-cyan-500/30 px-10 py-4 hover:bg-cyan-500/10"
            >
              Login
            </Link>

          </div>

        </motion.div>

      </section>

      {/* ========================= */}
      {/* FOOTER */}
      {/* ========================= */}

      <footer className="border-t border-cyan-500/10 py-10 text-center">

        <h2 className="text-xl font-bold">
          Secure File Transfer System
        </h2>

        <p className="mt-3 text-slate-400">
          Final Year Project • Computer Science with Statistics
        </p>

        <p className="mt-2 text-slate-500">
          Built with Next.js • Prisma • PostgreSQL • AES-256 • SHA-256
        </p>

      </footer>

    </main>
  );
}
