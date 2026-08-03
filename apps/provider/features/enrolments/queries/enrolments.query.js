"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { LEARNER_QUERY_KEYS } from "@/features/learners/queries/keys";
import { toastError, toastSuccess } from "@/hooks/useToast";
import { ERROR_CODES } from "@/lib/errors";

import { ENROLMENT_QUERY_KEYS } from "./keys";
import {
  acceptProviderEnrolment,
  activateEnrolment,
  cancelEnrolment,
  completeEnrolment,
  createEnrolment,
  endBreakInLearning,
  getEnrolment,
  getEnrolmentJourney,
  getParticipantOptions,
  listBreaksInLearning,
  listEnrolments,
  lookupCounterpartOrganisation,
  recordBreakInLearning,
  recordEpaOutcome,
  setEnrolmentJourney,
  setEnrolmentOrganisationLinks,
  setEnrolmentParticipants,
} from "../services/enrolments.service";

// ─── Reads ────────────────────────────────────────────────────────────────────

export function useEnrolments({ page = 1, perPage = 20, ...options } = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: ENROLMENT_QUERY_KEYS.list(orgId, page, perPage),
    queryFn: () => listEnrolments({ page, perPage }),
    enabled: !!orgId,
    placeholderData: keepPreviousData,
    select: (response) => ({
      enrolments: response?.data ?? [],
      meta: response?.meta ?? null,
    }),
    ...options,
  });
}

export function useEnrolment(id, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: ENROLMENT_QUERY_KEYS.detail(orgId, id),
    queryFn: () => getEnrolment(id),
    enabled: !!orgId && !!id,
    ...options,
  });
}

function mapParticipantOptions(response) {
  const mapList = (items = []) =>
    items.map((user) => ({
      value: user.id,
      text: user.displayName,
    }));

  return {
    apprenticeOptions: mapList(response?.apprenticeCandidates),
    tutorOptions: mapList(response?.tutors),
    employerManagerOptions: mapList(response?.employerManagers),
  };
}

export function useParticipantOptions(enrolmentId, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: ENROLMENT_QUERY_KEYS.participantOptions(orgId, enrolmentId),
    queryFn: () => getParticipantOptions(enrolmentId),
    enabled: !!orgId && !!enrolmentId,
    select: mapParticipantOptions,
    ...options,
  });
}

export function useEnrolmentJourney(id, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: ENROLMENT_QUERY_KEYS.journey(orgId, id),
    queryFn: () => getEnrolmentJourney(id),
    enabled: !!orgId && !!id,
    ...options,
  });
}

// Employer organisations already linked on provider enrolments (PRD F2.4.1 directory).
export function useLookupCounterpartOrganisation() {
  return useMutation({
    mutationFn: (ukprn) => lookupCounterpartOrganisation(ukprn),
  });
}

// ─── Shared cache helpers ────────────────────────────────────────────────────

// Any enrolment mutation can change the list, the detail, and the journey
// (gateway/pipeline are derived). Invalidating the whole namespace keeps every
// surface consistent without threading the orgId/id through each call site.
function useInvalidateEnrolments() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: ENROLMENT_QUERY_KEYS.all() });
}

// Standard onError: surface non-validation errors as a toast (forms render
// field errors themselves via applyServerErrors).
function toastUnlessValidation(error) {
  if (error.code !== ERROR_CODES.VALIDATION) toastError(error.message);
}

// ─── Create ──────────────────────────────────────────────────────────────────

export function useCreateEnrolment() {
  const invalidate = useInvalidateEnrolments();

  return useMutation({
    mutationFn: (payload) => createEnrolment(payload),
    onSuccess: (data) => {
      toastSuccess(data?.message || "Enrolment created.");
      invalidate();
    },
    onError: toastUnlessValidation,
  });
}

// ─── Sub-resource PATCH endpoints ────────────────────────────────────────────

export function useSetEnrolmentJourney() {
  const invalidate = useInvalidateEnrolments();

  return useMutation({
    mutationFn: ({ id, payload }) => setEnrolmentJourney({ id, payload }),
    onSuccess: (data) => {
      toastSuccess(data?.message || "EPA date updated.");
      invalidate();
    },
    onError: toastUnlessValidation,
  });
}

