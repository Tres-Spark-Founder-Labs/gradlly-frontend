"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Flag } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ServerErrorAlert } from "@/components/error/ServerErrorAlert";
import { TextareaField } from "@/components/form/TextareaField";
import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { applyServerErrors } from "@/lib/errors";

import { useFlagOtjEntry } from "../queries/otj-log-entries.query";

// Mirrors FlagOtjLogEntryDto: 3–2000 characters, required.
const flagSchema = z.object({
  note: z
    .string()
    .trim()
    .min(3, "Say what needs discussing")
    .max(2000, "Must be 2000 characters or fewer"),
});

const flagDefaults = Object.freeze({ note: "" });

/**
 * F2.2.4 AC3 — flag an off-the-job entry for discussion.
 *
 * Not the same act as rejecting. Rejecting is the employer deciding the hours
 * do not count; flagging keeps the hours and asks a question about them. The
 * note is mandatory for the same reason the backend insists on it: a flag
 * nobody can explain is an accusation the learner cannot answer.
 */
export function FlagOtjEntryModal({ entry, open, onClose }) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(flagSchema),
    defaultValues: flagDefaults,
    mode: "onBlur",
  });

  const { mutateAsync, isPending, error: serverError } = useFlagOtjEntry();
  const disabled = isSubmitting || isPending;

  useEffect(() => {
    if (open) reset(flagDefaults);
  }, [open, reset]);

  const onSubmit = async (values) => {
    try {
      await mutateAsync({ id: entry?.id, note: values.note.trim() });
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
      icon={<Flag className="size-4.5" strokeWidth={1.85} aria-hidden />}
      title="Flag for discussion"
      description={
        entry?.activityName
          ? `“${entry.activityName}” — the hours stay logged; this raises a question about them.`
          : "The hours stay logged; this raises a question about them."
      }
      footer={
        <Button
          type="submit"
          form="flag-otj-form"
          color="green"
          size="sm"
          loading={disabled}
          disabled={disabled}
        >
          Flag entry
        </Button>
      }
    >
      <form
        id="flag-otj-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-4"
      >
        <ServerErrorAlert error={serverError} />

        <TextareaField
          required
          name="note"
          label="What needs discussing?"
          placeholder="e.g. Eight hours logged for a day marked as annual leave."
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
