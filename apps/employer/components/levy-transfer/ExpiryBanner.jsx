"use client";
import { X } from "lucide-react";

import { T } from "@/components/dashboard/levy/tokens";
import { useLevyExpiryCalendar } from "@/features/levy/queries/levy.query";

const fmt = (n) => `£${Number(n ?? 0).toLocaleString("en-GB")}`;
const DAY_MS = 24 * 60 * 60 * 1000;

/** Earliest tranche expiring within the next 90 days across all months. */
function nearestExpiringTranche(months) {
  const now = Date.now();
  let nearest = null;
  for (const month of months) {
    for (const tranche of month.tranches ?? []) {
      const expiresAt = new Date(tranche.expiresOn).getTime();
      const daysLeft = Math.ceil((expiresAt - now) / DAY_MS);
      if (daysLeft < 0 || daysLeft > 90) continue;
      if (!nearest || daysLeft < nearest.daysLeft) {
        nearest = { ...tranche, daysLeft };
      }
    }
  }
  return nearest;
}

export function ExpiryBanner({ onDismiss, onFindSME, onLearnMore, onPrefill }) {
  const { data: months = [] } = useLevyExpiryCalendar();
  const tranche = nearestExpiringTranche(months);

  if (!tranche) return null;

  const chipColor = tranche.daysLeft < 30 ? T.red : T.amber;

  return (
    <div
      className="rounded-2xl p-4"
      style={{
        backgroundColor: T.amberLight,
        borderLeft: `4px solid ${T.amber}`,
        border: `1px solid ${T.amber}44`,
      }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p
            className="text-sm font-semibold leading-snug"
            style={{ color: T.amber }}
          >
            ⚠ {fmt(tranche.amount)} expiring in{" "}
            <span
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold mx-1"
              style={{ backgroundColor: `${chipColor}22`, color: chipColor }}
            >
              {tranche.daysLeft} days
            </span>
            — transfer to an SME before{" "}
            {new Date(tranche.expiresOn).toLocaleDateString("en-GB")} to prevent
            funds returning to HMRC
          </p>
          <div className="flex items-center gap-3 mt-2.5 flex-wrap">
            <button
              type="button"
              onClick={onFindSME}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold hover:opacity-80 transition-opacity"
              style={{ backgroundColor: T.amber, color: "#fff" }}
            >
              Review SME applications →
            </button>
            <button
              type="button"
              onClick={onLearnMore}
              className="text-xs font-semibold hover:underline"
              style={{ color: T.amber }}
            >
              Learn more
            </button>
          </div>
          <button
            type="button"
            onClick={() => onPrefill?.(tranche.amount)}
            className="mt-2 text-[11px] font-medium hover:underline block"
            style={{ color: T.amber }}
          >
            Pre-fill with expiring amount ({fmt(tranche.amount)})
          </button>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors hover:bg-amber-100 shrink-0"
          style={{ color: T.amber }}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
