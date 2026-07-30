export const REPORTING_QUERY_KEYS = {
  all: () => ["reporting"],
  employerDashboard: (orgId) => ["reporting", "employer-dashboard", orgId],
  levyUtilisation: (orgId) => ["reporting", "levy-utilisation", orgId],
  levyRoi: (orgId) => ["reporting", "levy-roi", orgId],
  levyRoiBreakdown: (orgId, groupBy) => [
    "reporting",
    "levy-roi-breakdown",
    orgId,
    groupBy,
  ],
};
