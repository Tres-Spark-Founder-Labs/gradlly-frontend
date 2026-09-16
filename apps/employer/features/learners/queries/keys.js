export const LEARNER_QUERY_KEYS = {
  all: () => ["learners"],
  profile: (orgId, enrolmentId) => ["learners", "profile", orgId, enrolmentId],
  otjWeekly: (orgId, enrolmentId) => [
    "learners",
    "otj-weekly",
    orgId,
    enrolmentId,
  ],
};
