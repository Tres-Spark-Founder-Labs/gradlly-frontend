"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { toastError, toastSuccess } from "@/hooks/useToast";
import { $apiClient } from "@/lib/api/client";

import { AT_RISK_QUERY_KEYS } from "./at-risk.keys";
import {
  createIntervention,
  getAtRiskApprentice,
  getAtRiskList,
  markAsReviewed,
  scheduleReview,
  sendMessage,
} from "../services/at-risk.service";

export function useAtRiskList(params = {}) {
  return useQuery({
    queryKey: AT_RISK_QUERY_KEYS.list(),
    queryFn: () => getAtRiskList(params),
  });
}

export function useAtRiskApprentice(id) {
  return useQuery({
    queryKey: AT_RISK_QUERY_KEYS.detail(id),
    queryFn: () => getAtRiskApprentice(id),
    enabled: Boolean(id),
  });
}

export function useCreateIntervention(apprenticeId) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body) => createIntervention(apprenticeId, body),
    onSuccess: () => {
      toastSuccess("Intervention note saved.");
      qc.invalidateQueries({
        queryKey: AT_RISK_QUERY_KEYS.detail(apprenticeId),
      });
    },
    onError: (error) => {
      toastError(error.message || "Failed to save intervention.");
    },
  });
}

export function useSendMessage(apprenticeId) {
  return useMutation({
    mutationFn: (body) => sendMessage(apprenticeId, body),
    onSuccess: () => {
      toastSuccess("Message sent successfully.");
    },
    onError: (error) => {
      toastError(error.message || "Failed to send message.");
    },
  });
}

export function useMarkAsReviewed(apprenticeId) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => markAsReviewed(apprenticeId),
    onSuccess: () => {
      toastSuccess("Marked as reviewed.");
      qc.invalidateQueries({
        queryKey: AT_RISK_QUERY_KEYS.detail(apprenticeId),
      });
      qc.invalidateQueries({ queryKey: AT_RISK_QUERY_KEYS.list() });
    },
    onError: (error) => {
      toastError(error.message || "Failed to mark as reviewed.");
    },
  });
}

export function useScheduleReview(apprenticeId) {
  return useMutation({
    mutationFn: (body) => scheduleReview(apprenticeId, body),
    onSuccess: (data) => {
      toastSuccess(data?.message || "Review scheduled.");
    },
    onError: (error) => {
      toastError(error.message || "Failed to schedule review.");
    },
  });
}

/**
 * The sidebar badge count, from the real API rather than the mock.
 *
 * `getAtRiskList` above still returns `AT_RISK_APPRENTICES` from a static file —
 * the whole At-Risk dashboard is mock-backed and says so at the top of its
 * service. Driving the badge from that mock meant every employer saw the same
 * fabricated number, including a brand-new one with no organisation at all.
 *
 * `GET /learners/intervention-queue` is the real thing, and its own API
 * description says it "includes atRiskCount for sidebar badge" — the backend
 * was built for this and never wired up.
 *
 * Deliberately a separate hook rather than a fix inside `getAtRiskList`:
 * swapping that function is the documented migration for the whole feature and
 * touches every at-risk screen. This changes only the number in the nav, which
 * is the part that was lying to every user on every page.
 */
export function useAtRiskBadgeCount() {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: ["at-risk", "badge-count", orgId],
    queryFn: async () => {
      try {
        const res = await $apiClient.get(
          "/api/v1/learners/intervention-queue",
          { headers: orgId ? { "x-organisation-id": orgId } : {} },
        );
        const data = res.data?.data ?? res.data;
        return Number(data?.atRiskCount ?? 0);
      } catch {
        // A badge is not worth an error state. Absent beats wrong.
        return 0;
      }
    },
    enabled: Boolean(orgId),
    staleTime: 5 * 60 * 1000,
    meta: { skipAuthRedirect: true },
  });
}
