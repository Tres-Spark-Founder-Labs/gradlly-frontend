"use client";

import { Download, Eye, FileDown, GraduationCap } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { InputField } from "@/components/form/InputField";
import { SingleSelectField } from "@/components/form/SingleSelectField";
import Button from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { usePdfJobPoll } from "@/hooks/usePdfJobPoll";
import { toastError } from "@/hooks/useToast";
import { cn, formatDate, formatDateTime } from "@/utils/helper";

import { LearnerStatusBadge } from "./LearnerBadges";
import { COHORT_SORT_KEYS, LEARNER_STATUS_FILTER_OPTIONS } from "../constants";
import {
  useCohort,
  useCohortFilterOptions,
  useDownloadCohortCsv,
  useExportCohortPdf,
} from "../queries/learners.query";

// ─── Cells ────────────────────────────────────────────────────────────────────
function LearnerCell({ entry }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 ring-1 ring-primary-100">
        <GraduationCap className="size-4.5" strokeWidth={1.75} aria-hidden />
      </div>
      <div className="min-w-0">
        <p className="truncate font-medium text-neutral-900">
          {entry.learnerName}
        </p>
        <p className="truncate text-xs text-neutral-400">
          {entry.standardTitle}
        </p>
      </div>
    </div>
  );
}

function OtjCell({ percent }) {
  if (percent === null || percent === undefined) {
    return <span className="text-neutral-400">—</span>;
  }
  const pct = Math.round(percent);
  const tone =
    pct >= 80
      ? "text-emerald-600"
      : pct >= 50
        ? "text-amber-600"
        : "text-danger-600";
  return <span className={cn("font-semibold tabular-nums", tone)}>{pct}%</span>;
}

