export const COMMITMENT_QUERY_KEYS = {
  all: () => ["commitments"],
  list: (orgId, filters) => ["commitments", "list", orgId, filters ?? {}],
  detail: (orgId, id) => ["commitments", "detail", orgId, id],
  // F1.3.1 — keyed by filters so each filtered view caches separately.
  board: (orgId, filters) => ["commitments", "board", orgId, filters ?? {}],
  versionHistory: (orgId, groupId) => [
    "commitments",
    "versions",
    orgId,
    groupId,
  ],
};
