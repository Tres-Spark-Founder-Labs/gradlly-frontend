export const ENROLMENT_PATHS = Object.freeze({
  BASE: "/api/v1/enrolments",
  counterpartOrganisationLookup:
    "/api/v1/enrolments/counterpart-organisations/lookup",
  byId: (id) => `/api/v1/enrolments/${id}`,
  participantOptions: (id) => `/api/v1/enrolments/${id}/participant-options`,
  journey: (id) => `/api/v1/enrolments/${id}/journey`,
  participants: (id) => `/api/v1/enrolments/${id}/participants`,
  organisationLinks: (id) => `/api/v1/enrolments/${id}/organisation-links`,
  activate: (id) => `/api/v1/enrolments/${id}/activate`,
  acceptProvider: (id) => `/api/v1/enrolments/${id}/accept-provider`,
  complete: (id) => `/api/v1/enrolments/${id}/complete`,
  epaOutcome: (id) => `/api/v1/enrolments/${id}/epa-outcome`,
  cancel: (id) => `/api/v1/enrolments/${id}/cancel`,
  // F2.2.4 AC6 — start, end, and the history behind the current break.
  breakInLearning: (id) => `/api/v1/enrolments/${id}/break-in-learning`,
  breakInLearningEnd: (id) => `/api/v1/enrolments/${id}/break-in-learning/end`,
});

// ─── Break in learning (F2.2.4 AC6) ──────────────────────────────────────────
/**
 * The ESFA's own reason list. These are not free text on the ILR — a break is
 * reported with a coded reason, so offering the tutor an open box here would
 * only mean someone re-coding it by hand at submission time.
 */
export const BREAK_IN_LEARNING_REASONS = [
  { value: "Illness", text: "Illness" },
  { value: "Maternity leave", text: "Maternity leave" },
  { value: "Paternity leave", text: "Paternity leave" },
  { value: "Caring responsibilities", text: "Caring responsibilities" },
  { value: "Employer circumstances", text: "Employer circumstances" },
  { value: "Personal circumstances", text: "Personal circumstances" },
  { value: "Other", text: "Other" },
];

// ─── Lifecycle status (`EnrolmentStatus`) ───────────────────────────────────
export const ENROLMENT_STATUS = Object.freeze({
  DRAFT: "draft",
  ACTIVE: "active",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
});

export const ENROLMENT_STATUS_LABELS = Object.freeze({
  draft: "Draft",
  active: "Active",
  completed: "Completed",
  cancelled: "Cancelled",
});

// ─── Pipeline state (`EnrolmentPipelineState`) — forward-only / monotonic ────
export const PIPELINE_STATE = Object.freeze({
  INVITED: "invited",
  ACCOUNT_CREATED: "account_created",
  PROVIDER_ACCEPTED: "provider_accepted",
  ILR_CREATED: "ilr_created",
  DAS_CONFIRMED: "das_confirmed",
});

export const PIPELINE_STATE_LABELS = Object.freeze({
  invited: "Invited",
  account_created: "Account created",
  provider_accepted: "Provider accepted",
  ilr_created: "ILR created",
  das_confirmed: "DAS confirmed",
});

// Ordered for progress rendering (index === how far along the pipeline).
export const PIPELINE_STATE_ORDER = [
  PIPELINE_STATE.INVITED,
  PIPELINE_STATE.ACCOUNT_CREATED,
  PIPELINE_STATE.PROVIDER_ACCEPTED,
  PIPELINE_STATE.ILR_CREATED,
  PIPELINE_STATE.DAS_CONFIRMED,
];

// ─── EPA outcome (`EpaOutcome`) ──────────────────────────────────────────────
export const EPA_OUTCOME = Object.freeze({
  PASS: "pass",
  MERIT: "merit",
  DISTINCTION: "distinction",
  FAIL: "fail",
});

export const EPA_OUTCOME_LABELS = Object.freeze({
  pass: "Pass",
  merit: "Merit",
  distinction: "Distinction",
  fail: "Fail",
});

export const EPA_OUTCOME_OPTIONS = [
  { value: EPA_OUTCOME.PASS, text: "Pass" },
  { value: EPA_OUTCOME.MERIT, text: "Merit" },
  { value: EPA_OUTCOME.DISTINCTION, text: "Distinction" },
  { value: EPA_OUTCOME.FAIL, text: "Fail" },
];

export const EPA_OUTCOME_VALUES = Object.values(EPA_OUTCOME);

// ─── OTJ pace alert (`OtjPaceAlertLevel`) ────────────────────────────────────
export const OTJ_PACE_LEVEL = Object.freeze({
  ON_TRACK: "on_track",
  AT_RISK: "at_risk",
  OFF_TRACK: "off_track",
});

export const OTJ_PACE_LABELS = Object.freeze({
  on_track: "On track",
  at_risk: "At risk",
  off_track: "Off track",
});

// ─── EPA countdown band (journey response) ───────────────────────────────────
export const EPA_COUNTDOWN_BAND = Object.freeze({
  GREEN: "green",
  AMBER: "amber",
  RED: "red",
  UNSET: "unset",
});

// ─── Lifecycle action keys (for the actions menu) ────────────────────────────
export const ENROLMENT_ACTION = Object.freeze({
  ACTIVATE: "activate",
  ACCEPT_PROVIDER: "accept-provider",
  COMPLETE: "complete",
  EPA_OUTCOME: "epa-outcome",
  CANCEL: "cancel",
});

// ─── Transition guards ───────────────────────────────────────────────────────
//
// Mirror the backend state machines so the UI only offers valid actions. The
// backend remains the source of truth (and is idempotent), but gating here
// avoids predictable 400s and guides the user.

const CANCELLABLE = new Set([ENROLMENT_STATUS.DRAFT, ENROLMENT_STATUS.ACTIVE]);

const PIPELINE_INDEX = PIPELINE_STATE_ORDER.reduce((acc, state, i) => {
  acc[state] = i;
  return acc;
}, {});

// Provider acceptance requires status === active and pipeline at least
// account_created, and the enrolment must not already be accepted further.
function canAcceptProvider(enrolment) {
  if (enrolment?.status !== ENROLMENT_STATUS.ACTIVE) return false;
  const idx = PIPELINE_INDEX[enrolment?.pipelineState] ?? -1;
  return (
    idx >= PIPELINE_INDEX[PIPELINE_STATE.ACCOUNT_CREATED] &&
    idx < PIPELINE_INDEX[PIPELINE_STATE.PROVIDER_ACCEPTED]
  );
}

/**
 * Returns the set of lifecycle actions currently available for an enrolment.
 * @returns {{ activate:boolean, acceptProvider:boolean, complete:boolean, recordEpa:boolean, cancel:boolean }}
 */
export function getAvailableActions(enrolment) {
  const status = enrolment?.status ?? null;
  return {
    activate: status === ENROLMENT_STATUS.DRAFT,
    acceptProvider: canAcceptProvider(enrolment),
    complete: status === ENROLMENT_STATUS.ACTIVE,
    // EPA outcome is recorded only after completion. The DTO does not expose
    // whether one already exists, so we always offer it for completed enrolments
    // and let the backend's 409 ("already recorded") guard be the source of truth.
    recordEpa: status === ENROLMENT_STATUS.COMPLETED,
    cancel: CANCELLABLE.has(status),
  };
}

export function hasAnyAction(enrolment) {
  const a = getAvailableActions(enrolment);
  return (
    a.activate || a.acceptProvider || a.complete || a.recordEpa || a.cancel
  );
}
