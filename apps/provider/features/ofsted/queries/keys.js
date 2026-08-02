export const OFSTED_QUERY_KEYS = {
  all: () => ["ofsted"],
  eifCriteria: (orgId) => ["ofsted", "eif-criteria", orgId],
  eifScores: (orgId) => ["ofsted", "eif-scores", orgId],
  eifScoreTrend: (orgId) => ["ofsted", "eif-score-trend", orgId],

  qipList: (orgId, params = {}) => ["ofsted", "qip", "list", orgId, params],
  qipSummary: (orgId) => ["ofsted", "qip", "summary", orgId],
  qipDetail: (orgId, id) => ["ofsted", "qip", "detail", orgId, id],

  sarReports: (orgId) => ["ofsted", "sar", "list", orgId],

  safeguarding: (orgId) => ["ofsted", "safeguarding", orgId],
  programmeDocuments: (orgId, programmeId) => [
    "ofsted",
    "programme-documents",
    orgId,
    programmeId,
  ],
  evidencePackJob: (orgId, id) => ["ofsted", "evidence-pack", orgId, id],
};
