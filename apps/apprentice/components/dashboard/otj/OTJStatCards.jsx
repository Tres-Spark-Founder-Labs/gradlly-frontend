import { Clock, TrendingUp, Target, Zap } from "lucide-react";

import { cn } from "@/utils/helper";

const CARDS = [
  {
    icon: Clock,
    label: "Hours logged",
    value: "198h",
    sub: "of 439h minimum for this standard",
    color: "green",
  },
  {
    icon: TrendingUp,
    label: "This month",
    value: "14h",
    sub: "≈ 4h behind monthly pace",
    color: "amber",
    tag: "Behind",
  },
  {
    icon: Target,
    label: "Progress to minimum",
    value: "45%",
    sub: "241h still to log",
    color: "green",
  },
  {
    icon: Zap,
    label: "Pace to gateway",
    value: "4.2h",
    sub: "per week to reach 439h by Dec 2025",
    color: "blue",
  },
];

const THEME = {
  green: {
    iconBg: "bg-primary-100",
    icon: "text-primary-700",
    val: "text-primary-900",
  },
  amber: {
    iconBg: "bg-warning-100",
    icon: "text-warning-700",
    val: "text-warning-800",
  },
  blue: { iconBg: "bg-info-100", icon: "text-info-700", val: "text-info-800" },
};

function StatCard({ card, i }) {
  const { icon: Icon, label, value, sub, color, tag } = card;
  const t = THEME[color];
  return (
    <div
      className={cn(
        "surface-card p-5 flex flex-col gap-3",
        tag && "border-warning-200",
      )}
      style={{
        animation: "slide-up 320ms var(--ease-out) both",
        animationDelay: `${i * 60}ms`,
      }}
    >
      <div className="flex items-start justify-between">
        <div className={cn("p-2 rounded-lg", t.iconBg)}>
          <Icon size={18} className={t.icon} />
        </div>
        {tag && (
          <span className="text-xs font-medium text-warning-700 bg-warning-100 px-2 py-0.5 rounded-full">
            {tag}
          </span>
        )}
      </div>
      <div>
        <div className={cn("text-2xl font-bold tracking-tight", t.val)}>
          {value}
        </div>
        <div className="text-xs font-medium text-neutral-500 mt-0.5">
          {label}
        </div>
      </div>
      <p className="text-xs text-neutral-400 leading-relaxed">{sub}</p>
    </div>
  );
}

export function OTJStatCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {CARDS.map((c, i) => (
        <StatCard key={c.label} card={c} i={i} />
      ))}
    </div>
  );
}
