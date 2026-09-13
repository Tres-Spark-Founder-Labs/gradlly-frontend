export const LEVY_EXCHANGE_QUERY_KEYS = Object.freeze({
  all: () => ["levy-exchange"],
  eligibility: () => ["levy-exchange", "eligibility"],
  recipientProfile: (orgId) => ["levy-exchange", "recipient-profile", orgId],
  matchApplications: (orgId, params = {}) => [
    "levy-exchange",
    "match-applications",
    orgId,
    params,
  ],
});
