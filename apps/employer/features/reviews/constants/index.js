export const REVIEW_PATHS = Object.freeze({
  BASE: "/api/v1/reviews",
  byId: (id) => `/api/v1/reviews/${id}`,
  record: (id) => `/api/v1/reviews/${id}/record`,
});

/**
 * F2.2.3 AC6 — the employer sees reviews, and never acts on them.
 *
 * There is no schedule, edit, sign or cancel path in this feature on purpose.
 * The API refuses those for a non-owning organisation, and rendering controls
 * that return 403 would be worse than not rendering them: it teaches people
 * the product is broken rather than that the action is not theirs.
 */
export const REVIEW_STATUS = Object.freeze({
  SCHEDULED: "scheduled",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
});

export const REVIEW_STATUS_LABELS = Object.freeze({
  scheduled: "Scheduled",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
});

export const REVIEW_STATUS_FILTER_OPTIONS = [
  { value: "", text: "All statuses" },
  { value: REVIEW_STATUS.SCHEDULED, text: "Scheduled" },
  { value: REVIEW_STATUS.IN_PROGRESS, text: "In progress" },
  { value: REVIEW_STATUS.COMPLETED, text: "Completed" },
  { value: REVIEW_STATUS.CANCELLED, text: "Cancelled" },
];

/** Mirrors PreviousGoalOutcome on the API. */
export const PREVIOUS_GOAL_OUTCOME_LABELS = Object.freeze({
  achieved: "Achieved",
  partially_achieved: "Partially achieved",
  not_achieved: "Not achieved",
  carried_forward: "Carried forward",
});
