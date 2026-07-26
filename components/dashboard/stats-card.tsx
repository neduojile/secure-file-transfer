import { LucideIcon, ShieldCheck } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon?: LucideIcon;
  color?: "indigo" | "emerald" | "amber" | "rose";
}

const colorStyles = {
  indigo: {
    icon: "bg-indigo-600/15 text-indigo-400",
    border: "group-hover:border-indigo-500/40",
    accent: "bg-indigo-500",
  },
  emerald: {
    icon: "bg-emerald-600/15 text-emerald-400",
    border: "group-hover:border-emerald-500/40",
    accent: "bg-emerald-500",
  },
  amber: {
    icon: "bg-amber-600/15 text-amber-400",
    border: "group-hover:border-amber-500/40",
    accent: "bg-amber-500",
  },
  rose: {
    icon: "bg-rose-600/15 text-rose-400",
    border: "group-hover:border-rose-500/40",
    accent: "bg-rose-500",
  },
};

export default function StatsCard({
  title,
  value,
  description,
  icon: Icon = ShieldCheck,
  color = "indigo",
}: StatsCardProps) {
  const style = colorStyles[color];

  return (
    <div
      className={`card-base group relative overflow-hidden p-6 transition-all duration-200 hover:-translate-y-1 ${style.border}`}
    >
      <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-white/5 blur-3xl" />

      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </p>

          <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-100">
            {value}
          </h2>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${style.icon}`}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>

      <p className="relative mt-5 text-sm leading-6 text-slate-400">
        {description}
      </p>

      <div className="mt-6 h-1 overflow-hidden rounded-full bg-slate-800">
        <div
          className={`h-full w-1/2 rounded-full transition-all duration-300 group-hover:w-full ${style.accent}`}
        />
      </div>
    </div>
  );
}