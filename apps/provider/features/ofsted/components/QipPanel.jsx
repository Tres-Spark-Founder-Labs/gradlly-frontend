"use client";

import {
  CheckCircle2,
  ClipboardList,
  FileDown,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";

import { SingleSelectField } from "@/components/form/SingleSelectField";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { usePdfJobPoll } from "@/hooks/usePdfJobPoll";
import { toastError } from "@/hooks/useToast";
import { cn, formatDate } from "@/utils/helper";

import { DeleteQipActionModal } from "./DeleteQipActionModal";
import { QipStatusBadge } from "./OfstedBadges";
import { QipActionModal } from "./QipActionModal";
import { QipProgressModal } from "./QipProgressModal";
import { EIF_CRITERION_LABELS, QIP_STATUS_FILTER_OPTIONS } from "../constants";
import {
  useExportQipPlan,
  useQipActions,
  useQipSummary,
} from "../queries/ofsted.query";

const OVERDUE_OPTIONS = [
  { value: "", text: "All" },
  { value: "true", text: "Overdue only" },
];

function SummaryStat({ label, value, accent }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white px-4 py-3">
      <p className="text-xs font-medium text-neutral-400">{label}</p>
      <p className={cn("mt-0.5 text-xl font-bold tabular-nums", accent)}>
        {value}
      </p>
    </div>
  );
}

function TitleCell({ action }) {
  return (
    <div className="min-w-0">
      <p className="truncate font-medium text-neutral-900">{action.title}</p>
      <p className="truncate text-xs text-neutral-400">
        {EIF_CRITERION_LABELS[action.eifCriterionSlug] ??
          action.eifCriterionSlug}
      </p>
    </div>
  );
}

function DueCell({ action }) {
  return (
    <div className="flex flex-col items-end gap-0.5 md:items-start">
      <span className="text-neutral-600">
        {formatDate(action.targetCompletionDate)}
      </span>
      {action.isOverdue ? (
        <span className="rounded-full bg-danger-50 px-2 py-0.5 text-[10px] font-bold text-danger-600 ring-1 ring-inset ring-danger-200">
          Overdue
        </span>
      ) : null}
    </div>
  );
}

