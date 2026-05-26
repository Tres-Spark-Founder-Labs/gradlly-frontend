"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { PORTAL } from "@/config/portal.config";
import { AUTH_REDIRECTS } from "@/features/auth/constants";
import { AUTH_QUERY_KEYS } from "@/features/auth/queries/keys";
import {
  forgotPassword,
  getMe,
  login,
  logout,
  resendVerificationEmail,
  resetPassword,
  signup,
  verifyEmail,
} from "@/features/auth/services/auth.service";
import { toastError, toastSuccess } from "@/hooks/useToast";
import { ERROR_CODES } from "@/lib/errors";

export function useMe(options = {}) {
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.me(),
    queryFn: getMe,
    staleTime: 30_000,
    ...options,
  });
}

export function useLogin() {
  const router = useRouter();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      toastSuccess(data?.message || "Welcome back!");
      qc.removeQueries({ queryKey: AUTH_QUERY_KEYS.me() });
      router.refresh();
      router.replace(AUTH_REDIRECTS.DASHBOARD_HOME_PAGE);
    },
    onError: (error) => {
      if (error.code !== ERROR_CODES.VALIDATION) {
        toastError(error.message);
      }
    },
  });
}

export function useSignup() {
  const router = useRouter();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: signup,
    onSuccess: (data, variables) => {
      toastSuccess(data?.message || "Account created! Check your inbox.");
      qc.removeQueries({ queryKey: AUTH_QUERY_KEYS.me() });
      // Start cooldown here so the resend button is locked on the verify-email page
      localStorage.setItem(
        PORTAL.emailVerification.storageKey,
        String(Date.now()),
      );
      const email = encodeURIComponent(variables.email);
      router.replace(`${AUTH_REDIRECTS.VERIFY_EMAIL_PAGE}?email=${email}`);
    },
    onError: (error) => {
      if (error.code !== ERROR_CODES.VALIDATION) {
        toastError(error.message);
      }
    },
  });
}

export function useVerifyEmail() {
  const router = useRouter();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: verifyEmail,
    onSuccess: (data) => {
      toastSuccess(data?.message || "Email verified successfully!");
      qc.removeQueries({ queryKey: AUTH_QUERY_KEYS.me() });
      router.refresh();
      router.replace(AUTH_REDIRECTS.DASHBOARD_HOME_PAGE);
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
    onSettled: () => {
      qc.clear();
      router.refresh();
      router.replace(AUTH_REDIRECTS.LOGIN_PAGE);
    },
  });
}
