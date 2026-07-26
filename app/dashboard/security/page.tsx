import {
  ShieldCheck,
  Lock,
  FileCheck,
  FileKey,
  TriangleAlert,
  Activity,
  CheckCircle2,
} from "lucide-react";

export default function SecurityPage() {
  const securityItems = [
    {
      title: "AES-256 Encryption",
      status: "Active",
      icon: Lock,
      color: "emerald",
      description: "All uploaded files are encrypted before storage.",
    },
    {
      title: "SHA-256 Integrity",
      status: "Verified",
      icon: FileCheck,
      color: "indigo",
      description: "Every downloaded file undergoes integrity verification.",
    },
    {
      title: "Secure Authentication",
      status: "Protected",
      icon: ShieldCheck,
      color: "amber",
      description: "Only authenticated users can access protected resources.",
    },
    {
      title: "Secure Transfer",
      status: "Enabled",
      icon: FileKey,
      color: "rose",
      description: "Files are transferred through protected API endpoints.",
    },
  ];

  const activities = [
    {
      icon: CheckCircle2,
      title: "Authentication System",
      description: "Login protection is active.",
      status: "Healthy",
      color: "emerald",
    },
    {
      icon: Activity,
      title: "Encryption Service",
      description: "AES-256 encryption operational.",
      status: "Running",
      color: "indigo",
    },
    {
      icon: ShieldCheck,
      title: "Integrity Verification",
      description: "SHA-256 hash verification enabled.",
      status: "Secure",
      color: "emerald",
    },
    {
      icon: TriangleAlert,
      title: "Threat Monitoring",
      description: "No suspicious activities detected.",
      status: "Normal",
      color: "amber",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Overview */}

      <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 to-slate-900 p-8">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-emerald-500/20 p-4">
            <ShieldCheck className="h-10 w-10 text-emerald-400" />
          </div>

          <div>
            <h2 className="text-3xl font-bold text-slate-100">
              Security Center
            </h2>

            <p className="mt-2 text-slate-400">
              Your Secure File Transfer System is operating normally with all
              protection mechanisms enabled.
            </p>
          </div>
        </div>
      </div>

      {/* Security Cards */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {securityItems.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-indigo-500"
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="rounded-xl bg-slate-800 p-3">
                  <Icon className="h-6 w-6 text-indigo-400" />
                </div>

                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                  {item.status}
                </span>
              </div>

              <h3 className="font-semibold text-slate-100">
                {item.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* System Activity */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900">
        <div className="border-b border-slate-800 px-6 py-5">
          <h2 className="text-xl font-semibold text-slate-100">
            Security Status
          </h2>
        </div>

        <div className="divide-y divide-slate-800">
          {activities.map((activity) => {
            const Icon = activity.icon;

            return (
              <div
                key={activity.title}
                className="flex items-center justify-between p-6 transition hover:bg-slate-800/40"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-slate-800 p-3">
                    <Icon className="h-5 w-5 text-indigo-400" />
                  </div>

                  <div>
                    <h3 className="font-medium text-slate-100">
                      {activity.title}
                    </h3>

                    <p className="mt-1 text-sm text-slate-400">
                      {activity.description}
                    </p>
                  </div>
                </div>

                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400">
                  {activity.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Information */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="mb-6 text-xl font-semibold text-slate-100">
          Security Features
        </h2>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
            <h3 className="font-medium text-slate-100">
              File Encryption
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Every uploaded file is encrypted using AES-256 before being stored
              on the server, protecting confidential information from
              unauthorized access.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
            <h3 className="font-medium text-slate-100">
              Integrity Verification
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              SHA-256 hashing ensures downloaded files remain identical to the
              original upload and have not been modified.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
            <h3 className="font-medium text-slate-100">
              Authentication
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Access to protected resources requires successful user
              authentication before any operation is performed.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
            <h3 className="font-medium text-slate-100">
              Secure Transfer
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Secure API endpoints protect file uploads, downloads, and viewing
              operations throughout the application.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}