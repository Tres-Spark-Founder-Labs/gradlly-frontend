export const LEARNER_PATHS = Object.freeze({
  cohort: "/api/v1/learners/cohort",
  // F2.2.1 AC2 — options for the employer, standard and tutor filters.
  cohortFilterOptions: "/api/v1/learners/cohort/filter-options",
  // F2.2.1 AC5 — the whole filtered set, not the visible page.
  cohortExportPdf: "/api/v1/learners/cohort/export",
  interventionQueue: "/api/v1/learners/intervention-queue",
  interventions: (enrolmentId) =>
    `/api/v1/learners/${enrolmentId}/interventions`,
  profile: (enrolmentId) => `/api/v1/learners/${enrolmentId}/profile`,
  // F2.2.5 — tutor caseload dashboard and bulk assignment.
  caseload: "/api/v1/learners/caseload",
  caseloadAssignTutor: "/api/v1/learners/caseload/assign-tutor",
});

// ─── Status badge (`LearnerStatusBadge`) — derived per learner ───────────────
export const LEARNER_STATUS = Object.freeze({
  ON_TRACK: "on_track",
  AT_RISK: "at_risk",
  OVERDUE: "overdue",
  BREAK_IN_LEARNING: "break_in_learning",
  WITHDRAWN: "withdrawn",
  EPA_READY: "epa_ready",
});

export const LEARNER_STATUS_LABELS = Object.freeze({
  on_track: "On track",
  at_risk: "At risk",
  overdue: "Overdue",
  break_in_learning: "Break in learning",
  withdrawn: "Withdrawn",
  epa_ready: "EPA ready",
});

export const LEARNER_STATUS_FILTER_OPTIONS = [
  { value: "", text: "All statuses" },
  { value: LEARNER_STATUS.ON_TRACK, text: "On track" },
  { value: LEARNER_STATUS.AT_RISK, text: "At risk" },
  { value: LEARNER_STATUS.OVERDUE, text: "Overdue" },
  { value: LEARNER_STATUS.BREAK_IN_LEARNING, text: "Break in learning" },
  { value: LEARNER_STATUS.EPA_READY, text: "EPA ready" },
  { value: LEARNER_STATUS.WITHDRAWN, text: "Withdrawn" },
];

// ─── Intervention flag reasons (queue) ───────────────────────────────────────
export const FLAG_REASON_LABELS = Object.freeze({
  otj_behind: "OTJ behind",
  missed_review: "Missed review",
  gateway_stalled: "Gateway stalled",
});

// ─── Intervention action types (logged) ──────────────────────────────────────
/**
 * F2.2.2 AC4. Sixty seconds is chosen against what actually moves the queue:
 * an OTJ log approval, a review slipping past its date, a gateway item being
 * ticked. None of those change second to second, and a tutor acting on a
 * minute-old queue is not acting on stale information.
 *
 * It is also cheap — one request per minute against a 100/minute budget.
 */
export const INTERVENTION_QUEUE_REFRESH_MS = 60_000;

export const INTERVENTION_ACTION = Object.freeze({
  CONTACT_MADE: "contact_made",
  REVIEW_SCHEDULED: "review_scheduled",
  EMPLOYER_NOTIFIED: "employer_notified",
  ESCALATED: "escalated",
});

export const INTERVENTION_ACTION_LABELS = Object.freeze({
  contact_made: "Contact made",
  review_scheduled: "Review scheduled",
  employer_notified: "Employer notified",
  escalated: "Escalated",
});

export const INTERVENTION_ACTION_OPTIONS = [
  { value: INTERVENTION_ACTION.CONTACT_MADE, text: "Contact made" },
  { value: INTERVENTION_ACTION.REVIEW_SCHEDULED, text: "Review scheduled" },
  { value: INTERVENTION_ACTION.EMPLOYER_NOTIFIED, text: "Employer notified" },
  { value: INTERVENTION_ACTION.ESCALATED, text: "Escalated" },
];

export const INTERVENTION_ACTION_VALUES = Object.values(INTERVENTION_ACTION);

// ─── Learner document type ───────────────────────────────────────────────────
export const LEARNER_DOC_TYPE_LABELS = Object.freeze({
  commitment: "Commitment statement",
  review: "Review",
  evidence: "Evidence",
});

// ─── Cohort sort keys (server-side sort) ─────────────────────────────────────
export const COHORT_SORT_KEYS = Object.freeze({
  LEARNER_NAME: "learnerName",
  EMPLOYER_NAME: "employerName",
  STANDARD_TITLE: "standardTitle",
  START_DATE: "startDate",
  OTJ_PERCENT: "otjPercent",
  NEXT_REVIEW_DATE: "nextReviewDate",
  EPA_DATE: "epaDate",
  STATUS_BADGE: "statusBadge",
  TUTOR_NAME: "tutorName",
});

// Severity → colour band for the queue ranking.
export function severityBand(score) {
  if (score >= 85) return "high";
  if (score >= 60) return "medium";
  return "low";
}
