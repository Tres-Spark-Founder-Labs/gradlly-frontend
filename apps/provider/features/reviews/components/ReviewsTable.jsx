"use client";

import { CalendarDays, CalendarPlus, Eye } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { SingleSelectField } from "@/components/form/SingleSelectField";
import Button from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { useRoleAccess } from "@/features/auth/hooks/useRoleAccess";
import { cn, formatDateTime } from "@/utils/helper";

import { BulkScheduleReviewsModal } from "./BulkScheduleReviewsModal";
import { ReviewDueChip, ReviewStatusBadge } from "./ReviewBadges";
import { REVIEW_STATUS_FILTER_OPTIONS } from "../constants";
import { useReviews } from "../queries/reviews.query";

const OVERDUE_OPTIONS = [
  { value: "", text: "All reviews" },
  { value: "true", text: "Overdue only" },
];

function ReviewCell({ review }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 ring-1 ring-primary-100">
        <CalendarDays className="size-4.5" strokeWidth={1.75} aria-hidden />
      </div>
      <div className="min-w-0">
        <p className="truncate font-medium text-neutral-900">
          {review.title || "Progress review"}
        </p>
        <p className="truncate text-xs text-neutral-400">
          {review.reviewType || "—"}
        </p>
      </div>
    </div>
  );
}

export function ReviewsTable() {
  const { can } = useRoleAccess();
  const canManage = can("admin");
  const [bulkOpen, setBulkOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [overdue, setOverdue] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const params = useMemo(
    () => ({
      page,
      perPage,
      status: status || undefined,
      isOverdue: overdue || undefined,
    }),
    [page, perPage, status, overdue],
  );

  const { data, isLoading, isFetching } = useReviews(params);
  const reviews = data?.reviews ?? [];
  const meta = data?.meta ?? null;

  const changePerPage = (next) => {
    setPerPage(next);
    setPage(1);
  };

  const columns = [
    {
      key: "title",
      header: "Review",
      primary: true,
      cell: (row) => <ReviewCell review={row} />,
    },
    {
      key: "scheduledAt",
      header: "Scheduled",
      mobileLabel: "Scheduled",
      sortable: true,
      sortValue: (row) =>
        row.scheduledAt ? new Date(row.scheduledAt).getTime() : 0,
      cell: (row) => (
        <span className="text-neutral-600">
          {formatDateTime(row.scheduledAt)}
        </span>
      ),
    },
    {
      key: "due",
      header: "Due",
      mobileLabel: "Due",
      cell: (row) => <ReviewDueChip review={row} />,
    },
    {
      key: "status",
      header: "Status",
      mobileLabel: "Status",
      sortable: true,
      sortValue: (row) => row.status,
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="w-full sm:w-52">
            <SingleSelectField
              name="statusFilter"
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
          <div className="w-full sm:w-44">
            <SingleSelectField
              name="overdueFilter"
              label="Overdue"
              options={OVERDUE_OPTIONS}
              value={overdue}
              setValue={(_, v) => {
                setOverdue(v);
                setPage(1);
              }}
              placeholder="All reviews"
              searchable={false}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* F2.2.3 AC2. A single review is still scheduled from its
              enrolment, where the participants are already in context; this
              is for setting one date across a caseload. */}
          {canManage ? (
            <Button
              size="sm"
              color="green"
              startIcon={<CalendarPlus className="size-4" />}
              onClick={() => setBulkOpen(true)}
            >
              Bulk schedule
            </Button>
          ) : null}
          <Link
            href="/reviews/calendar"
            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
          >
            <CalendarDays className="size-4" aria-hidden />
            Calendar view
          </Link>
        </div>
      </div>

      <BulkScheduleReviewsModal
        open={bulkOpen}
        onClose={() => setBulkOpen(false)}
      />

      <DataTable
        columns={columns}
        data={reviews}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        meta={meta}
        onPageChange={setPage}
        onPerPageChange={changePerPage}
        empty={{
          icon: CalendarDays,
          title: "No reviews",
          description:
            "Schedule progress reviews from an enrolment, or adjust your filters.",
        }}
        className={cn(
          isFetching && !isLoading && "opacity-70 transition-opacity",
        )}
      />
    </div>
  );
}
