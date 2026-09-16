"use client";

import { SignatureImageModal } from "@/components/signing/SignatureImageModal";

import { TRANSFER_PARTY } from "../constants";
import { useSignTransfer } from "../queries/levy-exchange.query";

/**
 * The recipient's signature on a transfer agreement — the same capture as
 * commitment statements (SignatureImageModal), with the transfer endpoint.
 *
 * Opened only when the transfer's `actionRequired` is true: the API's own
 * can-sign-now signal, which already applies the signing order and the
 * signer rule. This modal never decides that itself.
 */
export function SignTransferModal({ transfer, open, onClose, onSigned }) {
  const { mutateAsync, isPending, error } = useSignTransfer();

  return (
    <SignatureImageModal
      open={open}
      onClose={onClose}
      title="Sign the transfer agreement"
      note="The donor signs first, then the recipient. The order is enforced by the API, which refuses a signature out of turn or from anyone but your organisation's assigned signer, owner or admin."
      onSign={(signatureImageKey) =>
        mutateAsync({
          id: transfer.id,
          party: TRANSFER_PARTY.RECIPIENT,
          signatureImageKey,
        })
      }
      onSigned={onSigned}
      isPending={isPending}
      error={error}
    />
  );
}
