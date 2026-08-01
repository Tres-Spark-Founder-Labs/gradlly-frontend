export const REPORTING_PATHS = Object.freeze({
  EMPLOYER_DASHBOARD: "/api/v1/reporting/employer-dashboard",
  LEVY_UTILISATION: "/api/v1/reporting/levy-utilisation",
  LEVY_ROI: "/api/v1/reporting/levy-roi",
  LEVY_ROI_BREAKDOWN: "/api/v1/reporting/levy-roi/breakdown",
  LEVY_ROI_EXPORT: "/api/v1/reporting/levy-roi/export",
  // F1.4.1 AC5 — who receives the scheduled monthly report.
  LEVY_ROI_SUBSCRIBERS: "/api/v1/reporting/levy-roi/subscribers",
  // F1.4.2 AC3 — provider comparison exports.
  PROVIDER_COMPARISON_CSV: "/api/v1/reporting/levy-roi/provider-comparison.csv",
  PROVIDER_COMPARISON_EXPORT:
    "/api/v1/reporting/levy-roi/provider-comparison/export",
});

export const LEVY_ROI_BREAKDOWN_GROUP = Object.freeze({
  PROVIDER: "provider",
  STANDARD: "standard",
});
