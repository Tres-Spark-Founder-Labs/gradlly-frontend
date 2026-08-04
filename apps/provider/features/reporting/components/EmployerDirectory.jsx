"use client";

import { Building2, Mail } from "lucide-react";
import { useMemo, useState } from "react";

import { InputField } from "@/components/form/InputField";
import { DataTable } from "@/components/ui/DataTable";
import { cn, formatDate } from "@/utils/helper";

import { CommitmentPipelineBadge } from "./CommitmentPipelineBadge";
import { useEmployerDirectory } from "../queries/reporting.query";

function EmployerCell({ employer }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 ring-1 ring-primary-100">
        <Building2 className="size-4.5" strokeWidth={1.75} aria-hidden />
      </div>
      <div className="min-w-0">
        <p className="truncate font-medium text-neutral-900">
          {employer.organisationName}
        </p>
        <p className="truncate text-xs text-neutral-400">
          {employer.region || "—"}
        </p>
      </div>
    </div>
  );
}

function ContactCell({ employer }) {
  return (
    <div className="min-w-0">
      {employer.contactName ? (
        <p className="truncate text-sm text-neutral-700">
          {employer.contactName}
        </p>
      ) : null}
      {employer.contactEmail ? (
        <a
          href={`mailto:${employer.contactEmail}`}
          className="inline-flex items-center gap-1 truncate text-xs text-primary-700 hover:underline"
        >
          <Mail className="size-3 shrink-0" aria-hidden />
          {employer.contactEmail}
        </a>
      ) : (
        <span className="text-xs text-neutral-400">No contact</span>
      )}
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

export function EmployerDirectory() {
  const [region, setRegion] = useState("");
  const [minLearners, setMinLearners] = useState("");
  const [minOtj, setMinOtj] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const params = useMemo(
    () => ({
      page,
      perPage,
      region: region || undefined,
      minActiveLearners: minLearners || undefined,
      minAverageOtjPercent: minOtj || undefined,
    }),
    [page, perPage, region, minLearners, minOtj],
  );

  const { data, isLoading, isFetching } = useEmployerDirectory(params);
  const employers = data?.employers ?? [];
  const meta = data?.meta ?? null;

  const changePerPage = (next) => {
    setPerPage(next);
    setPage(1);
  };

  const resetPage = () => setPage(1);

  const columns = [
    {
      key: "organisationName",
      header: "Employer",
      primary: true,
      cell: (row) => <EmployerCell employer={row} />,
    },
    {
      key: "contact",
      header: "Contact",
      mobileLabel: "Contact",
      cell: (row) => <ContactCell employer={row} />,
    },
    {
      key: "activeLearnerCount",
      header: "Learners",
      mobileLabel: "Learners",
      cell: (row) => (
        <span className="tabular-nums text-neutral-700">
          {row.activeLearnerCount ?? 0}
        </span>
      ),
    },
    {
      key: "averageOtjPercent",
      header: "Avg OTJ",
      mobileLabel: "Avg OTJ",
      cell: (row) => <OtjCell percent={row.averageOtjPercent} />,
    },
    {
      key: "commitmentPipelineStatus",
      header: "Commitment",
      mobileLabel: "Commitment",
      cell: (row) => (
        <CommitmentPipelineBadge status={row.commitmentPipelineStatus} />
      ),
    },
    {
      /**
       * F2.4.1 / F2.4.2. This field was a hardcoded `null` on the API,
       * honestly labelled "reserved for employer visit log", until the visit
       * log existed to fill it.
       *
       * "Never visited" is spelled out rather than left as a dash: it is the
       * state a provider preparing for inspection most needs to spot, and a
       * dash reads as missing data rather than as an answer.
       */
      key: "lastVisitDate",
      header: "Last visit",
      mobileLabel: "Last visit",
      cell: (row) =>
        row.lastVisitDate ? (
          <span className="tabular-nums text-neutral-700">
            {formatDate(row.lastVisitDate)}
          </span>
        ) : (
          <span className="text-xs text-amber-700">Never visited</span>
        ),
    },
  ];

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="w-full sm:w-52">
          <InputField
            name="region"
            label="Region"
            placeholder="e.g. London"
            value={region}
            onChange={(e) => {
              setRegion(e.target.value);
              resetPage();
            }}
          />
        </div>
        <div className="w-full sm:w-40">
          <InputField
            name="minLearners"
            label="Min learners"
            type="number"
            min="0"
            step="1"
            value={minLearners}
            onChange={(e) => {
              setMinLearners(e.target.value);
              resetPage();
            }}
          />
        </div>
        <div className="w-full sm:w-40">
          <InputField
            name="minOtj"
            label="Min avg OTJ %"
            type="number"
            min="0"
            max="100"
            step="1"
            value={minOtj}
            onChange={(e) => {
              setMinOtj(e.target.value);
              resetPage();
            }}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={employers}
        rowKey={(row) => row.employerOrganisationId}
        isLoading={isLoading}
        meta={meta}
        onPageChange={setPage}
        onPerPageChange={changePerPage}
        empty={{
          icon: Building2,
          title: "No employers",
          description:
            "Employers linked to your enrolments appear here. Adjust the filters to widen the search.",
        }}
        className={cn(
          isFetching && !isLoading && "opacity-70 transition-opacity",
        )}
      />
    </div>
  );
}
