"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { toastError, toastSuccess } from "@/hooks/useToast";

import { LEVY_QUERY_KEYS } from "./keys";
import {
  createTransferFromMatch,
  getDonorLinks,
  getExpiryCalendar,
  getLevy,
  getMatchApplications,
  getTransfer,
  getTransferDocument,
  getTransfers,
  signTransfer,
  submitTransferToDas,
  syncDonorLink,
  updateMatchApplicationStatus,
} from "../services/levy.service";

// GET /levy-exchange/surplus returns one row per linked donor DAS account
// (LevySurplusResponseDto[]). Most orgs have zero or one link; this aggregates
// across all linked accounts into a single summary object with the response's
// real field names (totalBalance, maxTransferable, alreadyTransferred,
// availableSurplus, committedToOwnApprenticeships) plus the raw per-link rows.
function aggregateSurplus(rows) {
  if (!rows.length) return null;
  const sum = (key) =>
    rows.reduce((total, row) => total + Number(row?.[key] ?? 0), 0);
  return {
    totalBalance: sum("totalBalance"),
    committedToOwnApprenticeships: sum("committedToOwnApprenticeships"),
    maxTransferable: sum("maxTransferable"),
    alreadyTransferred: sum("alreadyTransferred"),
    availableSurplus: sum("availableSurplus"),
    computedAt: rows[0]?.computedAt ?? null,
    links: rows,
  };
}

export function useLevySurplus() {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: LEVY_QUERY_KEYS.surplus(orgId),
    queryFn: () => getLevy({ orgId }),
    enabled: !!orgId,
    staleTime: 5 * 60 * 1000,
    meta: { skipAuthRedirect: true },
    select: (response) => {
      const rows = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
          ? response
          : [];
      return aggregateSurplus(rows);
    },
  });
}

export function useLevyExpiryCalendar() {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: LEVY_QUERY_KEYS.expiryCalendar(orgId),
    queryFn: () => getExpiryCalendar({ orgId }),
    enabled: !!orgId,
    staleTime: 60 * 60 * 1000,
    meta: { skipAuthRedirect: true },
    select: (response) =>
      Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
          ? response
          : [],
  });
}

export function useDonorLinks() {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: LEVY_QUERY_KEYS.donorLinks(orgId),
    queryFn: () => getDonorLinks({ orgId }),
    enabled: !!orgId,
    staleTime: 5 * 60 * 1000,
    meta: { skipAuthRedirect: true },
    select: (response) =>
      Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
          ? response
          : [],
  });
}

export function useSyncDonorLink() {
  const qc = useQueryClient();
  const { orgId } = useAuthUser();

  return useMutation({
    mutationFn: (id) => syncDonorLink({ orgId, id }),
    onSuccess: () => {
      toastSuccess("Levy balance synced.");
      qc.invalidateQueries({ queryKey: LEVY_QUERY_KEYS.donorLinks(orgId) });
      qc.invalidateQueries({ queryKey: LEVY_QUERY_KEYS.surplus(orgId) });
    },
    onError: (error) => {
      toastError(error.message || "Sync failed. Please try again.");
    },
  });
}

/** Pending/confirmed/rejected match applications where this org is the donor
 * being asked to fund an SME, or the recipient tracking its own requests. */
export function useLevyMatchApplications(params = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: LEVY_QUERY_KEYS.matchApplications(orgId, params),
    queryFn: () => getMatchApplications({ orgId, params }),
    enabled: !!orgId,
    staleTime: 60 * 1000,
    meta: { skipAuthRedirect: true },
    select: (response) => ({
      applications: Array.isArray(response?.data) ? response.data : [],
      meta: response?.meta ?? null,
    }),
  });
}

export function useConfirmMatchApplication() {
  const qc = useQueryClient();
  const { orgId } = useAuthUser();

  return useMutation({
    mutationFn: (id) =>
      updateMatchApplicationStatus({ orgId, id, status: "confirmed" }),
    onSuccess: () => {
      toastSuccess("Match confirmed. You can now create the transfer.");
      qc.invalidateQueries({ queryKey: LEVY_QUERY_KEYS.all() });
    },
    onError: (error) => {
      toastError(error.message || "Could not confirm the match.");
    },
  });
}

export function useRejectMatchApplication() {
  const qc = useQueryClient();
  const { orgId } = useAuthUser();

  return useMutation({
    mutationFn: (id) =>
      updateMatchApplicationStatus({ orgId, id, status: "rejected" }),
    onSuccess: () => {
      toastSuccess("Application rejected.");
      qc.invalidateQueries({ queryKey: LEVY_QUERY_KEYS.all() });
    },
    onError: (error) => {
      toastError(error.message || "Could not reject the match.");
    },
  });
}

export function useLevyTransfers(params = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: LEVY_QUERY_KEYS.transfers(orgId, params),
    queryFn: () => getTransfers({ orgId, params }),
    enabled: !!orgId,
    staleTime: 60 * 1000,
    meta: { skipAuthRedirect: true },
    select: (response) => ({
      transfers: Array.isArray(response?.data) ? response.data : [],
      meta: response?.meta ?? null,
    }),
  });
}

export function useLevyTransfer(id, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: LEVY_QUERY_KEYS.transfer(orgId, id),
    queryFn: () => getTransfer({ orgId, id }),
    enabled: !!orgId && !!id,
    meta: { skipAuthRedirect: true },
    ...options,
  });
}

export function useTransferDocument(id, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: LEVY_QUERY_KEYS.transferDocument(orgId, id),
    queryFn: () => getTransferDocument({ orgId, id }),
    enabled: !!orgId && !!id,
    meta: { skipAuthRedirect: true },
    ...options,
  });
}

export function useCreateTransferFromMatch() {
  const qc = useQueryClient();
  const { orgId } = useAuthUser();

  return useMutation({
    mutationFn: (dto) => createTransferFromMatch({ orgId, ...dto }),
    onSuccess: () => {
      toastSuccess("Transfer created. The agreement is being prepared.");
      qc.invalidateQueries({ queryKey: LEVY_QUERY_KEYS.all() });
    },
    onError: (error) => {
      toastError(error.message || "Could not create the transfer.");
    },
  });
}

export function useSignTransfer(id) {
  const qc = useQueryClient();
  const { orgId } = useAuthUser();

  return useMutation({
    mutationFn: ({ party, signatureImageKey }) =>
      signTransfer({ orgId, id, party, signatureImageKey }),
    onSuccess: () => {
      toastSuccess("Signature recorded.");
      qc.invalidateQueries({ queryKey: LEVY_QUERY_KEYS.transfer(orgId, id) });
      qc.invalidateQueries({
        queryKey: LEVY_QUERY_KEYS.transferDocument(orgId, id),
      });
      qc.invalidateQueries({ queryKey: LEVY_QUERY_KEYS.transfers(orgId, {}) });
    },
    onError: (error) => {
      toastError(error.message || "Could not record the signature.");
    },
  });
}

export function useSubmitTransferToDas(id) {
  const qc = useQueryClient();
  const { orgId } = useAuthUser();

  return useMutation({
    mutationFn: () => submitTransferToDas({ orgId, id }),
    onSuccess: () => {
      toastSuccess("Submitted to ESFA DAS.");
      qc.invalidateQueries({ queryKey: LEVY_QUERY_KEYS.transfer(orgId, id) });
      qc.invalidateQueries({ queryKey: LEVY_QUERY_KEYS.transfers(orgId, {}) });
    },
    onError: (error) => {
      toastError(error.message || "DAS submission failed.");
    },
  });
}
