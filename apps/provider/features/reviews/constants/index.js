export const REVIEW_PATHS = Object.freeze({
  BASE: "/api/v1/reviews",
  bulkSchedule: "/api/v1/reviews/bulk-schedule",
  // F2.2.3 AC2 — one date across many learners; participants derived server-side.
  bulkScheduleFromEnrolments: "/api/v1/reviews/bulk-schedule/from-enrolments",
  calendar: "/api/v1/reviews/calendar",
  byId: (id) => `/api/v1/reviews/${id}`,
  record: (id) => `/api/v1/reviews/${id}/record`,
  // F2.2.3 AC4 — goals agreed at the previous review.
  previousGoals: (id) => `/api/v1/reviews/${id}/previous-goals`,
  snapshotPdf: (id) => `/api/v1/reviews/${id}/snapshot-pdf`,
  sign: (id) => `/api/v1/reviews/${id}/sign`,
});

export const REVIEW_BULK_SCHEDULE_MAX = 20;

// ─── Status (`ReviewStatus`) ─────────────────────────────────────────────────
export const REVIEW_STATUS = Object.freeze({
  SCHEDULED: "scheduled",
  IN_PROGRESS: "in_progress",
  AWAITING_SIGNATURES: "awaiting_signatures",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
});

export const REVIEW_STATUS_LABELS = Object.freeze({
  scheduled: "Scheduled",
  in_progress: "In progress",
  awaiting_signatures: "Awaiting signatures",
  completed: "Completed",
  cancelled: "Cancelled",
});

export const REVIEW_STATUS_FILTER_OPTIONS = [
  { value: "", text: "All statuses" },
  { value: REVIEW_STATUS.SCHEDULED, text: "Scheduled" },
  { value: REVIEW_STATUS.IN_PROGRESS, text: "In progress" },
  { value: REVIEW_STATUS.AWAITING_SIGNATURES, text: "Awaiting signatures" },
  { value: REVIEW_STATUS.COMPLETED, text: "Completed" },
  { value: REVIEW_STATUS.CANCELLED, text: "Cancelled" },
];

// ─── Tripartite party (`ReviewSignerParty`) — sign in this order ─────────────
export const PARTY = Object.freeze({
  APPRENTICE: "apprentice",
  TUTOR: "tutor",
  EMPLOYER_MANAGER: "employer_manager",
});

export const PARTY_LABELS = Object.freeze({
  apprentice: "Apprentice",
  tutor: "Tutor",
  employer_manager: "Employer manager",
});

export const PARTY_ORDER = [
  PARTY.APPRENTICE,
  PARTY.TUTOR,
  PARTY.EMPLOYER_MANAGER,
];

// ─── Terminal + transition guards (mirror the backend) ───────────────────────
export const TERMINAL_STATUSES = new Set([
  REVIEW_STATUS.COMPLETED,
  REVIEW_STATUS.CANCELLED,
]);

export function isTerminal(review) {
  return TERMINAL_STATUSES.has(review?.status);
}

/**
 * Actions available for a review by status. Sign gating is separate (depends on
 * nextParty + the signed-in user), handled in the UI.
 */
export function getReviewActions(review) {
  const status = review?.status ?? null;
  const terminal = TERMINAL_STATUSES.has(status);
  return {
    edit: !terminal, // reschedule / edit fields
    editRecord: !terminal,
    snapshot: !terminal,
    cancel: !terminal,
    sign: status === REVIEW_STATUS.AWAITING_SIGNATURES,
    downloadSigned:
      status === REVIEW_STATUS.COMPLETED && !!review?.finalSignedPdfKey,
  };
}

// ─── Previous-goal outcomes (F2.2.3 AC4) ─────────────────────────────────────
export const PREVIOUS_GOAL_OUTCOME_OPTIONS = [
  { value: "achieved", text: "Achieved" },
  { value: "partially_achieved", text: "Partially achieved" },
  { value: "not_achieved", text: "Not achieved" },
  { value: "carried_forward", text: "Carried forward" },
];
