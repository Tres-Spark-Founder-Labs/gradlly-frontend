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

import { ILR_QUERY_KEYS } from "./keys";
import { ILR_SUBMISSION_TERMINAL } from "../constants";
import {
  amendIlrRecord,
  buildIlrRecord,
  createMappingConfig,
  getActiveMappingConfig,
  getIlrRecord,
  getIlrSubmission,
  getIlrValidationReport,
  listFundingClaims,
  listIlrRecords,
  listMappingConfigs,
  listRecordSubmissions,
  publishMappingConfig,
  setFundingClaimResolution,
  submitIlrRecord,
  updateIlrOverrides,
  validateIlrRecord,
} from "../services/ilr.service";

// ─── Learner records ─────────────────────────────────────────────────────────

export function useIlrRecords(params = {}, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: ILR_QUERY_KEYS.records(orgId, params),
    queryFn: () => listIlrRecords(params),
    enabled: !!orgId,
    placeholderData: keepPreviousData,
    select: (response) => ({
      records: response?.data ?? [],
      meta: response?.meta ?? null,
    }),
    ...options,
  });
}

export function useIlrRecord(id, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: ILR_QUERY_KEYS.record(orgId, id),
    queryFn: () => getIlrRecord(id),
    enabled: !!orgId && !!id,
    ...options,
  });
}

export function useIlrValidationReport(id, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: ILR_QUERY_KEYS.validationReport(orgId, id),
    queryFn: () => getIlrValidationReport(id),
    enabled: !!orgId && !!id,
    ...options,
  });
}

export function useRecordSubmissions(id, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: ILR_QUERY_KEYS.recordSubmissions(orgId, id),
    queryFn: () => listRecordSubmissions(id),
    enabled: !!orgId && !!id,
    select: (data) => data ?? [],
    ...options,
  });
}

// Poll one submission until terminal (submitted/failed).
export function useIlrSubmission(id, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: ILR_QUERY_KEYS.submission(orgId, id),
    queryFn: () => getIlrSubmission(id),
    enabled: !!orgId && !!id,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status && ILR_SUBMISSION_TERMINAL.has(status) ? false : 3000;
    },
    ...options,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

function useInvalidateIlr() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: ILR_QUERY_KEYS.all() });
}

export function useBuildIlrRecord() {
  const invalidate = useInvalidateIlr();

  return useMutation({
    mutationFn: (payload) => buildIlrRecord(payload),
    onSuccess: (data) => {
      toastSuccess(data?.message || "ILR record built.");
      invalidate();
    },
    onError: (error) => {
      if (error.code !== ERROR_CODES.VALIDATION) toastError(error.message);
    },
  });
}

export function useUpdateIlrOverrides() {
  const invalidate = useInvalidateIlr();

  return useMutation({
    mutationFn: ({ id, manualOverrides }) =>
      updateIlrOverrides({ id, manualOverrides }),
    onSuccess: (data) => {
      toastSuccess(data?.message || "Overrides saved. Re-validate to check.");
      invalidate();
    },
    onError: (error) => {
      if (error.code !== ERROR_CODES.VALIDATION) toastError(error.message);
    },
  });
}

export function useValidateIlrRecord() {
  const invalidate = useInvalidateIlr();

  return useMutation({
    mutationFn: (id) => validateIlrRecord(id),
    onSuccess: (record) => {
      const summary = record?.validationSummary;
      if (record?.status === "validated") {
        toastSuccess("Validation passed — ready to submit.");
      } else {
        toastError(
          `Validation failed${
            summary ? ` (${summary.errorCount} error(s))` : ""
          }.`,
        );
      }
      invalidate();
    },
    onError: (error) => toastError(error.message),
  });
}

export function useSubmitIlrRecord() {
  const invalidate = useInvalidateIlr();

  return useMutation({
    mutationFn: (id) => submitIlrRecord(id),
    onSuccess: (data) => {
      toastSuccess(data?.message || "Submission queued.");
      invalidate();
    },
    onError: (error) => toastError(error.message),
  });
}

export function useAmendIlrRecord() {
  const invalidate = useInvalidateIlr();

  return useMutation({
    mutationFn: (id) => amendIlrRecord(id),
    onSuccess: (data) => {
      toastSuccess(data?.message || "Amendment queued.");
      invalidate();
    },
    onError: (error) => toastError(error.message),
  });
}

// ─── Mapping configs ─────────────────────────────────────────────────────────

export function useMappingConfigs(options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: ILR_QUERY_KEYS.mappingConfigs(orgId),
    queryFn: listMappingConfigs,
    enabled: !!orgId,
    select: (data) => data ?? [],
    ...options,
  });
}

export function useActiveMappingConfig(academicYear, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: ILR_QUERY_KEYS.mappingConfigActive(orgId, academicYear),
    queryFn: () => getActiveMappingConfig(academicYear),
    enabled: !!orgId && !!academicYear,
    ...options,
  });
}

export function useCreateMappingConfig() {
  const invalidate = useInvalidateIlr();

  return useMutation({
    mutationFn: (payload) => createMappingConfig(payload),
    onSuccess: (data) => {
      toastSuccess(data?.message || "Draft config created.");
      invalidate();
    },
    onError: (error) => {
      if (error.code !== ERROR_CODES.VALIDATION) toastError(error.message);
    },
  });
}

export function usePublishMappingConfig() {
  const invalidate = useInvalidateIlr();

  return useMutation({
    mutationFn: (id) => publishMappingConfig(id),
    onSuccess: (data) => {
      toastSuccess(data?.message || "Config published.");
      invalidate();
    },
    onError: (error) => toastError(error.message),
  });
}

// ─── Funding claim tracker (F2.3.2 AC7) ──────────────────────────────────────

export function useFundingClaims(params = {}, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: ILR_QUERY_KEYS.fundingClaims(orgId, params),
    queryFn: () => listFundingClaims(params),
    enabled: !!orgId,
    placeholderData: keepPreviousData,
    select: (response) => ({
      claims: response?.data ?? [],
      meta: response?.meta ?? null,
    }),
    ...options,
  });
}

export function useSetFundingClaimResolution() {
  const invalidate = useInvalidateIlr();

  return useMutation({
    mutationFn: ({ enrolmentId, payload }) =>
      setFundingClaimResolution({ enrolmentId, payload }),
    onSuccess: () => {
      toastSuccess("Funding claim updated.");
      invalidate();
    },
    // The backend rejects closing a claim without a note; the form renders
    // that as a field error rather than a toast.
    onError: (error) => {
      if (error.code !== ERROR_CODES.VALIDATION) toastError(error.message);
    },
  });
}
