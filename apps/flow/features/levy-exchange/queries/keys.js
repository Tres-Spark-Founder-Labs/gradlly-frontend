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
  // Everything under ["levy-exchange", "transfers"] is invalidated together
  // after a signature: the list row, the detail and the document all change.
  transfers: (orgId, params = {}) => [
    "levy-exchange",
    "transfers",
    orgId,
    params,
  ],
  transfer: (orgId, id) => ["levy-exchange", "transfers", orgId, "detail", id],
  transferDocument: (orgId, id) => [
    "levy-exchange",
    "transfers",
    orgId,
    "document",
    id,
  ],
});
