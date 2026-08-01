"use client";

import { Download } from "lucide-react";
import { useState } from "react";

import { usePdfJobPoll } from "@/hooks/usePdfJobPoll";
import { toastError, toastSuccess } from "@/hooks/useToast";

import { LevyRoiView } from "./LevyRoiView";
import { LevyUtilisationView } from "./LevyUtilisationView";
import { ProviderPerformanceView } from "./ProviderPerformanceView";
import { ReportRecipientsCard } from "./ReportRecipientsCard";
import { useExportLevyRoiPdf } from "../queries/reporting.query";

const TABS = [
  { key: "roi", label: "Levy ROI" },
  { key: "utilisation", label: "Utilisation" },
  { key: "providers", label: "Provider performance" },
];

export function ReportsDashboard() {
  const [tab, setTab] = useState("roi");
  const [jobId, setJobId] = useState(null);
  const exportPdf = useExportLevyRoiPdf();

  usePdfJobPoll({
    jobId,
    enabled: !!jobId,
    onComplete: (job) => {
      setJobId(null);
      if (job.status === "completed" && job.downloadUrl) {
        window.open(job.downloadUrl, "_blank", "noopener,noreferrer");
      } else {
        toastError("Report export failed. Please try again.");
      }
    },
  });

  const handleExport = async () => {
    const job = await exportPdf.mutateAsync();
    setJobId(job?.jobId ?? null);
    if (!job?.jobId) {
      toastSuccess("Export queued — check back shortly.");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-extrabold text-neutral-900">Reports</h1>
          <p className="mt-0.5 text-sm text-neutral-500">
            Levy ROI, utilisation, and provider performance.
          </p>
        </div>
        <button
          type="button"
          onClick={handleExport}
          disabled={exportPdf.isPending || !!jobId}
          className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 px-3.5 py-2 text-xs font-bold text-neutral-600 transition-opacity hover:opacity-75 disabled:opacity-40"
        >
          <Download className="h-3.5 w-3.5" />
          {jobId ? "Preparing…" : "Export PDF"}
        </button>
      </div>

      <div className="flex border-b border-neutral-200">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
              tab === t.key
                ? "border-primary-600 text-primary-700"
                : "border-transparent text-neutral-500 hover:text-neutral-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "roi" && (
        <div className="space-y-6">
          <LevyRoiView />
          {/* F1.4.1 AC5 — sits under the ROI report because that is the
              report being scheduled. */}
          <ReportRecipientsCard />
        </div>
      )}
      {tab === "utilisation" && <LevyUtilisationView />}
      {tab === "providers" && <ProviderPerformanceView />}
    </div>
  );
}
