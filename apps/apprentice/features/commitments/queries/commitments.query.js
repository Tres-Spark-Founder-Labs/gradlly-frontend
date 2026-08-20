"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { COMMITMENT_STATUS } from "../constants";
import {
  getCommitmentStatement,
  getCommitmentStatements,
  getSignedDocumentUrl,
  signCommitmentStatement,
} from "../services/commitments.service";

export const COMMITMENT_QUERY_KEYS = {
  all: ["commitment-statements"],
  list: (enrolmentId) => ["commitment-statements", "list", enrolmentId],
  detail: (id) => ["commitment-statements", "detail", id],
  signedDocument: (id) => ["commitment-statements", "signed-document", id],
};

export function useCommitmentStatements(enrolmentId) {
  return useQuery({
    queryKey: COMMITMENT_QUERY_KEYS.list(enrolmentId),
    queryFn: () => getCommitmentStatements({ enrolmentId }),
    enabled: Boolean(enrolmentId),
    select: (response) => (Array.isArray(response) ? response : []),
  });
}

export function useCommitmentStatement(id) {
  return useQuery({
    queryKey: COMMITMENT_QUERY_KEYS.detail(id),
    queryFn: () => getCommitmentStatement(id),
    enabled: Boolean(id),
  });
}

/**
 * F3.4.1 AC5 — the signed PDF, once every party has signed.
 *
 * Only enabled on a fully signed statement. The API cannot produce a document
 * before then, so requesting one mid-sequence would turn a normal state into a
 * failed request and a red error where the honest answer is "not yet".
 */
export function useSignedDocumentUrl(id, status) {
  return useQuery({
    queryKey: COMMITMENT_QUERY_KEYS.signedDocument(id),
    queryFn: () => getSignedDocumentUrl(id),
    enabled: Boolean(id) && status === COMMITMENT_STATUS.SIGNED,
    staleTime: 60 * 1000,
  });
}

export function useSignCommitmentStatement(id) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ signatureDataUrl }) =>
      signCommitmentStatement({ id, signatureDataUrl }),
    onSuccess: () => {
      // The signature changes the statement's status and may complete the
      // sequence, which is what makes the AC5 document available — so both the
      // detail and the document query are invalidated together.
      qc.invalidateQueries({ queryKey: COMMITMENT_QUERY_KEYS.detail(id) });
      qc.invalidateQueries({
        queryKey: COMMITMENT_QUERY_KEYS.signedDocument(id),
      });
      qc.invalidateQueries({ queryKey: COMMITMENT_QUERY_KEYS.all });
    },
  });
}
