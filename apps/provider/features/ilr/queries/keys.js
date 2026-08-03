export const ILR_QUERY_KEYS = {
  all: () => ["ilr"],
  records: (orgId, params = {}) => ["ilr", "records", orgId, params],
  // F2.3.2 AC7.
  fundingClaims: (orgId, params = {}) => [
    "ilr",
    "funding-claims",
    orgId,
    params,
  ],
  record: (orgId, id) => ["ilr", "record", orgId, id],
  validationReport: (orgId, id) => ["ilr", "validation-report", orgId, id],
  recordSubmissions: (orgId, id) => ["ilr", "record-submissions", orgId, id],
  submission: (orgId, id) => ["ilr", "submission", orgId, id],
  mappingConfigs: (orgId) => ["ilr", "mapping-configs", orgId],
  mappingConfigActive: (orgId, year) => [
    "ilr",
    "mapping-config-active",
    orgId,
    year,
  ],
};
