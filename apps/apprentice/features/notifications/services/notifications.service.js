"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { NOTIFICATION_PATHS } from "../constants";

export async function listNotifications({
  organisationId,
  unreadOnly = false,
  page = 1,
  perPage = 20,
} = {}) {
  const params = { organisationId, page, perPage };
  if (unreadOnly) params.unreadOnly = true;

  try {
    const result = await $apiClient.get(NOTIFICATION_PATHS.BASE, { params });
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function markNotificationRead({ id }) {
  try {
    const result = await $apiClient.patch(NOTIFICATION_PATHS.read(id), {});
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function markAllNotificationsRead({ organisationId } = {}) {
  try {
    const result = await $apiClient.patch(NOTIFICATION_PATHS.READ_ALL, {
      organisationId,
    });
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

/**
 * F3.4.3 AC3 — every (channel, type) pair for the signed-in user, labelled,
 * each marked `configurable`. Per user, so no organisation is sent.
 */
export async function getNotificationPreferences() {
  try {
    const result = await $apiClient.get(NOTIFICATION_PATHS.PREFERENCES);
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

/** Upserts `[{ channel, type, enabled }]`; returns the whole matrix. */
export async function updateNotificationPreferences(preferences) {
  try {
    const result = await $apiClient.patch(NOTIFICATION_PATHS.PREFERENCES, {
      preferences,
    });
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

/** F3.4.3 AC4 — the server's VAPID public key; null when push is not configured. */
export async function getPushPublicKey() {
  try {
    const result = await $apiClient.get(NOTIFICATION_PATHS.PUSH_PUBLIC_KEY);
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

/** Stores this browser's subscription — `PushSubscription.toJSON()`, unchanged. */
export async function createPushSubscription(subscription) {
  try {
    const result = await $apiClient.post(
      NOTIFICATION_PATHS.PUSH_SUBSCRIPTIONS,
      subscription,
    );
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

/** Retires this browser's subscription by its endpoint. */
export async function deletePushSubscription(endpoint) {
  try {
    const result = await $apiClient.delete(
      `${NOTIFICATION_PATHS.PUSH_SUBSCRIPTIONS}?endpoint=${encodeURIComponent(endpoint)}`,
    );
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
