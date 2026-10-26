"use client";

import { Eye, FileText, Link2, Type } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { SingleSelectField } from "@/components/form/SingleSelectField";
import { DataTable } from "@/components/ui/DataTable";
import { cn } from "@/utils/helper";

import { EvidenceActions } from "./EvidenceActions";
import { EvidenceStatusBadge } from "./PortfolioBadges";
import {
  EVIDENCE_STATUS,
  EVIDENCE_STATUS_FILTER_OPTIONS,
  EVIDENCE_TYPE,
} from "../constants";
import { useEvidenceItems } from "../queries/portfolio.query";

const TYPE_ICON = {
  [EVIDENCE_TYPE.FILE]: FileText,
  [EVIDENCE_TYPE.LINK]: Link2,
  [EVIDENCE_TYPE.TEXT]: Type,
};

function EvidenceCell({ item }) {
  const Icon = TYPE_ICON[item.type] ?? FileText;
  const codes = (item.ksbDefinitions ?? []).map((k) => k.code).join(", ");
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 ring-1 ring-primary-100">
        <Icon className="size-4.5" strokeWidth={1.75} aria-hidden />
      </div>
      <div className="min-w-0">
        <p className="truncate font-medium text-neutral-900">{item.title}</p>
        {codes ? (
          <p className="truncate text-xs text-neutral-400">KSBs: {codes}</p>
        ) : null}
      </div>
    </div>
  );
}

export function EvidenceQueue({ enrolmentId, canManage = true }) {
  const router = useRouter();
  // Default to the submitted review backlog.
  const [status, setStatus] = useState(EVIDENCE_STATUS.SUBMITTED);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const params = useMemo(
    () => ({
      page,
      perPage,
      status: status || undefined,
      enrolmentId: enrolmentId || undefined,
    }),
    [page, perPage, status, enrolmentId],
  );

  const { data, isLoading, isFetching } = useEvidenceItems(params);
  const items = data?.items ?? [];
  const meta = data?.meta ?? null;

  const changePerPage = (next) => {
    setPerPage(next);
    setPage(1);
  };

  const columns = [
    {
      key: "title",
      header: "Evidence",
      primary: true,
      cell: (row) => <EvidenceCell item={row} />,
    },
    {
      key: "type",
      header: "Type",
      mobileLabel: "Type",
      sortable: true,
      sortValue: (row) => row.type,
      cell: (row) => (
        <span className="capitalize text-neutral-600">{row.type}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      mobileLabel: "Status",
      sortable: true,
      sortValue: (row) => row.status,
      cell: (row) => <EvidenceStatusBadge status={row.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      mobileLabel: "Actions",
      cell: (row) => (
        <div className="flex flex-wrap items-center justify-end gap-1">
          <Link
            href={`/portfolio/evidence/${row.id}`}
            title="View evidence"
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
          >
            <Eye className="size-3.5" aria-hidden />
            View
          </Link>
          {canManage ? <EvidenceActions item={row} compact /> : null}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="w-full sm:w-52">
        <SingleSelectField
          name="evidenceStatusFilter"
          label="Status"
          options={EVIDENCE_STATUS_FILTER_OPTIONS}
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
        data={items}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        onRowClick={(row) => router.push(`/portfolio/evidence/${row.id}`)}
        meta={meta}
        onPageChange={setPage}
        onPerPageChange={changePerPage}
        empty={{
          icon: FileText,
          title: "No evidence to review",
          description:
            "Evidence submitted by apprentices will appear here for review.",
        }}
        className={cn(
          isFetching && !isLoading && "opacity-70 transition-opacity",
        )}
      />
    </div>
  );
}
