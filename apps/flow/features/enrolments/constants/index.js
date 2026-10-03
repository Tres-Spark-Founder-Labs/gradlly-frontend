export const ENROLMENT_PATHS = Object.freeze({
  BASE: "/api/v1/enrolments",
  // The three parties on one enrolment. Keyed by the enrolment on purpose: a
  // review spans three organisations, and the enrolment is what entitles this
  // caller to see those people at all. There is no platform-wide user lookup,
  // and asking for one would be asking for a tenancy leak.
  participantOptions: (id) => `/api/v1/enrolments/${id}/participant-options`,
});
