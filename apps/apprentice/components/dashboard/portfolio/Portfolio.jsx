"use client";

import { useState } from "react";

import {
  useKsbHeatmap,
  useLearnerDocument,
} from "@/features/portfolio/queries/portfolio.query";
import { useLearnerSummary } from "@/features/reporting/queries/reporting.query";

import { AddEvidenceModal } from "./add/AddEvidenceModal";
import { PortfolioEvidenceList } from "./PortfolioEvidenceList";
import { PortfolioGatewayPanel } from "./PortfolioGatewayPanel";
import { PortfolioHeader } from "./PortfolioHeader";
import { PortfolioKSBGrid } from "./PortfolioKSBGrid";
import { PortfolioStatCards } from "./PortfolioStatCards";

export function Portfolio() {
  const [activeKSB, setActiveKSB] = useState(null);
  /**
   * The real KSB coverage. Replaces `KSB_DATA` — a 218-line hardcoded list
   * with invented coverage states that every apprentice saw identically
   * (OQ-15). The enrolment id comes from the learner summary, never from the
   * client, per client decision D3.
   */
  const summary = useLearnerSummary();
  const heatmap = useKsbHeatmap(summary.data?.activeEnrolmentId);
  const cells = heatmap.data?.cells ?? [];
  const coverageLoading = summary.isLoading || heatmap.isLoading;
  const {
    data: learnerDoc,
    isLoading: docLoading,
    error: docError,
  } = useLearnerDocument();
  const [addOpen, setAddOpen] = useState(false);
  const [newEvidence, setNewEvidence] = useState([]);
  const [ksbUpdates, setKsbUpdates] = useState({});

  function handleEvidenceAdded(data) {
    setNewEvidence((prev) => [{ ...data, id: Date.now() }, ...prev]);

    if (data.status === "draft") return;

    const updates = {};
    (data.ksbDefinitionIds ?? []).forEach((code) => {
      const base = cells.find((k) => k.code === code);
      // Only bump a KSB that genuinely had nothing against it, so the optimistic
      // update can never overstate coverage the server has not confirmed.
      if ((!base?.strength || base.strength === "none") && !ksbUpdates[code]) {
        updates[code] = "in_progress";
      }
    });
    if (Object.keys(updates).length) {
      setKsbUpdates((prev) => ({ ...prev, ...updates }));
    }
  }

  return (
    <>
      <div className="space-y-6 pb-10">
        <PortfolioHeader onAddEvidence={() => setAddOpen(true)} />
        <PortfolioStatCards cells={cells} isLoading={coverageLoading} />
        <PortfolioKSBGrid
          cells={cells}
          isLoading={coverageLoading}
          activeKSB={activeKSB}
          onSelect={setActiveKSB}
          ksbUpdates={ksbUpdates}
        />
        <PortfolioEvidenceList
          activeKSB={activeKSB}
          newEvidence={newEvidence}
          onAddEvidence={() => setAddOpen(true)}
        />
        <PortfolioGatewayPanel cells={cells} isLoading={coverageLoading} />

        {/* Learner document debug — /api/v1/leaners/me/document */}
        <div className="surface-card p-4 space-y-2">
          <p className="text-xs font-semibold text-neutral-500">
            GET /api/v1/leaners/me/document
          </p>
          {docLoading && <p className="text-xs text-neutral-400">Loading…</p>}
          {docError && (
            <p className="text-xs text-danger-600">{docError.message}</p>
          )}
          {learnerDoc && (
            <pre className="text-xs text-neutral-700 bg-neutral-50 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap break-all">
              {JSON.stringify(learnerDoc, null, 2)}
            </pre>
          )}
        </div>
      </div>

      <AddEvidenceModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onEvidenceAdded={handleEvidenceAdded}
      />
    </>
  );
}
