export const OTJ_PATHS = Object.freeze({
  BASE: "/api/v1/otj-log-entries",
  bulkApprove: () => "/api/v1/otj-log-entries/bulk-approve",
  bulkReject: () => "/api/v1/otj-log-entries/bulk-reject",
  detail: (id) => `/api/v1/otj-log-entries/${id}`,
});

/**
 * F1.2.3 AC7 — digest cadence lives on the notifications resource, not OTJ,
 * because it is a per-user notification preference rather than a property of
 * any log entry.
 */
export const NOTIFICATION_PATHS = Object.freeze({
  digestPreference: () => "/api/v1/notifications/preferences/digest",
});

/**
 * F1.2.3 AC4 — bulk approve is available for up to 20 entries simultaneously.
 * Mirrors BULK_OTJ_ACTION_MAX_IDS in the API, which is the authority.
 */
export const BULK_OTJ_MAX = 20;

export const DIGEST_FREQUENCIES = Object.freeze({
  DAILY: "daily",
  WEEKLY: "weekly",
  OFF: "off",
});

export const DIGEST_FREQUENCY_LABELS = Object.freeze({
  daily: "Daily",
  weekly: "Weekly",
  off: "Off",
});

export const OTJ_STATUSES = Object.freeze({
  DRAFT: "draft",
  SUBMITTED: "submitted",
  APPROVED: "approved",
  REJECTED: "rejected",
});

export const OTJ_STATUS = OTJ_STATUSES;

export const OTJ_STATUS_LABELS = Object.freeze({
  draft: "Draft",
  submitted: "Submitted",
  approved: "Approved",
  rejected: "Rejected",
});
