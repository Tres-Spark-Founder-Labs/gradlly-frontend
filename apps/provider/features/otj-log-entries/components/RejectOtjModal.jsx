"use client";

import { XCircle } from "lucide-react";
import { useState } from "react";

import { TextareaField } from "@/components/form/TextareaField";
import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

import { useBulkRejectOtj } from "../queries/otj-log-entries.query";

/** Matches the API's minimum (F1.2.3 AC3). */
const MIN_REASON_LENGTH = 10;

/**
 * Bulk-reject the given submitted entries with a shared reason.
 *
 * The reason used to be optional here, and this modal sent `undefined` when
 * it was blank. `POST /otj-log-entries/bulk-reject` now requires at least
 * ten characters, so leaving it optional would mean a field labelled
 * "optional" that returns a 400 — the API and this form disagreeing about
 * their own contract.
 *
 * The rule was introduced for the employer portal, but it is not
 * employer-specific: a rejection with no explanation leaves the apprentice
 * with nothing to act on whoever sent it.
 *
 * @param {string[]} ids        entry ids to reject
 * @param {Function} [onDone]   called after a successful reject (e.g. clear selection)
 */
export function RejectOtjModal({ ids = [], open, onClose, onDone }) {
  const [reason, setReason] = useState("");
  const { mutateAsync, isPending } = useBulkRejectOtj();

  const trimmedLength = reason.trim().length;
  const reasonTooShort = trimmedLength < MIN_REASON_LENGTH;

  // Reset on the way out so the next open starts clean (no setState-in-effect).
  const handleClose = () => {
    if (isPending) return;
    setReason("");
    onClose();
  };

  const handleReject = async () => {
    if (reasonTooShort) return;
    try {
      await mutateAsync({ ids, reason: reason.trim() });
      onDone?.();
      setReason("");
      onClose();
    } catch {
      // surfaced via the mutation's onError toast
    }
  };

  const count = ids.length;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      busy={isPending}
      size="md"
      icon={<XCircle className="size-4.5" strokeWidth={1.85} aria-hidden />}
      title={`Reject ${count} ${count === 1 ? "entry" : "entries"}?`}
      description="The apprentice can see the reason and resubmit."
      footer={
        <Button
          type="button"
          color="black"
          variant="solid"
          size="sm"
          loading={isPending}
          disabled={isPending || count === 0 || reasonTooShort}
          onClick={handleReject}
          className="!bg-red-600 !border-red-600 hover:!bg-red-700 hover:!border-red-700"
        >
          Reject {count > 0 ? count : ""}
        </Button>
      }
    >
      <TextareaField
        name="reason"
        label="Reason"
        placeholder="e.g. Insufficient detail — please add what you learned."
        rows={4}
        maxLength={1000}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        disabled={isPending}
        hint={
          reasonTooShort
            ? `${trimmedLength} / ${MIN_REASON_LENGTH} characters minimum — the apprentice sees this.`
            : "The apprentice sees this and can resubmit."
        }
      />
    </Modal>
  );
}
