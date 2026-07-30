"use client";

import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock,
  Download,
  TrendingUp,
} from "lucide-react";

import { HealthRing } from "./HealthRing";
import { HealthSignal } from "./HealthSignal";
import { fmt, fmtGBP, scoreColor } from "./helpers";
import { OverviewStat } from "./OverviewStat";
import { T } from "./tokens";

export function OverviewPanel({ das, levy, onExpiryModal, onExport }) {
  const score = levy?.healthScore ?? 0;
  const color = scoreColor(score);
  const label = score < 40 ? "Critical" : score < 70 ? "Moderate" : "Healthy";

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: T.surface, border: `1px solid ${T.border}` }}
    >
      <div
        className="flex items-center gap-5 px-5 py-4 flex-wrap"
        style={{ borderBottom: `1px solid ${T.border}` }}
      >
        <div className="relative shrink-0">
          <HealthRing score={score} />
          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ paddingTop: 8 }}
          >
            <span
              className="text-[22px] font-extrabold tabular-nums leading-none"
              style={{ color: T.ink }}
            >
              {score}
            </span>
            <span
              className="text-[10px] font-bold tracking-widest"
              style={{ color: T.muted }}
            >
              /100
            </span>
          </div>
        </div>

        <div className="shrink-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold" style={{ color: T.ink }}>
              Levy Health
            </p>
            <span
              className="px-2 py-0.5 rounded-full text-[11px] font-bold"
              style={{
                backgroundColor: `${color}12`,
                color,
                border: `1px solid ${color}28`,
              }}
            >
              {label}
            </span>
          </div>
          <p className="mt-0.5 text-xs" style={{ color: T.muted }}>
            FY 2024/25
          </p>
        </div>

        <div
          className="hidden lg:block h-10 w-px shrink-0"
          style={{ backgroundColor: T.border }}
        />

        <div className="flex flex-1 flex-wrap gap-2 min-w-0">
          <HealthSignal
            icon={<AlertTriangle className="h-3.5 w-3.5" />}
            label="Utilisation low"
            detail={`${levy?.usedThisYear !== null && levy?.usedThisYear !== undefined ? Math.round((levy.usedThisYear / (levy.annualPot || 1)) * 100) : 0}% used`}
            color={T.amber}
            bg={T.amberLight}
          />
          <HealthSignal
            icon={<AlertCircle className="h-3.5 w-3.5" />}
            label={`${fmt(levy?.expiring ?? 0)} expiring`}
            detail={`${levy?.expiringDays ?? 0} days · unallocated`}
            color={T.red}
            bg={T.redLight}
            onClick={onExpiryModal}
          />
          <HealthSignal
            icon={<CheckCircle2 className="h-3.5 w-3.5" />}
            label="DAS synced"
            detail={das?.fmtLastSynced?.() ?? "—"}
            color={T.green}
            bg={T.greenLight}
          />
        </div>

        <button
          type="button"
          onClick={onExport}
          className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold shrink-0 hover:opacity-80 transition-opacity"
          style={{
            backgroundColor: "#f5f4f2",
            color: T.subtle,
            border: `1px solid ${T.border}`,
          }}
        >
          <Download className="h-3.5 w-3.5" /> Export
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <OverviewStat
          accent={T.blue}
          icon={<BarChart3 className="h-4 w-4" />}
          /* F1.1.1 AC1: DAS-sourced balance, GBP to 2dp. Renders an em dash
             rather than £0.00 when no DAS account is linked — showing a
             confident zero for "unknown" is how people overcommit funds. */
          value={das?.hasLink ? fmtGBP(das.balance) : "—"}
          label="Available Balance"
          /* F1.1.1 AC3: last-synced timestamp sits with the balance itself,
             not only in the separate health-signal row. */
          sub={
            das?.hasLink
              ? `DAS · synced ${das.fmtSyncedAt?.()}`
              : "No DAS account linked"
          }
        />
        <OverviewStat
          accent={T.green}
          icon={<TrendingUp className="h-4 w-4" />}
          value={fmt(levy?.monthly ?? 0)}
          label="Monthly Contribution"
          sub={`0.5% of ${fmt(levy?.payroll ?? 0)} payroll`}
        />
        <OverviewStat
          accent={T.amber}
          icon={<Clock className="h-4 w-4" />}
          value={fmt(levy?.expiring ?? 0)}
          valueColor={T.amber}
          label="Expiring (90 days)"
          sub={`${levy?.expiringDays ?? 0} days`}
          onClick={onExpiryModal}
          badge={
            levy?.expiringDays !== null &&
            levy?.expiringDays !== undefined &&
            levy.expiringDays <= 90 ? (
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full levy-countdown-pulse"
                style={{ backgroundColor: T.amberLight, color: T.amber }}
              >
                {levy.expiringDays}d
              </span>
            ) : null
          }
        />
        <OverviewStat
          accent={T.green}
          icon={<ArrowRight className="h-4 w-4" />}
          value={fmt(levy?.transferred ?? 0)}
          valueColor={T.green}
          label="Transferred to SMEs"
          sub="Active transfers this year"
          noBorder
        />
      </div>
    </div>
  );
}
