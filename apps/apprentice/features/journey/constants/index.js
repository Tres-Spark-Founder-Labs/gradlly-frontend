// @ts-check

export const JOURNEY_PATHS = Object.freeze({
  /** @param {string} enrolmentId */
  JOURNEY: (enrolmentId) => `/api/v1/enrolments/${enrolmentId}/journey`,
});

/**
 * Mirrors `JourneyMilestoneStatus` in the API
 * (`src/enrolments/enums/journey-milestone-status.enum.ts`).
 *
 * `overdue` and `cancelled` were added by client decision Q2 — the timeline is
 * sourced from reviews that actually happened, so a review whose date passed
 * without it being held reads as overdue rather than as still upcoming.
 */
export const MILESTONE_STATUS = Object.freeze({
  COMPLETE: "complete",
  CURRENT: "current",
  UPCOMING: "upcoming",
  OVERDUE: "overdue",
  CANCELLED: "cancelled",
});

/** F3.2.1 AC2 — complete (green tick) / current (blue highlight) / upcoming (grey). */
export const MILESTONE_PRESENTATION = Object.freeze({
  [MILESTONE_STATUS.COMPLETE]: {
    label: "Complete",
    dot: "bg-success-500 border-success-500",
    text: "text-success-700",
    chip: "bg-success-50 text-success-700 border-success-200",
  },
  [MILESTONE_STATUS.CURRENT]: {
    label: "In progress",
    dot: "bg-primary-500 border-primary-500 ring-4 ring-primary-100",
    text: "text-primary-700",
    chip: "bg-primary-50 text-primary-700 border-primary-200",
  },
  [MILESTONE_STATUS.UPCOMING]: {
    label: "Upcoming",
    dot: "bg-white border-neutral-300",
    text: "text-neutral-500",
    chip: "bg-neutral-50 text-neutral-600 border-neutral-200",
  },
  [MILESTONE_STATUS.OVERDUE]: {
    label: "Overdue",
    dot: "bg-warning-500 border-warning-500",
    text: "text-warning-700",
    chip: "bg-warning-50 text-warning-700 border-warning-200",
  },
  [MILESTONE_STATUS.CANCELLED]: {
    label: "Cancelled",
    dot: "bg-neutral-200 border-neutral-300",
    text: "text-neutral-400",
    chip: "bg-neutral-50 text-neutral-400 border-neutral-200",
  },
});

/** Mirrors `GatewayCriterionStatus` in the API. */
export const CRITERION_STATUS = Object.freeze({
  COMPLETE: "complete",
  IN_PROGRESS: "in_progress",
  NOT_STARTED: "not_started",
  BLOCKED: "blocked",
});

/** F3.2.2 AC2 — complete / in progress / not started. AC3 adds blocked. */
export const CRITERION_PRESENTATION = Object.freeze({
  [CRITERION_STATUS.COMPLETE]: {
    label: "Complete",
    chip: "bg-success-50 text-success-700 border-success-200",
  },
  [CRITERION_STATUS.IN_PROGRESS]: {
    label: "In progress",
    chip: "bg-primary-50 text-primary-700 border-primary-200",
  },
  [CRITERION_STATUS.NOT_STARTED]: {
    label: "Not started",
    chip: "bg-neutral-50 text-neutral-600 border-neutral-200",
  },
  [CRITERION_STATUS.BLOCKED]: {
    label: "Blocked",
    chip: "bg-warning-50 text-warning-700 border-warning-200",
  },
});

/**
 * Mirrors `EpaCountdownBand` in the API
 * (`src/enrolments/enums/epa-countdown-band.enum.ts`).
 *
 * The bands are evaluated **server-side** and read here. F3.2.3 AC2 sets the
 * thresholds (≥90 green / 30–89 amber / ≤29 red); this file must not re-derive
 * them from `daysToEpa`, or the boundary would exist in two places and drift —
 * which is exactly the defect that put day 90 in the wrong band before.
 */
export const EPA_BAND = Object.freeze({
  GREEN: "green",
  AMBER: "amber",
  RED: "red",
  OVERDUE: "overdue",
  UNSET: "unset",
});

export const EPA_BAND_PRESENTATION = Object.freeze({
  [EPA_BAND.GREEN]: {
    ring: "text-success-500",
    value: "text-success-700",
    surface: "bg-success-50 border-success-200",
  },
  [EPA_BAND.AMBER]: {
    ring: "text-warning-500",
    value: "text-warning-700",
    surface: "bg-warning-50 border-warning-200",
  },
  [EPA_BAND.RED]: {
    ring: "text-error-500",
    value: "text-error-700",
    surface: "bg-error-50 border-error-200",
  },
  [EPA_BAND.OVERDUE]: {
    ring: "text-error-500",
    value: "text-error-700",
    surface: "bg-error-50 border-error-200",
  },
  [EPA_BAND.UNSET]: {
    ring: "text-neutral-400",
    value: "text-neutral-600",
    surface: "bg-neutral-50 border-neutral-200",
  },
});

/** F3.2.3 AC3 — the exact copy the PRD specifies when no date is set. */
export const EPA_DATE_UNSET_MESSAGE =
  "EPA date not yet confirmed — speak to your tutor";

/**
 * Mirrors `OtjProgressBand` in the API
 * (`src/otj/enums/otj-progress-band.enum.ts`).
 *
 * F3.1.2 AC2 sets the ring colours. As with the EPA bands, the thresholds are
 * evaluated server-side (`src/otj/otj-progress.ts`) and only read here.
 */
export const PROGRESS_BAND = Object.freeze({
  GREEN: "green",
  AMBER: "amber",
  RED: "red",
  UNKNOWN: "unknown",
});

export const PROGRESS_BAND_PRESENTATION = Object.freeze({
  [PROGRESS_BAND.GREEN]: {
    ring: "text-success-500",
    bar: "bg-success-500",
    value: "text-success-700",
  },
  [PROGRESS_BAND.AMBER]: {
    ring: "text-warning-500",
    bar: "bg-warning-500",
    value: "text-warning-700",
  },
  [PROGRESS_BAND.RED]: {
    ring: "text-error-500",
    bar: "bg-error-500",
    value: "text-error-700",
  },
  [PROGRESS_BAND.UNKNOWN]: {
    ring: "text-neutral-300",
    bar: "bg-neutral-300",
    value: "text-neutral-600",
  },
});

/** F3.1.2 AC4 — the weekly chart covers the last 8 weeks. */
export const OTJ_WEEKS_SHOWN = 8;
