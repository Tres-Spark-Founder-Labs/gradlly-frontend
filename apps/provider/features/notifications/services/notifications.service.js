// @ts-check
"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { NOTIFICATION_PATHS } from "../constants";

/** @typedef {import("@/types/api").paths["/notifications/read-all"]["patch"]["requestBody"]["content"]["application/json"]} MarkAllReadBody */

/** @typedef {import("@/types/api").paths["/notifications"]["get"]["parameters"]["query"]} NotificationsQuery */

/** @param {NotificationsQuery} [options] */
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

/** @param {MarkAllReadBody} [options] */
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
