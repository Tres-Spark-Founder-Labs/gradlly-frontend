export const LEARNER_QUERY_KEYS = {
  all: () => ["learners"],
  profile: (orgId, enrolmentId) => ["learners", "profile", orgId, enrolmentId],
};
