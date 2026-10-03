"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarClock, Save } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";

import { ServerErrorAlert } from "@/components/error/ServerErrorAlert";
import { InputField } from "@/components/form/InputField";
import { SingleSelectField } from "@/components/form/SingleSelectField";
import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import {
  selectParticipantOptions,
  useParticipantOptions,
} from "@/features/enrolments/queries/enrolments.query";
import { participantPlaceholder } from "@/features/enrolments/utils/participant-placeholder";
import { applyServerErrors } from "@/lib/errors";

import { useCreateReview, useUpdateReview } from "../queries/reviews.query";
import {
  reviewScheduleDefaults,
  reviewScheduleDefaultsFromRow,
  reviewScheduleSchema,
  toCreateReviewPayload,
  toUpdateReviewPayload,
} from "../schemas";

/**
 * Schedule a new review (create) or reschedule/edit an existing one.
 * One form for both flows (DRY); `review` switches to edit mode.
 *
 * @param {object} [review]   the review to edit (omit for create)
 * @param {{enrolmentId, apprenticeId}} context  required for create
 */
export function ReviewScheduleModal({
  open,
  onClose,
  review = null,
  context = {},
}) {
  const isEdit = Boolean(review);

  const defaults = useMemo(
    () =>
      isEdit ? reviewScheduleDefaultsFromRow(review) : reviewScheduleDefaults,
    [isEdit, review],
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(reviewScheduleSchema),
    defaultValues: defaults,
    mode: "onBlur",
  });

  /**
   * The enrolment is the authorisation boundary for these three people, so it
   * has to be known before they can be offered. Creating, it arrives as
   * context; editing, the review itself carries it.
   */
  const enrolmentId = context.enrolmentId ?? review?.enrolmentId ?? null;
  const { user } = useAuthUser();
  const { data: participants, isLoading: loadingParticipants } =
    useParticipantOptions(enrolmentId, {
      enabled: open && !!enrolmentId,
      select: selectParticipantOptions,
    });

  // Memoised because the `?? []` fallback is a fresh array every render, which
  // would make the defaulting effect below re-run on each one.
  const apprenticeOptions = useMemo(
    () => participants?.apprenticeOptions ?? [],
    [participants],
  );
  const tutorOptions = useMemo(
    () => participants?.tutorOptions ?? [],
    [participants],
  );
  const employerManagerOptions = useMemo(
    () => participants?.employerManagerOptions ?? [],
    [participants],
  );

  const apprenticeUserId = useWatch({ control, name: "apprenticeUserId" });
  const tutorUserId = useWatch({ control, name: "tutorUserId" });
  const employerManagerUserId = useWatch({
    control,
    name: "employerManagerUserId",
  });

  /**
   * Fill in what the enrolment already decides, so the common case leaves
   * nothing to choose: one candidate means there is no choice to make, and the
   * tutor scheduling the review is almost always the tutor on it.
   *
   * Only ever fills a blank — a value the user picked, or one loaded from the
   * review being edited, is never overwritten.
   */
  useEffect(() => {
    if (!open || !participants) return;

    if (!apprenticeUserId && apprenticeOptions.length === 1) {
      setValue("apprenticeUserId", apprenticeOptions[0].value);
    }
    if (!employerManagerUserId && employerManagerOptions.length === 1) {
      setValue("employerManagerUserId", employerManagerOptions[0].value);
    }
    if (!tutorUserId) {
      const self = tutorOptions.find((option) => option.value === user?.id);
      if (self) {
        setValue("tutorUserId", self.value);
      } else if (tutorOptions.length === 1) {
        setValue("tutorUserId", tutorOptions[0].value);
      }
    }
  }, [
    open,
    participants,
    apprenticeUserId,
    tutorUserId,
    employerManagerUserId,
    apprenticeOptions,
    tutorOptions,
    employerManagerOptions,
    setValue,
    user?.id,
  ]);

  const create = useCreateReview();
  const update = useUpdateReview();
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
    try {
      if (isEdit) {
        await mutateAsync({
          id: review.id,
          payload: toUpdateReviewPayload(values),
        });
      } else {
        await mutateAsync(
          toCreateReviewPayload(values, {
            enrolmentId: context.enrolmentId,
            apprenticeId: context.apprenticeId,
          }),
        );
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
        <CalendarClock className="size-4.5" strokeWidth={1.85} aria-hidden />
      }
      title={isEdit ? "Reschedule review" : "Schedule review"}
      description="The tripartite progress review signed by apprentice, tutor and employer manager."
      footer={
        <Button
          type="submit"
          form="review-schedule-form"
          color="green"
          size="sm"
          loading={disabled}
          disabled={disabled}
          startIcon={
            isEdit ? (
              <Save className="size-4" />
            ) : (
              <CalendarClock className="size-4" />
            )
          }
        >
          {isEdit ? "Save changes" : "Schedule review"}
        </Button>
      }
    >
      <form
        id="review-schedule-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-4"
      >
        <ServerErrorAlert error={serverError} />

        <InputField
          required
          name="scheduledAt"
          label="Date & time"
          type="datetime-local"
          register={register}
          error={errors.scheduledAt?.message}
          disabled={disabled}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputField
            name="title"
            label="Title"
            placeholder="Quarterly progress review"
            register={register}
            error={errors.title?.message}
            disabled={disabled}
          />
          <InputField
            name="reviewType"
            label="Type"
            placeholder="12-week"
            register={register}
            error={errors.reviewType?.message}
            disabled={disabled}
          />
        </div>

        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold text-neutral-900">
            Signing parties
          </legend>
          <p className="-mt-2 text-xs text-neutral-500">
            They sign in order: apprentice → tutor → employer manager. Everyone
            listed here is on this enrolment.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <SingleSelectField
              required
              name="apprenticeUserId"
              label="Apprentice"
              options={apprenticeOptions}
              register={register}
              setValue={setValue}
              value={apprenticeUserId ?? ""}
              error={errors.apprenticeUserId?.message}
              placeholder={participantPlaceholder(
                loadingParticipants,
                enrolmentId,
                apprenticeOptions,
                "Select the apprentice",
                "This learner has no portal account yet. Invite them first.",
              )}
              disabled={
                disabled ||
                loadingParticipants ||
                apprenticeOptions.length === 0
              }
            />
            <SingleSelectField
              required
              name="tutorUserId"
              label="Tutor"
              options={tutorOptions}
              register={register}
              setValue={setValue}
              value={tutorUserId ?? ""}
              error={errors.tutorUserId?.message}
              placeholder={participantPlaceholder(
                loadingParticipants,
                enrolmentId,
                tutorOptions,
                "Select a tutor",
                "No colleagues yet. Invite someone to your organisation.",
              )}
              disabled={
                disabled || loadingParticipants || tutorOptions.length === 0
              }
            />
            <SingleSelectField
              required
              name="employerManagerUserId"
              label="Employer manager"
              options={employerManagerOptions}
              register={register}
              setValue={setValue}
              value={employerManagerUserId ?? ""}
              error={errors.employerManagerUserId?.message}
              placeholder={participantPlaceholder(
                loadingParticipants,
                enrolmentId,
                employerManagerOptions,
                "Select the employer manager",
                "No employer contacts yet. Link an employer organisation first.",
              )}
              disabled={
                disabled ||
                loadingParticipants ||
                employerManagerOptions.length === 0
              }
            />
          </div>
        </fieldset>
      </form>
    </Modal>
  );
}
