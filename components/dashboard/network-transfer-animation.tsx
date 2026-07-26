"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Lock,
  Radio,
  Send,
  Server,
  ShieldCheck,
  User,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type TransferStage =
  | "preparing"
  | "encrypting"
  | "connecting"
  | "sending"
  | "transit"
  | "delivered";

interface NetworkTransferAnimationProps {
  isRunning: boolean;
  encrypted: boolean;
  onComplete?: () => void;
}

const STAGES: {
  stage: TransferStage;
  title: string;
  description: string;
  duration: number;
}[] = [
  {
    stage: "preparing",
    title: "Preparing Transfer",
    description: "Initializing secure upload...",
    duration: 900,
  },
  {
    stage: "encrypting",
    title: "AES-256 Encryption",
    description: "Encrypting file contents...",
    duration: 1500,
  },
  {
    stage: "connecting",
    title: "Connecting",
    description: "Establishing secure network channel...",
    duration: 1200,
  },
  {
    stage: "sending",
    title: "Sending Packet",
    description: "Uploading encrypted packet...",
    duration: 1800,
  },
  {
    stage: "transit",
    title: "Packet In Transit",
    description: "Travelling across secure network...",
    duration: 1800,
  },
  {
    stage: "delivered",
    title: "Transfer Complete",
    description: "Receiver acknowledged delivery.",
    duration: 1200,
  },
];

