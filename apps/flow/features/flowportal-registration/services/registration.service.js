// @ts-check
"use client";

import { $publicApiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { REGISTRATION_PATHS } from "../constants";

function unwrap(result) {
  return result.data?.data ?? result.data;
}

// All registration endpoints are public + throttled — no auth, no org scoping.

export async function createRegistrationSession(payload = {}) {
  try {
    const result = await $publicApiClient.post(
      REGISTRATION_PATHS.SESSIONS,
      payload,
    );
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getRegistrationSessionByToken(token) {
  try {
    const result = await $publicApiClient.get(
      REGISTRATION_PATHS.byToken(token),
    );
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function saveRegistrationStep({ token, step, payload }) {
  try {
    const result = await $publicApiClient.put(
      REGISTRATION_PATHS.stepByToken(token, step),
      payload,
    );
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function completeRegistration({ token, contactEmail }) {
  try {
    const result = await $publicApiClient.post(
      REGISTRATION_PATHS.completeByToken(token),
      contactEmail ? { contactEmail } : {},
    );
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
