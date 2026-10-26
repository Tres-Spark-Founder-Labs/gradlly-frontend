"use client";

import { Pencil, Trash2, UserRoundPlus, Users } from "lucide-react";
import { useState } from "react";

import { Avatar } from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { useRoleAccess } from "@/features/auth/hooks/useRoleAccess";
import { cn, getFullName, getInitials } from "@/utils/helper";

import { ApprenticeFormModal } from "./ApprenticeFormModal";
import { ApprenticeStatusBadge } from "./ApprenticeStatusBadge";
import { DeleteApprenticeModal } from "./DeleteApprenticeModal";
import { useApprentices } from "../queries/apprentices.query";

// ─── Cells ──────────────────────────────────────────────────────────────────

function ApprenticeCell({ apprentice }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar
        initials={getInitials(apprentice.firstName, apprentice.lastName)}
        size="sm"
        className="shrink-0 ring-1 ring-primary-100"
      />
      <div className="min-w-0">
        <p className="truncate font-medium text-neutral-900">
          {getFullName(apprentice)}
        </p>
        <p className="truncate text-xs text-neutral-400">{apprentice.email}</p>
      </div>
    </div>
  );
}

function RowActions({ apprentice, onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-end gap-1">
      <button
        type="button"
        onClick={() => onEdit(apprentice)}
        title="Edit apprentice"
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
        onClick={() => onDelete(apprentice)}
        title="Delete apprentice"
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-danger-600 transition-colors duration-150 hover:bg-danger-50 hover:text-danger-700"
      >
        <Trash2 className="size-3.5" aria-hidden />
        Delete
      </button>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ApprenticesTable() {
  // Owners and admins manage apprentices; members get a read-only view.
  const { can } = useRoleAccess();
  const canManage = can("admin");

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading, isFetching } = useApprentices({ page, perPage });
  const apprentices = data?.apprentices ?? [];
  const meta = data?.meta ?? null;

  const handlePerPageChange = (next) => {
    setPerPage(next);
    setPage(1); // reset to the first page when page size changes
  };

  const openCreate = () => {
    setEditTarget(null);
    setFormOpen(true);
  };

  const openEdit = (apprentice) => {
    setEditTarget(apprentice);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditTarget(null);
  };

  const columns = [
    {
      key: "name",
      header: "Apprentice",
      primary: true,
      sortable: true,
      sortValue: (row) => `${row.firstName} ${row.lastName}`,
      cell: (row) => <ApprenticeCell apprentice={row} />,
    },
    {
      key: "status",
      header: "Status",
      mobileLabel: "Status",
      sortable: true,
      sortValue: (row) => row.status,
      cell: (row) => <ApprenticeStatusBadge status={row.status} />,
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
                apprentice={row}
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
            All apprentices
          </h2>
          <p className="mt-0.5 text-sm text-neutral-500">
            Learners in your organisation. Enrol them onto a standard to begin
            their journey.
          </p>
        </div>
        {canManage ? (
          <Button
            size="sm"
            color="green"
            startIcon={<UserRoundPlus className="size-4" />}
            onClick={openCreate}
          >
            Add apprentice
          </Button>
        ) : null}
      </div>

      <DataTable
        columns={columns}
        data={apprentices}
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
          icon: Users,
          title: "No apprentices yet",
          description: canManage
            ? "Add your first apprentice to start enrolling learners onto standards."
            : "There are no apprentices at this time.",
          action: canManage ? (
            <Button
              size="sm"
              color="green"
              startIcon={<UserRoundPlus className="size-4" />}
              onClick={openCreate}
            >
              Add apprentice
            </Button>
          ) : null,
        }}
        className={cn(
          isFetching && !isLoading && "opacity-70 transition-opacity",
        )}
      />

      <ApprenticeFormModal
        open={formOpen}
        onClose={closeForm}
        apprentice={editTarget}
      />
      <DeleteApprenticeModal
        apprentice={deleteTarget}
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
