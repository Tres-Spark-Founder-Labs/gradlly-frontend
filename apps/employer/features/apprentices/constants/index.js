export const APPRENTICE_PATHS = Object.freeze({
  LIST: "/api/v1/apprentices",
  detail: (id) => `/api/v1/apprentices/${id}`,
  // F1.2.1 AC6 — queues the roster PDF; poll the returned job.
  ROSTER_EXPORT: "/api/v1/apprentices/roster/export",
});

export const APPRENTICE_STATUSES = Object.freeze({
  PENDING: "pending",
  ACTIVE: "active",
  PAUSED: "paused",
  COMPLETED: "completed",
  WITHDRAWN: "withdrawn",
});
