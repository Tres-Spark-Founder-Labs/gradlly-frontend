// ============================================================
// FILE: apps/provider/features/auth/queries/keys.js
// ============================================================

export const AUTH_QUERY_KEYS = Object.freeze({
  all: () => ["auth"],
  me: () => [...AUTH_QUERY_KEYS.all(), "me"],
});
