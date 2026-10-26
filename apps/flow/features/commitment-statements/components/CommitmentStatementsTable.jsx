"use client";

import { Eye, FileSignature } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { SingleSelectField } from "@/components/form/SingleSelectField";
import { DataTable } from "@/components/ui/DataTable";
import { cn, formatDate } from "@/utils/helper";

import { CommitmentStatusBadge } from "./CommitmentStatusBadge";
import { COMMITMENT_STATUS_OPTIONS } from "../constants";
import { useCommitmentStatements } from "../queries/commitment-statements.query";

// ─── Cells ──────────────────────────────────────────────────────────────────

function VersionCell({ statement }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 ring-1 ring-primary-100">
        <FileSignature className="size-4.5" strokeWidth={1.75} aria-hidden />
      </div>
      <div className="min-w-0">
        <p className="truncate font-medium text-neutral-900">
          Version {statement.version}
        </p>
        <p className="truncate font-mono text-xs text-neutral-400">
          {statement.enrolmentId}
        </p>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function CommitmentStatementsTable() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [status, setStatus] = useState("");

  const { data, isLoading, isFetching } = useCommitmentStatements({
    page,
    perPage,
    status: status || undefined,
  });
  const statements = data?.statements ?? [];
  const meta = data?.meta ?? null;

  const handlePerPageChange = (next) => {
    setPerPage(next);
    setPage(1);
  };

  const columns = [
    {
      key: "version",
      header: "Statement",
      primary: true,
      sortable: true,
      sortValue: (row) => row.version,
      cell: (row) => <VersionCell statement={row} />,
    },
    {
      key: "status",
      header: "Status",
      mobileLabel: "Status",
      sortable: true,
      sortValue: (row) => row.status,
      cell: (row) => <CommitmentStatusBadge status={row.status} />,
    },
    {
      key: "publishedAt",
      header: "Published",
      mobileLabel: "Published",
      sortable: true,
      sortValue: (row) =>
        row.publishedAt ? new Date(row.publishedAt).getTime() : -1,
      cell: (row) => (
        <span className="text-neutral-600">
          {row.publishedAt ? formatDate(row.publishedAt) : "—"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      mobileLabel: "Actions",
      cell: (row) => (
        <Link
          href={`/learners/${row.enrolmentId}`}
          title="View apprentice"
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-neutral-600 transition-colors duration-150 hover:bg-neutral-100 hover:text-neutral-900"
        >
          <Eye className="size-3.5" aria-hidden />
          Apprentice
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-neutral-900">
            All commitment statements
          </h2>
          <p className="mt-0.5 text-sm text-neutral-500">
            Tripartite training plans across your apprentices. Manage each from
            the apprentice&apos;s page.
          </p>
        </div>
        <div className="w-full sm:w-56">
          <SingleSelectField
            name="statusFilter"
            options={[
              { value: "", text: "All statuses" },
              ...COMMITMENT_STATUS_OPTIONS,
            ]}
            value={status}
            setValue={(_, v) => {
              setStatus(v);
              setPage(1);
            }}
            placeholder="Filter by status"
            searchable={false}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={statements}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        onRowClick={(row) => router.push(`/learners/${row.enrolmentId}`)}
        meta={meta}
        onPageChange={setPage}
        onPerPageChange={handlePerPageChange}
        empty={{
          icon: FileSignature,
          title: "No commitment statements yet",
          description:
            "Commitment statements are created from an apprentice's page.",
        }}
        className={cn(
          isFetching && !isLoading && "opacity-70 transition-opacity",
        )}
      />
    </div>
  );
}
