export const OTJ_PATHS = Object.freeze({
  BASE: "/api/v1/otj-log-entries",
  CATEGORIES: "/api/v1/otj-log-entries/categories",
  LEARNER_DOCUMENTS: "/api/v1/learners/me/documents",
  byId: (id) => `/api/v1/otj-log-entries/${id}`,
});

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

// ─── F3.1.1 AC2 — the six category options ───────────────────────────────────
//
// Held locally rather than fetched from GET /otj-log-entries/categories, and
// that is a deliberate trade against AC5's 30-second budget: a dropdown that
// cannot populate until a round trip completes is a round trip inside the
// thing being timed. The catalogue endpoint stays the source of truth for
// anything that needs versioning; this is the quick-log path only.
//
// The risk of a local copy is drift — the exact failure that produced F1.2.4's
// grey "Unknown" badge. `otj-categories.contract.test.js` pins these values
// against the API's own enum so drift fails the build rather than the screen.
export const OTJ_CATEGORY_OPTIONS = Object.freeze([
  { value: "taught_learning", text: "Taught learning" },
  { value: "applied_project", text: "Applied project" },
  { value: "mentoring_coaching", text: "Mentoring & coaching" },
  { value: "job_shadowing", text: "Job shadowing" },
  { value: "off_site_learning", text: "Off-site learning" },
  { value: "other", text: "Other" },
]);

// ─── F3.1.1 AC1 — field limits, from the API's own DTO ───────────────────────
export const OTJ_ACTIVITY_NAME_MAX = 80;

/** AC1: "duration (hours stepper in 0.5 increments)". */
export const OTJ_DURATION_STEP_HOURS = 0.5;
export const OTJ_DURATION_MIN_HOURS = 0.5;
/** The API's own ceiling; a full day is already implausible for one session. */
export const OTJ_DURATION_MAX_HOURS = 24;
