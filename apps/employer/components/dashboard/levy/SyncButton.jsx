"use client";

import { Check, Loader2, RefreshCw } from "lucide-react";

import { T } from "./tokens";

/**
 * `syncState` is honest already — "Synced ✓" appears only after a mutation
 * actually succeeded. What was missing is manual mode: there, POST /das/sync
 * returns 409 by design, so offering "Sync DAS" invites a click that can only
 * fail. The button says why instead.
 */
export function SyncButton({ syncState, onSync, isManual = false }) {
  const syncing = syncState === "syncing";
  const done = syncState === "done";
  const error = syncState === "error";

  const icon = syncing ? (
    <Loader2 className="h-3.5 w-3.5 animate-spin" />
  ) : done ? (
    <Check className="h-3.5 w-3.5" style={{ color: T.green }} />
  ) : error ? (
    <RefreshCw className="h-3.5 w-3.5" style={{ color: T.red }} />
  ) : (
    <RefreshCw className="h-3.5 w-3.5" />
  );

  const label = isManual
    ? "Manual mode"
    : syncing
      ? "Syncing…"
      : done
        ? "Synced ✓"
        : error
          ? "Retry"
          : "Sync DAS";

  return (
    <button
      type="button"
      onClick={onSync}
      disabled={syncing || isManual}
      title={
        isManual
          ? "This deployment has no ESFA connection. Levy figures are entered under Levy & Finance → Levy Data."
          : undefined
      }
      className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all hover:opacity-80 disabled:opacity-50"
      style={{
        backgroundColor: "#f5f4f2",
        color: T.subtle,
        border: `1px solid ${T.border}`,
      }}
    >
      {icon} {label}
    </button>
  );
}