export function QipPanel({ canManage = true, prefillSlug, onPrefillConsumed }) {
  const [status, setStatus] = useState("");
  const [overdue, setOverdue] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [progressTarget, setProgressTarget] = useState(null);

  const params = useMemo(
    () => ({
      page,
      perPage,
      status: status || undefined,
      overdue: overdue || undefined,
    }),
    [page, perPage, status, overdue],
  );

  const { data, isLoading, isFetching } = useQipActions(params);
  const { data: summary } = useQipSummary();

  // F2.1.2 AC5 — queue the plan PDF, then poll and open it.
  const [exportJobId, setExportJobId] = useState(null);
  const { mutateAsync: exportPlan, isPending: queueingExport } =
    useExportQipPlan();

  usePdfJobPoll({
    jobId: exportJobId,
    enabled: !!exportJobId,
    onComplete: (job) => {
      setExportJobId(null);
      if (job?.status === "completed" && job.downloadUrl) {
        window.open(job.downloadUrl, "_blank", "noopener,noreferrer");
      } else {
        toastError("QIP export failed. Please try again.");
      }
    },
  });

  const exportingPlan = queueingExport || !!exportJobId;
  const handleExport = async () => {
    const job = await exportPlan().catch(() => null);
    if (job?.jobId) setExportJobId(job.jobId);
  };
  const actions = data?.actions ?? [];
  const meta = data?.meta ?? null;

  // Open the create modal when the dashboard CTA prefills a criterion.
  const createOpen = formOpen || Boolean(prefillSlug);

  const openCreate = () => {
    setEditTarget(null);
    setFormOpen(true);
  };
  const openEdit = (action) => {
    setEditTarget(action);
    setFormOpen(true);
  };
  const closeForm = () => {
    setFormOpen(false);
    setEditTarget(null);
    onPrefillConsumed?.();
  };

  const changePerPage = (next) => {
    setPerPage(next);
    setPage(1);
  };

  const columns = [
    {
      key: "title",
      header: "Action",
      primary: true,
      cell: (row) => <TitleCell action={row} />,
    },
    {
      key: "status",
      header: "Status",
      mobileLabel: "Status",
      sortable: true,
      sortValue: (row) => row.status,
      cell: (row) => <QipStatusBadge status={row.status} />,
    },
    {
      key: "due",
      header: "Target",
      mobileLabel: "Target",
      sortable: true,
      sortValue: (row) =>
        row.targetCompletionDate
          ? new Date(row.targetCompletionDate).getTime()
          : 0,
      cell: (row) => <DueCell action={row} />,
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      mobileLabel: "Actions",
      cell: (row) => (
        <div className="flex items-center justify-end gap-1">
          {/* Open to everyone who can see the plan. Marking your own action
              done and attaching the evidence is the work itself; deciding
              what the plan contains is the separate, narrower act below. */}
          <button
            type="button"
            onClick={() => setProgressTarget(row)}
            title="Update progress"
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
          >
            <CheckCircle2 className="size-3.5" aria-hidden />
            Progress
          </button>
          {canManage ? (
            <>
              <button
                type="button"
                onClick={() => openEdit(row)}
                title="Edit action"
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
              >
                <Pencil className="size-3.5" aria-hidden />
                Edit
              </button>
              <button
                type="button"
                onClick={() => setDeleteTarget(row)}
                title="Delete action"
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-danger-600 transition-colors hover:bg-danger-50 hover:text-danger-700"
              >
                <Trash2 className="size-3.5" aria-hidden />
                Delete
              </button>
            </>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <Card>
      <CardContent className="space-y-5">
        {/* Header + summary */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <ClipboardList className="size-4 text-neutral-400" aria-hidden />
            <h2 className="text-base font-semibold text-neutral-900">
              Quality Improvement Plan
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {/* F2.1.2 AC5 — the plan as an inspection document. Open to
                anyone who can read the plan: being unable to produce it
                because the one admin is away is the worse failure. */}
            <Button
              size="sm"
              variant="outline"
              startIcon={<FileDown className="size-4" />}
              onClick={handleExport}
              disabled={exportingPlan}
            >
              {exportingPlan ? "Preparing…" : "Export PDF"}
            </Button>
            {canManage ? (
              <Button
                size="sm"
                color="green"
                startIcon={<Plus className="size-4" />}
                onClick={openCreate}
              >
                New action
              </Button>
            ) : null}
          </div>
        </div>

        {summary ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <SummaryStat label="Total" value={summary.total ?? 0} />
            <SummaryStat
              label="Completed"
              value={summary.completed ?? 0}
              accent="text-emerald-600"
            />
            <SummaryStat
              label="Overdue"
              value={summary.overdue ?? 0}
              accent="text-danger-600"
            />
            <SummaryStat
              label="Complete"
              value={`${summary.percentComplete ?? 0}%`}
            />
          </div>
        ) : null}

        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="w-full sm:w-48">
            <SingleSelectField
              name="qipStatusFilter"
              options={QIP_STATUS_FILTER_OPTIONS}
              value={status}
              setValue={(_, v) => {
                setStatus(v);
                setPage(1);
              }}
              placeholder="All statuses"
              searchable={false}
            />
          </div>
          <div className="w-full sm:w-40">
            <SingleSelectField
              name="qipOverdueFilter"
              options={OVERDUE_OPTIONS}
              value={overdue}
              setValue={(_, v) => {
                setOverdue(v);
                setPage(1);
              }}
              placeholder="All"
              searchable={false}
            />
          </div>
        </div>

        <DataTable
          columns={columns}
          data={actions}
          rowKey={(row) => row.id}
          isLoading={isLoading}
          meta={meta}
          onPageChange={setPage}
          onPerPageChange={changePerPage}
          empty={{
            icon: ClipboardList,
            title: "No QIP actions",
            description:
              "Create improvement actions, often from a low EIF criterion.",
          }}
          className={cn(
            isFetching && !isLoading && "opacity-70 transition-opacity",
          )}
        />
      </CardContent>

      {/* key remounts the modal per open/target so its attachment-key state
          initialises fresh (avoids setState-in-effect). */}
      <QipActionModal
        key={`${createOpen ? "open" : "closed"}-${editTarget?.id ?? prefillSlug ?? "new"}`}
        open={createOpen}
        onClose={closeForm}
        action={editTarget}
        prefillSlug={editTarget ? undefined : prefillSlug}
      />
      {/* Keyed per target for the same reason as the form above: the modal
          seeds its status/notes/attachments from the row on first render. */}
      <QipProgressModal
        key={progressTarget?.id ?? "no-progress-target"}
        action={progressTarget}
        open={Boolean(progressTarget)}
        onClose={() => setProgressTarget(null)}
      />
      <DeleteQipActionModal
        action={deleteTarget}
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
      />
    </Card>
  );
}
