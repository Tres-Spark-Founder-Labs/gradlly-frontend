import { useMemo } from "react";

import { useCurrentUser } from "../queries";
import type { AuthUser, UserRole } from "../types";

/**
 * useAuth — a non-TanStack convenience hook that composes auth state
 * from useCurrentUser. This is the hook consumers import for simple
 * auth checks. It is NOT a TanStack hook itself — it calls useCurrentUser
 * internally and derives computed values from the result.
 */
export const useAuth = (): {
  user: AuthUser | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: UserRole | undefined;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
} => {
  const { user, isAuthenticated, isLoading } = useCurrentUser();

  const helpers = useMemo(
    () => ({
      hasRole: (role: UserRole): boolean => user?.role === role,
      hasAnyRole: (roles: UserRole[]): boolean =>
        user ? roles.includes(user.role) : false,
    }),
    [user],
  );

  return {
    user,
    isAuthenticated,
    isLoading,
    role: user?.role,
    hasRole: helpers.hasRole,
    hasAnyRole: helpers.hasAnyRole,
  };
};
