import { ClipboardCheck, Clock, GraduationCap, TrendingUp } from "lucide-react";

import { cn } from "@/utils/helper";

const METRICS = [
  {
    icon: TrendingUp,
    label: "On programme",
    value: "52%",
    sub: "Week 54 of 104 · ~9 months to gateway",
    color: "green",
    bar: 52,
  },
  {
    icon: Clock,
    label: "Off-the-job",
    value: "198 / 439h",
    sub: "≈ 4h behind this month",
    color: "amber",
    bar: 45,
    tag: "Amber",
  },
  {
    icon: ClipboardCheck,
    label: "Portfolio",
    value: "22 / 38",
    sub: "16 KSBs still to evidence",
    color: "blue",
    bar: 58,
  },
  {
    icon: GraduationCap,
    label: "English & maths",
    value: "✓ Complete",
    sub: "Level 2 achieved",
    color: "success",
  },
];

const T = {
  green: {
    iconBg: "bg-primary-100",
    icon: "text-primary-700",
    val: "text-primary-900",
    bar: "bg-primary-500",
  },
  amber: {
    iconBg: "bg-warning-100",
    icon: "text-warning-700",
    val: "text-warning-800",
    bar: "bg-warning-400",
  },
  blue: {
    iconBg: "bg-info-100",
    icon: "text-info-700",
    val: "text-info-800",
    bar: "bg-info-500",
  },
  success: {
    iconBg: "bg-success-100",
    icon: "text-success-700",
    val: "text-success-700",
    bar: "bg-success-500",
  },
};

function MetricCard({ m, i }) {
  const t = T[m.color];
  return (
    <div
      className={cn(
        "surface-card p-5 flex flex-col gap-3",
        m.tag && "border-warning-200",
      )}
      style={{
        animation: "slide-up 320ms var(--ease-out) both",
        animationDelay: `${i * 60}ms`,
      }}
    >
      <div className="flex items-start justify-between">
        <div className={cn("p-2 rounded-lg", t.iconBg)}>
          <m.icon size={18} className={t.icon} />
        </div>
        {m.tag && (
          <span className="text-xs font-medium text-warning-700 bg-warning-100 px-2 py-0.5 rounded-full">
            {m.tag}
          </span>
        )}
        {m.color === "success" && (
          <span className="text-xs font-medium text-success-700 bg-success-100 px-2 py-0.5 rounded-full">
            ✓ Done
          </span>
        )}
      </div>
      <div>
        <div className={cn("text-xl font-bold tracking-tight", t.val)}>
          {m.value}
        </div>
        <div className="text-xs font-medium text-neutral-500 mt-0.5">
          {m.label}
        </div>
      </div>
      {m.bar !== undefined && (
        <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full", t.bar)}
            style={{ width: `${m.bar}%` }}
          />
        </div>
      )}
      <p className="text-xs text-neutral-400 leading-relaxed">{m.sub}</p>
    </div>
  );
}

export function DashboardMetrics() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {METRICS.map((m, i) => (
        <MetricCard key={m.label} m={m} i={i} />
      ))}
    </div>
  );
}
