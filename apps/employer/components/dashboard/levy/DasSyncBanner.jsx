"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

import { fmtGBP } from "./helpers";
import { T } from "./tokens";

export function DasSyncBanner({ balance, isDegraded, fmtSyncedAt, onSync }) {
  if (!isDegraded) return null;

  return (
    <div
      className="flex items-center justify-between gap-3 rounded-xl px-4 py-3.5"
      style={{
        backgroundColor: T.amberLight,
        border: `1.5px solid ${T.amber}40`,
      }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <AlertCircle className="h-4 w-4 shrink-0" style={{ color: T.amber }} />
        <div className="min-w-0">
          <p className="text-sm font-bold" style={{ color: T.amber }}>
            DAS API unavailable — displaying last known data
          </p>
          {/* F1.1.1 AC4: last *known* balance plus the time it was accurate,
              so a stale figure is never mistaken for a live one. */}
          <p className="text-xs mt-0.5" style={{ color: T.subtle }}>
            Last known balance {fmtGBP(balance)}, accurate as of{" "}
            {fmtSyncedAt?.()}. Live sync failed.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onSync}
        className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg hover:opacity-80 transition-opacity shrink-0"
        style={{ backgroundColor: T.amber, color: "#fff" }}
      >
        <RefreshCw className="h-3 w-3" /> Retry
      </button>
    </div>
  );
}
