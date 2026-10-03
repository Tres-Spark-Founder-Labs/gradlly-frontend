export const ENROLMENT_QUERY_KEYS = {
  all: () => ["enrolments"],
  participantOptions: (orgId, enrolmentId) => [
    "enrolments",
    "participant-options",
    orgId,
    enrolmentId,
  ],
};
