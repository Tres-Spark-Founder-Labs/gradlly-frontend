export const EMPLOYER_VISIT_QUERY_KEYS = {
  all: () => ["employer-visits"],
  list: (orgId, params = {}) => ["employer-visits", "list", orgId, params],
  detail: (orgId, id) => ["employer-visits", "detail", orgId, id],
  nextSuggestion: (orgId, employerOrganisationId) => [
    "employer-visits",
    "next-suggestion",
    orgId,
    employerOrganisationId,
  ],
};
