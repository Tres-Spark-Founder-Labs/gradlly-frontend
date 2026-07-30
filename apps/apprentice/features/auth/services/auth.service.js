"use client";

import { $apiClient } from "@/lib/api/client";
import { ApiClientError, normalizeApiClientError } from "@/lib/errors";

import { AUTH_API_PATHS } from "../constants";

export async function login(credentials) {
  try {
    const result = await $apiClient.post(AUTH_API_PATHS.LOGIN, credentials);
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function signup(data) {
  try {
    const result = await $apiClient.post(AUTH_API_PATHS.SIGNUP, data);
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function verifyEmail({ token }) {
  try {
    const result = await $apiClient.post(AUTH_API_PATHS.VERIFY_EMAIL, {
      token,
    });
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function resendVerificationEmail({ email }) {
  try {
    const result = await $apiClient.post(AUTH_API_PATHS.RESEND_VERIFICATION, {
      email,
    });
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function logout() {
  await $apiClient.post(AUTH_API_PATHS.LOGOUT);
}

export async function forgotPassword({ email }) {
  try {
    const result = await $apiClient.post(AUTH_API_PATHS.FORGOT_PASSWORD, {
      email,
    });
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function resetPassword({ token, password }) {
  try {
    const result = await $apiClient.post(AUTH_API_PATHS.RESET_PASSWORD, {
      token,
      password,
    });
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getMe() {
  try {
    const result = await $apiClient.get(AUTH_API_PATHS.ME);
    return result.data?.data ?? result.data;
  } catch (e) {
    // 401 means the session is dead (proxy already attempted refresh and failed)
    if (e instanceof ApiClientError && e.status === 401) return null;
    throw normalizeApiClientError(e);
  }
}

export async function updateMe(payload) {
  try {
    const result = await $apiClient.patch(AUTH_API_PATHS.ME, payload);
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

// ─── MFA ────────────────────────────────────────────────────────────────────

export async function enrollMfa() {
  try {
    const result = await $apiClient.post(AUTH_API_PATHS.MFA_ENROLL);
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function confirmMfa({ code }) {
  try {
    const result = await $apiClient.post(AUTH_API_PATHS.MFA_CONFIRM, { code });
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function disableMfa({ code }) {
  try {
    const result = await $apiClient.post(AUTH_API_PATHS.MFA_DISABLE, { code });
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

/** Completes login started by a login() MFA challenge. */
export async function verifyMfaChallenge({
  challengeToken,
  code,
  recoveryCode,
}) {
  try {
    const result = await $apiClient.post(AUTH_API_PATHS.MFA_VERIFY, {
      challengeToken,
      code,
      recoveryCode,
    });
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
