"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { toastError, toastSuccess } from "@/hooks/useToast";

import { COMMITMENT_QUERY_KEYS } from "./keys";
import {
  cancelCommitmentStatement,
  getCommitmentBoard,
  getCommitmentStatement,
  getCommitmentVersionHistory,
  getSignedCommitmentDocument,
  createCommitmentStatement,
  getCommitmentStatements,
  publishCommitmentStatement,
  signCommitmentStatement,
} from "../services/commitments.service";

/**
 * F1.3.1 2014 the employer status board.
 *
 * `actionRequiredCount` comes back alongside the rows and is what the sidebar
 * badge reads (AC5), so the badge and the table can never disagree.
 */
export function useCommitmentBoard(filters = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: COMMITMENT_QUERY_KEYS.board(orgId, filters),
    queryFn: () => getCommitmentBoard({ orgId, ...filters }),
    enabled: !!orgId,
    staleTime: 60 * 1000,
    meta: { skipAuthRedirect: true },
  });
}

/**
 * F1.3.2 AC1 — the full statement text, read before signing.
 *
 * The detail endpoint resolves for any *party* to the statement rather than
 * only the organisation that owns it, which is what lets an employer read a
 * document the provider drafted.
 */
export function useCommitmentStatement(id, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: COMMITMENT_QUERY_KEYS.detail(orgId, id),
    queryFn: () => getCommitmentStatement({ orgId, id }),
    enabled: !!orgId && !!id,
    staleTime: 60 * 1000,
    meta: { skipAuthRedirect: true },
    ...options,
  });
}

/** F1.3.2 AC5 — version history for a statement group. */
export function useCommitmentVersionHistory(groupId, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: COMMITMENT_QUERY_KEYS.versionHistory(orgId, groupId),
    queryFn: () => getCommitmentVersionHistory({ orgId, groupId }),
    enabled: !!orgId && !!groupId,
    staleTime: 60 * 1000,
    meta: { skipAuthRedirect: true },
    ...options,
  });
}

/**
 * F1.3.2 AC6 — fetches a fresh presigned link and opens it.
 *
 * A mutation rather than a query: the URL is short-lived, so it is requested
 * at the moment of the click rather than held in a cache that could hand back
 * an expired link.
 */
export function useDownloadSignedCommitment() {
  const { orgId } = useAuthUser();

  return useMutation({
    mutationFn: (id) => getSignedCommitmentDocument({ orgId, id }),
    onSuccess: (doc) => {
      if (doc?.downloadUrl) window.open(doc.downloadUrl, "_blank", "noopener");
    },
    onError: (error) => {
      toastError(error.message || "Could not open the signed document.");
    },
  });
}

export function useCommitmentStatements(filters = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: COMMITMENT_QUERY_KEYS.list(orgId, filters),
    queryFn: () => getCommitmentStatements({ orgId, ...filters }),
    enabled: !!orgId,
    staleTime: 2 * 60 * 1000,
    meta: { skipAuthRedirect: true },
    select: (r) => r?.data ?? [],
  });
}

export function useCreateCommitmentStatement() {
  const qc = useQueryClient();
  const { orgId } = useAuthUser();

  return useMutation({
    mutationFn: (body) => createCommitmentStatement({ orgId, body }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: COMMITMENT_QUERY_KEYS.all() });
      toastSuccess("Commitment statement created.");
    },
    onError: (error) => {
      toastError(error.message || "Failed to create commitment statement.");
    },
  });
}

export function usePublishCommitmentStatement() {
  const qc = useQueryClient();
  const { orgId } = useAuthUser();

  return useMutation({
    mutationFn: (id) => publishCommitmentStatement({ orgId, id }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: COMMITMENT_QUERY_KEYS.all() });
      toastSuccess("Commitment statement published for signatures.");
    },
    onError: (error) => {
      toastError(error.message || "Failed to publish.");
    },
  });
}

export function useCancelCommitmentStatement() {
  const qc = useQueryClient();
  const { orgId } = useAuthUser();

  return useMutation({
    mutationFn: (id) => cancelCommitmentStatement({ orgId, id }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: COMMITMENT_QUERY_KEYS.all() });
      toastSuccess("Commitment statement cancelled.");
    },
    onError: (error) => {
      toastError(error.message || "Failed to cancel.");
    },
  });
}

export function useSignCommitmentStatement() {
  const qc = useQueryClient();
  const { orgId } = useAuthUser();

  return useMutation({
    mutationFn: ({ id, party, signatureImageKey }) =>
      signCommitmentStatement({ orgId, id, party, signatureImageKey }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: COMMITMENT_QUERY_KEYS.all() });
      toastSuccess("Commitment statement signed.");
    },
    onError: (error) => {
      toastError(error.message || "Failed to sign.");
    },
  });
}
