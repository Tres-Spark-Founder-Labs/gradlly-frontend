export const DAS_PATHS = Object.freeze({
  sync: "/api/v1/das/sync",
  levyBalance: "/api/v1/das/levy-balance",
  levyForecast: "/api/v1/das/levy-forecast",
  fundingPayments: "/api/v1/das/funding-payments",
  // F2.3.1 AC5 / AC7.
  syncStatus: "/api/v1/das/sync-status",
  activity: "/api/v1/das/activity",
});

// ─── Sync health band (F2.3.1 AC5) ───────────────────────────────────────────
//
// Distinct from DAS_SYNC_STATUS below, which is the outcome of one push. This
// is the health of the integration as a whole.
export const DAS_SYNC_HEALTH = Object.freeze({
  GREEN: "green",
  AMBER: "amber",
  RED: "red",
});

export const DAS_SYNC_HEALTH_LABELS = Object.freeze({
  green: "Healthy",
  amber: "Degraded",
  red: "Not working",
});

/**
 * The band already carries the judgement, so the UI only maps it to colour —
 * it must never recompute the band from lastSyncAt and errorCount, or the
 * indicator can disagree with the API about what it is showing.
 */
export const DAS_SYNC_HEALTH_CLASSES = Object.freeze({
  green: "bg-emerald-50 text-emerald-700 border-emerald-200",
  amber: "bg-amber-50 text-amber-700 border-amber-200",
  red: "bg-rose-50 text-rose-700 border-rose-200",
});

// ─── DAS API operations (F2.3.1 AC7) ─────────────────────────────────────────
export const DAS_OPERATION_LABELS = Object.freeze({
  oauth_token: "Authentication",
  levy_balance: "Levy balance",
  funding_payments: "Funding payments",
  enrolment_submit: "Enrolment submission",
  completion_notify: "Completion notification",
  transfer_consent: "Transfer consent",
  transfer_status: "Transfer status",
});

export const DAS_OPERATION_FILTER_OPTIONS = [
  { value: "", text: "All operations" },
  { value: "oauth_token", text: "Authentication" },
  { value: "levy_balance", text: "Levy balance" },
  { value: "funding_payments", text: "Funding payments" },
  { value: "enrolment_submit", text: "Enrolment submission" },
  { value: "completion_notify", text: "Completion notification" },
  { value: "transfer_consent", text: "Transfer consent" },
  { value: "transfer_status", text: "Transfer status" },
];

// ─── Sync status (`DasSyncStatus`) ───────────────────────────────────────────
export const DAS_SYNC_STATUS = Object.freeze({
  IDLE: "idle", // never synced — show "connect DAS" state
  SUCCESS: "success",
  FAILED: "failed",
});

export const DAS_SYNC_STATUS_LABELS = Object.freeze({
  idle: "Not synced",
  success: "Synced",
  failed: "Sync failed",
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
