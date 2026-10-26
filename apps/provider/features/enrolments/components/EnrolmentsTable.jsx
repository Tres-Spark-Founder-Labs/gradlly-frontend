"use client";

import { ClipboardList, Eye, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import Button from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { useApprentices } from "@/features/apprentices/queries/apprentices.query";
import { useRoleAccess } from "@/features/auth/hooks/useRoleAccess";
import { useStandards } from "@/features/standards/queries/standards.query";
import { cn, getFullName } from "@/utils/helper";

import { EnrolmentActionsMenu } from "./EnrolmentActionsMenu";
import { EnrolmentStatusBadge, PipelineStateBadge } from "./EnrolmentBadges";
import { EnrolmentFormModal } from "./EnrolmentFormModal";
import { useEnrolments } from "../queries/enrolments.query";

// ─── Cells ──────────────────────────────────────────────────────────────────

function ApprenticeCell({ name, standardName }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 ring-1 ring-primary-100">
        <ClipboardList className="size-4.5" strokeWidth={1.75} aria-hidden />
      </div>
      <div className="min-w-0">
        <p className="truncate font-medium text-neutral-900">
          {name ?? "Unknown apprentice"}
        </p>
        <p className="truncate text-xs text-neutral-400">
          {standardName ?? "Unknown standard"}
        </p>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function EnrolmentsTable() {
  const router = useRouter();
  const { can } = useRoleAccess();
  const canManage = can("admin");

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [createOpen, setCreateOpen] = useState(false);

  const { data, isLoading, isFetching } = useEnrolments({ page, perPage });
  const enrolments = data?.enrolments ?? [];
  const meta = data?.meta ?? null;

  // Enrolment rows carry apprenticeId / standardId only — resolve display names
  // from the separately cached apprentice and standard lists (no server join).
  const { data: apprenticeData } = useApprentices({ perPage: 100 });
  const { data: standardData } = useStandards({ perPage: 100 });

  const apprenticeNameById = useMemo(() => {
    const map = new Map();
    for (const a of apprenticeData?.apprentices ?? []) {
      map.set(a.id, getFullName(a));
    }
    return map;
  }, [apprenticeData]);

  const standardNameById = useMemo(() => {
    const map = new Map();
    for (const s of standardData?.standards ?? []) {
      map.set(s.id, `${s.title} (${s.code})`);
    }
    return map;
  }, [standardData]);

  const handlePerPageChange = (next) => {
    setPerPage(next);
    setPage(1);
  };

  const columns = [
    {
      key: "apprentice",
      header: "Apprentice / Standard",
      primary: true,
      sortable: true,
      sortValue: (row) => apprenticeNameById.get(row.apprenticeId) ?? "",
      cell: (row) => (
        <ApprenticeCell
          name={apprenticeNameById.get(row.apprenticeId)}
          standardName={standardNameById.get(row.standardId)}
        />
      ),
    },
    {
      key: "status",
      header: "Status",
      mobileLabel: "Status",
      sortable: true,
      sortValue: (row) => row.status,
      cell: (row) => <EnrolmentStatusBadge status={row.status} />,
    },
    {
      key: "pipelineState",
      header: "Pipeline",
      mobileLabel: "Pipeline",
      sortable: true,
      sortValue: (row) => row.pipelineState ?? "",
      cell: (row) => <PipelineStateBadge state={row.pipelineState} />,
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      mobileLabel: "Actions",
      cell: (row) => (
        <div className="flex flex-wrap items-center justify-end gap-1">
          <Link
            href={`/enrolments/${row.id}`}
            title="View enrolment"
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-neutral-600 transition-colors duration-150 hover:bg-neutral-100 hover:text-neutral-900"
          >
            <Eye className="size-3.5" aria-hidden />
            View
          </Link>
          {canManage ? <EnrolmentActionsMenu enrolment={row} compact /> : null}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-neutral-900">
            All enrolments
          </h2>
          <p className="mt-0.5 text-sm text-neutral-500">
            Apprentices linked to standards, tracked through their lifecycle.
          </p>
        </div>
        {canManage ? (
          <Button
            size="sm"
            color="green"
            startIcon={<Plus className="size-4" />}
            onClick={() => setCreateOpen(true)}
          >
            New enrolment
          </Button>
        ) : null}
      </div>

      <DataTable
        columns={columns}
        data={enrolments}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        onRowClick={(row) => router.push(`/enrolments/${row.id}`)}
        meta={meta}
        onPageChange={setPage}
        onPerPageChange={handlePerPageChange}
        empty={{
          icon: ClipboardList,
          title: "No enrolments yet",
          description: canManage
            ? "Create your first enrolment by linking an apprentice to a standard."
            : "There are no enrolments at this time.",
          action: canManage ? (
            <Button
              size="sm"
              color="green"
              startIcon={<Plus className="size-4" />}
              onClick={() => setCreateOpen(true)}
            >
              New enrolment
            </Button>
          ) : null,
        }}
        className={cn(
          isFetching && !isLoading && "opacity-70 transition-opacity",
        )}
      />

      <EnrolmentFormModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </div>
  );
}
