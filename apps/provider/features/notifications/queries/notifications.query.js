"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { toastError } from "@/hooks/useToast";

import { NOTIFICATION_QUERY_KEYS } from "./keys";
import {
  getNotificationPreferences,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  updateNotificationPreferences,
} from "../services/notifications.service";

// Refetch the unread badge periodically so it stays roughly live.
const UNREAD_POLL_MS = 60_000;

/**
 * Paginated notifications list, scoped to the active organisation when present.
 */
export function useNotifications({
  page = 1,
  perPage = 20,
  unreadOnly = false,
  ...options
} = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: NOTIFICATION_QUERY_KEYS.list(orgId, {
      page,
      perPage,
      unreadOnly,
    }),
    queryFn: () =>
      listNotifications({ organisationId: orgId, page, perPage, unreadOnly }),
    enabled: !!orgId,
    placeholderData: keepPreviousData,
    select: (response) => ({
      notifications: response?.data ?? [],
      meta: response?.meta ?? null,
    }),
    ...options,
  });
}

/**
 * Lightweight unread-count query used by the header bell badge. Derives the
 * count from the paginated meta of an `unreadOnly` request.
 */
export function useUnreadNotificationCount(options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: NOTIFICATION_QUERY_KEYS.unreadCount(orgId),
    queryFn: () =>
      listNotifications({
        organisationId: orgId,
        unreadOnly: true,
        page: 1,
        perPage: 1,
      }),
    enabled: !!orgId,
    refetchInterval: UNREAD_POLL_MS,
    refetchOnWindowFocus: true,
    select: (response) => response?.meta?.total ?? 0,
    ...options,
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id) => markNotificationRead({ id }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.all() });
    },
    onError: (error) => {
      toastError(error.message || "Failed to update notification.");
    },
  });
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  const { orgId } = useAuthUser();

  return useMutation({
    mutationFn: () => markAllNotificationsRead({ organisationId: orgId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.all() });
    },
    onError: (error) => {
      toastError(error.message || "Failed to mark all as read.");
    },
  });
}

/** F3.4.3 AC3 — the signed-in user's per-type preferences. */
export function useNotificationPreferences(options = {}) {
  const { user } = useAuthUser();
  const userId = user?.id;

  return useQuery({
    queryKey: NOTIFICATION_QUERY_KEYS.preferences(userId),
    queryFn: getNotificationPreferences,
    enabled: !!userId,
    ...options,
  });
}

/**
 * Optimistic: the cached matrix takes the change at once, the server's answer
 * replaces it, and a refusal restores what was there and says why.
 */
export function useUpdateNotificationPreferences() {
  const qc = useQueryClient();
  const { user } = useAuthUser();
  const key = NOTIFICATION_QUERY_KEYS.preferences(user?.id);

  return useMutation({
    mutationFn: (preferences) => updateNotificationPreferences(preferences),
    onMutate: async (preferences) => {
      await qc.cancelQueries({ queryKey: key });
      const previous = qc.getQueryData(key);
      qc.setQueryData(key, (current) =>
        applyPreferenceChanges(current, preferences),
      );
      return { previous };
    },
    onError: (error, _preferences, context) => {
      qc.setQueryData(key, context?.previous);
      toastError(error?.message ?? "Your preference could not be saved.");
    },
    onSuccess: (matrix) => {
      qc.setQueryData(key, matrix);
    },
  });
}

/** The cached matrix with each { channel, type, enabled } applied. */
function applyPreferenceChanges(matrix, preferences) {
  if (!matrix || !Array.isArray(matrix.types)) return matrix;
  return {
    ...matrix,
    types: matrix.types.map((entry) => ({
      ...entry,
      channels: (Array.isArray(entry.channels) ? entry.channels : []).map(
        (channel) => {
          const change = preferences.find(
            (p) => p.type === entry.type && p.channel === channel.channel,
          );
          return change ? { ...channel, enabled: change.enabled } : channel;
        },
      ),
    })),
  };
}
