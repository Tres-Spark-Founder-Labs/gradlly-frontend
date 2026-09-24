"use client";

import { T } from "./tokens";

export function OverviewStat({
  icon,
  value,
  valueColor,
  label,
  sub,
  accent,
  badge,
  onClick,
  noBorder,
}) {
  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className="flex flex-col p-5 transition-colors duration-150 hover:bg-neutral-50/60"
      style={{
        cursor: onClick ? "pointer" : "default",
        borderRight: noBorder ? "none" : `1px solid ${T.border}`,
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="h-8 w-8 rounded-xl flex items-center justify-center shrink-0"
          style={{
            backgroundColor: `color-mix(in srgb, ${accent} 7.8431372549%, transparent)`,
          }}
        >
          <span style={{ color: accent }}>{icon}</span>
        </div>
        {badge}
      </div>
      <p
        className="text-[22px] font-extrabold tabular-nums leading-none"
        style={{ color: valueColor ?? T.ink }}
      >
        {value}
      </p>
      <p className="mt-1.5 text-xs font-semibold" style={{ color: T.muted }}>
        {label}
      </p>
      <p className="mt-0.5 text-xs leading-snug" style={{ color: T.subtle }}>
        {sub}
      </p>
    </div>
  );
}
