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
