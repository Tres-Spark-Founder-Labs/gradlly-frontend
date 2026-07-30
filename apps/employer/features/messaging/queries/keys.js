export const MESSAGING_QUERY_KEYS = {
  all: () => ["messaging"],
  unreadCount: (orgId) => ["messaging", "unread-count", orgId],
  threads: (orgId, params = {}) => ["messaging", "threads", orgId, params],
  thread: (orgId, id) => ["messaging", "thread", orgId, id],
  messages: (orgId, threadId, page, perPage) => [
    "messaging",
    "messages",
    orgId,
    threadId,
    { page, perPage },
  ],
};
