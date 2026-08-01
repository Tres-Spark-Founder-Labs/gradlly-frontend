"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ClipboardList, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { ServerErrorAlert } from "@/components/error/ServerErrorAlert";
import { InputField } from "@/components/form/InputField";
import { SingleSelectField } from "@/components/form/SingleSelectField";
import { TextareaField } from "@/components/form/TextareaField";
import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { applyServerErrors } from "@/lib/errors";

import { EvidenceAttachments } from "./EvidenceAttachments";
import { QIP_STATUS_OPTIONS } from "../constants";
import {
  useCreateQipAction,
  useEifCriterionOptions,
  useUpdateQipAction,
} from "../queries/ofsted.query";
import {
  qipActionDefaults,
  qipActionDefaultsFromRow,
  qipActionSchema,
  toQipActionPayload,
} from "../schemas";

/**
 * Create / edit a QIP action. One form for both (DRY).
 *
 * @param {object} [action]       row to edit (omit for create)
 * @param {string} [prefillSlug]  pre-select an EIF criterion (from the dashboard CTA)
 */
export function QipActionModal({ open, onClose, action = null, prefillSlug }) {
  const isEdit = Boolean(action);

  const defaults = useMemo(() => {
    if (isEdit) return qipActionDefaultsFromRow(action);
    return prefillSlug
      ? { ...qipActionDefaults, eifCriterionSlug: prefillSlug }
      : qipActionDefaults;
  }, [isEdit, action, prefillSlug]);

  // Attachment keys are managed outside RHF (uploaded then carried into payload).
  // Seeded from the edit target; the parent remounts via `key` per open so this
  // initializer runs fresh each time (no setState-in-effect needed).
  const [attachmentKeys, setAttachmentKeys] = useState(
    () => action?.evidenceAttachmentKeys ?? [],
  );

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(qipActionSchema),
    defaultValues: defaults,
    mode: "onBlur",
  });

  const criterionValue = useWatch({ control, name: "eifCriterionSlug" });
  const statusValue = useWatch({ control, name: "status" });

  const { data: criterionOptions = [] } = useEifCriterionOptions({
    enabled: open,
  });

  const create = useCreateQipAction();
  const update = useUpdateQipAction();
  const {
    mutateAsync,
    isPending,
    error: serverError,
  } = isEdit ? update : create;
  const disabled = isSubmitting || isPending;

  useEffect(() => {
    if (open) reset(defaults);
  }, [open, defaults, reset]);

  const onSubmit = async (values) => {
    const payload = toQipActionPayload(values, {
      evidenceAttachmentKeys: attachmentKeys,
    });
    try {
      if (isEdit) {
        await mutateAsync({ id: action.id, payload });
      } else {
        await mutateAsync(payload);
      }
      onClose();
    } catch (err) {
      applyServerErrors(err, setError);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      busy={disabled}
      size="lg"
      icon={
        <ClipboardList className="size-4.5" strokeWidth={1.85} aria-hidden />
      }
      title={isEdit ? "Edit QIP action" : "New QIP action"}
      description="A trackable improvement action tied to an EIF criterion."
      footer={
        <Button
          type="submit"
          form="qip-form"
          color="green"
          size="sm"
          loading={disabled}
          disabled={disabled}
          startIcon={
            isEdit ? (
              <Save className="size-4" />
            ) : (
              <ClipboardList className="size-4" />
            )
          }
        >
          {isEdit ? "Save changes" : "Create action"}
        </Button>
      }
    >
      <form
        id="qip-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-4"
      >
        <ServerErrorAlert error={serverError} />

        <InputField
          required
          name="title"
          label="Title"
          placeholder="Publish updated safeguarding policy"
          register={register}
          error={errors.title?.message}
          disabled={disabled}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SingleSelectField
            required
            name="eifCriterionSlug"
            label="EIF criterion"
            options={criterionOptions}
            register={register}
            setValue={setValue}
            value={criterionValue}
            error={errors.eifCriterionSlug?.message}
            placeholder="Select a criterion"
          />
          <SingleSelectField
            required
            name="status"
            label="Status"
            options={QIP_STATUS_OPTIONS}
            register={register}
            setValue={setValue}
            value={statusValue}
            error={errors.status?.message}
            placeholder="Select a status"
            searchable={false}
            disabled={disabled}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputField
            required
            name="assignedOwnerUserId"
            label="Owner user ID"
            placeholder="UUID of an active org member"
            register={register}
            error={errors.assignedOwnerUserId?.message}
            disabled={disabled}
          />
          <InputField
            required
            name="targetCompletionDate"
            label="Target date"
            type="date"
            register={register}
            error={errors.targetCompletionDate?.message}
            disabled={disabled}
          />
        </div>

        <TextareaField
          name="description"
          label="Description"
          rows={3}
          register={register}
          error={errors.description?.message}
          disabled={disabled}
        />

        <TextareaField
          name="evidenceNotes"
          label="Evidence notes"
          rows={2}
          register={register}
          error={errors.evidenceNotes?.message}
          disabled={disabled}
        />

        <div className="space-y-2">
          <p className="text-sm font-medium text-neutral-700">
            Evidence attachments (optional)
          </p>
          <EvidenceAttachments
            keys={attachmentKeys}
            onChange={setAttachmentKeys}
            disabled={disabled}
          />
        </div>
      </form>
    </Modal>
  );
}
