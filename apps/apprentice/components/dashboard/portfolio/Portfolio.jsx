"use client";

import { useState } from "react";

import { KSB_DATA } from "@/data/portfolio.data";

import { AddEvidenceModal } from "./add/AddEvidenceModal";
import { PlanModal } from "./plan/PlanModal";
import { PortfolioEPACard } from "./PortfolioEPACard";
import { PortfolioEvidenceList } from "./PortfolioEvidenceList";
import { PortfolioGatewayPanel } from "./PortfolioGatewayPanel";
import { PortfolioHeader } from "./PortfolioHeader";
import { PortfolioKSBGrid } from "./PortfolioKSBGrid";
import { PortfolioScorecard } from "./PortfolioScorecard";
import { PortfolioStatCards } from "./PortfolioStatCards";
import { RatingsModal } from "./ratings/RatingsModal";

export function Portfolio() {
  const [activeKSB, setActiveKSB] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [ratingsOpen, setRatingsOpen] = useState(false);
  const [planOpen, setPlanOpen] = useState(false);
  const [newEvidence, setNewEvidence] = useState([]);
  const [ksbUpdates, setKsbUpdates] = useState({});
  const [savedRatings, setSavedRatings] = useState(null);
  const [planItems, setPlanItems] = useState([]);

  function handleEvidenceSubmit(data) {
    setNewEvidence((prev) => [{ ...data, id: Date.now() }, ...prev]);

    if (data.status === "draft") return;

    const updates = {};
    data.ksbs.forEach((code) => {
      const base = KSB_DATA.find((k) => k.code === code);
      const already = ksbUpdates[code];
      if (base?.state === "not_started" && !already)
        updates[code] = "in_progress";
    });
    if (Object.keys(updates).length)
      setKsbUpdates((prev) => ({ ...prev, ...updates }));
  }

  return (
    <>
      <div className="space-y-6 pb-10">
        <PortfolioHeader onAddEvidence={() => setAddOpen(true)} />
        <PortfolioStatCards
          newCount={newEvidence.filter((e) => e.status !== "draft").length}
        />
        <PortfolioKSBGrid
          activeKSB={activeKSB}
          onSelect={setActiveKSB}
          ksbUpdates={ksbUpdates}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <PortfolioEvidenceList
              activeKSB={activeKSB}
              newEvidence={newEvidence}
              onAddEvidence={() => setAddOpen(true)}
            />
            <PortfolioGatewayPanel
              ksbUpdates={ksbUpdates}
              onPlanGaps={() => setPlanOpen(true)}
            />
          </div>
          <div className="space-y-6">
            <PortfolioScorecard
              savedRatings={savedRatings}
              onUpdate={() => setRatingsOpen(true)}
            />
            <PortfolioEPACard />
          </div>
        </div>
      </div>

      <AddEvidenceModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleEvidenceSubmit}
      />
      <RatingsModal
        open={ratingsOpen}
        onClose={() => setRatingsOpen(false)}
        onSave={(r) => setSavedRatings(r)}
      />
      <PlanModal
        open={planOpen}
        onClose={() => setPlanOpen(false)}
        onSave={(items) => setPlanItems(items)}
      />
    </>
  );
}
