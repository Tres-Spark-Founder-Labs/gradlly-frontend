export const NOTIFICATION_QUERY_KEYS = {
  all: () => ["notifications"],
  list: (orgId, { page = 1, perPage = 20, unreadOnly = false } = {}) => [
    "notifications",
    "list",
    orgId,
    { page, perPage, unreadOnly },
  ],
  unreadCount: (orgId) => ["notifications", "unread-count", orgId],
  // Per user, not per organisation: the preference follows the person.
  preferences: (userId) => ["notifications", "preferences", userId],
};
