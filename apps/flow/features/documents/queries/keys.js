export const DOCUMENTS_QUERY_KEYS = Object.freeze({
  all: () => ["documents"],
  learnerDocuments: (orgId, enrolmentId) => [
    "documents",
    "learner",
    orgId,
    enrolmentId,
  ],
});
