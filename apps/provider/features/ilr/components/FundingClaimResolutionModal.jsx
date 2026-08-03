"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Scale } from "lucide-react";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { ServerErrorAlert } from "@/components/error/ServerErrorAlert";
import { SingleSelectField } from "@/components/form/SingleSelectField";
import { TextareaField } from "@/components/form/TextareaField";
import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { applyServerErrors } from "@/lib/errors";

import {
  FUNDING_RESOLUTION_CLOSING,
  FUNDING_RESOLUTION_OPTIONS,
  FUNDING_RESOLUTION_VALUES,
} from "../constants";
import { useSetFundingClaimResolution } from "../queries/ilr.query";

/**
 * Mirrors the backend rule: a note is required to close a claim, not to open
 * one. Validated here as well as there so the tutor sees the requirement
 * before submitting rather than as a server error afterwards.
 */
const resolutionSchema = z
  .object({
    status: z.enum(FUNDING_RESOLUTION_VALUES, { message: "Select a status" }),
    note: z
      .string()
      .trim()
      .max(2000, "Must be 2000 characters or fewer")
      .optional()
      .or(z.literal("")),
  })
  .superRefine((values, ctx) => {
    if (FUNDING_RESOLUTION_CLOSING.includes(values.status) && !values.note) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["note"],
        message:
          "Say why this claim is being closed — an ESFA reconciliation will ask.",
      });
    }
  });

export function FundingClaimResolutionModal({ claim, open, onClose }) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resolutionSchema),
    defaultValues: { status: "", note: "" },
    mode: "onBlur",
  });

  const statusValue = useWatch({ control, name: "status" });
  const {
    mutateAsync,
    isPending,
    error: serverError,
  } = useSetFundingClaimResolution();
  const disabled = isSubmitting || isPending;

  useEffect(() => {
    if (open) {
      reset({
        status: claim?.resolutionStatus ?? "",
        note: claim?.resolutionNote ?? "",
      });
    }
  }, [open, claim, reset]);

  const onSubmit = async (values) => {
    try {
      await mutateAsync({
        enrolmentId: claim?.enrolmentId,
        payload: {
          status: values.status,
          ...(values.note?.trim() ? { note: values.note.trim() } : {}),
        },
      });
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
      size="md"
      icon={<Scale className="size-4.5" strokeWidth={1.85} aria-hidden />}
      title="Funding claim"
      description={
        claim?.apprenticeName
          ? `${claim.apprenticeName} — claimed £${claim.claimedAmount?.toLocaleString()}, received £${claim.receivedAmount?.toLocaleString()}.`
          : "Record progress on this funding discrepancy."
      }
      footer={
        <Button
          type="submit"
          form="funding-claim-form"
          color="green"
          size="sm"
          loading={disabled}
          disabled={disabled}
        >
          Save
        </Button>
      }
    >
      <form
        id="funding-claim-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-4"
      >
        <ServerErrorAlert error={serverError} />

        <SingleSelectField
          required
          name="status"
          label="Status"
          options={FUNDING_RESOLUTION_OPTIONS}
          register={register}
          setValue={setValue}
          value={statusValue}
          error={errors.status?.message}
          placeholder="Select a status"
          searchable={false}
          disabled={disabled}
        />

        <TextareaField
          name="note"
          label="Note"
          placeholder="e.g. ESFA confirmed the balance will land in period 11."
          rows={4}
          maxLength={2000}
          register={register}
          error={errors.note?.message}
          disabled={disabled}
        />
      </form>
    </Modal>
  );
}
