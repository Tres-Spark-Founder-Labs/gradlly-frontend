// @ts-check
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { ServerErrorAlert } from "@/components/error/ServerErrorAlert";
import { InputField } from "@/components/form/InputField";
import { SingleSelectField } from "@/components/form/SingleSelectField";
import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useLearnerSummary } from "@/features/reporting/queries/reporting.query";
import { applyServerErrors } from "@/lib/errors";

import {
  OTJ_ACTIVITY_NAME_MAX,
  OTJ_CATEGORY_OPTIONS,
  OTJ_DURATION_MAX_HOURS,
  OTJ_DURATION_MIN_HOURS,
  OTJ_DURATION_STEP_HOURS,
} from "../constants";
import { useCreateOtjLogEntry } from "../queries/otj.query";

/**
 * F3.1.1 — Quick OTJ Log Entry.
 *
 * Replaces the three-step wizard in `components/dashboard/otj/` (OTJLogForm +
 * OTJLogStep1/2/3), which contradicted AC3 outright:
 *
 *   > Form submits with a single tap — no multi-step flow
 *
 * Four fields, one submit, no `setStep` anywhere.
 *
 * MOBILE IS PRIMARY HERE, unlike P1/P2. That changes two things concretely:
 * the duration control is a stepper with real tap targets rather than a number
 * input needing a keyboard, and the fields stack in a single column at every
 * width rather than using the two-column grid the desktop portals default to.
 */

/**
 * Hours, not minutes, because AC1 says hours. The API stores minutes and the
 * conversion happens once, on submit.
 *
 * `multipleOf` is checked against a scaled integer rather than `hours % 0.5`,
 * because 0.1 + 0.2 arithmetic makes the modulo of a float unreliable — the
 * same class of defect the ILR funding claim work hit and fixed by comparing
 * in integers.
 */
const quickLogSchema = z.object({
  activityName: z
    .string()
    .trim()
    .min(1, "Say what you did")
    .max(
      OTJ_ACTIVITY_NAME_MAX,
      `Keep it under ${OTJ_ACTIVITY_NAME_MAX} characters`,
    ),
  category: z.string().min(1, "Pick a category"),
  hours: z
    .number()
    .min(OTJ_DURATION_MIN_HOURS, "At least half an hour")
    .max(OTJ_DURATION_MAX_HOURS, `At most ${OTJ_DURATION_MAX_HOURS} hours`)
    .refine((h) => Math.round(h * 2) === h * 2, "Use half-hour steps"),
  evidenceUrl: z
    .string()
    .trim()
    .url("Enter a valid link")
    .optional()
    .or(z.literal("")),
});

/** AC1's stepper. Kept as its own control so the tap targets are real. */
function DurationStepper({ value, onChange, disabled }) {
  const step = (delta) => {
    const next = Math.round((value + delta) * 2) / 2;
    if (next < OTJ_DURATION_MIN_HOURS || next > OTJ_DURATION_MAX_HOURS) return;
    onChange(next);
  };

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-neutral-700">
        Duration
      </span>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => step(-OTJ_DURATION_STEP_HOURS)}
          disabled={disabled || value <= OTJ_DURATION_MIN_HOURS}
          aria-label="Decrease by half an hour"
          className="flex size-12 shrink-0 items-center justify-center rounded-full border border-neutral-300 text-neutral-700 transition-colors active:bg-neutral-100 disabled:opacity-40"
        >
          <Minus className="size-5" aria-hidden />
        </button>

        {/*
          aria-live so a screen reader announces the new value on each tap —
          without it the buttons change something the user cannot perceive.
        */}
        <output
          aria-live="polite"
          className="min-w-24 text-center text-2xl font-semibold tabular-nums text-neutral-900"
        >
          {value % 1 === 0 ? value : value.toFixed(1)}
          <span className="ml-1 text-base font-normal text-neutral-500">
            {value === 1 ? "hour" : "hours"}
          </span>
        </output>

        <button
          type="button"
          onClick={() => step(OTJ_DURATION_STEP_HOURS)}
          disabled={disabled || value >= OTJ_DURATION_MAX_HOURS}
          aria-label="Increase by half an hour"
          className="flex size-12 shrink-0 items-center justify-center rounded-full border border-neutral-300 text-neutral-700 transition-colors active:bg-neutral-100 disabled:opacity-40"
        >
          <Plus className="size-5" aria-hidden />
        </button>
      </div>
    </div>
  );
}

/**
 * AC4 — "a green confirmation state with updated running total".
 *
 * The total shown is APPROVED hours, labelled as such, plus the session just
 * logged shown separately as pending.
 *
 * That wording is deliberate and is a judgment call worth overruling if the
 * client disagrees. A freshly logged session is `submitted`, not `approved`,
 * so an "approved total" does not move on submit — and a confirmation screen
 * whose headline number is unchanged reads as a failed save. Showing the
 * session as pending alongside the approved figure is the honest version of
 * "updated running total": something did change, and it is not yet the
 * approved number.
 *
 * A true "total logged including pending" needs either a new summary field or
 * the F3.1.3 list endpoint. Recorded as its own item rather than approximated.
 */
