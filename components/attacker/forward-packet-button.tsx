"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  CheckCircle2,
  Forward,
  AlertTriangle,
} from "lucide-react";

interface Props {
  transferId: string;
  onSuccess?: () => void;
}

export default function ForwardPacketButton({
  transferId,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function forwardPacket() {
    setLoading(true);

    const loadingToast = toast.loading(
      "Forwarding packet...",
      {
        description:
          "Receiver will verify the document integrity.",
      }
    );

    try {
      const response = await fetch(
        "/api/attacker/forward",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transferId,
          }),
        }
      );

      const result = await response.json();

      toast.dismiss(loadingToast);

      if (!response.ok || !result.success) {
        toast.error("Forward Failed", {
          description:
            result.error ||
            "Unable to forward packet.",
          icon: (
            <AlertTriangle className="h-5 w-5" />
          ),
        });

        return;
      }

      toast.success("Packet Forwarded", {
        description:
          "SHA-256 verification passed and the document was delivered.",
        icon: (
          <CheckCircle2 className="h-5 w-5" />
        ),
      });

      onSuccess?.();
    } catch (error) {
      console.error(error);

      toast.dismiss(loadingToast);

      toast.error("Unexpected Error", {
        description:
          "Unable to forward packet.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      disabled={loading}
      onClick={forwardPacket}
      className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Forward className="h-5 w-5" />

      {loading
        ? "Forwarding..."
        : "Forward Packet"}
    </button>
  );
}
