"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { toastError, toastSuccess } from "@/hooks/useToast";
import { ERROR_CODES } from "@/lib/errors";
import { STALE_TIMES } from "@/lib/react-query/query.config";

import { OFSTED_QUERY_KEYS } from "./keys";
import { EVIDENCE_PACK_TERMINAL } from "../constants";
import {
  completeSafeguardingItem,
  createEvidencePackJob,
  downloadSarDocx,
  generateSarReport,
  listSarReports,
  lockSarReport,
  updateSarReport,
  createProgrammeDocument,
  createQipAction,
  deleteQipAction,
  getEifCriteria,
  getEifScores,
  getEifScoreTrend,
  exportQipPlan,
  getEvidencePackJob,
  getQipSummary,
  getSafeguardingChecklist,
  listProgrammeDocuments,
  listQipActions,
  updateQipAction,
  updateQipActionProgress,
} from "../services/ofsted.service";

// ─── EIF criteria + scores ───────────────────────────────────────────────────

export function useEifCriteria(options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: OFSTED_QUERY_KEYS.eifCriteria(orgId),
    queryFn: getEifCriteria,
    enabled: !!orgId,
    staleTime: STALE_TIMES?.STATIC ?? 60 * 60 * 1000,
    select: (data) => data ?? [],
    ...options,
  });
}

// Criteria as { value, text } options for QIP forms.
export function useEifCriterionOptions(options = {}) {
  return useEifCriteria({
    select: (data) =>
      (data ?? []).map((c) => ({ value: c.slug, text: c.label })),
    ...options,
  });
}

export function useEifScores(options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: OFSTED_QUERY_KEYS.eifScores(orgId),
    queryFn: getEifScores,
    enabled: !!orgId,
    ...options,
  });
}

/**
 * F2.1.1 AC5 — the twelve-month trend.
 *
 * Longer staleTime than the live scores: this comes from a nightly snapshot,
 * so it cannot change within a session and refetching it on every focus would
 * be pure noise.
 */
export function useEifScoreTrend(options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: OFSTED_QUERY_KEYS.eifScoreTrend(orgId),
    queryFn: getEifScoreTrend,
    enabled: !!orgId,
    staleTime: 60 * 60 * 1000,
    ...options,
  });
}

// ─── Shared invalidation: scores move after most writes ──────────────────────
function useInvalidateOfsted() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: OFSTED_QUERY_KEYS.all() });
}

// ─── QIP actions ─────────────────────────────────────────────────────────────

export function useQipActions(params = {}, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: OFSTED_QUERY_KEYS.qipList(orgId, params),
    queryFn: () => listQipActions(params),
    enabled: !!orgId,
    placeholderData: keepPreviousData,
    select: (response) => ({
      actions: response?.data ?? [],
      meta: response?.meta ?? null,
    }),
    ...options,
  });
}

export function useQipSummary(options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: OFSTED_QUERY_KEYS.qipSummary(orgId),
    queryFn: getQipSummary,
    enabled: !!orgId,
    ...options,
  });
}

export function useCreateQipAction() {
  const invalidate = useInvalidateOfsted();

  return useMutation({
    mutationFn: (payload) => createQipAction(payload),
    onSuccess: (data) => {
      toastSuccess(data?.message || "QIP action created.");
      invalidate();
    },
    onError: (error) => {
      if (error.code !== ERROR_CODES.VALIDATION) toastError(error.message);
    },
  });
}

export function useUpdateQipAction() {
  const invalidate = useInvalidateOfsted();

  return useMutation({
    mutationFn: ({ id, payload }) => updateQipAction({ id, payload }),
    onSuccess: (data) => {
      toastSuccess(data?.message || "QIP action updated.");
      invalidate();
    },
    onError: (error) => {
      if (error.code !== ERROR_CODES.VALIDATION) toastError(error.message);
    },
  });
}

/**
 * F2.1.2 — the narrow sibling of useUpdateQipAction, behind the wider
 * COMPLETE_QIP_ACTION capability. See updateQipActionProgress.
 */
export function useUpdateQipActionProgress() {
  const invalidate = useInvalidateOfsted();

  return useMutation({
    mutationFn: ({ id, payload }) => updateQipActionProgress({ id, payload }),
    onSuccess: (data) => {
      toastSuccess(data?.message || "Progress updated.");
      invalidate();
    },
    onError: (error) => {
      if (error.code !== ERROR_CODES.VALIDATION) toastError(error.message);
    },
  });
}

