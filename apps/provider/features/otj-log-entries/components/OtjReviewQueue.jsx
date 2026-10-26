"use client";

import { CheckCircle2, Clock, Eye, XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { SingleSelectField } from "@/components/form/SingleSelectField";
import Button from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { useRoleAccess } from "@/features/auth/hooks/useRoleAccess";
import { cn, formatDate } from "@/utils/helper";

import { OtjStatusBadge } from "./OtjStatusBadge";
import { RejectOtjModal } from "./RejectOtjModal";
import {
  OTJ_CATEGORY_LABELS,
  OTJ_STATUS,
  OTJ_STATUS_FILTER_OPTIONS,
  isActionable,
} from "../constants";
import {
  useBulkApproveOtj,
  useOtjCategories,
  useOtjEntries,
} from "../queries/otj-log-entries.query";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatMinutes(mins) {
  const n = Number(mins);
  if (!n || Number.isNaN(n)) return "—";
  const h = Math.floor(n / 60);
  const m = n % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}

// ─── Selection checkbox ───────────────────────────────────────────────────────

function SelectBox({ checked, disabled, onChange, label }) {
  return (
    <input
      type="checkbox"
      checked={checked}
      disabled={disabled}
      onChange={onChange}
      aria-label={label}
      className={cn(
        "size-4 rounded border-neutral-300 text-primary-600",
        "focus:ring-2 focus:ring-primary-500 focus:ring-offset-0",
        disabled && "cursor-not-allowed opacity-40",
      )}
    />
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function OtjReviewQueue() {
  const router = useRouter();
  const { can } = useRoleAccess();
  const canReview = can("admin");

  // Default the queue to the approval backlog.
  const [status, setStatus] = useState(OTJ_STATUS.SUBMITTED);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [selected, setSelected] = useState(() => new Set());
  const [rejectOpen, setRejectOpen] = useState(false);

  const params = useMemo(
    () => ({
      page,
      perPage,
      status: status || undefined,
      category: category || undefined,
    }),
    [page, perPage, status, category],
  );

  const { data, isLoading, isFetching } = useOtjEntries(params);
  // Stable identity so downstream useMemo deps don't change every render.
  const entries = useMemo(() => data?.entries ?? [], [data]);
  const meta = data?.meta ?? null;

  const { data: categoryOptions = [] } = useOtjCategories();
  const categoryFilterOptions = useMemo(
    () => [{ value: "", text: "All activities" }, ...categoryOptions],
    [categoryOptions],
  );

  const approve = useBulkApproveOtj();

  // Selection is only meaningful for actionable (submitted) rows.
  const actionableIds = useMemo(
    () => entries.filter(isActionable).map((e) => e.id),
    [entries],
  );
  const selectedIds = useMemo(
    () => [...selected].filter((id) => actionableIds.includes(id)),
    [selected, actionableIds],
  );
  const allSelected =
    actionableIds.length > 0 && selectedIds.length === actionableIds.length;

  const resetSelection = () => setSelected(new Set());

  const toggleRow = (id) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleAll = () =>
    setSelected(allSelected ? new Set() : new Set(actionableIds));

  // Changing a filter invalidates the current selection + resets paging.
  const changeStatus = (value) => {
    setStatus(value);
    setPage(1);
    resetSelection();
  };
  const changeCategory = (value) => {
    setCategory(value);
    setPage(1);
    resetSelection();
  };
  const changePage = (next) => {
    setPage(next);
    resetSelection();
  };
  const changePerPage = (next) => {
    setPerPage(next);
    setPage(1);
    resetSelection();
  };

  const handleApprove = async () => {
    try {
      await approve.mutateAsync(selectedIds);
      resetSelection();
    } catch {
      // surfaced via mutation onError toast
    }
  };

  const showActions = canReview && selectedIds.length > 0;

  // Matches DataTable's row-activation guard: a click on the checkbox or the
  // "View" link does only that, not also navigate.
  const goToEntry = (id) => (e) => {
    if (e.target.closest("button, a, input, select, textarea, label")) return;
    router.push(`/otj-log-entries/${id}`);
  };

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="w-full sm:w-52">
          <SingleSelectField
            name="statusFilter"
            label="Status"
            options={OTJ_STATUS_FILTER_OPTIONS}
            value={status}
            setValue={(_, v) => changeStatus(v)}
            placeholder="All statuses"
            searchable={false}
          />
        </div>
        <div className="w-full sm:w-56">
          <SingleSelectField
            name="categoryFilter"
            label="Activity type"
            options={categoryFilterOptions}
            value={category}
            setValue={(_, v) => changeCategory(v)}
            placeholder="All activities"
            searchable={false}
          />
        </div>
      </div>

      {/* Bulk action bar — visible only when actionable rows are selected */}
      {showActions ? (
        <div className="flex flex-col gap-3 rounded-xl border border-primary-200 bg-primary-50/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-primary-800">
            {selectedIds.length} selected
          </p>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              color="green"
              loading={approve.isPending}
              disabled={approve.isPending}
              startIcon={<CheckCircle2 className="size-4" />}
              onClick={handleApprove}
            >
              Approve
            </Button>
            <Button
              size="sm"
              color="black"
              variant="neutral"
              startIcon={<XCircle className="size-4" />}
              onClick={() => setRejectOpen(true)}
              className="!text-red-600 hover:!bg-red-50"
            >
              Reject
            </Button>
            <Button
              size="sm"
              color="black"
              variant="neutral"
              onClick={resetSelection}
            >
              Clear
            </Button>
          </div>
        </div>
      ) : null}

      {/* Table */}
      <div
        className={cn(
          "overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm",
          isFetching && !isLoading && "opacity-70 transition-opacity",
        )}
      >
        {isLoading ? (
          <div className="divide-y divide-neutral-100">
            {Array.from({ length: 5 }).map((_, r) => (
              <div key={r} className="flex items-center gap-4 px-5 py-4">
                <div className="h-4 w-4 animate-pulse rounded bg-neutral-100" />
                <div className="h-4 w-1/3 animate-pulse rounded bg-neutral-100" />
                <div className="h-4 w-16 animate-pulse rounded bg-neutral-100" />
              </div>
            ))}
          </div>
        ) : entries.length === 0 ? (
          <EmptyState
            icon={Clock}
            title="Nothing to review"
            description="OTJ log entries submitted by apprentices will appear here for approval."
          />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50">
                    {canReview ? (
                      <th scope="col" className="w-12 px-5 py-3.5">
                        <SelectBox
                          checked={allSelected}
                          disabled={actionableIds.length === 0}
                          onChange={toggleAll}
                          label="Select all submitted entries"
                        />
                      </th>
                    ) : null}
                    {[
                      "Activity",
                      "Apprentice",
                      "Date",
                      "Duration",
                      "Status",
                    ].map((h) => (
                      <th
                        key={h}
                        scope="col"
                        className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500"
                      >
                        {h}
                      </th>
                    ))}
                    <th scope="col" className="px-5 py-3.5">
                      {""}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => {
                    const selectable = isActionable(entry);
                    const isChecked = selected.has(entry.id) && selectable;
                    return (
                      <tr
                        key={entry.id}
                        onClick={goToEntry(entry.id)}
                        className={cn(
                          "cursor-pointer border-b border-neutral-100 transition-colors duration-100 last:border-0 hover:bg-neutral-50/70",
                          isChecked && "bg-primary-50/40",
                        )}
                      >
                        {canReview ? (
                          <td className="px-5 py-4">
                            <SelectBox
                              checked={isChecked}
                              disabled={!selectable}
                              onChange={() => toggleRow(entry.id)}
                              label={`Select ${entry.activityName}`}
                            />
                          </td>
                        ) : null}
                        <td className="px-5 py-4">
                          <p className="font-medium text-neutral-900">
                            {entry.activityName}
                          </p>
                          <p className="text-xs text-neutral-400">
                            {OTJ_CATEGORY_LABELS[entry.category] ??
                              entry.category}
                          </p>
                        </td>
                        <td className="px-5 py-4 font-mono text-xs text-neutral-500">
                          {entry.apprenticeId}
                        </td>
                        <td className="px-5 py-4 text-neutral-600">
                          {formatDate(entry.loggedDate)}
                        </td>
                        <td className="px-5 py-4 tabular-nums text-neutral-600">
                          {formatMinutes(entry.minutes)}
                        </td>
                        <td className="px-5 py-4">
                          <OtjStatusBadge status={entry.status} />
                        </td>
                        <td className="px-5 py-4 text-right">
                          <Link
                            href={`/otj-log-entries/${entry.id}`}
                            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                          >
                            <Eye className="size-3.5" aria-hidden />
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <ul className="divide-y divide-neutral-100 md:hidden">
              {entries.map((entry) => {
                const selectable = isActionable(entry);
                const isChecked = selected.has(entry.id) && selectable;
                return (
                  <li
                    key={entry.id}
                    onClick={goToEntry(entry.id)}
                    className="cursor-pointer space-y-3 p-4"
                  >
                    <div className="flex items-start gap-3">
                      {canReview ? (
                        <span className="pt-0.5">
                          <SelectBox
                            checked={isChecked}
                            disabled={!selectable}
                            onChange={() => toggleRow(entry.id)}
                            label={`Select ${entry.activityName}`}
                          />
                        </span>
                      ) : null}
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-neutral-900">
                          {entry.activityName}
                        </p>
                        <p className="text-xs text-neutral-400">
                          {OTJ_CATEGORY_LABELS[entry.category] ??
                            entry.category}
                        </p>
                      </div>
                      <OtjStatusBadge status={entry.status} />
                    </div>
                    <dl className="space-y-2 border-t border-neutral-100 pt-3 text-sm">
                      <div className="flex items-center justify-between">
                        <dt className="text-xs font-medium text-neutral-400">
                          Date
                        </dt>
                        <dd className="text-neutral-700">
                          {formatDate(entry.loggedDate)}
                        </dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="text-xs font-medium text-neutral-400">
                          Duration
                        </dt>
                        <dd className="tabular-nums text-neutral-700">
                          {formatMinutes(entry.minutes)}
                        </dd>
                      </div>
                    </dl>
                    <Link
                      href={`/otj-log-entries/${entry.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-700"
                    >
                      <Eye className="size-3.5" aria-hidden />
                      View entry
                    </Link>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>

      {!isLoading && meta ? (
        <Pagination
          meta={meta}
          onPageChange={changePage}
          onPerPageChange={changePerPage}
        />
      ) : null}

      <RejectOtjModal
        ids={selectedIds}
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        onDone={resetSelection}
      />
    </div>
  );
}
