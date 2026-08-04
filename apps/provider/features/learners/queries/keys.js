export const LEARNER_QUERY_KEYS = {
  all: () => ["learners"],
  cohort: (orgId, params = {}) => ["learners", "cohort", orgId, params],
  cohortFilterOptions: (orgId) => ["learners", "cohort-filter-options", orgId],
  interventionQueue: (orgId, params = {}) => [
    "learners",
    "intervention-queue",
    orgId,
    params,
  ],
  profile: (orgId, enrolmentId) => ["learners", "profile", orgId, enrolmentId],
  caseload: (orgId) => ["learners", "caseload", orgId],
};
