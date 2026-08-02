"use client";

import { CheckCircle2 } from "lucide-react";
import { useState } from "react";

import { SingleSelectField } from "@/components/form/SingleSelectField";
import { TextareaField } from "@/components/form/TextareaField";
import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

import { EvidenceAttachments } from "./EvidenceAttachments";
import { EIF_CRITERION_LABELS, QIP_STATUS_OPTIONS } from "../constants";
import { useUpdateQipActionProgress } from "../queries/ofsted.query";

/**
 * F2.1.2 — report progress on an action you own.
 *
 * Deliberately not the edit form. This modal can only move the status, add
 * notes and attach documents; the title, owner, target date and EIF criterion
 * are shown as read-only context because changing them is a different act by
 * a different person (see UpdateQipActionProgressDto on the API).
 *
 * The parent remounts this via `key` per target, so the initial state below
 * runs fresh each time rather than needing an effect to resync.
 */
export function QipProgressModal({ open, onClose, action }) {
  const [status, setStatus] = useState(() => action?.status ?? "");
  const [evidenceNotes, setEvidenceNotes] = useState(
    () => action?.evidenceNotes ?? "",
  );
  const [attachmentKeys, setAttachmentKeys] = useState(
    () => action?.evidenceAttachmentKeys ?? [],
  );

  const { mutateAsync, isPending } = useUpdateQipActionProgress();

  if (!action) return null;

  const submit = async () => {
    try {
      await mutateAsync({
        id: action.id,
        payload: {
          status,
          // Cleared notes must reach the API as "", not vanish from the body —
          // an omitted key would leave the old text in place.
          evidenceNotes: evidenceNotes ?? "",
          evidenceAttachmentKeys: attachmentKeys,
        },
      });
      onClose();
    } catch {
      // The mutation already surfaced the error; leave the modal open so the
      // notes just typed are not thrown away.
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      busy={isPending}
      size="lg"
      icon={
        <CheckCircle2 className="size-4.5" strokeWidth={1.85} aria-hidden />
      }
      title="Update progress"
      description="Record what has been done and attach the evidence."
      footer={
        <Button
          type="button"
          color="green"
          size="sm"
          loading={isPending}
          disabled={isPending}
          onClick={submit}
          startIcon={<CheckCircle2 className="size-4" />}
        >
          Save progress
        </Button>
      }
    >
      <div className="space-y-4">
        {/* Read-only context: what the action is, and who set it. */}
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3">
          <p className="font-medium text-neutral-900">{action.title}</p>
          <p className="mt-0.5 text-xs text-neutral-500">
            {EIF_CRITERION_LABELS[action.eifCriterionSlug] ??
              action.eifCriterionSlug}
            {action.targetCompletionDate
              ? ` · target ${action.targetCompletionDate}`
              : ""}
          </p>
          {action.description ? (
            <p className="mt-2 text-sm text-neutral-600">
              {action.description}
            </p>
          ) : null}
        </div>

        <SingleSelectField
          name="qipProgressStatus"
          label="Status"
          options={QIP_STATUS_OPTIONS}
          value={status}
          setValue={(_, v) => setStatus(v)}
          disabled={isPending}
          searchable={false}
        />

        <TextareaField
          name="qipProgressNotes"
          label="Evidence notes"
          placeholder="What was done, and what shows it was done."
          value={evidenceNotes}
          onChange={(e) => setEvidenceNotes(e.target.value)}
          disabled={isPending}
          rows={4}
        />

        <div className="space-y-2">
          <p className="text-sm font-medium text-neutral-700">
            Evidence attachments
          </p>
          <EvidenceAttachments
            keys={attachmentKeys}
            onChange={setAttachmentKeys}
            disabled={isPending}
          />
        </div>
      </div>
    </Modal>
  );
}
