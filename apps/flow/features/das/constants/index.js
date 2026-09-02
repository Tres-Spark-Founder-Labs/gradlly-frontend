export const DAS_PATHS = Object.freeze({
  sync: "/api/v1/das/sync",
  levyBalance: "/api/v1/das/levy-balance",
  levyForecast: "/api/v1/das/levy-forecast",
  fundingPayments: "/api/v1/das/funding-payments",
});

// ─── Sync status (`DasSyncStatus`) ───────────────────────────────────────────
export const DAS_SYNC_STATUS = Object.freeze({
  IDLE: "idle", // never synced — show "connect DAS" state
  SUCCESS: "success",
  FAILED: "failed",
  // A temporary mode flag, not a sync outcome: the figure was typed in by an
  // administrator because this deployment has no ESFA credentials. Rendered in
  // a neutral tone rather than the success green, because nothing was synced.
  MANUAL: "manual",
});

export const DAS_SYNC_STATUS_LABELS = Object.freeze({
  idle: "Not synced",
  success: "Synced",
  failed: "Sync failed",
  manual: "Manually entered",
});

// Default forecast horizon.
export const DEFAULT_HORIZON_MONTHS = 12;

export const HORIZON_OPTIONS = [
  { value: "6", text: "6 months" },
  { value: "12", text: "12 months" },
  { value: "18", text: "18 months" },
  { value: "24", text: "24 months" },
];

// A runway is "low" when it won't cover the forecast horizon.
export function isRunwayLow(runwayMonths, horizonMonths) {
  if (runwayMonths === null || runwayMonths === undefined) return false;
  return runwayMonths < (horizonMonths ?? DEFAULT_HORIZON_MONTHS);
}
