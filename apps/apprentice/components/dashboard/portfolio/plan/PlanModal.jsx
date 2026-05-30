"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { KSB_DATA } from "@/data/portfolio.data";

import { PlanBand } from "./PlanBand";
import { PlanGapCard } from "./PlanGapCard";
import { PlanSmartPanel } from "./PlanSmartPanel";
import { PlanStrengthen } from "./PlanStrengthen";
import { PlanTimeline } from "./PlanTimeline";

const PRIORITY = KSB_DATA.filter((k) => k.state === "not_started");
const STRENGTHEN = KSB_DATA.filter((k) => k.state === "in_progress");

const SUGGESTIONS = {
  K11: "Capture the design doc from your next feature build",
  S12: "Reflective account of building to a given spec",
  S15: "Record / slide your next demo and add a reflection",
  S16: "Annotated code from an algorithm-heavy task",
  B8: "Short reflection on why a feature mattered to the business",
};

export function PlanModal({ open, onClose, onSave }) {
  const [filter, setFilter] = useState("all");
  const [planItems, setPlanItems] = useState([]);

  function addItem(item) {
    setPlanItems((p) => [...p.filter((x) => x.code !== item.code), item]);
  }

  function handleSave() {
    onSave(planItems);
    toast.success(
      "Plan saved — Sarah Chen can see it before your next review.",
    );
    onClose();
  }

  const showPriority = filter !== "in_progress";
  const showStrengthen = filter !== "not_started";

  const footer = (
    <>
      <Button variant="outline" size="sm" onClick={onClose}>
        Cancel
      </Button>
      <Button variant="outline" size="sm" disabled={planItems.length === 0}>
        Share with tutor
      </Button>
      <Button size="sm" disabled={planItems.length === 0} onClick={handleSave}>
        Save plan
      </Button>
    </>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="3xl"
      align="top"
      title="Plan your evidence"
      description="Gateway: 15 Dec 2025 · ~270 days · ~9 evidence-gathering windows left"
      footer={footer}
    >
      <p className="text-xs text-neutral-500 leading-relaxed mb-5">
        16 KSBs still need evidence before your December gateway. Plan how and
        when you&apos;ll cover each one.
      </p>

      <PlanBand
        planCount={planItems.length}
        filter={filter}
        onFilter={setFilter}
      />

      {showPriority && (
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-warning-400" />
            <h3 className="text-xs font-semibold text-neutral-700 uppercase tracking-wide">
              Start here — Not started{" "}
              <span className="text-neutral-400 font-normal normal-case">
                ({PRIORITY.length})
              </span>
            </h3>
          </div>
          {PRIORITY.map((ksb) => (
            <PlanGapCard
              key={ksb.code}
              ksb={ksb}
              suggestion={SUGGESTIONS[ksb.code]}
              onAdd={addItem}
              planned={planItems.find((i) => i.code === ksb.code)}
            />
          ))}
        </section>
      )}

      {showStrengthen && (
        <section className="mb-6">
          <PlanStrengthen items={STRENGTHEN} />
        </section>
      )}

      <section className="mb-6">
        <PlanSmartPanel />
      </section>

      {planItems.length > 0 && (
        <section>
          <PlanTimeline items={planItems} />
        </section>
      )}
    </Modal>
  );
}
