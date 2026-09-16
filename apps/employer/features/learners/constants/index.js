/**
 * The learner profile aggregate (F2.2.4).
 *
 * `GET /learners/:enrolmentId/profile` returns the whole drawer's worth of
 * data in one response: personal, employer, programme, tutor, reviews, OTJ,
 * documents, message threads and break-in-learning. The provider app has read
 * it since it was built; the employer drawer rendered fixtures instead.
 *
 * Mirrors apps/provider/features/learners/constants deliberately — same path,
 * same label maps — so the two portals cannot drift into describing the same
 * response differently.
 */
export const LEARNER_PATHS = Object.freeze({
  profile: (enrolmentId) => `/api/v1/learners/${enrolmentId}/profile`,
  // F1.2.2 AC3 — weekly OTJ buckets over the programme lifetime.
  otjWeekly: (enrolmentId) => `/api/v1/learners/${enrolmentId}/otj/weekly`,
});

/** `ReviewStatus` on the API. */
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

/** `LearnerDocumentType` on the API. Matches the provider's map exactly. */
export const LEARNER_DOC_TYPE_LABELS = Object.freeze({
  commitment: "Commitment statement",
  review: "Review",
  evidence: "Evidence",
});

/** `OtjLogStatus` on the API. */
export const OTJ_STATUS_LABELS = Object.freeze({
  draft: "Draft",
  submitted: "Submitted",
  approved: "Approved",
  rejected: "Rejected",
});

/** `InterventionActionType` on the API. */
export const INTERVENTION_ACTION_LABELS = Object.freeze({
  call: "Call logged",
  email: "Email sent",
  meeting: "Meeting held",
  support_plan: "Support plan raised",
  escalation: "Escalated",
});

/**
 * Shown wherever a date the milestone genuinely needs has not been recorded.
 *
 * Deliberately not a dash. A dash reads as "nothing here" and is ignored; this
 * says the date is missing, which is a thing an employer can chase. The old
 * drawer inferred dates instead — a 12-month review dated twelve months after
 * a start date nobody had entered — and an inferred date is indistinguishable
 * from a real one once it is on the screen.
 */
export const DATE_NOT_RECORDED = "Date not recorded";

// ─── Programme journey (GET /enrolments/:id/journey) ─────────────────────────
//
// F1.2.2 AC2. The API's own milestones and gateway checklist, with the status
// each carries. Labelled here for exactly the enum values the API declares
// (JourneyMilestoneStatus, GatewayCriterionStatus); anything else renders as
// the raw value rather than as a label invented for it.
export const JOURNEY_MILESTONE_STATUS_LABELS = Object.freeze({
  complete: "Complete",
  current: "In progress",
  upcoming: "Upcoming",
  // Client decision Q2: a review whose date passed without being held is
  // overdue, not still upcoming — an employer can chase that.
  overdue: "Overdue",
  cancelled: "Cancelled",
});

export const GATEWAY_STATUS_LABELS = Object.freeze({
  complete: "Complete",
  in_progress: "In progress",
  not_started: "Not started",
  blocked: "Blocked",
});

// ─── Review records (GET /reviews/:id/record) ────────────────────────────────
//
// F1.2.2 AC4. PreviousGoalOutcome on the API; the raw value is shown for
// anything outside this list.
export const PREVIOUS_GOAL_OUTCOME_LABELS = Object.freeze({
  achieved: "Achieved",
  partially_achieved: "Partially achieved",
  not_achieved: "Not achieved",
  carried_forward: "Carried forward",
});
