"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuthUser } from "@/features/auth/hooks/useAuthUser";

import { LEARNER_QUERY_KEYS } from "./keys";
import { getLearnerProfile } from "../services/learners.service";

/**
 * One request behind the whole profile drawer.
 *
 * Every tab reads from this single query rather than fetching its own slice:
 * the API already assembles the aggregate, and seven parallel requests for one
 * drawer would be slower and would let the tabs disagree with each other about
 * the same learner.
 *
 * Tabs still render their own loading, error and empty states from it — see
 * ProfileTabState — so a failure shows up inside the tab the reader is looking
 * at instead of blanking the drawer.
 */
export function useLearnerProfile(enrolmentId, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: LEARNER_QUERY_KEYS.profile(orgId, enrolmentId),
    queryFn: () => getLearnerProfile(enrolmentId),
    enabled: !!orgId && !!enrolmentId,
    ...options,
  });
}
