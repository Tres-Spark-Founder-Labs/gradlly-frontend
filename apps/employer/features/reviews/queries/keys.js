export const REVIEW_QUERY_KEYS = {
  all: () => ["reviews"],
  list: (orgId, params = {}) => ["reviews", "list", orgId, params],
  detail: (orgId, id) => ["reviews", "detail", orgId, id],
  record: (orgId, id) => ["reviews", "record", orgId, id],
};
