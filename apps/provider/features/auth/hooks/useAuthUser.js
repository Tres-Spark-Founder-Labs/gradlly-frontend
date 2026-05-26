"use client";

import { useMe } from "@/features/auth/queries/auth.query";

/**
 * Public interface to the current authenticated user.
 *
 * Wraps useMe so consumers never import from the query layer directly.
 * All dashboard components should use this hook — never useMe.
 */
export function useAuthUser() {
  const { data, isLoading, isError, error } = useMe();
  return {
    user: data ?? null,
    activeOrganisation: data?.activeOrganisation ?? null,
    isLoading,
    isError,
    error,
  };
}
