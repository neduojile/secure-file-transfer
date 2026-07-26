"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Send,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from "lucide-react";

interface Props {
  transferId: string;
}

export default function ForwardPacketButton({
  transferId,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function forwardPacket() {
    if (loading) return;

    setLoading(true);

    const loadingToast = toast.loading(
      "Forwarding Packet...",
      {
        description:
          "Securely delivering the packet to the intended receiver.",
      }
    );

    try {
      const res = await fetch("/api/attacker/forward", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transferId,
        }),
      });

      const result = await res.json();

      toast.dismiss(loadingToast);

      if (!res.ok) {
        toast.error("Forward Failed", {
          description:
            result.error ??
            "Unable to forward the packet.",
          icon: (
            <AlertTriangle className="h-5 w-5" />
          ),
        });

        return;
      }

      toast.success("Packet Delivered", {
        description:
          "The packet has been securely forwarded to the receiver.",
        icon: (
          <CheckCircle2 className="h-5 w-5" />
        ),
      });

      // Give users enough time to see the success notification
      setTimeout(() => {
        router.refresh();
      }, 2200);
    } catch {
      toast.dismiss(loadingToast);

      toast.error("Network Error", {
        description:
          "Something went wrong while forwarding the packet.",
        icon: (
          <AlertTriangle className="h-5 w-5" />
        ),
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8 rounded-2xl border border-green-700/60 bg-gradient-to-br from-green-950 to-slate-900 p-6 shadow-xl shadow-green-900/20">
      <h2 className="text-xl font-bold text-green-400">
        Forward Packet
      </h2>

      <p className="mt-2 text-sm text-slate-300">
        Securely send this packet to the intended receiver.
      </p>

      <button
        onClick={forwardPacket}
        disabled={loading}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-green-500 hover:shadow-lg hover:shadow-green-500/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Forwarding...
          </>
        ) : (
          <>
            <Send className="h-5 w-5" />
            Forward Packet
          </>
        )}
      </button>
    </div>
  );
}