export function useSetEnrolmentParticipants() {
  const invalidate = useInvalidateEnrolments();

  return useMutation({
    mutationFn: ({ id, payload }) => setEnrolmentParticipants({ id, payload }),
    onSuccess: (data) => {
      toastSuccess(data?.message || "Participants updated.");
      invalidate();
    },
    onError: toastUnlessValidation,
  });
}

export function useSetEnrolmentOrganisationLinks() {
  const invalidate = useInvalidateEnrolments();

  return useMutation({
    mutationFn: ({ id, payload }) =>
      setEnrolmentOrganisationLinks({ id, payload }),
    onSuccess: (data) => {
      toastSuccess(data?.message || "Organisation links updated.");
      invalidate();
    },
    onError: toastUnlessValidation,
  });
}

// ─── Lifecycle actions ───────────────────────────────────────────────────────

export function useActivateEnrolment() {
  const invalidate = useInvalidateEnrolments();

  return useMutation({
    mutationFn: (id) => activateEnrolment(id),
    onSuccess: (data) => {
      toastSuccess(data?.message || "Enrolment activated.");
      invalidate();
    },
    onError: (error) => toastError(error.message),
  });
}

export function useAcceptProviderEnrolment() {
  const invalidate = useInvalidateEnrolments();

  return useMutation({
    mutationFn: (id) => acceptProviderEnrolment(id),
    onSuccess: (data) => {
      toastSuccess(data?.message || "Provider acceptance recorded.");
      invalidate();
    },
    onError: (error) => toastError(error.message),
  });
}

export function useCompleteEnrolment() {
  const invalidate = useInvalidateEnrolments();

  return useMutation({
    mutationFn: (id) => completeEnrolment(id),
    onSuccess: (data) => {
      toastSuccess(data?.message || "Enrolment completed.");
      invalidate();
    },
    onError: (error) => toastError(error.message),
  });
}

export function useCancelEnrolment() {
  const invalidate = useInvalidateEnrolments();

  return useMutation({
    mutationFn: (id) => cancelEnrolment(id),
    onSuccess: (data) => {
      toastSuccess(data?.message || "Enrolment cancelled.");
      invalidate();
    },
    onError: (error) => toastError(error.message),
  });
}

export function useRecordEpaOutcome() {
  const invalidate = useInvalidateEnrolments();

  return useMutation({
    mutationFn: ({ id, payload }) => recordEpaOutcome({ id, payload }),
    onSuccess: (data) => {
      toastSuccess(data?.message || "EPA outcome recorded.");
      invalidate();
    },
    onError: toastUnlessValidation,
  });
}

// ─── Break in learning (F2.2.4 AC6) ──────────────────────────────────────────

export function useBreaksInLearning(id, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: ENROLMENT_QUERY_KEYS.breaksInLearning(orgId, id),
    queryFn: () => listBreaksInLearning(id),
    enabled: !!orgId && !!id,
    ...options,
  });
}

/**
 * Starting or ending a break changes the apprentice's status, which the
 * learner profile, the cohort table and the intervention queue all read. Those
 * live under the `learners` key, so invalidating enrolments alone would leave
 * the profile showing a learner as active seconds after pausing them.
 */
function useInvalidateAfterBreakChange() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: ENROLMENT_QUERY_KEYS.all() });
    qc.invalidateQueries({ queryKey: LEARNER_QUERY_KEYS.all() });
  };
}

export function useRecordBreakInLearning() {
  const invalidate = useInvalidateAfterBreakChange();

  return useMutation({
    mutationFn: ({ id, payload }) => recordBreakInLearning({ id, payload }),
    onSuccess: (data) => {
      toastSuccess(data?.message || "Break in learning recorded.");
      invalidate();
    },
    onError: toastUnlessValidation,
  });
}

export function useEndBreakInLearning() {
  const invalidate = useInvalidateAfterBreakChange();

  return useMutation({
    mutationFn: ({ id, payload }) => endBreakInLearning({ id, payload }),
    onSuccess: (data) => {
      toastSuccess(data?.message || "Return from break recorded.");
      invalidate();
    },
    onError: toastUnlessValidation,
  });
}