export function useDeleteQipAction() {
  const invalidate = useInvalidateOfsted();

  return useMutation({
    mutationFn: (id) => deleteQipAction(id),
    onSuccess: () => {
      toastSuccess("QIP action deleted.");
      invalidate();
    },
    onError: (error) => toastError(error.message),
  });
}

// ─── SAR (F2.1.3) ────────────────────────────────────────────────────────────

export function useSarReports(options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: OFSTED_QUERY_KEYS.sarReports(orgId),
    queryFn: listSarReports,
    enabled: !!orgId,
    select: (data) => data ?? [],
    ...options,
  });
}

export function useGenerateSarReport() {
  const invalidate = useInvalidateOfsted();

  return useMutation({
    mutationFn: (academicYear) => generateSarReport(academicYear),
    onSuccess: () => {
      toastSuccess("SAR draft ready.");
      invalidate();
    },
    onError: (error) => {
      if (error.code !== ERROR_CODES.VALIDATION) toastError(error.message);
    },
  });
}

export function useUpdateSarReport() {
  const invalidate = useInvalidateOfsted();

  return useMutation({
    mutationFn: ({ id, sections }) => updateSarReport({ id, sections }),
    onSuccess: () => {
      toastSuccess("SAR saved.");
      invalidate();
    },
    onError: (error) => {
      if (error.code !== ERROR_CODES.VALIDATION) toastError(error.message);
    },
  });
}

export function useLockSarReport() {
  const invalidate = useInvalidateOfsted();

  return useMutation({
    mutationFn: (id) => lockSarReport(id),
    onSuccess: () => {
      toastSuccess("SAR locked. It is now a historical record.");
      invalidate();
    },
    onError: (error) => toastError(error.message),
  });
}

export function useDownloadSarDocx() {
  return useMutation({
    mutationFn: ({ id, academicYear }) => downloadSarDocx({ id, academicYear }),
    onError: (error) => toastError(error.message),
  });
}

// ─── Safeguarding ────────────────────────────────────────────────────────────

export function useSafeguardingChecklist(options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: OFSTED_QUERY_KEYS.safeguarding(orgId),
    queryFn: getSafeguardingChecklist,
    enabled: !!orgId,
    select: (data) => data ?? [],
    ...options,
  });
}

export function useCompleteSafeguardingItem() {
  const invalidate = useInvalidateOfsted();

  return useMutation({
    mutationFn: ({ slug, evidenceStorageKey }) =>
      completeSafeguardingItem({ slug, evidenceStorageKey }),
    onSuccess: (data) => {
      toastSuccess(data?.message || "Marked complete.");
      invalidate();
    },
    onError: (error) => toastError(error.message),
  });
}

// ─── Programme documents ─────────────────────────────────────────────────────

export function useProgrammeDocuments(programmeId, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: OFSTED_QUERY_KEYS.programmeDocuments(orgId, programmeId),
    queryFn: () => listProgrammeDocuments(programmeId),
    enabled: !!orgId && !!programmeId,
    select: (data) => data ?? [],
    ...options,
  });
}

export function useCreateProgrammeDocument() {
  const invalidate = useInvalidateOfsted();

  return useMutation({
    mutationFn: ({ programmeId, payload }) =>
      createProgrammeDocument({ programmeId, payload }),
    onSuccess: (data) => {
      toastSuccess(data?.message || "Document attached.");
      invalidate();
    },
    onError: (error) => {
      if (error.code !== ERROR_CODES.VALIDATION) toastError(error.message);
    },
  });
}

// ─── Evidence pack jobs ──────────────────────────────────────────────────────

export function useCreateEvidencePackJob() {
  return useMutation({
    mutationFn: (additionalStorageKeys) =>
      createEvidencePackJob({ additionalStorageKeys }),
    onSuccess: (data) => {
      toastSuccess(data?.message || "Evidence pack build started.");
    },
    onError: (error) => toastError(error.message),
  });
}

export function useEvidencePackJob(jobId, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: OFSTED_QUERY_KEYS.evidencePackJob(orgId, jobId),
    queryFn: () => getEvidencePackJob(jobId),
    enabled: !!orgId && !!jobId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status && EVIDENCE_PACK_TERMINAL.has(status) ? false : 3000;
    },
    ...options,
  });
}

/** F2.1.2 AC5 — queues the QIP plan PDF; the caller polls the job. */
export function useExportQipPlan() {
  return useMutation({
    mutationFn: exportQipPlan,
    onError: (error) => {
      toastError(error.message || "Could not start the QIP export.");
    },
  });
}
