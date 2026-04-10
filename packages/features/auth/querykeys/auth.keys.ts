/**
 * Auth query key factory — global keys used across all portals.
 * All auth queries reference these keys to ensure cache consistency.
 */
export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
  sessions: () => [...authKeys.all, "sessions"] as const,
  mfaSetup: () => [...authKeys.all, "mfa-setup"] as const,
  tokenValidity: () => [...authKeys.all, "token-validity"] as const,
} as const;
