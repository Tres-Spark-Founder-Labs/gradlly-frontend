"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { toastError } from "@/hooks/useToast";

import { MESSAGING_QUERY_KEYS } from "./keys";
import {
  getThread,
  getUnreadCount,
  listMessages,
  listThreads,
  markThreadRead,
  sendMessage,
  uploadMessageAttachment,
} from "../services/messaging.service";

const UNREAD_POLL_MS = 60_000;

export function useMessagingUnreadCount(options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: MESSAGING_QUERY_KEYS.unreadCount(orgId),
    queryFn: getUnreadCount,
    enabled: !!orgId,
    refetchInterval: UNREAD_POLL_MS,
    refetchOnWindowFocus: true,
    select: (response) => response?.unreadCount ?? 0,
    ...options,
  });
}

export function useMessageThreads(params = {}, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: MESSAGING_QUERY_KEYS.threads(orgId, params),
    queryFn: () => listThreads(params),
    enabled: !!orgId,
    select: (response) => (Array.isArray(response?.data) ? response.data : []),
    ...options,
  });
}

export function useMessageThread(id, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: MESSAGING_QUERY_KEYS.thread(orgId, id),
    queryFn: () => getThread(id),
    enabled: !!orgId && !!id,
    ...options,
  });
}

export function useMarkThreadRead() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id) => markThreadRead(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: MESSAGING_QUERY_KEYS.all() });
    },
    onError: () => {
      // Silent — marking read is a background side-effect, not worth a toast.
    },
  });
}

export function useMessages(
  threadId,
  { page = 1, perPage = 20, ...options } = {},
) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: MESSAGING_QUERY_KEYS.messages(orgId, threadId, page, perPage),
    queryFn: () => listMessages({ threadId, page, perPage }),
    enabled: !!orgId && !!threadId,
    placeholderData: keepPreviousData,
    select: (response) => ({
      messages: response?.data ?? [],
      meta: response?.meta ?? null,
    }),
    ...options,
  });
}

export function useSendMessage(threadId) {
  const qc = useQueryClient();
  const { orgId } = useAuthUser();

  return useMutation({
    mutationFn: ({ body, attachments }) =>
      sendMessage({ threadId, body, attachments }),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: MESSAGING_QUERY_KEYS.messages(orgId, threadId),
        exact: false,
      });
      qc.invalidateQueries({
        queryKey: MESSAGING_QUERY_KEYS.threads(orgId, {}),
      });
      qc.invalidateQueries({
        queryKey: MESSAGING_QUERY_KEYS.unreadCount(orgId),
      });
    },
    onError: (error) => {
      toastError(error.message || "Message could not be sent.");
    },
  });
}

export function useUploadMessageAttachment() {
  return useMutation({
    mutationFn: uploadMessageAttachment,
    onError: (error) => {
      toastError(error.message || "Attachment upload failed.");
    },
  });
}