export function CohortTable() {
  const [statusBadge, setStatusBadge] = useState("");
  const [epaMonth, setEpaMonth] = useState("");
  const [sort, setSort] = useState({
    sortBy: COHORT_SORT_KEYS.LEARNER_NAME,
    sortOrder: "asc",
  });
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  // F2.2.1 AC2 names five filters. Employer, standard and tutor existed in
  // the API and had no controls until now.
  const [employerOrganisationId, setEmployerOrganisationId] = useState("");
  const [standardId, setStandardId] = useState("");
  const [tutorUserId, setTutorUserId] = useState("");

  const { data: filterOptions } = useCohortFilterOptions();
  const toOptions = (items = []) => [
    { value: "", text: "All" },
    ...items.map((i) => ({ value: i.id, text: i.name })),
  ];

  const params = useMemo(
    () => ({
      page,
      perPage,
      employerOrganisationId: employerOrganisationId || undefined,
      standardId: standardId || undefined,
      statusBadge: statusBadge || undefined,
      tutorUserId: tutorUserId || undefined,
      epaMonth: epaMonth || undefined,
      sortBy: sort.sortBy,
      sortOrder: sort.sortOrder,
    }),
    [
      page,
      perPage,
      employerOrganisationId,
      standardId,
      statusBadge,
      tutorUserId,
      epaMonth,
      sort,
    ],
  );

  const { data, isLoading, isFetching } = useCohort(params);
  const entries = data?.entries ?? [];
  const meta = data?.meta ?? null;

  // F2.2.1 AC5 — filters without paging: an export is of the whole set.
  const exportFilters = useMemo(() => {
    const { page: _page, perPage: _perPage, ...filters } = params;
    return filters;
  }, [params]);

  const { mutate: downloadCsv, isPending: downloadingCsv } =
    useDownloadCohortCsv();
  const { mutateAsync: exportPdf, isPending: queueingPdf } =
    useExportCohortPdf();
  const [pdfJobId, setPdfJobId] = useState(null);

  usePdfJobPoll({
    jobId: pdfJobId,
    enabled: !!pdfJobId,
    onComplete: (job) => {
      setPdfJobId(null);
      if (job?.status === "completed" && job.downloadUrl) {
        window.open(job.downloadUrl, "_blank", "noopener,noreferrer");
      } else {
        toastError("Cohort PDF export failed. Please try again.");
      }
    },
  });

  const preparingPdf = queueingPdf || !!pdfJobId;
  const handleExportPdf = async () => {
    const job = await exportPdf(exportFilters).catch(() => null);
    if (job?.jobId) setPdfJobId(job.jobId);
  };

  const changePerPage = (next) => {
    setPerPage(next);
    setPage(1);
  };

  // Sort is server-side (via the sortBy/sortOrder controls below), so the table
  // columns themselves are not client-sortable — the data arrives pre-sorted.
  const columns = [
    {
      key: "learnerName",
      header: "Learner",
      primary: true,
      cell: (row) => <LearnerCell entry={row} />,
    },
    {
      key: "employerName",
      header: "Employer",
      mobileLabel: "Employer",
      cell: (row) => (
        <span className="text-neutral-600">{row.employerName || "—"}</span>
      ),
    },
    {
      key: "otjPercent",
      header: "OTJ",
      mobileLabel: "OTJ",
      cell: (row) => <OtjCell percent={row.otjPercent} />,
    },
    {
      key: "nextReviewDate",
      header: "Next review",
      mobileLabel: "Next review",
      cell: (row) => (
        <span className="text-neutral-600">
          {row.nextReviewDate ? formatDateTime(row.nextReviewDate) : "—"}
        </span>
      ),
    },
    {
      key: "epaDate",
      header: "EPA",
      mobileLabel: "EPA date",
      cell: (row) => (
        <span className="text-neutral-600">
          {row.epaDate ? formatDate(row.epaDate) : "—"}
        </span>
      ),
    },
    {
      key: "statusBadge",
      header: "Status",
      mobileLabel: "Status",
      cell: (row) => <LearnerStatusBadge status={row.statusBadge} />,
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      mobileLabel: "Actions",
      cell: (row) => (
        <Link
          href={`/learners/${row.enrolmentId}`}
          title="View learner"
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
        >
          <Eye className="size-3.5" aria-hidden />
          View
        </Link>
      ),
    },
  ];

  // Sort dropdown options (server-side).
  const sortOptions = [
    { value: COHORT_SORT_KEYS.LEARNER_NAME, text: "Learner name" },
    { value: COHORT_SORT_KEYS.EMPLOYER_NAME, text: "Employer" },
    { value: COHORT_SORT_KEYS.STANDARD_TITLE, text: "Standard" },
    { value: COHORT_SORT_KEYS.START_DATE, text: "Start date" },
    { value: COHORT_SORT_KEYS.OTJ_PERCENT, text: "OTJ %" },
    { value: COHORT_SORT_KEYS.NEXT_REVIEW_DATE, text: "Next review" },
    { value: COHORT_SORT_KEYS.EPA_DATE, text: "EPA date" },
    { value: COHORT_SORT_KEYS.STATUS_BADGE, text: "Status" },
  ];

  return (
    <div className="space-y-5">
      {/* Filters + export */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="w-full sm:w-48">
            <SingleSelectField
              name="statusFilter"
              label="Status"
              options={LEARNER_STATUS_FILTER_OPTIONS}
              value={statusBadge}
              setValue={(_, v) => {
                setStatusBadge(v);
                setPage(1);
              }}
              placeholder="All statuses"
              searchable={false}
            />
          </div>
          <div className="w-full sm:w-48">
            <SingleSelectField
              name="employerFilter"
              label="Employer"
              options={toOptions(filterOptions?.employers)}
              value={employerOrganisationId}
              setValue={(_, v) => {
                setEmployerOrganisationId(v);
                setPage(1);
              }}
              placeholder="All employers"
            />
          </div>
          <div className="w-full sm:w-48">
            <SingleSelectField
              name="standardFilter"
              label="Standard"
              options={toOptions(filterOptions?.standards)}
              value={standardId}
              setValue={(_, v) => {
                setStandardId(v);
                setPage(1);
              }}
              placeholder="All standards"
            />
          </div>
          <div className="w-full sm:w-44">
            <SingleSelectField
              name="tutorFilter"
              label="Tutor"
              options={toOptions(filterOptions?.tutors)}
              value={tutorUserId}
              setValue={(_, v) => {
                setTutorUserId(v);
                setPage(1);
              }}
              placeholder="All tutors"
            />
          </div>
          <div className="w-full sm:w-44">
            <InputField
              name="epaMonth"
              label="EPA month"
              type="month"
              value={epaMonth}
              onChange={(e) => {
                setEpaMonth(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="w-full sm:w-48">
            <SingleSelectField
              name="sortBy"
              label="Sort by"
              options={sortOptions}
              value={sort.sortBy}
              setValue={(_, v) => setSort((p) => ({ ...p, sortBy: v }))}
              searchable={false}
            />
          </div>
          <div className="w-full sm:w-32">
            <SingleSelectField
              name="sortOrder"
              label="Order"
              options={[
                { value: "asc", text: "Ascending" },
                { value: "desc", text: "Descending" },
              ]}
              value={sort.sortOrder}
              setValue={(_, v) => setSort((p) => ({ ...p, sortOrder: v }))}
              searchable={false}
            />
          </div>
        </div>

        {/* F2.2.1 AC5. Both exports take the current filters and return the
            whole matching cohort — not the page on screen. */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            color="black"
            variant="neutral"
            startIcon={<Download className="size-4" />}
            disabled={entries.length === 0 || downloadingCsv}
            onClick={() => downloadCsv(exportFilters)}
          >
            {downloadingCsv ? "Preparing…" : "Export CSV"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            startIcon={<FileDown className="size-4" />}
            disabled={entries.length === 0 || preparingPdf}
            onClick={handleExportPdf}
          >
            {preparingPdf ? "Preparing…" : "Export PDF"}
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={entries}
        rowKey={(row) => row.enrolmentId}
        isLoading={isLoading}
        meta={meta}
        onPageChange={setPage}
        onPerPageChange={changePerPage}
        empty={{
          icon: GraduationCap,
          title: "No learners",
          description: "Active learners appear here once enrolments exist.",
        }}
        className={cn(
          isFetching && !isLoading && "opacity-70 transition-opacity",
        )}
      />
    </div>
  );
}
