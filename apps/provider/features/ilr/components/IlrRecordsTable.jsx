"use client";

import {
  AlertCircle,
  Download,
  Eye,
  FileSpreadsheet,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { InputField } from "@/components/form/InputField";
import { SingleSelectField } from "@/components/form/SingleSelectField";
import Button from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { toastSuccess } from "@/hooks/useToast";
import { cn } from "@/utils/helper";

import { BuildIlrModal } from "./BuildIlrModal";
import { IlrRecordStatusBadge } from "./IlrBadges";
import { ILR_RECORD_STATUS_FILTER_OPTIONS } from "../constants";
import { useIlrRecords } from "../queries/ilr.query";
import { getIlrReturnFile } from "../services/ilr.service";

function RecordCell({ record }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 ring-1 ring-primary-100">
        <FileSpreadsheet className="size-4.5" strokeWidth={1.75} aria-hidden />
      </div>
      <div className="min-w-0">
        <p className="truncate font-medium text-neutral-900">
          {record.collectionPeriod}
        </p>
        <p className="truncate font-mono text-xs text-neutral-400">
          {record.enrolmentId}
        </p>
      </div>
    </div>
  );
}

export function IlrRecordsTable() {
  const [status, setStatus] = useState("");
  const [collectionPeriod, setCollectionPeriod] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [buildOpen, setBuildOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [returnProblem, setReturnProblem] = useState(null);

  /**
   * 5.4 — the whole return for the chosen collection period as one ILR XML
   * file for ESFA Submit Learner Data. The API sends every learner record in
   * the period or refuses with the reason (records not yet validated, an
   * empty period, no UKPRN); a refusal is shown here and no file is saved.
   */
  const handleDownloadReturn = async () => {
    setReturnProblem(null);
    setDownloading(true);
    try {
      const file = await getIlrReturnFile(collectionPeriod);
      if (!file?.xml || !file?.filename) {
        setReturnProblem("The ILR file came back empty. No file was saved.");
        return;
      }
      const url = URL.createObjectURL(
        new Blob([file.xml], { type: "application/xml" }),
      );
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = file.filename;
      anchor.click();
      URL.revokeObjectURL(url);
      toastSuccess(
        `ILR file for ${collectionPeriod} downloaded: ${file.learnerCount} learners.`,
      );
    } catch (e) {
      setReturnProblem(e?.message ?? "The ILR file could not be produced.");
    } finally {
      setDownloading(false);
    }
  };

  const params = useMemo(
    () => ({
      page,
      perPage,
      status: status || undefined,
      collectionPeriod: collectionPeriod || undefined,
    }),
    [page, perPage, status, collectionPeriod],
  );

  const { data, isLoading, isFetching } = useIlrRecords(params);
  const records = data?.records ?? [];
  const meta = data?.meta ?? null;

  const changePerPage = (next) => {
    setPerPage(next);
    setPage(1);
  };

  const columns = [
    {
      key: "collectionPeriod",
      header: "Record",
      primary: true,
      cell: (row) => <RecordCell record={row} />,
    },
    {
      key: "academicYear",
      header: "Academic year",
      mobileLabel: "Academic year",
      cell: (row) => (
        <span className="text-neutral-600">{row.academicYear}</span>
      ),
    },
    {
      key: "validationSummary",
      header: "Validation",
      mobileLabel: "Validation",
      cell: (row) => {
        const s = row.validationSummary;
        if (!s) return <span className="text-neutral-400">—</span>;
        return (
          <span className="text-xs text-neutral-600">
            <span
              className={cn(
                "font-semibold",
                s.errorCount > 0 ? "text-danger-600" : "text-emerald-600",
              )}
            >
              {s.errorCount} err
            </span>{" "}
            · {s.warnCount} warn
          </span>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      mobileLabel: "Status",
      cell: (row) => <IlrRecordStatusBadge status={row.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      mobileLabel: "Actions",
      cell: (row) => (
        <Link
          href={`/ilr/${row.id}`}
          title="Open record"
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
        >
          <Eye className="size-3.5" aria-hidden />
          Open
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="w-full sm:w-48">
            <SingleSelectField
              name="statusFilter"
              label="Status"
              options={ILR_RECORD_STATUS_FILTER_OPTIONS}
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
            <InputField
              name="collectionPeriod"
              label="Collection period"
              type="month"
              value={collectionPeriod}
              onChange={(e) => {
                setCollectionPeriod(e.target.value);
                setPage(1);
                setReturnProblem(null);
              }}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            startIcon={<Download className="size-4" />}
            onClick={handleDownloadReturn}
            loading={downloading}
            disabled={!collectionPeriod}
            title={
              collectionPeriod
                ? `Every learner record for ${collectionPeriod}, as one ILR XML file`
                : "Choose a collection period first"
            }
          >
            Download ILR file
          </Button>
          <Button
            size="sm"
            color="green"
            startIcon={<Plus className="size-4" />}
            onClick={() => setBuildOpen(true)}
          >
            Build record
          </Button>
        </div>
      </div>

      {returnProblem ? (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-lg bg-danger-50 px-3 py-2 text-sm text-danger-600"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>{returnProblem}</span>
        </p>
      ) : null}
      {collectionPeriod ? (
        <p className="text-xs text-neutral-500">
          The ILR file holds every learner record for {collectionPeriod}, and
          only once each has passed validation. It uses the v1 ILR field
          mapping, not the full ESFA schema, so Submit Learner Data may reject
          it until the mapping is complete. The file says the same at the top.
        </p>
      ) : null}

      <DataTable
        columns={columns}
        data={records}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        meta={meta}
        onPageChange={setPage}
        onPerPageChange={changePerPage}
        empty={{
          icon: FileSpreadsheet,
          title: "No ILR records",
          description:
            "Build an ILR record from an enrolment to start your ESFA return.",
          action: (
            <Button
              size="sm"
              color="green"
              startIcon={<Plus className="size-4" />}
              onClick={() => setBuildOpen(true)}
            >
              Build record
            </Button>
          ),
        }}
        className={cn(
          isFetching && !isLoading && "opacity-70 transition-opacity",
        )}
      />

      <BuildIlrModal open={buildOpen} onClose={() => setBuildOpen(false)} />
    </div>
  );
}
