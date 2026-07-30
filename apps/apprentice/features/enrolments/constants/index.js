export const ENROLMENT_PATHS = Object.freeze({
  BASE: "/api/v1/enrolments",
  byId: (id) => `/api/v1/enrolments/${id}`,
  journey: (id) => `/api/v1/enrolments/${id}/journey`,
});

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

export const PIPELINE_STATE_LABELS = Object.freeze({
  invited: "Invited",
  account_created: "Account created",
  provider_accepted: "Provider accepted",
  ilr_created: "ILR created",
  das_confirmed: "DAS confirmed",
});
