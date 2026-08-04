"use client";

import { UsersRound } from "lucide-react";
import { useMemo, useState } from "react";

import { CheckboxField } from "@/components/form/CheckboxField";
import { SingleSelectField } from "@/components/form/SingleSelectField";
import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

import {
  useAssignTutorInBulk,
  useCohort,
  useCohortFilterOptions,
} from "../queries/learners.query";

/**
 * F2.2.5 AC1 — the bulk half of tutor assignment.
 *
 * A dedicated picker rather than row selection bolted onto the cohort table:
 * the cohort table is paginated and filtered, and "select all" across a
 * filtered, paginated table is a well-known way to reassign learners a manager
 * never saw. Here the list is explicit and everything ticked is on screen.
 *
 * The caller remounts this on each open (via `key`), so the tutor choice and
 * ticked learners start empty every time without an effect resetting them —
 * a half-remembered selection from the previous open is how the wrong cohort
 * gets reassigned.
 */
export function AssignTutorModal({ open, onClose }) {
  const [tutorUserId, setTutorUserId] = useState("");
  const [selected, setSelected] = useState(() => new Set());

  // A generous page: this is a picker, and paginating it would reintroduce the
  // "assigned someone off-screen" problem the explicit list avoids.
  const { data: cohort, isLoading } = useCohort(
    { page: 1, perPage: 200 },
    { enabled: open },
  );
  const { data: filterOptions } = useCohortFilterOptions({ enabled: open });
  const { mutateAsync, isPending } = useAssignTutorInBulk();

  const learners = cohort?.entries ?? [];

  const tutorOptions = useMemo(() => {
    // GET /learners/cohort/filter-options returns { id, name }.
    const options = (filterOptions?.tutors ?? []).map((tutor) => ({
      value: tutor.id,
      text: tutor.name,
    }));
    return [
      // Un-assigning is a real action: a tutor leaves and their caseload has
      // to become visibly unowned rather than stay with someone who has gone.
      { value: "", text: "Unassigned (clear tutor)" },
      ...options,
    ];
  }, [filterOptions]);

  const toggle = (enrolmentId) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(enrolmentId)) {
        next.delete(enrolmentId);
      } else {
        next.add(enrolmentId);
      }
      return next;
    });
  };

  const onSubmit = async () => {
    await mutateAsync({
      enrolmentIds: [...selected],
      tutorUserId: tutorUserId || null,
    });
    onClose();
  };

  const disabled = isPending || selected.size === 0;

  return (
    <Modal
      open={open}
      onClose={onClose}
      busy={isPending}
      size="lg"
      icon={<UsersRound className="size-4.5" strokeWidth={1.85} aria-hidden />}
      title="Assign tutor"
      description="Move several learners to a tutor at once, or clear their tutor."
      footer={
        <Button
          type="button"
          color="green"
          size="sm"
          loading={isPending}
          disabled={disabled}
          onClick={() => void onSubmit()}
        >
          {selected.size === 0
            ? "Select learners"
            : `Assign ${selected.size} learner${selected.size === 1 ? "" : "s"}`}
        </Button>
      }
    >
      <div className="space-y-4">
        <SingleSelectField
          name="tutorUserId"
          label="Tutor"
          options={tutorOptions}
          value={tutorUserId}
          setValue={(_, v) => setTutorUserId(v)}
          placeholder="Select a tutor"
          disabled={isPending}
        />

        {isLoading ? (
          <p className="text-sm text-neutral-400">Loading learners…</p>
        ) : learners.length ? (
          <div className="max-h-80 overflow-y-auto rounded-xl border border-neutral-200">
            <ul className="divide-y divide-neutral-100">
              {learners.map((learner) => (
                <li key={learner.enrolmentId} className="px-3 py-2">
                  <CheckboxField
                    name={`learner-${learner.enrolmentId}`}
                    label={`${learner.learnerName} — ${learner.tutorName ?? "no tutor"}`}
                    checked={selected.has(learner.enrolmentId)}
                    onChange={() => toggle(learner.enrolmentId)}
                    disabled={isPending}
                  />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-neutral-400">No active learners.</p>
        )}
      </div>
    </Modal>
  );
}
