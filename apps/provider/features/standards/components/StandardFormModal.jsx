"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { BookMarked, Save } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";

import { ServerErrorAlert } from "@/components/error/ServerErrorAlert";
import { InputField } from "@/components/form/InputField";
import { SingleSelectField } from "@/components/form/SingleSelectField";
import { TextareaField } from "@/components/form/TextareaField";
import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useProgrammeOptions } from "@/features/programmes/queries/programmes.query";
import { applyServerErrors } from "@/lib/errors";

import { STANDARD_STATUS_OPTIONS } from "../constants";
import {
  useCreateStandard,
  useUpdateStandard,
} from "../queries/standards.query";
import {
  standardDefaults,
  standardDefaultsFromRow,
  standardSchema,
  toStandardPayload,
} from "../schemas";

/**
 * Create / edit a standard. A single form serves both flows (DRY); the presence
 * of `standard` switches it into edit mode. The programme dropdown is fed by
 * GET /api/v1/programmes (a standard must belong to an existing programme).
 */
export function StandardFormModal({ open, onClose, standard = null }) {
  const isEdit = Boolean(standard);

  const defaults = useMemo(
    () => (isEdit ? standardDefaultsFromRow(standard) : standardDefaults),
    [isEdit, standard],
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
    resolver: zodResolver(standardSchema),
    defaultValues: defaults,
    mode: "onBlur",
  });

  const programmeIdValue = useWatch({ control, name: "programmeId" });
  const statusValue = useWatch({ control, name: "status" });

  const { data: programmeOptions = [], isLoading: loadingProgrammes } =
    useProgrammeOptions({ enabled: open });

  const create = useCreateStandard();
  const update = useUpdateStandard();
  const {
    mutateAsync,
    isPending,
    error: serverError,
  } = isEdit ? update : create;
  const disabled = isSubmitting || isPending;

  // No programmes exist yet → a standard cannot be created. Block create only.
  const noProgrammes = !loadingProgrammes && programmeOptions.length === 0;

  // Re-seed the form whenever the modal opens (or the target row changes).
  useEffect(() => {
    if (open) reset(defaults);
  }, [open, defaults, reset]);

  const onSubmit = async (values) => {
    const payload = toStandardPayload(values);
    try {
      if (isEdit) {
        await mutateAsync({ id: standard.id, payload });
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
      icon={<BookMarked className="size-4.5" strokeWidth={1.85} aria-hidden />}
      title={isEdit ? "Edit standard" : "Create standard"}
      description={
        isEdit
          ? "Update the details of this apprenticeship standard."
          : "A standard belongs to a programme and is referenced by enrolments."
      }
      footer={
        <Button
          type="submit"
          form="standard-form"
          color="green"
          size="sm"
          loading={disabled}
          disabled={disabled || (!isEdit && noProgrammes)}
          startIcon={
            isEdit ? (
              <Save className="size-4" />
            ) : (
              <BookMarked className="size-4" />
            )
          }
        >
          {isEdit ? "Save changes" : "Create standard"}
        </Button>
      }
    >
      <form
        id="standard-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-4"
      >
        <ServerErrorAlert error={serverError} />

        {noProgrammes ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            You need at least one programme before creating a standard. Create a
            programme first, then come back here.
          </div>
        ) : null}

        <SingleSelectField
          required
          name="programmeId"
          label="Programme"
          options={programmeOptions}
          register={register}
          setValue={setValue}
          value={programmeIdValue}
          error={errors.programmeId?.message}
          placeholder={
            loadingProgrammes ? "Loading programmes…" : "Select a programme"
          }
          disabled={disabled || loadingProgrammes}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputField
            required
            name="code"
            label="Code"
            placeholder="ST0116"
            register={register}
            error={errors.code?.message}
            disabled={disabled}
          />
          <SingleSelectField
            required
            name="status"
            label="Status"
            options={STANDARD_STATUS_OPTIONS}
            register={register}
            setValue={setValue}
            value={statusValue}
            error={errors.status?.message}
            placeholder="Select a status"
            searchable={false}
            disabled={disabled}
          />
        </div>

        <InputField
          required
          name="title"
          label="Title"
          placeholder="Software Developer L4"
          register={register}
          error={errors.title?.message}
          disabled={disabled}
        />

        <TextareaField
          name="description"
          label="Description"
          placeholder="Optional summary of this standard."
          rows={3}
          maxLength={2000}
          register={register}
          error={errors.description?.message}
          disabled={disabled}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputField
            name="fundingBandMax"
            label="Funding band max (£)"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            placeholder="21000"
            register={register}
            error={errors.fundingBandMax?.message}
            disabled={disabled}
          />
          <InputField
            name="defaultDurationMonths"
            label="Default duration (months)"
            type="number"
            inputMode="numeric"
            step="1"
            min="1"
            placeholder="18"
            register={register}
            error={errors.defaultDurationMonths?.message}
            disabled={disabled}
          />
        </div>

        <div className="rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3 text-xs leading-relaxed text-neutral-500">
          <span className="font-semibold text-neutral-700">Tip: </span>
          <span className="font-medium text-neutral-700">
            Funding band max
          </span>{" "}
          and{" "}
          <span className="font-medium text-neutral-700">default duration</span>{" "}
          feed levy and spend forecasts. Both are optional and can be set later.
        </div>
      </form>
    </Modal>
  );
}
