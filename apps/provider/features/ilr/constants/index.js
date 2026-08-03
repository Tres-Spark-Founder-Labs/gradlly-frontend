export const ILR_PATHS = Object.freeze({
  // Learner records
  build: "/api/v1/ilr/learner-records/build",
  records: "/api/v1/ilr/learner-records",
  recordById: (id) => `/api/v1/ilr/learner-records/${id}`,
  validate: (id) => `/api/v1/ilr/learner-records/${id}/validate`,
  validationReport: (id) =>
    `/api/v1/ilr/learner-records/${id}/validation-report`,
  submit: (id) => `/api/v1/ilr/learner-records/${id}/submit`,
  amend: (id) => `/api/v1/ilr/learner-records/${id}/amend`,
  recordSubmissions: (id) => `/api/v1/ilr/learner-records/${id}/submissions`,

  // F2.3.2 AC7 — funding claim tracker.
  fundingClaims: "/api/v1/ilr/funding-claims",
  fundingClaimResolution: (enrolmentId) =>
    `/api/v1/ilr/funding-claims/${enrolmentId}/resolution`,

  // Submissions (poll)
  submissionById: (id) => `/api/v1/ilr/submissions/${id}`,

  // Mapping configs
  mappingConfigs: "/api/v1/ilr/mapping-configs",
  mappingConfigActive: "/api/v1/ilr/mapping-configs/active",
  mappingConfigPublish: (id) => `/api/v1/ilr/mapping-configs/${id}/publish`,
});

// ─── Learner record status (`IlrLearnerRecordStatus`) ────────────────────────
export const ILR_RECORD_STATUS = Object.freeze({
  DRAFT: "draft",
  VALIDATED: "validated",
  VALIDATION_FAILED: "validation_failed",
});

export const ILR_RECORD_STATUS_LABELS = Object.freeze({
  draft: "Draft",
  validated: "Validated",
  validation_failed: "Validation failed",
});

export const ILR_RECORD_STATUS_FILTER_OPTIONS = [
  { value: "", text: "All statuses" },
  { value: ILR_RECORD_STATUS.DRAFT, text: "Draft" },
  { value: ILR_RECORD_STATUS.VALIDATED, text: "Validated" },
  { value: ILR_RECORD_STATUS.VALIDATION_FAILED, text: "Validation failed" },
];

// ─── Submission status (`IlrSubmissionStatus`) — async ───────────────────────
export const ILR_SUBMISSION_STATUS = Object.freeze({
  QUEUED: "queued",
  PROCESSING: "processing",
  SUBMITTED: "submitted",
  FAILED: "failed",
});

export const ILR_SUBMISSION_STATUS_LABELS = Object.freeze({
  queued: "Queued",
  processing: "Processing",
  submitted: "Submitted",
  failed: "Failed",
});

export const ILR_SUBMISSION_TERMINAL = new Set([
  ILR_SUBMISSION_STATUS.SUBMITTED,
  ILR_SUBMISSION_STATUS.FAILED,
]);

export function isSubmissionInFlight(submission) {
  return (
    submission?.status === ILR_SUBMISSION_STATUS.QUEUED ||
    submission?.status === ILR_SUBMISSION_STATUS.PROCESSING
  );
}

// ─── Mapping config status ───────────────────────────────────────────────────
export const ILR_CONFIG_STATUS = Object.freeze({
  DRAFT: "draft",
  PUBLISHED: "published",
  SUPERSEDED: "superseded",
});

export const ILR_CONFIG_STATUS_LABELS = Object.freeze({
  draft: "Draft",
  published: "Published",
  superseded: "Superseded",
});

// ─── Validation severity ─────────────────────────────────────────────────────
export const VALIDATION_SEVERITY = Object.freeze({
  ERROR: "error",
  WARN: "warn",
});

// ─── Record action gating (mirror the backend) ───────────────────────────────
/**
 * Actions available for a learner record.
 * @param {object}  record         the IlrLearnerRecord
 * @param {boolean} canSubmit      user is owner/admin (submit/amend gate)
 * @param {object}  latestSubmission  most recent submission (for amend/in-flight gates)
 */
export function getIlrRecordActions(
  record,
  { canSubmit, latestSubmission } = {},
) {
  const status = record?.status ?? null;
  const inFlight = isSubmissionInFlight(latestSubmission);
  const hasSuccessful =
    latestSubmission?.status === ILR_SUBMISSION_STATUS.SUBMITTED;

  return {
    validate: true, // always available (refreshes status)
    submit: status === ILR_RECORD_STATUS.VALIDATED && canSubmit && !inFlight,
    amend: hasSuccessful && canSubmit && !inFlight,
    inFlight,
  };
}

// ─── Funding claim tracker (F2.3.2 AC7) ──────────────────────────────────────

export const FUNDING_DISCREPANCY = Object.freeze({
  NONE: "none",
  CLAWBACK: "clawback",
  SHORTFALL: "shortfall",
  OVERPAYMENT: "overpayment",
});

/**
 * "None" deliberately reads as reconciled rather than as an absence. An active
 * learner who has received part of their funding is on track, not unexamined —
 * the backend only calls a shortfall a shortfall once the programme completes.
 */
export const FUNDING_DISCREPANCY_LABELS = Object.freeze({
  none: "Reconciled",
  clawback: "Clawback",
  shortfall: "Shortfall",
  overpayment: "Overpayment",
});

export const FUNDING_DISCREPANCY_CLASSES = Object.freeze({
  none: "bg-neutral-100 text-neutral-600",
  clawback: "bg-rose-50 text-rose-700",
  shortfall: "bg-amber-50 text-amber-700",
  overpayment: "bg-sky-50 text-sky-700",
});

export const FUNDING_RESOLUTION = Object.freeze({
  OPEN: "open",
  INVESTIGATING: "investigating",
  RESOLVED: "resolved",
  WRITTEN_OFF: "written_off",
});

export const FUNDING_RESOLUTION_LABELS = Object.freeze({
  open: "Open",
  investigating: "Investigating",
  resolved: "Resolved",
  written_off: "Written off",
});

export const FUNDING_RESOLUTION_VALUES = Object.values(FUNDING_RESOLUTION);

export const FUNDING_RESOLUTION_OPTIONS = [
  { value: FUNDING_RESOLUTION.OPEN, text: "Open" },
  { value: FUNDING_RESOLUTION.INVESTIGATING, text: "Investigating" },
  { value: FUNDING_RESOLUTION.RESOLVED, text: "Resolved" },
  { value: FUNDING_RESOLUTION.WRITTEN_OFF, text: "Written off" },
];

// Statuses that close a claim, and so require a note. Mirrors the backend.
export const FUNDING_RESOLUTION_CLOSING = [
  FUNDING_RESOLUTION.RESOLVED,
  FUNDING_RESOLUTION.WRITTEN_OFF,
];
