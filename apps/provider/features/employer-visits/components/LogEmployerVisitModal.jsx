"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin } from "lucide-react";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";

import { ServerErrorAlert } from "@/components/error/ServerErrorAlert";
import { InputField } from "@/components/form/InputField";
import { SingleSelectField } from "@/components/form/SingleSelectField";
import { TextareaField } from "@/components/form/TextareaField";
import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { applyServerErrors } from "@/lib/errors";
import { formatDate } from "@/utils/helper";

import { EMPLOYER_VISIT_TYPE_OPTIONS } from "../constants";
import {
  useCreateEmployerVisit,
  useNextVisitSuggestion,
} from "../queries/employer-visits.query";
import {
  employerVisitDefaults,
  employerVisitSchema,
  toEmployerVisitPayload,
} from "../schemas";

/**
 * F2.4.2 — record an employer visit.
 *
 * @param {string} [employerOrganisationId] pre-selected when opened from an
 *   employer row; the select is then locked, because the visit belongs to that
 *   employer and changing it silently would file the notes against the wrong one.
 */
export function LogEmployerVisitModal({
  employerOrganisationId,
  employerName,
  employerOptions = [],
  open,
  onClose,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(employerVisitSchema),
    defaultValues: employerVisitDefaults,
    mode: "onBlur",
  });

  const selectedEmployer = useWatch({
    control,
    name: "employerOrganisationId",
  });
  const visitTypeValue = useWatch({ control, name: "visitType" });

  const {
    mutateAsync,
    isPending,
    error: serverError,
  } = useCreateEmployerVisit();
  const { data: suggestion } = useNextVisitSuggestion(selectedEmployer);
  const disabled = isSubmitting || isPending;

  useEffect(() => {
    if (open) {
      reset({
        ...employerVisitDefaults,
        employerOrganisationId: employerOrganisationId ?? "",
        // Today, as the overwhelmingly common case — a tutor logs a visit on
        // the day or shortly after.
        visitedOn: new Date().toISOString().slice(0, 10),
      });
    }
  }, [open, employerOrganisationId, reset]);

  const onSubmit = async (values) => {
    try {
      await mutateAsync(toEmployerVisitPayload(values));
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
      icon={<MapPin className="size-4.5" strokeWidth={1.85} aria-hidden />}
      title="Log employer visit"
      description={
        employerName
          ? `Record an engagement with ${employerName}.`
          : "Record an engagement with an employer."
      }
      footer={
        <Button
          type="submit"
          form="employer-visit-form"
          color="green"
          size="sm"
          loading={disabled}
          disabled={disabled}
        >
          Save visit
        </Button>
      }
    >
      <form
        id="employer-visit-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-4"
      >
        <ServerErrorAlert error={serverError} />

        {employerOrganisationId ? null : (
          <SingleSelectField
            required
            name="employerOrganisationId"
            label="Employer"
            options={employerOptions}
            register={register}
            setValue={setValue}
            value={selectedEmployer}
            error={errors.employerOrganisationId?.message}
            placeholder="Select an employer"
            disabled={disabled}
          />
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputField
            required
            name="visitedOn"
            label="Visit date"
            type="date"
            register={register}
            error={errors.visitedOn?.message}
            disabled={disabled}
          />
          <SingleSelectField
            required
            name="visitType"
            label="Visit type"
            options={EMPLOYER_VISIT_TYPE_OPTIONS}
            register={register}
            setValue={setValue}
            value={visitTypeValue}
            error={errors.visitType?.message}
            placeholder="Select a type"
            searchable={false}
            disabled={disabled}
          />
        </div>

        <InputField
          required
          name="attendees"
          label="Attendees"
          placeholder="e.g. Sarah Patel (Operations Manager), Tom Reid (tutor)"
          register={register}
          error={errors.attendees?.message}
          disabled={disabled}
        />

        <TextareaField
          required
          name="discussionPoints"
          label="Discussion points"
          rows={4}
          maxLength={5000}
          register={register}
          error={errors.discussionPoints?.message}
          disabled={disabled}
        />

        <TextareaField
          name="actionPoints"
          label="Action points"
          rows={3}
          maxLength={5000}
          register={register}
          error={errors.actionPoints?.message}
          disabled={disabled}
        />

        <InputField
          name="nextVisitDate"
          label="Next visit date"
          type="date"
          register={register}
          error={errors.nextVisitDate?.message}
          disabled={disabled}
        />

        {/*
         * F2.4.2 AC4. Offered, not imposed — the field stays blank unless the
         * tutor takes the suggestion, because a guessed date on an Ofsted
         * evidence record is worse than an honest gap.
         */}
        {suggestion?.suggestedDate ? (
          <p className="text-xs text-neutral-500">
            {suggestion.lastVisitedOn
              ? `Last visit ${formatDate(suggestion.lastVisitedOn)}. `
              : "No previous visit on record. "}
            Suggested next visit{" "}
            <button
              type="button"
              onClick={() =>
                setValue("nextVisitDate", suggestion.suggestedDate, {
                  shouldValidate: true,
                })
              }
              className="font-medium text-primary-700 underline hover:no-underline"
              disabled={disabled}
            >
              {formatDate(suggestion.suggestedDate)}
            </button>{" "}
            ({suggestion.intervalWeeks} weeks).
          </p>
        ) : null}
      </form>
    </Modal>
  );
}
