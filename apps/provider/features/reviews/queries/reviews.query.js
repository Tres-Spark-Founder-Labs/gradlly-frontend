"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { ENROLMENT_QUERY_KEYS } from "@/features/enrolments/queries/keys";
import { toastError, toastSuccess } from "@/hooks/useToast";
import { ERROR_CODES } from "@/lib/errors";

import { REVIEW_QUERY_KEYS } from "./keys";
import {
  bulkScheduleReviews,
  bulkScheduleReviewsFromEnrolments,
  cancelReview,
  createReview,
  enqueueReviewSnapshot,
  getPreviousReviewGoals,
  getReview,
  getReviewRecord,
  listReviewCalendar,
  listReviews,
  saveReviewRecord,
  signReview,
  updateReview,
} from "../services/reviews.service";

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useReviews(params = {}, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: REVIEW_QUERY_KEYS.list(orgId, params),
    queryFn: () => listReviews(params),
    enabled: !!orgId,
    placeholderData: keepPreviousData,
    select: (response) => ({
      reviews: response?.data ?? [],
      meta: response?.meta ?? null,
    }),
    ...options,
  });
}

export function useReviewCalendar(params = {}, options = {}) {
  const { orgId } = useAuthUser();
  const ready = !!params.from && !!params.to;

  return useQuery({
    queryKey: REVIEW_QUERY_KEYS.calendar(orgId, params),
    queryFn: () => listReviewCalendar(params),
    enabled: !!orgId && ready,
    placeholderData: keepPreviousData,
    select: (response) => response?.data ?? [],
    ...options,
  });
}

export function useReview(id, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: REVIEW_QUERY_KEYS.detail(orgId, id),
    queryFn: () => getReview(id),
    enabled: !!orgId && !!id,
    ...options,
  });
}

export function useReviewRecord(id, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: REVIEW_QUERY_KEYS.record(orgId, id),
    queryFn: () => getReviewRecord(id),
    enabled: !!orgId && !!id,
    ...options,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

function useInvalidateReviews() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: REVIEW_QUERY_KEYS.all() });
}

export function useCreateReview() {
  const invalidate = useInvalidateReviews();

  return useMutation({
    mutationFn: (payload) => createReview(payload),
    onSuccess: (data) => {
      toastSuccess(data?.message || "Review scheduled.");
      invalidate();
    },
    onError: (error) => {
      if (error.code !== ERROR_CODES.VALIDATION) toastError(error.message);
    },
  });
}

export function useBulkScheduleReviews() {
  const invalidate = useInvalidateReviews();

  return useMutation({
    mutationFn: (items) => bulkScheduleReviews({ items }),
    onSuccess: (result) => {
      const succeeded = result?.succeeded ?? 0;
      const failed = result?.failed ?? 0;
      if (failed === 0 && succeeded > 0) {
        toastSuccess(`${succeeded} reviews scheduled.`);
      } else if (succeeded > 0) {
        toastSuccess(`${succeeded} scheduled, ${failed} failed.`);
      } else {
        toastError(`No reviews scheduled — ${failed} failed.`);
      }
      invalidate();
    },
    onError: (error) => toastError(error.message),
  });
}

/**
 * F2.2.3 AC2 — bulk schedule by enrolment.
 *
 * Reports per-learner failures rather than a bare count: "3 failed" sends
 * someone hunting, "Amara Diallo — missing tutor" is actionable. The caller
 * renders the detail; this keeps the toast short and honest.
 */
export function useBulkScheduleReviewsFromEnrolments() {
  const invalidate = useInvalidateReviews();

  return useMutation({
    mutationFn: (input) => bulkScheduleReviewsFromEnrolments(input),
    onSuccess: (result) => {
      const succeeded = result?.succeeded ?? 0;
      const failed = result?.failed ?? 0;
      if (failed === 0 && succeeded > 0) {
        toastSuccess(`${succeeded} reviews scheduled.`);
      } else if (succeeded > 0) {
        toastSuccess(`${succeeded} scheduled, ${failed} could not be.`);
      } else {
        toastError(`No reviews scheduled — ${failed} could not be.`);
      }
      invalidate();
    },
    onError: (error) => toastError(error.message),
  });
}

/**
 * F2.2.3 AC4 — the previous review's goals.
 *
 * `staleTime: Infinity` because a completed review's record is immutable; the
 * goals cannot change while this form is open.
 */
export function usePreviousReviewGoals(reviewId, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: REVIEW_QUERY_KEYS.previousGoals(orgId, reviewId),
    queryFn: () => getPreviousReviewGoals(reviewId),
    enabled: !!orgId && !!reviewId,
    staleTime: Infinity,
    select: (data) => (Array.isArray(data) ? data : []),
    ...options,
  });
}

export function useUpdateReview() {
  const invalidate = useInvalidateReviews();

  return useMutation({
    mutationFn: ({ id, payload }) => updateReview({ id, payload }),
    onSuccess: (data) => {
      toastSuccess(data?.message || "Review updated.");
      invalidate();
    },
    onError: (error) => {
      if (error.code !== ERROR_CODES.VALIDATION) toastError(error.message);
    },
  });
}

export function useCancelReview() {
  const invalidate = useInvalidateReviews();

  return useMutation({
    mutationFn: (id) => cancelReview(id),
    onSuccess: (data) => {
      toastSuccess(data?.message || "Review cancelled.");
      invalidate();
    },
    onError: (error) => toastError(error.message),
  });
}

export function useSaveReviewRecord() {
  const qc = useQueryClient();
  const { orgId } = useAuthUser();

  return useMutation({
    mutationFn: ({ id, body }) => saveReviewRecord({ id, body }),
    onSuccess: (data, variables) => {
      toastSuccess(data?.message || "Record saved.");
      // Refresh the record + the review (status auto-promotes to in_progress).
      qc.invalidateQueries({
        queryKey: REVIEW_QUERY_KEYS.record(orgId, variables.id),
      });
      qc.invalidateQueries({ queryKey: REVIEW_QUERY_KEYS.all() });
    },
    onError: (error) => {
      if (error.code !== ERROR_CODES.VALIDATION) toastError(error.message);
    },
  });
}

export function useEnqueueReviewSnapshot() {
  const invalidate = useInvalidateReviews();

  return useMutation({
    mutationFn: (id) => enqueueReviewSnapshot(id),
    onSuccess: (data) => {
      toastSuccess(data?.message || "Generating the snapshot PDF…");
      invalidate();
    },
    onError: (error) => toastError(error.message),
  });
}

export function useSignReview(enrolmentId) {
  const qc = useQueryClient();
  const { orgId } = useAuthUser();

  return useMutation({
    mutationFn: ({ id, party, signatureImageKey }) =>
      signReview({ id, party, signatureImageKey }),
    onSuccess: (data) => {
      const completed = data?.reviewStatus === "completed";
      toastSuccess(
        completed ? "Review is now fully signed." : "Signature recorded.",
      );
      qc.invalidateQueries({ queryKey: REVIEW_QUERY_KEYS.all() });
      // A completed review feeds enrolment quality data; refresh its detail.
      if (completed && enrolmentId) {
        qc.invalidateQueries({
          queryKey: ENROLMENT_QUERY_KEYS.detail(orgId, enrolmentId),
        });
      }
    },
    onError: (error) => {
      if (error.code !== ERROR_CODES.VALIDATION) toastError(error.message);
    },
  });
}
