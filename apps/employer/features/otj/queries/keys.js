export const OTJ_QUERY_KEYS = {
  all: () => ["otj"],
  list: (orgId, filters = {}) => ["otj", "list", orgId, filters],
};

/**
 * F1.2.3 AC7. Deliberately not keyed by organisation — the cadence belongs to
 * the user, so keying it per org would cache the same value under several
 * keys and let them drift apart after a save.
 */
export const NOTIFICATION_QUERY_KEYS = {
  all: () => ["notifications"],
  digestPreference: () => ["notifications", "digest-preference"],
};
