"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { ENROLMENT_QUERY_KEYS } from "@/features/enrolments/queries/keys";
import { getEnrolments } from "@/features/enrolments/services/enrolments.service";
import { toastError, toastSuccess } from "@/hooks/useToast";

import { APPRENTICE_QUERY_KEYS } from "./keys";
import {
  createApprentice,
  getApprentices,
} from "../services/apprentices.service";
import { normalisePaceStatus } from "../utils/risk-status";

// ─── Avatar colour derived from apprentice id ─────────────────────────────────

const AVATAR_COLORS = [
  "#3b5fe0",
  "#0d7a52",
  "#7c3aed",
  "#b85c0a",
  "#1847d4",
  "#e04b3b",
];

function avatarColor(id = "") {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = id.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

function daysUntil(dateStr) {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr) - Date.now()) / 86_400_000);
}

function fmtDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// Merge one apprentice record with its most-relevant enrolment
function normalizeApprentice(apprentice, enrolment) {
  const first = apprentice.firstName ?? "";
  const last = apprentice.lastName ?? "";
  return {
    // Core identity
    id: apprentice.id,
    name: `${first} ${last}`.trim(),
    initials: `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase() || "?",
    avatarColor: avatarColor(apprentice.id),
    email: apprentice.email,
    apprenticeStatus: apprentice.status, // pending|active|paused|completed|withdrawn
    // No employee/payroll identifier exists on the Apprentice entity — checked
    // across the whole API, not assumed. Any UI offering to search by one would
    // be offering something the system cannot do.
    employeeId: null,

    // Programme — from enrolment
    enrolmentId: enrolment?.id ?? null,
    standardId: enrolment?.standardId ?? null,
    // EnrolmentResponseDto carries the display names directly. This previously
    // rendered "—" with a comment claiming the lookup was unavailable; the
    // value was in the response all along and was being discarded.
    standard: enrolment?.standardDisplayName ?? "—",
    // F1.2.4 AC5. Translated at the boundary: the API says `off_track`, the UI
    // says `overdue`. Passing the raw value through meant the most serious
    // level matched nothing anywhere on the screen.
    status: normalisePaceStatus(enrolment?.otjPaceAlertLevel),
    otjPaceAlertLevel: enrolment?.otjPaceAlertLevel ?? null,
    otjBehindPercent: enrolment?.otjBehindPercent ?? null,
    epaDate: fmtDate(enrolment?.epaDate) ?? "—",
    epaDaysLeft: daysUntil(enrolment?.epaDate),
    startDate: fmtDate(enrolment?.plannedStartDate),
    // Raw ISO alongside the display strings: the EPA-month and cohort filters
    // group by date, and parsing "12 Oct 2026" back into one is both lossy and
    // locale-dependent.
    epaDateIso: enrolment?.epaDate ?? null,
    startDateIso: enrolment?.plannedStartDate ?? null,
    expectedEndDate: fmtDate(enrolment?.plannedEndDate),
    levyCost: enrolment?.agreedPrice ?? 0,
    fundingBand: enrolment?.agreedPrice ?? 0,
    pipelineState: enrolment?.pipelineState ?? null,

    // Also present on the enrolment response, and likewise previously discarded.
    provider: enrolment?.providerOrganisationName ?? "—",
    tutorName: enrolment?.tutorUserDisplayName ?? null,
    lineManager: enrolment?.employerManagerUserDisplayName ?? null,

    // Genuinely absent from /apprentices and /enrolments. OTJ progress and
    // last-activity recency are computed per enrolment by the learner cohort
    // service (F1.2.1); until this screen reads that endpoint they stay null
    // rather than being guessed at.
    cohort: null,
    tutorEmail: null,
    lineManagerEmail: null,
    providerContact: { name: "—", email: "—", phone: "—" },
    lastActivity: null,
    attendance: null,
    otjActual: null,
    otjExpected: null,
    otjHoursCompleted: null,
    otjHoursRequired: null,
    commitmentSigned: false,
    milestones: [],
    recentActivity: [],
  };
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useApprenticeRoster() {
  const { orgId } = useAuthUser();

  const apprenticesQ = useQuery({
    queryKey: APPRENTICE_QUERY_KEYS.list(orgId),
    queryFn: () => getApprentices({ orgId }),
    enabled: !!orgId,
    staleTime: 2 * 60 * 1000,
    meta: { skipAuthRedirect: true },
    select: (r) => ({ data: r?.data ?? [], meta: r?.meta ?? null }),
  });

  const enrolmentsQ = useQuery({
    queryKey: ENROLMENT_QUERY_KEYS.list(orgId),
    queryFn: () => getEnrolments({ orgId }),
    enabled: !!orgId,
    staleTime: 2 * 60 * 1000,
    meta: { skipAuthRedirect: true },
    select: (r) => r?.data ?? [],
  });

  const apprenticesData = apprenticesQ.data;
  const enrolmentsData = enrolmentsQ.data;

  const roster = useMemo(() => {
    const apprentices = apprenticesData?.data ?? [];
    const enrolments = enrolmentsData ?? [];

    // Map apprenticeId → best enrolment (prefer active over draft/cancelled)
    const byApprentice = {};
    for (const e of enrolments) {
      const existing = byApprentice[e.apprenticeId];
      if (!existing || e.status === "active") {
        byApprentice[e.apprenticeId] = e;
      }
    }

    return apprentices.map((a) =>
      normalizeApprentice(a, byApprentice[a.id] ?? null),
    );
  }, [apprenticesData, enrolmentsData]);

  return {
    roster,
    meta: apprenticesQ.data?.meta ?? null,
    isLoading: apprenticesQ.isLoading || enrolmentsQ.isLoading,
    isError: apprenticesQ.isError || enrolmentsQ.isError,
  };
}

export function useCreateApprentice() {
  const qc = useQueryClient();
  const { orgId } = useAuthUser();

  return useMutation({
    mutationFn: (body) => createApprentice({ orgId, body }),
    onSuccess: () => {
      toastSuccess("Apprentice added to your roster.");
      qc.invalidateQueries({ queryKey: APPRENTICE_QUERY_KEYS.list(orgId) });
    },
    onError: (error) => {
      toastError(error.message || "Failed to create apprentice.");
    },
  });
}
