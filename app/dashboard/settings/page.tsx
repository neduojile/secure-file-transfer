import {
  ShieldCheck,
  User,
  Mail,
  Lock,
  Database,
  Server,
  Sparkles,
  Clock,
} from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      {/* Profile */}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-indigo-500/10 p-3">
              <User className="h-6 w-6 text-indigo-400" />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-100">
                Account
              </h2>

              <p className="text-sm text-slate-400">
                User profile information
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Name
              </p>

              <div className="mt-2 rounded-xl border border-slate-800 bg-slate-950 p-3 text-slate-300">
                Current User
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Email
              </p>

              <div className="mt-2 flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 p-3">
                <Mail className="h-4 w-4 text-indigo-400" />

                <span className="text-slate-300">
                  user@example.com
                </span>
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Account Status
              </p>

              <div className="mt-2 inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400">
                Active
              </div>
            </div>
          </div>
        </div>

        {/* Security */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-emerald-500/10 p-3">
              <ShieldCheck className="h-6 w-6 text-emerald-400" />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-100">
                Security
              </h2>

              <p className="text-sm text-slate-400">
                Protection overview
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              "AES-256 File Encryption",
              "SHA-256 Integrity Verification",
              "Secure Authentication",
              "Protected File Transfer",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-4"
              >
                <span className="text-slate-300">{item}</span>

                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                  Enabled
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System */}

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <Database className="mb-4 h-8 w-8 text-indigo-400" />

          <h3 className="font-semibold text-slate-100">
            Encryption
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            AES-256 protects every uploaded file before storage.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <Server className="mb-4 h-8 w-8 text-amber-400" />

          <h3 className="font-semibold text-slate-100">
            Secure Transfer
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            Files are transferred using protected application endpoints.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <Lock className="mb-4 h-8 w-8 text-emerald-400" />

          <h3 className="font-semibold text-slate-100">
            Integrity Check
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            Every download is verified before access.
          </p>
        </div>
      </div>

      {/* About */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="mb-6 flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-indigo-400" />

          <h2 className="text-xl font-semibold text-slate-100">
            Application Information
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Project
            </p>

            <p className="mt-2 font-medium text-slate-200">
              Secure File Transfer System
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Version
            </p>

            <p className="mt-2 font-medium text-slate-200">
              Version 1.0
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Status
            </p>

            <p className="mt-2 font-medium text-emerald-400">
              Operational
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-indigo-400" />

              <span className="text-xs uppercase tracking-wider text-slate-500">
                Last Updated
              </span>
            </div>

            <p className="mt-2 font-medium text-slate-200">
              Current Build
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}