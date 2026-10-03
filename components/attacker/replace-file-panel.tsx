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
}

export default function ReplaceFilePanel({
  transferId,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function uploadReplacement() {
    if (!file) {
      toast.warning("No replacement file selected", {
        description:
          "Choose the document you want the MITM simulation to inject.",
      });
      return;
    }

    setLoading(true);

    const loadingToast = toast.loading(
      "Simulating document modification...",
      {
        description:
          "Replacing the intercepted academic document and forwarding it to the receiver.",
      }
    );

    try {
      const formData = new FormData();

      formData.append("transferId", transferId);
      formData.append("file", file);

      const response = await fetch(
        "/api/attacker/replace",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      toast.dismiss(loadingToast);

      if (!response.ok || !result.success) {
        toast.error("Modification Failed", {
          description:
            result.error ||
            "Unable to modify the intercepted document.",
          icon: (
            <AlertTriangle className="h-5 w-5" />
          ),
        });

        return;
      }

      if (result.integrity === "COMPROMISED") {
        toast.error("Integrity Compromised", {
          description:
            "Replacement was forwarded, but SHA-256 verification detected a mismatch.",
          icon: (
            <AlertTriangle className="h-5 w-5" />
          ),
        });
      } else {
        toast.success("Replace & Forward Complete", {
          description:
            "The document was forwarded and integrity verification passed.",
          icon: (
            <CheckCircle2 className="h-5 w-5" />
          ),
        });
      }

      setFile(null);

      const input = document.getElementById(
        "replacementFile"
      ) as HTMLInputElement | null;

      if (input) {
        input.value = "";
      }
    } catch (error) {
      console.error(error);

      toast.dismiss(loadingToast);

      toast.error("Unexpected Error", {
        description:
          "Unable to complete the modification simulation.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <h2 className="text-2xl font-semibold text-yellow-400">
        MITM File Modification
      </h2>

      <p className="mt-2 text-zinc-400">
        Replace the intercepted document, forward it to the
        receiver, and test whether SHA-256 detects the change.
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
          ? "Simulating Attack..."
          : "Replace & Forward"}
      </button>
    </div>
  );
}