export default function NetworkTransferAnimation({
  isRunning,
  encrypted,
  onComplete,
}: NetworkTransferAnimationProps) {
  const [currentStage, setCurrentStage] =
    useState<TransferStage>("preparing");

  const [progress, setProgress] = useState(0);

  const stageIndex = useMemo(
    () =>
      STAGES.findIndex(
        (item) => item.stage === currentStage
      ),
    [currentStage]
  );

  useEffect(() => {
    if (!isRunning) {
      setCurrentStage("preparing");
      setProgress(0);
      return;
    }

    let cancelled = false;

    async function runTransfer() {
      for (let i = 0; i < STAGES.length; i++) {
        if (cancelled) return;

        setCurrentStage(STAGES[i].stage);

        setProgress(
          Math.round(((i + 1) / STAGES.length) * 100)
        );

        await new Promise((resolve) =>
          setTimeout(resolve, STAGES[i].duration)
        );
      }

      if (!cancelled) {
        onComplete?.();
      }
    }

    runTransfer();

    return () => {
      cancelled = true;
    };
  }, [isRunning, encrypted, onComplete]);

  const stage = STAGES[stageIndex];
    return (
    <AnimatePresence>
      {isRunning && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-8 overflow-hidden rounded-3xl border border-indigo-500/20 bg-slate-900"
        >
          {/* Header */}

          <div className="border-b border-slate-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-100">
                  Live Secure Transfer
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  {stage.description}
                </p>
              </div>

              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                }}
                className="rounded-full bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-400"
              >
                ● LIVE
              </motion.div>
            </div>

            {/* Progress */}

            <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-800">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400"
                animate={{
                  width: `${progress}%`,
                }}
                transition={{
                  duration: 0.8,
                }}
              />
            </div>

            <div className="mt-2 flex justify-between text-xs text-slate-500">
              <span>{stage.title}</span>
              <span>{progress}%</span>
            </div>
          </div>

          {/* Network */}

          <div className="relative p-10">
            <div className="grid grid-cols-3 items-center gap-10">

              {/* Sender */}

              <div className="flex flex-col items-center">
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 0px #000",
                      "0 0 25px rgb(99 102 241)",
                      "0 0 0px #000",
                    ],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                  }}
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-600"
                >
                  <User className="h-10 w-10 text-white" />
                </motion.div>

                <p className="mt-4 font-semibold text-slate-100">
                  Sender
                </p>

                <p className="text-xs text-slate-500">
                  Uploading File
                </p>
              </div>

              {/* Network */}

              <div className="relative flex flex-col items-center">

                <motion.div
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 12,
                    ease: "linear",
                  }}
                  className="absolute h-40 w-40 rounded-full border border-cyan-500/20"
                />

                <motion.div
                  animate={{
                    rotate: -360,
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 8,
                    ease: "linear",
                  }}
                  className="absolute h-28 w-28 rounded-full border border-cyan-400/20"
                />

                <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full bg-cyan-500/15">
                  <Server className="h-10 w-10 text-cyan-400" />
                </div>

                <p className="mt-5 font-semibold text-slate-100">
                  Secure Network
                </p>

                <p className="text-xs text-slate-500">
                  AES Tunnel
                </p>
              </div>

              {/* Receiver */}

              <div className="flex flex-col items-center">
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 0px #000",
                      "0 0 25px rgb(16 185 129)",
                      "0 0 0px #000",
                    ],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                  }}
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-600"
                >
                  <ShieldCheck className="h-10 w-10 text-white" />
                </motion.div>

                <p className="mt-4 font-semibold text-slate-100">
                  Receiver
                </p>

                <p className="text-xs text-slate-500">
                  Awaiting Packet
                </p>
              </div>

            </div>

            {/* Connection Line */}

            <div className="absolute left-[18%] right-[18%] top-1/2 -translate-y-1/2">

              <div className="relative h-1 rounded-full bg-slate-700">

                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400"
                  animate={{
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1,
                  }}
                />

                <motion.div
                  animate={{
                    x: ["0%", "100%"],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "linear",
                  }}
                  className="absolute -top-4"
                >
                  <Send className="h-8 w-8 text-cyan-300" />
                </motion.div>

              </div>

            </div>

                        {/* Status */}

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              <motion.div
                animate={{
                  y: [0, -4, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                }}
                className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
              >
                <div className="mb-3 flex items-center gap-2">
                  <Lock className="h-5 w-5 text-emerald-400" />

                  <span className="font-semibold text-slate-100">
                    Encryption
                  </span>
                </div>

                <p className="text-sm text-slate-400">
                  {encrypted
                    ? "AES-256 Encryption Enabled"
                    : "Sending Plain Text"}
                </p>
              </motion.div>

              <motion.div
                animate={{
                  y: [0, -4, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  delay: 0.25,
                }}
                className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
              >
                <div className="mb-3 flex items-center gap-2">
                  <Radio className="h-5 w-5 text-cyan-400" />

                  <span className="font-semibold text-slate-100">
                    Network
                  </span>
                </div>

                <p className="text-sm text-slate-400">
                  Secure transmission channel established.
                </p>
              </motion.div>

              <motion.div
                animate={{
                  y: [0, -4, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  delay: 0.5,
                }}
                className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
              >
                <div className="mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />

                  <span className="font-semibold text-slate-100">
                    Transfer Status
                  </span>
                </div>

                <p className="text-sm text-slate-400">
                  {stage.title}
                </p>
              </motion.div>
            </div>

            {/* Terminal */}

            <div className="mt-10 overflow-hidden rounded-2xl border border-slate-800 bg-black">
              <div className="border-b border-slate-800 px-5 py-3">
                <p className="font-mono text-sm text-emerald-400">
                  transfer.log
                </p>
              </div>

              <div className="space-y-2 p-5 font-mono text-sm">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-slate-400"
                >
                  &gt; Initializing secure transfer...
                </motion.p>

                {stageIndex >= 1 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-emerald-400"
                  >
                    &gt; AES-256 encryption completed.
                  </motion.p>
                )}

                {stageIndex >= 2 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-cyan-400"
                  >
                    &gt; Secure connection established.
                  </motion.p>
                )}

                {stageIndex >= 3 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-indigo-400"
                  >
                    &gt; Packet transmitted successfully.
                  </motion.p>
                )}

                {stageIndex >= 4 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-amber-400"
                  >
                    &gt; Packet travelling across the network...
                  </motion.p>
                )}

                {stageIndex >= 5 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-semibold text-emerald-400"
                  >
                    &gt; Transfer completed successfully.
                  </motion.p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}