"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuthUser } from "@/features/auth/hooks/useAuthUser";

import { DOCUMENTS_QUERY_KEYS } from "./keys";
import { getLearnerProfile } from "../services/documents.service";

/**
 * One enrolment's documents, from the profile aggregate.
 *
 * Fetched fresh on every mount, like the transfer agreement: each item's
 * `downloadUrl` is presigned and short-lived, and a cached one expires while
 * still looking like a link.
 */
export function useLearnerDocuments(enrolmentId, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: DOCUMENTS_QUERY_KEYS.learnerDocuments(orgId, enrolmentId),
    queryFn: () => getLearnerProfile(enrolmentId),
    enabled: !!orgId && !!enrolmentId,
    staleTime: 0,
    select: (profile) =>
      Array.isArray(profile?.documents) ? profile.documents : [],
    ...options,
  });
}
