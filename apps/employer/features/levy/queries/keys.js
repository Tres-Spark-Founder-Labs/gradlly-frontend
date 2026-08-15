export const LEVY_QUERY_KEYS = {
  all: () => ["levy"],
  surplus: (orgId) => ["levy", "surplus", orgId],
  expiryCalendar: (orgId) => ["levy", "expiry-calendar", orgId],
  donorLinks: (orgId) => ["levy", "donor-links", orgId],
  transferPreferences: (orgId) => ["levy", "transfer-preferences", orgId],
  recipientDirectory: (orgId, params = {}) => [
    "levy",
    "recipient-directory",
    orgId,
    params,
  ],
  matchApplications: (orgId, params = {}) => [
    "levy",
    "match-applications",
    orgId,
    params,
  ],
  transfers: (orgId, params = {}) => ["levy", "transfers", orgId, params],
  transfer: (orgId, id) => ["levy", "transfer", orgId, id],
  transferDocument: (orgId, id) => ["levy", "transfer-document", orgId, id],
  donorAnalytics: (orgId) => ["levy", "donor-analytics", orgId],
  donorAnalyticsBreakdown: (orgId) => [
    "levy",
    "donor-analytics-breakdown",
    orgId,
  ],
};
