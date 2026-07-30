"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { PORTAL } from "@/config/portal.config";
import { AUTH_REDIRECTS, safeRedirectPath } from "@/features/auth/constants";
import { AUTH_QUERY_KEYS } from "@/features/auth/queries/keys";
import {
  confirmMfa,
  disableMfa,
  enrollMfa,
  forgotPassword,
  getMe,
  login,
  logout,
  resendVerificationEmail,
  resetPassword,
  signup,
  updateMe,
  verifyEmail,
  verifyMfaChallenge,
} from "@/features/auth/services/auth.service";
import { toastError, toastSuccess } from "@/hooks/useToast";
import { setActiveOrgId } from "@/lib/api/active-org";
import { ERROR_CODES } from "@/lib/errors";
import { STALE_TIMES } from "@/lib/react-query/query.config";

export function useMe(options = {}) {
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.me(),
    queryFn: getMe,
    staleTime: STALE_TIMES.USER_SESSION,
    ...options,
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: updateMe,
    onSuccess: (data) => {
      toastSuccess(data?.message || "Profile updated successfully.");
      qc.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.me() });
    },
    onError: (error) => {
      if (error.code !== ERROR_CODES.VALIDATION) toastError(error.message);
    },
  });
}

export function useLogin({ redirectTo } = {}) {
  const router = useRouter();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      // Account has MFA enabled: no session was opened yet — the caller
      // (LoginForm) switches to the code-entry step using data.challengeToken.
      if (data?.mfaRequired) return;

      toastSuccess(data?.message || "Welcome back!");
      qc.removeQueries({ queryKey: AUTH_QUERY_KEYS.me() });
      router.refresh();
      // Honour a safe post-login redirect (e.g. returning to an invite link).
      router.replace(safeRedirectPath(redirectTo));
    },
    onError: (error) => {
      if (error.code !== ERROR_CODES.VALIDATION) {
        toastError(error.message);
      }
    },
  });
}

/** Completes login after a useLogin() call returned { mfaRequired: true }. */
export function useVerifyMfaChallenge({ redirectTo } = {}) {
  const router = useRouter();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: verifyMfaChallenge,
    onSuccess: (data) => {
      toastSuccess(data?.message || "Welcome back!");
      qc.removeQueries({ queryKey: AUTH_QUERY_KEYS.me() });
      router.refresh();
      router.replace(safeRedirectPath(redirectTo));
    },
    onError: (error) => {
      if (error.code !== ERROR_CODES.VALIDATION) {
        toastError(error.message);
      }
    },
  });
}

export function useEnrollMfa() {
  return useMutation({
    mutationFn: enrollMfa,
    onError: (error) => {
      toastError(error.message || "Could not start MFA setup.");
    },
  });
}

export function useConfirmMfa() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: confirmMfa,
    onSuccess: () => {
      toastSuccess("MFA enabled. Save your recovery codes somewhere safe.");
      qc.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.me() });
    },
    onError: (error) => {
      if (error.code !== ERROR_CODES.VALIDATION) {
        toastError(error.message || "Invalid code.");
      }
    },
  });
}

export function useDisableMfa() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: disableMfa,
    onSuccess: () => {
      toastSuccess("MFA disabled.");
      qc.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.me() });
    },
    onError: (error) => {
      if (error.code !== ERROR_CODES.VALIDATION) {
        toastError(error.message || "Invalid code.");
      }
    },
  });
}

export function useSignup({ redirectTo } = {}) {
  const router = useRouter();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: signup,
    onSuccess: (data, variables) => {
      toastSuccess(data?.message || "Account created! Check your inbox.");
      qc.removeQueries({ queryKey: AUTH_QUERY_KEYS.me() });
      localStorage.setItem(
        PORTAL.emailVerification.storageKey,
        String(Date.now()),
      );
      const email = encodeURIComponent(variables.email);
      const redirect = redirectTo
        ? `&redirect=${encodeURIComponent(redirectTo)}`
        : "";
      router.refresh();
      router.replace(
        `${AUTH_REDIRECTS.VERIFY_EMAIL_PAGE}?email=${email}${redirect}`,
      );
    },
    onError: (error) => {
      if (error.code !== ERROR_CODES.VALIDATION) {
        toastError(error.message);
      }
    },
  });
}

export function useVerifyEmail({ redirectTo } = {}) {
  const router = useRouter();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: verifyEmail,
    onSuccess: (data) => {
      toastSuccess(data?.message || "Email verified successfully!");
      qc.removeQueries({ queryKey: AUTH_QUERY_KEYS.me() });
      router.refresh();
      router.replace(safeRedirectPath(redirectTo));
    },
    onError: (error) => {
      if (error.code !== ERROR_CODES.VALIDATION) {
        toastError(error.message);
      }
    },
  });
}

export function useResendVerification() {
  return useMutation({
    mutationFn: resendVerificationEmail,
    onSuccess: (data) => {
      toastSuccess(data?.message || "Verification email sent.");
    },
    onError: (error) => {
      toastError(error.message || "Failed to resend. Please try again.");
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data) => {
      toastSuccess(
        data?.message || "Check your inbox for a password reset link.",
      );
    },
    onError: (error) => {
      if (error.code !== ERROR_CODES.VALIDATION) {
        toastError(error.message);
      }
    },
  });
}

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      toastSuccess(
        data?.message || "Password reset successfully. Please log in.",
      );
      router.replace(AUTH_REDIRECTS.LOGIN_PAGE);
    },
    onError: (error) => {
      if (error.code !== ERROR_CODES.VALIDATION) {
        toastError(error.message);
      }
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      toastSuccess("Signed out successfully.");
    },
    onError: () => {
      toastError("Sign out failed. Redirecting for security.");
    },
    onSettled: () => {
      // Drop the active-org cookie so the next user on this browser never
      // inherits a stale X-Organisation-Id.
      setActiveOrgId(null);
      qc.clear();
      router.refresh();
      router.replace(AUTH_REDIRECTS.LOGIN_PAGE);
    },
  });
}
