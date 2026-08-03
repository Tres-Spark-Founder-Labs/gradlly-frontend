"use client";

import { CalendarDays, Eye } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { SingleSelectField } from "@/components/form/SingleSelectField";
import { DataTable } from "@/components/ui/DataTable";
import { cn, formatDateTime } from "@/utils/helper";

import { ReviewStatusBadge } from "./ReviewStatusBadge";
import { REVIEW_STATUS_FILTER_OPTIONS } from "../constants";
import { useReviews } from "../queries/reviews.query";

/**
 * F2.2.3 AC6 — the employer's view of progress reviews for their apprentices.
 *
 * Read-only throughout. Scheduling, recording and signing belong to the
 * provider and the learner; this exists so the employer who is notified that a
 * review completed can actually open it.
 */
export function EmployerReviewsTable() {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const params = useMemo(
    () => ({ page, perPage, status: status || undefined }),
    [page, perPage, status],
  );

  const { data, isLoading, isFetching } = useReviews(params);
  const reviews = data?.reviews ?? [];
  const meta = data?.meta ?? null;

  const columns = [
    {
      key: "title",
      header: "Review",
      primary: true,
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 ring-1 ring-primary-100">
            <CalendarDays className="size-4.5" strokeWidth={1.75} aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium text-neutral-900">
              {row.title || "Progress review"}
            </p>
            <p className="truncate text-xs text-neutral-400">
              {row.reviewType || "12-weekly review"}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "scheduledAt",
      header: "Scheduled",
      mobileLabel: "Scheduled",
      cell: (row) => (
        <span className="text-neutral-600">
          {formatDateTime(row.scheduledAt)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      mobileLabel: "Status",
      cell: (row) => <ReviewStatusBadge status={row.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      mobileLabel: "Actions",
      cell: (row) => (
        <Link
          href={`/reviews/${row.id}`}
          title="View review"
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
        >
          <Eye className="size-3.5" aria-hidden />
          View
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="w-full sm:w-52">
        <SingleSelectField
          name="reviewStatusFilter"
          label="Status"
          options={REVIEW_STATUS_FILTER_OPTIONS}
          value={status}
          setValue={(_, v) => {
            setStatus(v);
            setPage(1);
          }}
          placeholder="All statuses"
          searchable={false}
        />
      </div>

      <DataTable
        columns={columns}
        data={reviews}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        meta={meta}
        onPageChange={setPage}
        onPerPageChange={(next) => {
          setPerPage(next);
          setPage(1);
        }}
        empty={{
          icon: CalendarDays,
          title: "No reviews yet",
          description:
            "Progress reviews scheduled by your training provider will appear here.",
        }}
        className={cn(
          isFetching && !isLoading && "opacity-70 transition-opacity",
        )}
      />
    </div>
  );
}
