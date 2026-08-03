"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarClock } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import { ServerErrorAlert } from "@/components/error/ServerErrorAlert";
import { InputField } from "@/components/form/InputField";
import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { applyServerErrors } from "@/lib/errors";

import { useSetEnrolmentJourney } from "../queries/enrolments.query";
import { journeySchema, toJourneyPayload } from "../schemas";

/**
 * F2.2.4 AC1 — EPA date *and* EPA organisation.
 *
 * This was "Set EPA date". The profile could say when the assessment was and
 * never who was doing it, so a tutor chasing an overdue result had a date and
 * nobody to ring. Both are decided at the same point in the journey — an EPAO
 * is appointed part-way through, not at enrolment — so they are set together.
 */
export function SetEpaDetailsModal({
  enrolmentId,
  currentEpaDate,
  currentEpaOrganisationName,
  currentEpaOrganisationUkprn,
  open,
  onClose,
}) {
  const defaults = useMemo(
    () => ({
      epaDate: currentEpaDate ?? "",
      epaOrganisationName: currentEpaOrganisationName ?? "",
      epaOrganisationUkprn: currentEpaOrganisationUkprn ?? "",
    }),
    [currentEpaDate, currentEpaOrganisationName, currentEpaOrganisationUkprn],
  );

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(journeySchema),
    defaultValues: defaults,
    mode: "onBlur",
  });

  const {
    mutateAsync,
    isPending,
    error: serverError,
  } = useSetEnrolmentJourney();
  const disabled = isSubmitting || isPending;

  useEffect(() => {
    if (open) reset(defaults);
  }, [open, defaults, reset]);

  const onSubmit = async (values) => {
    try {
      await mutateAsync({ id: enrolmentId, payload: toJourneyPayload(values) });
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
      icon={
        <CalendarClock className="size-4.5" strokeWidth={1.85} aria-hidden />
      }
      title="EPA details"
      description="The confirmed assessment date drives the countdown and pace. The organisation is who to contact about the result."
      footer={
        <Button
          type="submit"
          form="epa-details-form"
          color="green"
          size="sm"
          loading={disabled}
          disabled={disabled}
        >
          Save EPA details
        </Button>
      }
    >
      <form
        id="epa-details-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-4"
      >
        <ServerErrorAlert error={serverError} />

        <InputField
          name="epaDate"
          label="EPA date"
          type="date"
          register={register}
          error={errors.epaDate?.message}
          disabled={disabled}
        />

        <InputField
          name="epaOrganisationName"
          label="EPA organisation"
          placeholder="e.g. BCS, The Chartered Institute for IT"
          register={register}
          error={errors.epaOrganisationName?.message}
          disabled={disabled}
        />

        <InputField
          name="epaOrganisationUkprn"
          label="EPA organisation UKPRN"
          placeholder="8 digits, as it appears on the ILR"
          inputMode="numeric"
          maxLength={8}
          register={register}
          error={errors.epaOrganisationUkprn?.message}
          disabled={disabled}
        />

        <p className="text-xs text-neutral-400">
          Leaving a field blank leaves the saved value unchanged.
        </p>
      </form>
    </Modal>
  );
}
