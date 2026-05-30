import { BookMarked, CheckCircle, Clock, XCircle } from "lucide-react";

import { cn } from "@/utils/helper";

const CARDS = [
  {
    icon: BookMarked,
    label: "KSBs evidenced",
    value: "22 / 38",
    sub: "58% · 16 still to evidence",
    color: "green",
  },
  {
    icon: CheckCircle,
    label: "Strong coverage",
    value: "8",
    sub: "Multiple pieces of evidence",
    color: "success",
  },
  {
    icon: Clock,
    label: "In progress",
    value: "11",
    sub: "Drafts or single weak pieces",
    color: "amber",
  },
  {
    icon: XCircle,
    label: "Not started",
    value: "5",
    sub: "No evidence yet",
    color: "neutral",
    tag: "Gaps",
  },
];

const T = {
  green: {
    iconBg: "bg-primary-100",
    icon: "text-primary-700",
    val: "text-primary-900",
  },
  success: {
    iconBg: "bg-success-100",
    icon: "text-success-700",
    val: "text-success-800",
  },
  amber: {
    iconBg: "bg-warning-100",
    icon: "text-warning-700",
    val: "text-warning-800",
  },
  neutral: {
    iconBg: "bg-neutral-100",
    icon: "text-neutral-500",
    val: "text-neutral-700",
  },
};

function StatCard({ c, i }) {
  const t = T[c.color];
  return (
    <div
      className={cn(
        "surface-card p-5 flex flex-col gap-3",
        c.tag && "border-warning-200",
      )}
      style={{
        animation: "slide-up 320ms var(--ease-out) both",
        animationDelay: `${i * 60}ms`,
      }}
    >
      <div className="flex items-start justify-between">
        <div className={cn("p-2 rounded-lg", t.iconBg)}>
          <c.icon size={18} className={t.icon} />
        </div>
        {c.tag && (
          <span className="text-xs font-medium text-warning-700 bg-warning-100 px-2 py-0.5 rounded-full">
            {c.tag}
          </span>
        )}
      </div>
      <div>
        <div className={cn("text-2xl font-bold tracking-tight", t.val)}>
          {c.value}
        </div>
        <div className="text-xs font-medium text-neutral-500 mt-0.5">
          {c.label}
        </div>
      </div>
      <p className="text-xs text-neutral-400 leading-relaxed">{c.sub}</p>
    </div>
  );
}

export function PortfolioStatCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {CARDS.map((c, i) => (
        <StatCard key={c.label} c={c} i={i} />
      ))}
    </div>
  );
}
