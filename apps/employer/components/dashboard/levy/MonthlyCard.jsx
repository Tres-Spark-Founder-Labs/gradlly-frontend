"use client";

import { TrendingUp } from "lucide-react";
import { useState } from "react";

import { fmt } from "./helpers";
import { T } from "./tokens";

export function MonthlyCard({ levy }) {
  const [open, setOpen] = useState(false);
  const monthly = levy?.monthly ?? 0;
  const payroll = levy?.payroll ?? 0;
  const breakdown = levy?.monthlyBreakdown ?? [];

  return (
    <div
      onClick={() => setOpen((v) => !v)}
      role="button"
      tabIndex={0}
      className="h-full flex flex-col rounded-2xl overflow-hidden cursor-pointer transition-shadow hover:shadow-md"
      style={{
        backgroundColor: T.surface,
        border: `1px solid ${T.border}`,
        borderLeft: `3px solid ${T.green}`,
      }}
    >
      <div className="flex-1 p-5">
        <div className="flex items-start justify-between mb-4">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{ backgroundColor: T.greenLight }}
          >
            <TrendingUp className="h-4 w-4" style={{ color: T.green }} />
          </div>
          <span
            className="text-[10px] font-semibold uppercase tracking-wider"
            style={{ color: T.muted }}
          >
            Monthly
          </span>
        </div>
        <p
          className="text-[26px] font-extrabold tabular-nums leading-none"
          style={{ color: T.ink }}
        >
          {fmt(monthly)}
        </p>
        <p className="mt-1.5 text-xs font-semibold" style={{ color: T.muted }}>
          Monthly Contribution
        </p>
        {payroll > 0 && (
          <p className="mt-2 text-xs" style={{ color: T.subtle }}>
            0.5% of {fmt(payroll)} payroll
          </p>
        )}
      </div>
      <div
        className="overflow-hidden transition-all duration-500"
        style={{ maxHeight: open ? "150px" : "0" }}
      >
        <div
          className="px-5 pb-4 pt-3 space-y-2"
          style={{ borderTop: `1px solid ${T.border}` }}
        >
          {breakdown.length > 0 ? (
            breakdown.slice(-3).map((b) => (
              <div key={b.month} className="flex justify-between text-xs">
                <span style={{ color: T.subtle }}>{b.month}</span>
                <span
                  className="font-bold tabular-nums"
                  style={{ color: T.ink }}
                >
                  {fmt(b.value ?? 0)}
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs" style={{ color: T.muted }}>
              No breakdown available
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
