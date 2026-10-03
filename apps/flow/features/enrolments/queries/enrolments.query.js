"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuthUser } from "@/features/auth/hooks/useAuthUser";

import { ENROLMENT_QUERY_KEYS } from "./keys";
import { getParticipantOptions } from "../services/enrolments.service";

/**
 * "Name · role · email" — never the id.
 *
 * The id is the value the form submits and the API validates; it has no
 * business on screen. The role comes from which list the person arrived in
 * rather than from a field, because that is what the endpoint actually tells
 * us: a tutor is someone in the provider organisation, an employer manager is
 * someone in the linked employer organisation.
 */
function toOption(user, role) {
  const name = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();
  const label = name || user?.email || "Unnamed user";
  return {
    value: user.id,
    text: user?.email
      ? `${label} · ${role} · ${user.email}`
      : `${label} · ${role}`,
  };
}

export function selectParticipantOptions(response) {
  return {
    apprenticeOptions: (response?.apprenticeCandidates ?? []).map((user) =>
      toOption(user, "Apprentice"),
    ),
    tutorOptions: (response?.tutors ?? []).map((user) =>
      toOption(user, "Tutor"),
    ),
    employerManagerOptions: (response?.employerManagers ?? []).map((user) =>
      toOption(user, "Employer manager"),
    ),
  };
}

/**
 * The apprentice, tutor and employer-manager candidates for one enrolment.
 *
 * Disabled until an enrolment is known, because without one there is no
 * authorisation boundary to resolve these people against.
 */
export function useParticipantOptions(enrolmentId, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: ENROLMENT_QUERY_KEYS.participantOptions(orgId, enrolmentId),
    queryFn: () => getParticipantOptions(enrolmentId),
    enabled: !!orgId && !!enrolmentId,
    select: selectParticipantOptions,
    ...options,
  });
}
