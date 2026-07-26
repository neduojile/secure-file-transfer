"use client";

import { useState } from "react";
import {
  Upload,
  Mail,
  ShieldCheck,
  FileText,
  Lock,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

import NetworkTransferAnimation from "@/components/dashboard/network-transfer-animation";

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [receiverEmail, setReceiverEmail] = useState("");
  const [encrypt, setEncrypt] = useState(true);

  const [loading, setLoading] = useState(false);

  // Animation state
  const [showAnimation, setShowAnimation] = useState(false);

  async function handleUpload() {
    if (!receiverEmail.trim()) {
   toast.warning("Receiver email required", {
  description: "Please enter the recipient's email address.",
});
      return;
    }

    if (!file) {
      toast.warning("File required", {
        description: "Please select a file to upload.",
      });
      return;
    }

    setLoading(true);
    setShowAnimation(true);

    try {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("receiverEmail", receiverEmail);
      formData.append("encrypt", encrypt.toString());

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setTimeout(() => {
          // Stop the animation after upload reaches IN_TRANSIT
          setShowAnimation(false);

          // Reset form
          setFile(null);
          setReceiverEmail("");
          setEncrypt(true);

          const input = document.getElementById(
            "fileInput"
          ) as HTMLInputElement;

          if (input) {
            input.value = "";
          }

        toast.success("File Uploaded", {
  description:
    "Packet is now in transit.",
});
        }, 1800);
      } else {
        setShowAnimation(false);
        toast.error("Upload Failed", {
          description: data.error || "Failed to upload file.",
        });
      }
    } catch (error) {
      console.error(error);

      setShowAnimation(false);

      toast.error("Unexpected Error", {
  description: "Please try again.",
});
    } finally {
      setLoading(false);
    }
  }

  function handleAnimationComplete() {
    // We'll use this later when we connect
    // the animation to real transfer status updates.
  }

  return (
        <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-slate-100">
          Upload Secure File
        </h1>

        <p className="mt-2 text-slate-400">
          Encrypt and securely transfer files to another user.
        </p>
      </div>

      {/* Live Transfer Animation */}

      {showAnimation && (
        <NetworkTransferAnimation
          isRunning={showAnimation}
          encrypted={encrypt}
          onComplete={handleAnimationComplete}
        />
      )}

      {/* Upload Form */}

      {!showAnimation && (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Upload Form */}

          <div className="card-base p-8 lg:col-span-2">
            {/* Email */}

            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Receiver Email
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                <input
                  type="email"
                  placeholder="receiver@example.com"
                  value={receiverEmail}
                  onChange={(e) =>
                    setReceiverEmail(e.target.value)
                  }
                  className="input-base w-full pl-11"
                />
              </div>
            </div>

            {/* File */}

            <div className="mb-6">
              <label className="mb-3 block text-sm font-medium text-slate-300">
                Select File
              </label>

              <label
                htmlFor="fileInput"
                className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-700 bg-slate-900 p-10 text-center transition hover:border-indigo-500 hover:bg-slate-800"
              >
                <Upload className="mb-4 h-12 w-12 text-indigo-400" />

                <h3 className="font-semibold text-slate-100">
                  Click to choose a file
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  Any supported document or archive
                </p>

                {file && (
                  <div className="mt-6 flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2">
                    <FileText className="h-5 w-5 text-indigo-400" />

                    <span className="text-sm text-slate-200">
                      {file.name}
                    </span>
                  </div>
                )}
              </label>

              <input
                id="fileInput"
                type="file"
                className="hidden"
                onChange={(e) =>
                  setFile(e.target.files?.[0] || null)
                }
              />
            </div>

            {/* Encryption */}

            <div className="mb-8 flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 p-4">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-emerald-400" />

                <div>
                  <p className="font-medium text-slate-100">
                    Encrypt Before Sending
                  </p>

                  <p className="text-sm text-slate-400">
                    AES-256 encryption
                  </p>
                </div>
              </div>

              <input
                type="checkbox"
                checked={encrypt}
                onChange={() => setEncrypt(!encrypt)}
                className="h-5 w-5 accent-indigo-600"
              />
            </div>

            <button
              onClick={handleUpload}
              disabled={loading}
              className="btn-primary flex w-full items-center justify-center gap-3"
            >
              <Upload className="h-5 w-5" />

              {loading
                ? "Preparing Transfer..."
                : "Encrypt & Send File"}
            </button>
          </div>

          {/* Right Panel */}

                    <div className="space-y-6">
            <div className="card-base p-6">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15">
                <ShieldCheck className="h-6 w-6 text-emerald-400" />
              </div>

              <h2 className="text-lg font-semibold text-slate-100">
                Security Status
              </h2>

              <div className="mt-5 space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />

                  <span className="text-sm text-slate-300">
                    AES-256 Encryption
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />

                  <span className="text-sm text-slate-300">
                    SHA-256 Integrity
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />

                  <span className="text-sm text-slate-300">
                    Secure Database Storage
                  </span>
                </div>
              </div>
            </div>

            <div className="card-base p-6">
              <h3 className="font-semibold text-slate-100">
                Transfer Tips
              </h3>

              <ul className="mt-4 space-y-3 text-sm text-slate-400">
                <li>• Verify the recipient's email.</li>
                <li>• Large files may take longer to upload.</li>
                <li>• Encryption is recommended.</li>
                <li>• Review Security Logs after upload.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}