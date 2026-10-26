"use client";

import { BookMarked, ListChecks, Pencil, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import Button from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { useRoleAccess } from "@/features/auth/hooks/useRoleAccess";
import { ManageKsbModal } from "@/features/portfolio/components/ManageKsbModal";
import { useProgrammes } from "@/features/programmes/queries/programmes.query";
import { cn } from "@/utils/helper";

import { DeleteStandardModal } from "./DeleteStandardModal";
import { StandardFormModal } from "./StandardFormModal";
import { StandardStatusBadge } from "./StandardStatusBadge";
import { useStandards } from "../queries/standards.query";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const GBP = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

function formatFunding(value) {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : GBP.format(n);
}

// ─── Cells ──────────────────────────────────────────────────────────────────

function StandardCell({ standard }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 ring-1 ring-primary-100">
        <BookMarked className="size-4.5" strokeWidth={1.75} aria-hidden />
      </div>
      <div className="min-w-0">
        <p className="truncate font-medium text-neutral-900">
          {standard.title}
        </p>
        {standard.description ? (
          <p className="truncate text-xs text-neutral-400">
            {standard.description}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function CodeCell({ code }) {
  return (
    <span className="inline-flex items-center rounded-md bg-neutral-100 px-2 py-0.5 font-mono text-xs font-medium text-neutral-600">
      {code}
    </span>
  );
}

function ProgrammeCell({ name }) {
  if (!name) return <span className="text-neutral-400">—</span>;
  return <span className="text-neutral-700">{name}</span>;
}

function FundingCell({ value }) {
  const formatted = formatFunding(value);
  if (!formatted) return <span className="text-neutral-400">—</span>;
  return <span className="tabular-nums text-neutral-700">{formatted}</span>;
}

function RowActions({ standard, onManageKsb, onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-end gap-1">
      <button
        type="button"
        onClick={() => onManageKsb(standard)}
        title="Manage KSBs"
        className={cn(
          "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium",
          "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
          "transition-colors duration-150",
        )}
      >
        <ListChecks className="size-3.5" aria-hidden />
        KSBs
      </button>
      <button
        type="button"
        onClick={() => onEdit(standard)}
        title="Edit standard"
        className={cn(
          "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium",
          "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
          "transition-colors duration-150",
        )}
      >
        <Pencil className="size-3.5" aria-hidden />
        Edit
      </button>
      <button
        type="button"
        onClick={() => onDelete(standard)}
        title="Delete standard"
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-danger-600 transition-colors duration-150 hover:bg-danger-50 hover:text-danger-700"
      >
        <Trash2 className="size-3.5" aria-hidden />
        Delete
      </button>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function StandardsTable() {
  // Owners and admins manage standards; members get a read-only view.
  const { can } = useRoleAccess();
  const canManage = can("admin");

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [ksbTarget, setKsbTarget] = useState(null);

  const { data, isLoading, isFetching } = useStandards({ page, perPage });
  const standards = data?.standards ?? [];
  const meta = data?.meta ?? null;

  // The standards API returns programmeId only. Resolve programme titles
  // client-side from the (separately cached) programme list — there is no
  // server-side join or ?programmeId filter today.
  const { data: programmeData } = useProgrammes({ perPage: 100 });
  const programmeNameById = useMemo(() => {
    const map = new Map();
    for (const p of programmeData?.programmes ?? []) {
      map.set(p.id, `${p.title} (${p.code})`);
    }
    return map;
  }, [programmeData]);

  const handlePerPageChange = (next) => {
    setPerPage(next);
    setPage(1); // reset to the first page when page size changes
  };

  const openCreate = () => {
    setEditTarget(null);
    setFormOpen(true);
  };

  const openEdit = (standard) => {
    setEditTarget(standard);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditTarget(null);
  };

  const columns = [
    {
      key: "title",
      header: "Standard",
      primary: true,
      sortable: true,
      sortValue: (row) => row.title,
      cell: (row) => <StandardCell standard={row} />,
    },
    {
      key: "code",
      header: "Code",
      mobileLabel: "Code",
      sortable: true,
      sortValue: (row) => row.code,
      cell: (row) => <CodeCell code={row.code} />,
    },
    {
      key: "programme",
      header: "Programme",
      mobileLabel: "Programme",
      sortable: true,
      sortValue: (row) => programmeNameById.get(row.programmeId) ?? "",
      cell: (row) => (
        <ProgrammeCell name={programmeNameById.get(row.programmeId)} />
      ),
    },
    {
      key: "fundingBandMax",
      header: "Funding band",
      mobileLabel: "Funding band",
      align: "right",
      sortable: true,
      sortValue: (row) => row.fundingBandMax ?? -1,
      cell: (row) => <FundingCell value={row.fundingBandMax} />,
    },
    {
      key: "status",
      header: "Status",
      mobileLabel: "Status",
      sortable: true,
      sortValue: (row) => row.status,
      cell: (row) => <StandardStatusBadge status={row.status} />,
    },
    ...(canManage
      ? [
          {
            key: "actions",
            header: "Actions",
            align: "right",
            mobileLabel: "Actions",
            cell: (row) => (
              <RowActions
                standard={row}
                onManageKsb={setKsbTarget}
                onEdit={openEdit}
                onDelete={setDeleteTarget}
              />
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-5">
      {/* ── Section header ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-neutral-900">
            All standards
          </h2>
          <p className="mt-0.5 text-sm text-neutral-500">
            Apprenticeship standards that belong to a programme and feed
            enrolments.
          </p>
        </div>
        {canManage ? (
          <Button
            size="sm"
            color="green"
            startIcon={<Plus className="size-4" />}
            onClick={openCreate}
          >
            New standard
          </Button>
        ) : null}
      </div>

      <DataTable
        columns={columns}
        data={standards}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        // Members get a read-only table with no Edit button at all today, so
        // there's nothing yet for a click to open for them — only wire the
        // row up where that destination already exists.
        onRowClick={canManage ? openEdit : undefined}
        meta={meta}
        onPageChange={setPage}
        onPerPageChange={handlePerPageChange}
        empty={{
          icon: BookMarked,
          title: "No standards yet",
          description: canManage
            ? "Create your first standard against a programme to start building enrolments."
            : "There are no standards at this time.",
          action: canManage ? (
            <Button
              size="sm"
              color="green"
              startIcon={<Plus className="size-4" />}
              onClick={openCreate}
            >
              New standard
            </Button>
          ) : null,
        }}
        className={cn(
          isFetching && !isLoading && "opacity-70 transition-opacity",
        )}
      />

      <StandardFormModal
        open={formOpen}
        onClose={closeForm}
        standard={editTarget}
      />
      <DeleteStandardModal
        standard={deleteTarget}
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
      />
      <ManageKsbModal
        standard={ksbTarget}
        open={Boolean(ksbTarget)}
        onClose={() => setKsbTarget(null)}
      />
    </div>
  );
}
