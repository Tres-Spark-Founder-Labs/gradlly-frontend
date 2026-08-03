"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PauseCircle, PlayCircle } from "lucide-react";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";

import { ServerErrorAlert } from "@/components/error/ServerErrorAlert";
import { InputField } from "@/components/form/InputField";
import { SingleSelectField } from "@/components/form/SingleSelectField";
import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { applyServerErrors } from "@/lib/errors";

import { BREAK_IN_LEARNING_REASONS } from "../constants";
import {
  useEndBreakInLearning,
  useRecordBreakInLearning,
} from "../queries/enrolments.query";
import {
  breakInLearningDefaults,
  breakInLearningSchema,
  endBreakInLearningDefaults,
  endBreakInLearningSchema,
  toBreakInLearningPayload,
  toEndBreakInLearningPayload,
} from "../schemas";

/**
 * F2.2.4 AC6 — record a break in learning, or record the learner returning.
 *
 * One component with two modes rather than two files: the tutor is doing the
 * same job either way ("this learner is off / this learner is back"), and the
 * button that opens it is the same button in the same place on the profile.
 *
 * Both actions notify the ESFA on the backend, because a planned break moves
 * the expected end date and the funding schedule with it. That is stated in
 * the modal — a tutor should know when an action leaves the building.
 *
 * @param {"start"|"end"} mode
 */
export function BreakInLearningModal({
  enrolmentId,
  learnerName,
  mode = "start",
  open,
  onClose,
}) {
  const isStart = mode === "start";

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(
      isStart ? breakInLearningSchema : endBreakInLearningSchema,
    ),
    defaultValues: isStart
      ? breakInLearningDefaults
      : endBreakInLearningDefaults,
    mode: "onBlur",
  });

  const reasonValue = useWatch({ control, name: "reason" });

  const start = useRecordBreakInLearning();
  const end = useEndBreakInLearning();
  const active = isStart ? start : end;
  const disabled = isSubmitting || active.isPending;

  useEffect(() => {
    if (open) {
      reset(isStart ? breakInLearningDefaults : endBreakInLearningDefaults);
    }
  }, [open, isStart, reset]);

  const onSubmit = async (values) => {
    try {
      await active.mutateAsync({
        id: enrolmentId,
        payload: isStart
          ? toBreakInLearningPayload(values)
          : toEndBreakInLearningPayload(values),
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
      icon={
        isStart ? (
          <PauseCircle className="size-4.5" strokeWidth={1.85} aria-hidden />
        ) : (
          <PlayCircle className="size-4.5" strokeWidth={1.85} aria-hidden />
        )
      }
      title={isStart ? "Record break in learning" : "Record return from break"}
      description={
        isStart
          ? `Pauses ${learnerName || "this learner"} and notifies the ESFA.`
          : `Reactivates ${learnerName || "this learner"} and notifies the ESFA.`
      }
      footer={
        <Button
          type="submit"
          form="break-in-learning-form"
          color="green"
          size="sm"
          loading={disabled}
          disabled={disabled}
        >
          {isStart ? "Record break" : "Record return"}
        </Button>
      }
    >
      <form
        id="break-in-learning-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-4"
      >
        <ServerErrorAlert error={active.error} />

        {isStart ? (
          <>
            <SingleSelectField
              required
              name="reason"
              label="Reason"
              options={BREAK_IN_LEARNING_REASONS}
              register={register}
              setValue={setValue}
              value={reasonValue}
              error={errors.reason?.message}
              placeholder="Select a reason"
              searchable={false}
              disabled={disabled}
            />

            <InputField
              name="startedOn"
              label="Start date"
              type="date"
              register={register}
              error={errors.startedOn?.message}
              disabled={disabled}
            />

            <InputField
              name="expectedReturnDate"
              label="Expected return date"
              type="date"
              register={register}
              error={errors.expectedReturnDate?.message}
              disabled={disabled}
            />

            <p className="text-xs text-neutral-400">
              Leave the expected return blank if it is genuinely unknown — a
              guessed date on a funding record is worse than an honest gap.
              Dates default to today when left empty.
            </p>
          </>
        ) : (
          <>
            <InputField
              name="actualReturnDate"
              label="Return date"
              type="date"
              register={register}
              error={errors.actualReturnDate?.message}
              disabled={disabled}
            />
            <p className="text-xs text-neutral-400">
              Defaults to today when left empty.
            </p>
          </>
        )}
      </form>
    </Modal>
  );
}
