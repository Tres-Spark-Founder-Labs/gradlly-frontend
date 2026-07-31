export const COMMITMENT_PATHS = Object.freeze({
  LIST: "/api/v1/commitment-statements",
  detail: (id) => `/api/v1/commitment-statements/${id}`,
  newVersion: (groupId) => `/api/v1/commitment-statements/${groupId}/versions`,
  publish: (id) => `/api/v1/commitment-statements/${id}/publish`,
  cancel: (id) => `/api/v1/commitment-statements/${id}/cancel`,
  sign: (id) => `/api/v1/commitment-statements/${id}/sign`,
  // F1.3.1 — the employer status board. Scoped by the enrolment employer
  // link, unlike LIST which is scoped to the statement owner (the provider).
  BOARD: "/api/v1/commitment-statements/board",
  // F1.3.2 AC5 / AC6
  versionHistory: (groupId) =>
    `/api/v1/commitment-statements/${groupId}/version-history`,
  signedDocument: (id) => `/api/v1/commitment-statements/${id}/signed-document`,
});

export const COMMITMENT_STATUSES = Object.freeze({
  DRAFT: "draft",
  SUBMITTED: "submitted",
  AWAITING_SIGNATURES: "awaiting_signatures",
  SIGNED: "signed",
  SUPERSEDED: "superseded",
  CANCELLED: "cancelled",
});
