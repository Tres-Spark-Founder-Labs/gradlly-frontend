"use client";

import { Download, FileText } from "lucide-react";
import { useState } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { LEVY_ROI_BREAKDOWN_GROUP } from "@/features/reporting/constants";
import {
  useDownloadProviderComparisonCsv,
  useExportProviderComparisonPdf,
  useLevyRoiBreakdown,
} from "@/features/reporting/queries/reporting.query";
import { usePdfJobPoll } from "@/hooks/usePdfJobPoll";
import { toastError } from "@/hooks/useToast";

function metricColor(value, { good = 80, warn = 60 } = {}) {
  if (value === null || value === undefined) return "text-neutral-400";
  if (value >= good) return "text-emerald-600";
  if (value >= warn) return "text-amber-600";
  return "text-red-600";
}

function Metric({ label, value, suffix = "%", colorFn }) {
  const hasValue = value !== null && value !== undefined;
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-xs text-neutral-500">{label}</span>
      <span
        className={`text-xs font-semibold tabular-nums ${
          hasValue
            ? colorFn
              ? colorFn(value)
              : "text-neutral-800"
            : "text-neutral-400"
        }`}
      >
        {hasValue ? `${value}${suffix}` : "Not yet available"}
      </span>
    </div>
  );
}

function ProviderRow({ row }) {
  return (
    <div className="rounded-xl border border-neutral-200 px-4 py-3">
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-sm font-semibold text-neutral-900">
          {row.label}
        </p>
        <span className="shrink-0 text-xs text-neutral-500">
          {row.activeApprenticeCount} active · {row.completionCount} completed
        </span>
      </div>
      <div className="mt-2 divide-y divide-neutral-100">
        <Metric
          label="Average OTJ %"
          value={row.averageOtjPercent}
          colorFn={(v) => metricColor(v)}
        />
        <Metric
          label="Review compliance"
          value={row.reviewComplianceRate}
          colorFn={(v) => metricColor(v)}
        />
        <Metric
          label="Withdrawal rate"
          value={row.withdrawalRate}
          colorFn={(v) => metricColor(100 - v)}
        />
        {/**
         * F1.4.1 AC1/AC2 — this was hardcoded `value={null}` with a comment
         * saying the EPA-outcomes entity was "not yet built on the backend".
         * It had been built, with a recording endpoint; the API just never
         * read it. Real now, and shown with its denominator: a 100% pass rate
         * from one apprentice is not comparable to one from thirty, and a
         * side-by-side table has to say so.
         */}
        <Metric
          label={
            row.epaAssessedCount
              ? `EPA pass rate (${row.epaAssessedCount} assessed)`
              : "EPA pass rate"
          }
          value={row.epaPassRate}
          colorFn={(v) => metricColor(v)}
        />
      </div>
    </div>
  );
}

/** F1.4.2 — per-provider performance comparison. */
export function ProviderPerformanceView() {
  const { data: rows = [], isLoading } = useLevyRoiBreakdown(
    LEVY_ROI_BREAKDOWN_GROUP.PROVIDER,
  );

  // F1.4.2 AC3 — CSV is served inline; the PDF goes through the job queue.
  const { mutate: downloadCsv, isPending: downloadingCsv } =
    useDownloadProviderComparisonCsv();
  const { mutateAsync: exportPdf, isPending: queueingPdf } =
    useExportProviderComparisonPdf();
  const [pdfJobId, setPdfJobId] = useState(null);

  usePdfJobPoll({
    jobId: pdfJobId,
    enabled: !!pdfJobId,
    onComplete: (job) => {
      setPdfJobId(null);
      if (job?.status === "completed" && job.downloadUrl) {
        window.open(job.downloadUrl, "_blank", "noopener,noreferrer");
      } else {
        toastError("Comparison export failed. Please try again.");
      }
    },
  });

  const handleExportPdf = async () => {
    const job = await exportPdf().catch(() => null);
    if (job?.jobId) setPdfJobId(job.jobId);
  };

  const preparingPdf = queueingPdf || !!pdfJobId;
  // Nothing to export is not an error, but offering the button would be.
  const canExport = rows.length > 0 && !isLoading;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">
              Provider performance
            </h3>
            <p className="mt-0.5 text-xs text-neutral-500">
              Calculated from live platform data, not self-reported by
              providers.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => downloadCsv()}
              disabled={!canExport || downloadingCsv}
              className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 px-3 py-1.5 text-xs font-bold text-neutral-600 transition-opacity hover:opacity-75 disabled:opacity-40"
            >
              <Download className="h-3.5 w-3.5" />
              {downloadingCsv ? "Preparing…" : "CSV"}
            </button>
            <button
              type="button"
              onClick={handleExportPdf}
              disabled={!canExport || preparingPdf}
              className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 px-3 py-1.5 text-xs font-bold text-neutral-600 transition-opacity hover:opacity-75 disabled:opacity-40"
            >
              <FileText className="h-3.5 w-3.5" />
              {preparingPdf ? "Preparing…" : "PDF"}
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading && <p className="text-sm text-neutral-400">Loading…</p>}
        {!isLoading && rows.length === 0 && (
          <p className="text-sm text-neutral-500">
            No linked providers with active or completed apprentices yet.
          </p>
        )}
        {rows.map((row) => (
          <ProviderRow key={row.groupId} row={row} />
        ))}
      </CardContent>
    </Card>
  );
}
