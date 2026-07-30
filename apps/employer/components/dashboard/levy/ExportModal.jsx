"use client";
// F1.1.5 — Levy Report Export: PDF download + monthly email scheduling

import { Download, FileText, Send } from "lucide-react";
import { useState } from "react";

import { Modal } from "@/components/ui/Modal";
import { useExportLevyRoiPdf } from "@/features/reporting/queries/reporting.query";
import { usePdfJobPoll } from "@/hooks/usePdfJobPoll";
import { toastError, toastSuccess } from "@/hooks/useToast";

import { T } from "./tokens";

// F1.1.5 AC1. Kept in step with what the PDF actually renders — this list is
// a promise to the user, and previously named sections the report did not
// contain (the forecast was missing until this requirement).
const INCLUDES = [
  "Available levy balance (from DAS)",
  "Monthly contributions — last 12 months",
  "Utilisation breakdown (used / expiring / available)",
  "Spend forecast and estimated runway",
  "Active apprentice count",
  "Cost summary by provider and standard",
];

export function ExportModal({ open, onClose }) {
  const [exporting, setExp] = useState(false);

  // Was: a setTimeout followed by a "downloaded" toast, with no request and no
  // file. It reported success unconditionally, including when the backend was
  // unreachable. Now goes through the real async PDF pipeline.
  const exportPdf = useExportLevyRoiPdf();
  const [jobId, setJobId] = useState(null);

  usePdfJobPoll({
    jobId,
    onComplete: (job) => {
      setJobId(null);
      setExp(false);
      if (job?.downloadUrl) {
        window.open(job.downloadUrl, "_blank", "noopener,noreferrer");
        toastSuccess("Levy report ready.");
      } else {
        toastError("The report finished but no file was returned.");
      }
      onClose();
    },
  });

  async function handleExport() {
    setExp(true);
    try {
      const job = await exportPdf.mutateAsync();
      const id = job?.jobId ?? job?.id ?? null;
      if (!id) throw new Error("No job id returned");
      // Polling continues until the worker finishes; the modal stays open so
      // the user isn't told it's done before it is.
      setJobId(id);
    } catch {
      setExp(false);
      // useExportLevyRoiPdf already surfaces the error toast.
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      title="Export Levy Report"
      description="Board-ready levy report"
    >
      <div className="space-y-4">
        <div
          className="rounded-xl p-4"
          style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
        >
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-4 w-4" style={{ color: T.blue }} />
            <p
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: T.muted }}
            >
              Report includes
            </p>
          </div>
          <ul className="space-y-1.5">
            {INCLUDES.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-xs"
                style={{ color: T.ink }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: T.green }}
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <button
          type="button"
          onClick={handleExport}
          disabled={exporting}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm hover:opacity-80 transition-opacity disabled:opacity-60"
          style={{ backgroundColor: T.blue, color: "#fff" }}
        >
          <Download className="h-4 w-4" />
          {exporting ? "Generating PDF…" : "Download PDF Report"}
        </button>

        {/* Scheduled email reports have no backend endpoint yet. This
            previously accepted an address and toasted "report scheduled",
            which nothing acted on — a promise the system could not keep.
            Left visible but disabled until F1.1.5 provides the endpoint. */}
        <div>
          <p className="text-xs font-semibold mb-2" style={{ color: T.subtle }}>
            Schedule monthly email report
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              disabled
              placeholder="Coming soon"
              aria-label="Schedule monthly email report (not yet available)"
              className="flex-1 rounded-xl border px-3 py-2 text-sm disabled:opacity-60"
              style={{
                borderColor: T.border,
                color: T.ink,
                backgroundColor: T.card,
              }}
            />
            <button
              type="button"
              disabled
              title="Scheduled email reports are not available yet"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-sm opacity-50 cursor-not-allowed"
              style={{ backgroundColor: T.greenLight, color: T.green }}
            >
              <Send className="h-3.5 w-3.5" /> Schedule
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
