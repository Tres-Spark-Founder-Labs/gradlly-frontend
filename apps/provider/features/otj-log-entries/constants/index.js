export const OTJ_PATHS = Object.freeze({
  BASE: "/api/v1/otj-log-entries",
  byId: (id) => `/api/v1/otj-log-entries/${id}`,
  categories: "/api/v1/otj-log-entries/categories",
  bulkApprove: "/api/v1/otj-log-entries/bulk-approve",
  bulkReject: "/api/v1/otj-log-entries/bulk-reject",
  // F2.2.4 AC3 — a tutor's query, not an approval decision.
  flag: (id) => `/api/v1/otj-log-entries/${id}/flag`,
  unflag: (id) => `/api/v1/otj-log-entries/${id}/unflag`,
});

// ─── Status (`OtjLogStatus`) ─────────────────────────────────────────────────
export const OTJ_STATUS = Object.freeze({
  DRAFT: "draft",
  SUBMITTED: "submitted",
  APPROVED: "approved",
  REJECTED: "rejected",
});

export const OTJ_STATUS_LABELS = Object.freeze({
  draft: "Draft",
  submitted: "Submitted",
  approved: "Approved",
  rejected: "Rejected",
});

// Status filter options. "" = all; the queue defaults to submitted.
export const OTJ_STATUS_FILTER_OPTIONS = [
  { value: "", text: "All statuses" },
  { value: OTJ_STATUS.SUBMITTED, text: "Submitted" },
  { value: OTJ_STATUS.APPROVED, text: "Approved" },
  { value: OTJ_STATUS.REJECTED, text: "Rejected" },
  { value: OTJ_STATUS.DRAFT, text: "Draft" },
];

// ─── Activity category (`OtjActivityCategory`) ───────────────────────────────
// The dropdown is sourced from GET /categories at runtime (versioned catalogue).
// These labels are a display fallback for rendering a row's category before the
// catalogue loads, or if a value is missing from it.
export const OTJ_CATEGORY_LABELS = Object.freeze({
  taught_learning: "Taught learning",
  applied_project: "Applied project",
  mentoring_coaching: "Mentoring / coaching",
  job_shadowing: "Job shadowing",
  off_site_learning: "Off-site learning",
  other: "Other",
});

// ─── Bulk action keys + per-id reason codes ──────────────────────────────────
export const OTJ_BULK_ACTION = Object.freeze({
  APPROVE: "approve",
  REJECT: "reject",
});

export const OTJ_REASON_CODE = Object.freeze({
  NOT_FOUND: "not_found",
  INVALID_TRANSITION: "invalid_transition",
  INTERNAL_ERROR: "internal_error",
});

// Only submitted entries can be approved/rejected.
export function isActionable(entry) {
  return entry?.status === OTJ_STATUS.SUBMITTED;
}
