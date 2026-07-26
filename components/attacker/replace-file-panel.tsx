"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Upload,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

interface Props {
  transferId: string;
  onReplacementSuccess?: () => void;
}

export default function ReplaceFilePanel({
  transferId,
  onReplacementSuccess,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function uploadReplacement() {
    if (!file) {
      toast.warning("No replacement file selected", {
        description: "Please choose a replacement file.",
      });
      return;
    }

    setLoading(true);

    const loadingToast = toast.loading(
      "Uploading replacement packet...",
      {
        description: "Replacing intercepted packet.",
      }
    );

    try {
      const formData = new FormData();

      formData.append("transferId", transferId);
      formData.append("file", file);

      const res = await fetch("/api/attacker/replace", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!result.success) {
        toast.dismiss(loadingToast);

        toast.error("Replacement Failed", {
          description: result.error,
          icon: <AlertTriangle className="h-5 w-5" />,
        });

        return;
      }

      toast.dismiss(loadingToast);

      toast.success("Packet Replaced", {
        description:
          "Modified packet is now undergoing integrity verification.",
        icon: <CheckCircle2 className="h-5 w-5" />,
      });

      setFile(null);

      const input = document.getElementById(
        "replacementFile"
      ) as HTMLInputElement;

      if (input) {
        input.value = "";
      }

      onReplacementSuccess?.();
    } catch {
      toast.dismiss(loadingToast);

      toast.error("Unexpected Error", {
        description:
          "Unable to upload the replacement file.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <h2 className="text-2xl font-semibold text-yellow-400">
        Replace File
      </h2>

      <p className="mt-2 text-zinc-400">
        Upload another file to replace the intercepted packet.
      </p>

      <input
        id="replacementFile"
        type="file"
        className="mt-6 block w-full rounded border border-zinc-700 bg-zinc-950 p-3"
        onChange={(e) =>
          setFile(e.target.files?.[0] ?? null)
        }
      />

      {file && (
        <div className="mt-4 rounded bg-zinc-950 p-4">
          <p>
            <strong>Name:</strong> {file.name}
          </p>

          <p>
            <strong>Size:</strong>{" "}
            {(file.size / 1024).toFixed(2)} KB
          </p>

          <p>
            <strong>Type:</strong>{" "}
            {file.type || "Unknown"}
          </p>
        </div>
      )}

      <button
        disabled={loading}
        onClick={uploadReplacement}
        className="mt-6 flex items-center justify-center gap-2 rounded bg-yellow-600 px-6 py-3 font-semibold transition hover:bg-yellow-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Upload className="h-5 w-5" />

        {loading
          ? "Uploading..."
          : "Upload Replacement"}
      </button>
    </div>
  );
}