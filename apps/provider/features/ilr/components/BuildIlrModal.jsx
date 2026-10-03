"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FilePlus2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";

import { ServerErrorAlert } from "@/components/error/ServerErrorAlert";
import { InputField } from "@/components/form/InputField";
import { SingleSelectField } from "@/components/form/SingleSelectField";
import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useApprentices } from "@/features/apprentices/queries/apprentices.query";
import { useEnrolments } from "@/features/enrolments/queries/enrolments.query";
import { useStandards } from "@/features/standards/queries/standards.query";
import { applyServerErrors } from "@/lib/errors";
import { getFullName } from "@/utils/helper";

import { useBuildIlrRecord } from "../queries/ilr.query";
import { ilrBuildDefaults, ilrBuildSchema, toBuildPayload } from "../schemas";

/**
 * Build (or refresh) an ILR learner record from an enrolment. Re-building the
 * same enrolment refreshes auto-mapped fields while keeping manual overrides.
 */
export function BuildIlrModal({ open, onClose, onBuilt }) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(ilrBuildSchema),
    defaultValues: ilrBuildDefaults,
    mode: "onBlur",
  });

  const enrolmentId = useWatch({ control, name: "enrolmentId" });

  /**
   * Enrolment rows carry `apprenticeId` and `standardId` only — no server-side
   * join — so the label is assembled the same way the enrolments table already
   * assembles it, from the separately cached apprentice and standard lists.
   * Submitting an ILR record against the wrong learner is not a mistake anyone
   * should be able to make by mistyping a character.
   */
  const { data: enrolmentData, isLoading: loadingEnrolments } = useEnrolments({
    page: 1,
    perPage: 100,
  });
  const { data: apprenticeData } = useApprentices({ perPage: 100 });
  const { data: standardData } = useStandards({ perPage: 100 });

  const enrolmentOptions = useMemo(() => {
    const apprenticeNameById = new Map(
      (apprenticeData?.apprentices ?? []).map((a) => [a.id, getFullName(a)]),
    );
    const standardNameById = new Map(
      (standardData?.standards ?? []).map((s) => [
        s.id,
        `${s.title} (${s.code})`,
      ]),
    );

    return (enrolmentData?.enrolments ?? []).map((enrolment) => {
      const learner =
        apprenticeNameById.get(enrolment.apprenticeId) ?? "Unnamed learner";
      const standard = standardNameById.get(enrolment.standardId);
      const started = enrolment.plannedStartDate
        ? ` · from ${enrolment.plannedStartDate}`
        : "";
      return {
        value: enrolment.id,
        text: standard
          ? `${learner} · ${standard}${started}`
          : `${learner}${started}`,
      };
    });
  }, [enrolmentData, apprenticeData, standardData]);

  const { mutateAsync, isPending, error: serverError } = useBuildIlrRecord();
  const disabled = isSubmitting || isPending;

  useEffect(() => {
    if (open) reset(ilrBuildDefaults);
  }, [open, reset]);

  const onSubmit = async (values) => {
    try {
      const record = await mutateAsync(toBuildPayload(values));
      onBuilt?.(record);
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
      icon={<FilePlus2 className="size-4.5" strokeWidth={1.85} aria-hidden />}
      title="Build ILR record"
      description="Generate the ILR record for an enrolment from its domain data."
      footer={
        <Button
          type="submit"
          form="ilr-build-form"
          color="green"
          size="sm"
          loading={disabled}
          disabled={disabled}
          startIcon={<FilePlus2 className="size-4" />}
        >
          Build record
        </Button>
      }
    >
      <form
        id="ilr-build-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-4"
      >
        <ServerErrorAlert error={serverError} />

        <SingleSelectField
          required
          name="enrolmentId"
          label="Learner"
          options={enrolmentOptions}
          register={register}
          setValue={setValue}
          value={enrolmentId ?? ""}
          error={errors.enrolmentId?.message}
          placeholder={
            loadingEnrolments
              ? "Loading enrolments…"
              : enrolmentOptions.length > 0
                ? "Select the learner to build a record for"
                : "No enrolments yet. Create one first."
          }
          disabled={
            disabled || loadingEnrolments || enrolmentOptions.length === 0
          }
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputField
            required
            name="collectionPeriod"
            label="Collection period"
            placeholder="2025-10"
            register={register}
            error={errors.collectionPeriod?.message}
            disabled={disabled}
          />
          <InputField
            required
            name="academicYear"
            label="Academic year"
            placeholder="2025-26"
            register={register}
            error={errors.academicYear?.message}
            disabled={disabled}
          />
        </div>
      </form>
    </Modal>
  );
}
