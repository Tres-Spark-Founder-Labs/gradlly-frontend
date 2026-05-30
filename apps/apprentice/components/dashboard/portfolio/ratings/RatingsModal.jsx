"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { KSB_DATA } from "@/data/portfolio.data";
import { RATINGS_DATA } from "@/data/ratings.data";

import { RatingsBand } from "./RatingsBand";
import { RatingsGroup } from "./RatingsGroup";
import { RatingsReflection } from "./RatingsReflection";

const INIT_RATINGS = Object.fromEntries(
  RATINGS_DATA.map((r) => [r.code, r.last]),
);

const GROUPS = [
  { key: "K", label: "Knowledge" },
  { key: "S", label: "Skills" },
  { key: "B", label: "Behaviours" },
];

export function RatingsModal({ open, onClose, onSave }) {
  const [ratings, setRatings] = useState(INIT_RATINGS);
  const [reflection, setReflection] = useState("");
  const [dirty, setDirty] = useState(false);

  function rate(code, value) {
    setRatings((p) => ({ ...p, [code]: value }));
    setDirty(true);
  }

  function handleSave() {
    onSave(ratings);
    toast.success(
      "Ratings saved your tutor will see these before your 10 April review.",
    );
    setDirty(false);
    onClose();
  }

  function handleClose() {
    if (dirty && !window.confirm("You have unsaved changes. Leave anyway?"))
      return;
    onClose();
  }

  // Merge ratings with KSB labels and states
  const enriched = RATINGS_DATA.map((r) => {
    const ksb = KSB_DATA.find((k) => k.code === r.code);
    return {
      ...r,
      label: ksb?.label ?? r.code,
      ksbState: ksb?.state ?? "covered",
      today: ratings[r.code] ?? r.last,
    };
  });

  const footer = (
    <>
      <Button variant="outline" size="sm" onClick={handleClose}>
        Cancel
      </Button>
      <Button size="sm" disabled={!dirty} onClick={handleSave}>
        Save ratings
      </Button>
    </>
  );

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="3xl"
      align="top"
      title="Update my KSB ratings"
      description="Last updated 15 Jan 2025 · Next review 10 Apr 2025"
      footer={footer}
    >
      <p className="text-xs text-neutral-500 mb-5 leading-relaxed">
        Rate how confident you feel against each KSB today. Your baseline was
        set at induction this shows how far you&apos;ve come and what to focus
        on before gateway.
      </p>

      <RatingsBand enriched={enriched} />

      {GROUPS.map((g) => (
        <RatingsGroup
          key={g.key}
          label={g.label}
          items={enriched.filter((r) => r.group === g.key)}
          onRate={rate}
        />
      ))}

      <RatingsReflection value={reflection} onChange={setReflection} />
    </Modal>
  );
}
