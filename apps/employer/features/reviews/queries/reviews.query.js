"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { useAuthUser } from "@/features/auth/hooks/useAuthUser";

import { REVIEW_QUERY_KEYS } from "./keys";
import {
  getReview,
  getReviewRecord,
  listReviews,
} from "../services/reviews.service";

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

export function useReview(id, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: REVIEW_QUERY_KEYS.detail(orgId, id),
    queryFn: () => getReview(id),
    enabled: !!orgId && !!id,
    ...options,
  });
}

/**
 * A scheduled review has no record until the tutor writes one, so a 404 is an
 * expected state rather than a failure. Retrying it would only delay showing
 * the honest "not yet recorded" message.
 */
export function useReviewRecord(id, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: REVIEW_QUERY_KEYS.record(orgId, id),
    queryFn: () => getReviewRecord(id),
    enabled: !!orgId && !!id,
    retry: false,
    ...options,
  });
}
