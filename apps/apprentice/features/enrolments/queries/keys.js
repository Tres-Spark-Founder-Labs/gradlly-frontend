export const ENROLMENT_QUERY_KEYS = {
  all: () => ["enrolments"],
  list: (orgId, page, perPage) => [
    "enrolments",
    "list",
    orgId,
    { page, perPage },
  ],
  journey: (orgId, id) => ["enrolments", "journey", orgId, id],
};
