"use client";

import { AlertTriangle, CalendarPlus, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { CheckboxField } from "@/components/form/CheckboxField";
import { InputField } from "@/components/form/InputField";
import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useCohort } from "@/features/learners/queries/learners.query";
import { cn } from "@/utils/helper";

import { REVIEW_BULK_SCHEDULE_MAX } from "../constants";
import { useBulkScheduleReviewsFromEnrolments } from "../queries/reviews.query";

/**
 * F2.2.3 AC2 — "set review dates for multiple learners simultaneously".
 *
 * Deliberately not the single-review form repeated N times. That form asks for
 * the apprentice user, tutor and employer manager per review, which is
 * reasonable once and unusable across thirty learners — it is why the bulk
 * endpoint sat uncalled. This asks only what a provider knows at this point:
 * which learners, and when. The API derives the participants from each
 * enrolment.
 */
export function BulkScheduleReviewsModal({ open, onClose }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [scheduledAt, setScheduledAt] = useState("");
  const [title, setTitle] = useState("");
  const [failures, setFailures] = useState(null);

  // One page large enough to cover a normal caseload; the API caps a batch at
  // REVIEW_BULK_SCHEDULE_MAX anyway, so paging the picker would add clicks
  // without letting anyone schedule more.
  const { data, isLoading } = useCohort(
    { page: 1, perPage: 200 },
    { enabled: open },
  );
  const learners = useMemo(() => data?.entries ?? [], [data]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return learners;
    return learners.filter(
      (l) =>
        l.learnerName?.toLowerCase().includes(q) ||
        l.employerName?.toLowerCase().includes(q) ||
        l.standardTitle?.toLowerCase().includes(q),
    );
  }, [learners, search]);

  const { mutateAsync, isPending } = useBulkScheduleReviewsFromEnrolments();

  const atLimit = selected.length >= REVIEW_BULK_SCHEDULE_MAX;
  const canSubmit = selected.length > 0 && !!scheduledAt && !isPending;

  const toggle = (enrolmentId) => {
    setSelected((prev) =>
      prev.includes(enrolmentId)
        ? prev.filter((id) => id !== enrolmentId)
        : prev.length >= REVIEW_BULK_SCHEDULE_MAX
          ? prev
          : [...prev, enrolmentId],
    );
  };

  const selectAllVisible = () => {
    const ids = visible.map((l) => l.enrolmentId);
    setSelected(ids.slice(0, REVIEW_BULK_SCHEDULE_MAX));
  };

  const close = () => {
    setSelected([]);
    setScheduledAt("");
    setTitle("");
    setSearch("");
    setFailures(null);
    onClose();
  };

  const handleSubmit = async () => {
    const result = await mutateAsync({
      enrolmentIds: selected,
      // datetime-local is naive; the API wants an instant.
      scheduledAt: new Date(scheduledAt).toISOString(),
      title: title.trim() || undefined,
    }).catch(() => null);

    if (!result) return;

    /**
     * A partial batch is the normal case, not an error state. Rather than
     * closing on "27 scheduled, 3 failed" and leaving the provider to work
     * out which three, keep the modal open and name them — the API returns a
     * per-item reason precisely so this can be shown.
     */
    if (result.failed > 0) {
      const byIndex = new Map(
        (result.failures ?? []).map((f) => [f.index, f.message]),
      );
      setFailures(
        selected
          .map((id, index) => ({
            name:
              learners.find((l) => l.enrolmentId === id)?.learnerName ??
              "Unknown learner",
            message: byIndex.get(index),
          }))
          .filter((row) => row.message),
      );
      // Drop the ones that worked so a retry does not duplicate them.
      setSelected((prev) => prev.filter((_, index) => byIndex.has(index)));
      return;
    }

    close();
  };

  return (
    <Modal
      open={open}
      onClose={close}
      busy={isPending}
      size="2xl"
      icon={
        <CalendarPlus className="size-4.5" strokeWidth={1.85} aria-hidden />
      }
      title="Schedule reviews for multiple learners"
      description="One date and time, applied to everyone you select."
      footer={
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={close}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            color="green"
            onClick={handleSubmit}
            loading={isPending}
            disabled={!canSubmit}
            startIcon={<CalendarPlus className="size-4" />}
          >
            {selected.length > 0
              ? `Schedule ${selected.length} review${selected.length === 1 ? "" : "s"}`
              : "Schedule reviews"}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InputField
            name="bulkScheduledAt"
            label="Date and time"
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            required
            disabled={isPending}
          />
          <InputField
            name="bulkTitle"
            label="Title (optional)"
            placeholder="e.g. Autumn 12-weekly review"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isPending}
          />
        </div>

        {failures?.length ? (
          <div className="space-y-1.5 rounded-xl border border-amber-200 bg-amber-50 p-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-amber-800">
              <AlertTriangle className="size-4" aria-hidden />
              These learners could not be scheduled
            </div>
            <ul className="space-y-0.5 text-xs text-amber-800">
              {failures.map((f) => (
                <li key={f.name}>
                  <span className="font-medium">{f.name}</span> — {f.message}
                </li>
              ))}
            </ul>
            <p className="text-xs text-amber-700">
              The rest were scheduled. Fix these and try again.
            </p>
          </div>
        ) : null}

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400"
                aria-hidden
              />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search learners"
                aria-label="Search learners"
                className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-400 focus:outline-none"
              />
            </div>
            <Button
              size="xs"
              variant="outline"
              onClick={selectAllVisible}
              disabled={isPending || visible.length === 0}
            >
              Select first {Math.min(visible.length, REVIEW_BULK_SCHEDULE_MAX)}
            </Button>
          </div>

          <p
            className={cn(
              "text-xs",
              atLimit ? "font-medium text-amber-700" : "text-neutral-400",
            )}
          >
            {selected.length} of {REVIEW_BULK_SCHEDULE_MAX} selected
            {atLimit ? " — the maximum for one batch" : ""}
          </p>

          <div className="max-h-72 overflow-y-auto rounded-xl border border-neutral-200">
            {isLoading ? (
              <p className="p-4 text-center text-sm text-neutral-400">
                Loading learners…
              </p>
            ) : visible.length === 0 ? (
              <p className="p-4 text-center text-sm text-neutral-400">
                No learners match.
              </p>
            ) : (
              <ul className="divide-y divide-neutral-100">
                {visible.map((learner) => {
                  const checked = selected.includes(learner.enrolmentId);
                  return (
                    <li
                      key={learner.enrolmentId}
                      className="flex items-center gap-3 px-3 py-2"
                    >
                      <CheckboxField
                        name={`learner-${learner.enrolmentId}`}
                        checked={checked}
                        onChange={() => toggle(learner.enrolmentId)}
                        // Stop the limit silently swallowing clicks: an
                        // unselected row at the cap is visibly unavailable.
                        disabled={isPending || (!checked && atLimit)}
                        label=""
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-neutral-900">
                          {learner.learnerName}
                        </p>
                        <p className="truncate text-xs text-neutral-400">
                          {learner.employerName ?? "No employer"} ·{" "}
                          {learner.standardTitle}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