function ConfirmationState({
  loggedHours,
  approvedHours,
  onLogAnother,
  onClose,
}) {
  return (
    <div className="py-2 text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-100">
        <Check className="size-7 text-emerald-700" aria-hidden />
      </div>

      <p
        // Announced rather than merely rendered — the visual green tick is not
        // available to a screen-reader user.
        role="status"
        className="mt-3 text-lg font-semibold text-emerald-800"
      >
        {loggedHours === 1 ? "1 hour" : `${loggedHours} hours`} logged
      </p>

      <p className="mt-1 text-sm text-neutral-600">
        Awaiting your manager&rsquo;s approval.
      </p>

      <div className="mt-4 rounded-xl bg-neutral-50 px-4 py-3">
        <p className="text-xs uppercase tracking-wide text-neutral-400">
          Approved so far
        </p>
        <p className="mt-0.5 text-xl font-semibold tabular-nums text-neutral-900">
          {approvedHours === null ? "—" : `${approvedHours}h`}
        </p>
        <p className="mt-0.5 text-xs text-neutral-400">
          {approvedHours === null
            ? "Not available yet"
            : "This session is not counted until approved."}
        </p>
      </div>

      <div className="mt-5 flex gap-2">
        <Button
          variant="outline"
          color="black"
          size="sm"
          onClick={onLogAnother}
          className="flex-1"
        >
          Log another
        </Button>
        <Button color="green" size="sm" onClick={onClose} className="flex-1">
          Done
        </Button>
      </div>
    </div>
  );
}

export function QuickOtjLogSheet({ open, onClose }) {
  const [confirmed, setConfirmed] = useState(null);

  const { data: summary } = useLearnerSummary({ enabled: open });
  const enrolmentId = summary?.activeEnrolmentId ?? null;
  const apprenticeId = summary?.activeApprenticeId ?? null;

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(quickLogSchema),
    defaultValues: {
      activityName: "",
      category: "",
      hours: 1,
      evidenceUrl: "",
    },
    mode: "onSubmit",
  });

  const hours = useWatch({ control, name: "hours" });
  const category = useWatch({ control, name: "category" });

  const { mutateAsync, isPending, error: serverError } = useCreateOtjLogEntry();
  const busy = isSubmitting || isPending;

  /**
   * Reset on close rather than on open.
   *
   * Resetting in an effect keyed on `open` sets state during render and trips
   * the React Compiler rule against cascading renders. Closing is an event, so
   * the same guarantee — a clean form next time it opens — is available without
   * an effect at all.
   */
  const handleClose = () => {
    setConfirmed(null);
    reset({ activityName: "", category: "", hours: 1, evidenceUrl: "" });
    onClose();
  };

  const approvedHours =
    typeof summary?.otjPace?.approvedMinutes === "number"
      ? Math.round((summary.otjPace.approvedMinutes / 60) * 10) / 10
      : null;

  const onSubmit = async (values) => {
    if (!enrolmentId || !apprenticeId) return;

    try {
      await mutateAsync({
        enrolmentId,
        apprenticeId,
        activityName: values.activityName.trim(),
        category: values.category,
        // Today, not a date picker: AC1 lists four fields and a date is not one
        // of them, and a quick log is by definition about what just happened.
        loggedDate: new Date().toISOString().slice(0, 10),
        // The single conversion boundary. Rounded to an integer so no float
        // artefact ever reaches a stored funding-relevant value.
        minutes: Math.round(values.hours * 60),
        ...(values.evidenceUrl
          ? { evidence: { links: [values.evidenceUrl] } }
          : {}),
      });
      setConfirmed(values.hours);
    } catch (err) {
      applyServerErrors(err, setError);
    }
  };

  const blocked = !enrolmentId || !apprenticeId;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      busy={busy}
      size="md"
      title={confirmed === null ? "Log a session" : "Session logged"}
      description={
        confirmed === null ? "Four fields. One tap to save." : undefined
      }
      footer={
        confirmed === null ? (
          <Button
            type="submit"
            form="quick-otj-form"
            color="green"
            size="sm"
            loading={busy}
            disabled={busy || blocked}
            className="w-full"
          >
            Log session
          </Button>
        ) : null
      }
    >
      {confirmed !== null ? (
        <ConfirmationState
          loggedHours={confirmed}
          approvedHours={approvedHours}
          onLogAnother={() => {
            setConfirmed(null);
            reset({
              activityName: "",
              category: "",
              hours: 1,
              evidenceUrl: "",
            });
          }}
          onClose={handleClose}
        />
      ) : (
        <form
          id="quick-otj-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-5"
        >
          <ServerErrorAlert error={serverError} />

          {blocked ? (
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
              We could not find your active apprenticeship, so logging is
              unavailable. This is not a saving error — nothing has been lost.
            </p>
          ) : null}

          <InputField
            required
            name="activityName"
            label="What did you do?"
            placeholder="e.g. Shadowed a code review"
            maxLength={OTJ_ACTIVITY_NAME_MAX}
            register={register}
            error={errors.activityName?.message}
            disabled={busy}
          />

          <SingleSelectField
            required
            name="category"
            label="Category"
            options={OTJ_CATEGORY_OPTIONS}
            register={register}
            setValue={setValue}
            value={category}
            error={errors.category?.message}
            placeholder="Pick a category"
            searchable={false}
            disabled={busy}
          />

          <DurationStepper
            value={hours}
            onChange={(v) => setValue("hours", v, { shouldValidate: false })}
            disabled={busy}
          />
          {errors.hours?.message ? (
            <p className="text-sm text-rose-600">{errors.hours.message}</p>
          ) : null}

          <InputField
            name="evidenceUrl"
            label="Evidence link (optional)"
            placeholder="https://…"
            inputMode="url"
            register={register}
            error={errors.evidenceUrl?.message}
            disabled={busy}
          />
        </form>
      )}
    </Modal>
  );
}
