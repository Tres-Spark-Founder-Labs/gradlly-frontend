/**
 * Global auth service — used across all Gradlly portals.
 * All functions are plain async — no React, no TanStack Query.
 * Imported by auth queries in apps/main/features/auth/queries/
 */
import { $api } from "@/lib/api";

import type {
  AuthResponse,
  AuthSession,
  AuthTokens,
  AuthUser,
  ChangePasswordPayload,
  ForgotPasswordPayload,
  MFASetupResponse,
  MFAVerifyPayload,
  OAuthCallbackPayload,
  ResetPasswordPayload,
  SignInPayload,
  SignUpPayload,
  UpdateProfilePayload,
} from "../types";

export const signIn = async (payload: SignInPayload): Promise<AuthResponse> => {
  return $api<AuthResponse>({ endpoint: "/auth/sign-in", method: "POST", body: payload });
};

export const signOut = async (): Promise<void> => {
  await $api<void>({ endpoint: "/auth/sign-out", method: "POST" });
};

export const signUp = async (payload: SignUpPayload): Promise<AuthResponse> => {
  return $api<AuthResponse>({ endpoint: "/auth/sign-up", method: "POST", body: payload });
};

export const getMe = async (): Promise<AuthUser> => {
  return $api<AuthUser>({ endpoint: "/auth/me", method: "GET" });
};

export const refreshToken = async (token: string): Promise<AuthTokens> => {
  return $api<AuthTokens>({
    endpoint: "/auth/refresh",
    method: "POST",
    body: { refreshToken: token },
  });
};

export const revokeToken = async (): Promise<void> => {
  await $api<void>({ endpoint: "/auth/revoke", method: "POST" });
};

export const forgotPassword = async (payload: ForgotPasswordPayload): Promise<void> => {
  await $api<void>({ endpoint: "/auth/forgot-password", method: "POST", body: payload });
};

export const resetPassword = async (payload: ResetPasswordPayload): Promise<void> => {
  await $api<void>({ endpoint: "/auth/reset-password", method: "POST", body: payload });
};

export const changePassword = async (payload: ChangePasswordPayload): Promise<void> => {
  await $api<void>({ endpoint: "/auth/change-password", method: "PATCH", body: payload });
};

export const verifyEmail = async (token: string): Promise<void> => {
  await $api<void>({ endpoint: "/auth/verify-email", method: "POST", body: { token } });
};

export const resendVerificationEmail = async (email: string): Promise<void> => {
  await $api<void>({ endpoint: "/auth/resend-verification", method: "POST", body: { email } });
};

export const updateProfile = async (payload: UpdateProfilePayload): Promise<AuthUser> => {
  return $api<AuthUser>({ endpoint: "/auth/profile", method: "PATCH", body: payload });
};

export const setupMFA = async (): Promise<MFASetupResponse> => {
  return $api<MFASetupResponse>({ endpoint: "/auth/mfa/setup", method: "POST" });
};

export const verifyMFA = async (payload: MFAVerifyPayload): Promise<AuthResponse> => {
  return $api<AuthResponse>({ endpoint: "/auth/mfa/verify", method: "POST", body: payload });
};

export const disableMFA = async (code: string): Promise<void> => {
  await $api<void>({ endpoint: "/auth/mfa", method: "DELETE", body: { code } });
};

export const regenerateBackupCodes = async (
  code: string,
): Promise<{ backupCodes: string[] }> => {
  return $api<{ backupCodes: string[] }>({
    endpoint: "/auth/mfa/backup-codes",
    method: "POST",
    body: { code },
  });
};

export const getSessions = async (): Promise<AuthSession[]> => {
  return $api<AuthSession[]>({ endpoint: "/auth/sessions", method: "GET" });
};

export const revokeSession = async (sessionId: string): Promise<void> => {
  await $api<void>({ endpoint: `/auth/sessions/${sessionId}`, method: "DELETE" });
};

export const revokeAllOtherSessions = async (): Promise<void> => {
  await $api<void>({ endpoint: "/auth/sessions", method: "DELETE" });
};

export const getGovUKOneLoginUrl = async (
  redirectUri: string,
): Promise<{ url: string }> => {
  return $api<{ url: string }>({
    endpoint: "/auth/oauth/gov-uk/url",
    method: "GET",
    params: { redirectUri },
  });
};

export const handleGovUKOneLoginCallback = async (
  payload: OAuthCallbackPayload,
): Promise<AuthResponse> => {
  return $api<AuthResponse>({
    endpoint: "/auth/oauth/gov-uk/callback",
    method: "POST",
    body: payload,
  });
};
