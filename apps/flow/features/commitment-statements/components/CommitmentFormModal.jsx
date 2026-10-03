"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FileSignature, Save } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";

import { ServerErrorAlert } from "@/components/error/ServerErrorAlert";
import { InputField } from "@/components/form/InputField";
import { SingleSelectField } from "@/components/form/SingleSelectField";
import { TextareaField } from "@/components/form/TextareaField";
import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import {
  selectParticipantOptions,
  useParticipantOptions,
} from "@/features/enrolments/queries/enrolments.query";
import { participantPlaceholder } from "@/features/enrolments/utils/participant-placeholder";
import { applyServerErrors } from "@/lib/errors";

import {
  useCreateCommitmentStatement,
  useCreateCommitmentVersion,
  useUpdateCommitmentStatement,
} from "../queries/commitment-statements.query";
import {
  commitmentFormDefaults,
  commitmentFormDefaultsFromRow,
  commitmentFormSchema,
  toCreatePayload,
  toUpdatePayload,
} from "../schemas";

/**
 * Create / edit / new-version of a commitment statement. One form serves all
 * three flows (DRY):
 *   - mode="create"      → POST /commitment-statements (needs enrolmentId+apprenticeId)
 *   - mode="edit"        → PATCH /commitment-statements/:id (draft only)
 *   - mode="new-version" → POST /commitment-statements/:groupId/versions
 *
 * @param {"create"|"edit"|"new-version"} mode
 * @param {object} [statement]   the source version (edit / new-version)
 * @param {{enrolmentId:string, apprenticeId:string, groupId?:string}} context
 */
export function CommitmentFormModal({
  open,
  onClose,
  mode = "create",
  statement = null,
  context = {},
}) {
  const isEdit = mode === "edit";
  const isNewVersion = mode === "new-version";

  // Edit + new-version seed from the source row; create starts blank.
  const defaults = useMemo(
    () =>
      isEdit || isNewVersion
        ? commitmentFormDefaultsFromRow(statement)
        : commitmentFormDefaults,
    [isEdit, isNewVersion, statement],
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
    resolver: zodResolver(commitmentFormSchema),
    defaultValues: defaults,
    mode: "onBlur",
  });

  /**
   * Creating, the enrolment arrives as context; editing or versioning, the
   * statement carries it. Either way the enrolment is what entitles this user
   * to see the three parties, so the pickers stay closed until it is known.
   */
  const enrolmentId = context.enrolmentId ?? statement?.enrolmentId ?? null;
  const { user } = useAuthUser();
  const { data: participants, isLoading: loadingParticipants } =
    useParticipantOptions(enrolmentId, {
      enabled: open && !!enrolmentId,
      select: selectParticipantOptions,
    });

  // Memoised: the `?? []` fallback is a new array each render, which would
  // re-run the defaulting effect below every time.
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

  /** Fill only blanks, so an edited statement keeps the parties it was signed with. */
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

  const create = useCreateCommitmentStatement();
  const update = useUpdateCommitmentStatement();
  const newVersion = useCreateCommitmentVersion();
  const active = isEdit ? update : isNewVersion ? newVersion : create;
  const { mutateAsync, isPending, error: serverError } = active;
  const disabled = isSubmitting || isPending;

  useEffect(() => {
    if (open) reset(defaults);
  }, [open, defaults, reset]);

  const onSubmit = async (values) => {
    try {
      if (isEdit) {
        await mutateAsync({
          id: statement.id,
          payload: toUpdatePayload(values),
        });
      } else {
        // create + new-version share the create payload shape
        const payload = toCreatePayload(values, {
          enrolmentId: context.enrolmentId,
          apprenticeId: context.apprenticeId,
        });
        if (isNewVersion) {
          await mutateAsync({ groupId: context.groupId, payload });
        } else {
          await mutateAsync(payload);
        }
      }
      onClose();
    } catch (err) {
      applyServerErrors(err, setError);
    }
  };

  const title = isEdit
    ? "Edit commitment statement"
    : isNewVersion
      ? "Create new version"
      : "Create commitment statement";

  return (
    <Modal
      open={open}
      onClose={onClose}
      busy={disabled}
      size="2xl"
      icon={
        <FileSignature className="size-4.5" strokeWidth={1.85} aria-hidden />
      }
      title={title}
      description="The tripartite training plan signed by apprentice, tutor and employer manager."
      footer={
        <Button
          type="submit"
          form="commitment-form"
          color="green"
          size="sm"
          loading={disabled}
          disabled={disabled}
          startIcon={
            isEdit ? (
              <Save className="size-4" />
            ) : (
              <FileSignature className="size-4" />
            )
          }
        >
          {isEdit ? "Save changes" : "Save draft"}
        </Button>
      }
    >
      <form
        id="commitment-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-5"
      >
        <ServerErrorAlert error={serverError} />

        {/* Signers */}
        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold text-neutral-900">
            Signing parties
          </legend>
          <p className="-mt-2 text-xs text-neutral-500">
            Who signs each slot, in order: apprentice → tutor → employer
            manager. Everyone listed here is on this enrolment.
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

        {/* Content */}
        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold text-neutral-900">
            Training plan
          </legend>
          <TextareaField
            required
            name="trainingPlanSummary"
            label="Training plan summary"
            rows={3}
            maxLength={5000}
            register={register}
            error={errors.trainingPlanSummary?.message}
            disabled={disabled}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextareaField
              required
              name="employerCommitments"
              label="Employer commitments"
              rows={3}
              maxLength={5000}
              register={register}
              error={errors.employerCommitments?.message}
              disabled={disabled}
            />
            <TextareaField
              required
              name="apprenticeCommitments"
              label="Apprentice commitments"
              rows={3}
              maxLength={5000}
              register={register}
              error={errors.apprenticeCommitments?.message}
              disabled={disabled}
            />
            <TextareaField
              required
              name="providerCommitments"
              label="Provider commitments"
              rows={3}
              maxLength={5000}
              register={register}
              error={errors.providerCommitments?.message}
              disabled={disabled}
            />
            <TextareaField
              name="additionalTerms"
              label="Additional terms"
              rows={3}
              maxLength={5000}
              register={register}
              error={errors.additionalTerms?.message}
              disabled={disabled}
            />
          </div>
          <div className="sm:max-w-xs">
            <InputField
              name="weeklyHours"
              label="Weekly hours"
              type="number"
              inputMode="numeric"
              min="0"
              step="1"
              placeholder="30"
              register={register}
              error={errors.weeklyHours?.message}
              disabled={disabled}
            />
          </div>
        </fieldset>
      </form>
    </Modal>
  );
}
