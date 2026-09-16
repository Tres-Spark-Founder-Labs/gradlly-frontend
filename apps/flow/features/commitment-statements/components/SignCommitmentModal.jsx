"use client";

import { SignatureImageModal } from "@/components/signing/SignatureImageModal";

import { PARTY_LABELS } from "../constants";
import { useSignCommitmentStatement } from "../queries/commitment-statements.query";

/**
 * Sign one tripartite slot: upload the signature image (→ S3 key), then POST
 * /sign with { party, signatureImageKey }. The next party (if any) is surfaced
 * by the parent from the sign response.
 *
 * The capture itself lives in SignatureImageModal, shared with levy transfer
 * signing so both flows are one experience (F1.3.2). This file keeps the
 * commitment-specific wording and endpoint.
 *
 * @param {object}  statement
 * @param {string}  party        the party signing now (apprentice|tutor|employer_manager)
 * @param {Function} [onSigned]  called with the SignCommitmentResponseDto
 */
export function SignCommitmentModal({
  statement,
  party,
  open,
  onClose,
  onSigned,
}) {
  const { mutateAsync, isPending, error } = useSignCommitmentStatement();
  const partyLabel = PARTY_LABELS[party] ?? party;

  return (
    <SignatureImageModal
      open={open}
      onClose={onClose}
      title={`Sign as ${partyLabel}`}
      note="Signing order is sequential: apprentice → tutor → employer manager. Each party must be signed in by their assigned account."
      onSign={(signatureImageKey) =>
        mutateAsync({ id: statement.id, party, signatureImageKey })
      }
      onSigned={onSigned}
      isPending={isPending}
      error={error}
    />
  );
}
