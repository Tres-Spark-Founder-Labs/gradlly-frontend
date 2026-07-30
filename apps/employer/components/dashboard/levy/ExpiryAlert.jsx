"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { useLevyExpiryCalendar } from "@/features/levy/queries/levy.query";

import { fmtDate, fmtGBP } from "./helpers";
import { T } from "./tokens";

const SESSION_KEY = "levy_expiry_alert_v1";

// F1.1.2 AC1/AC2. Inclusive bounds: "within 30 days" includes day 30 itself.
const AMBER_DAYS = 90;
const RED_DAYS = 30;

const MS_PER_DAY = 86_400_000;

/**
 * Whether the alert was already dismissed this session.
 *
 * Returns false when storage is unreachable (server render, private mode,
 * blocked cookies). Failing open is the right direction here: showing a
 * funds-at-risk warning twice is harmless, suppressing it wrongly is not.
 */
function readDismissed() {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

/** Whole days from now until an ISO date. Negative once the date has passed. */
function daysUntil(iso) {
  if (!iso) return null;
  const then = new Date(iso);
  if (Number.isNaN(then.getTime())) return null;
  return Math.ceil((then.getTime() - Date.now()) / MS_PER_DAY);
}

/**
 * Levy funds expire tranche by tranche (unspent monthly contributions lapse
 * after 24 months). The expiry calendar returns months, each holding tranches
 * with an `amount` and an `expiresOn` date, so "is anything at risk" is a
 * question about individual tranches — not a single balance-wide number.
 *
 * Exported for direct testing: this function encodes the F1.1.2 thresholds and
 * is where a regression would be both easiest to introduce and most costly.
 */
export function assessRisk(calendar) {
  const tranches = (calendar ?? [])
    .flatMap((month) => month?.tranches ?? [])
    .map((t) => ({
      amount: Number(t?.amount ?? 0),
      expiresOn: t?.expiresOn ?? null,
      days: daysUntil(t?.expiresOn),
    }))
    // Drop already-lapsed tranches: that money is gone, not "at risk", and
    // counting it would overstate what the employer can still act on.
    .filter((t) => t.days !== null && t.days >= 0 && Number.isFinite(t.amount));

  const red = tranches.filter((t) => t.days <= RED_DAYS);
  const amber = tranches.filter((t) => t.days <= AMBER_DAYS);

  // Red wins when present, and we then report only the red tranches — the
  // urgent figure is what needs action this month, not a softer 90-day total.
  const atRisk = red.length > 0 ? red : amber;
  if (atRisk.length === 0) return null;

  return {
    urgent: red.length > 0,
    amount: atRisk.reduce((sum, t) => sum + t.amount, 0),
    // Earliest deadline in the set — the date the employer is racing.
    expiresOn: atRisk.reduce(
      (earliest, t) =>
        !earliest || new Date(t.expiresOn) < new Date(earliest)
          ? t.expiresOn
          : earliest,
      null,
    ),
    days: Math.min(...atRisk.map((t) => t.days)),
    trancheCount: atRisk.length,
  };
}

export function ExpiryAlert() {
  const { data: calendar = [] } = useLevyExpiryCalendar();

  // F1.1.2 AC5: dismissal lasts for the session only, so the warning returns on
  // next login. sessionStorage (not localStorage) is what gives us that for
  // free — the browser clears it when the session ends.
  //
  // Read in a lazy initialiser guarded by a `window` check rather than in an
  // effect: setting state from an effect triggers a second render pass and is
  // rejected by react-hooks/set-state-in-effect. The guard keeps it safe if
  // this component is ever server-rendered.
  const [dismissed, setDismissed] = useState(readDismissed);

  const risk = useMemo(() => assessRisk(calendar), [calendar]);

  if (dismissed || !risk) return null;

  const color = risk.urgent ? T.red : T.amber;
  const bg = risk.urgent ? T.redLight : T.amberLight;

  function dismiss() {
    try {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // Non-fatal: dismissal simply won't persist across a reload.
    }
    setDismissed(true);
  }

  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-xl px-4 py-3.5 justify-between"
      style={{ backgroundColor: bg, border: `1.5px solid ${color}30` }}
    >
      <div className="flex items-start gap-3 min-w-0">
        <span className="text-lg mt-px shrink-0" aria-hidden>
          {risk.urgent ? "🔴" : "⚠️"}
        </span>
        <div className="min-w-0">
          {/* AC3: exact amount at risk and the expiry date. */}
          <p className="text-sm font-bold" style={{ color }}>
            {risk.urgent ? "Urgent" : "Warning"}: {fmtGBP(risk.amount)} expires
            on {fmtDate(risk.expiresOn)}
          </p>
          <p className="text-xs mt-0.5" style={{ color: T.subtle }}>
            {risk.days === 0
              ? "Expires today."
              : `${risk.days} day${risk.days === 1 ? "" : "s"} remaining.`}
            {risk.trancheCount > 1
              ? ` Across ${risk.trancheCount} tranches.`
              : ""}{" "}
            Transfer or allocate these funds before they lapse.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0 mt-0.5">
        {/* AC4: one click to the Levy Transfer Hub (F1.1.4). */}
        <Link
          href="/levy-transfer"
          className="text-xs font-bold px-3 py-1.5 rounded-lg hover:opacity-80 transition-opacity"
          style={{ backgroundColor: color, color: "#fff" }}
        >
          Transfer funds →
        </Link>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss expiry alert for this session"
          className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-black/10 transition-colors"
        >
          <X className="h-3 w-3" style={{ color }} />
        </button>
      </div>
    </div>
  );
}
