export const DAS_QUERY_KEYS = {
  all: () => ["das"],
  levyBalance: (orgId) => ["das", "levy-balance", orgId],
  levyForecast: (orgId, horizonMonths) => [
    "das",
    "levy-forecast",
    orgId,
    horizonMonths,
  ],
  // F2.3.1 AC5 / AC7.
  syncStatus: (orgId) => ["das", "sync-status", orgId],
  activity: (orgId, params = {}) => ["das", "activity", orgId, params],
  fundingPayments: (orgId, params = {}) => [
    "das",
    "funding-payments",
    orgId,
    params,
  ],
};
