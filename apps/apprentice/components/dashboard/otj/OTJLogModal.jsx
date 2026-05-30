"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/utils/helper";

import { OTJLogStep1 } from "./OTJLogStep1";
import { OTJLogStep2 } from "./OTJLogStep2";
import { OTJLogStep3 } from "./OTJLogStep3";

const INIT = { title: "", category: "", date: "", hours: "" };

const META = [
  { title: "Log a session", description: "Step 1 of 2 · Session details" },
  {
    title: "Map to KSBs",
    description: "Step 2 of 2 · Which KSBs does this session develop?",
  },
  {
    title: "Session logged ✓",
    description: "Submitted for review by your training provider",
  },
];

function canProceed(form) {
  return (
    form.title.trim() && form.category && form.date && Number(form.hours) > 0
  );
}

function StepBar({ step }) {
  if (step >= 2) return null;
  return (
    <div className="flex items-center gap-2 mb-5">
      {[0, 1].map((i) => (
        <div
          key={i}
          className={cn(
            "h-1.5 rounded-full transition-all duration-300",
            i === step
              ? "bg-primary-600 w-8"
              : i < step
                ? "bg-primary-400 w-4"
                : "bg-neutral-200 w-4",
          )}
        />
      ))}
    </div>
  );
}

export function OTJLogModal({ open, onClose }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INIT);
  const [ksbs, setKsbs] = useState([]);

  function handleClose() {
    onClose();
    setTimeout(() => {
      setStep(0);
      setForm(INIT);
      setKsbs([]);
    }, 350);
  }

  const footer =
    step === 0 ? (
      <>
        <Button variant="outline" size="sm" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={() => setStep(1)}
          disabled={!canProceed(form)}
        >
          Next step →
        </Button>
      </>
    ) : step === 1 ? (
      <>
        <Button variant="outline" size="sm" onClick={() => setStep(0)}>
          ← Back
        </Button>
        <Button size="sm" onClick={() => setStep(2)}>
          Log session
        </Button>
      </>
    ) : (
      <Button size="sm" onClick={handleClose}>
        Done
      </Button>
    );

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="lg"
      title={META[step].title}
      description={META[step].description}
      footer={footer}
    >
      <StepBar step={step} />
      <div
        key={step}
        style={{ animation: "slide-up 220ms var(--ease-out) both" }}
      >
        {step === 0 && <OTJLogStep1 form={form} onChange={setForm} />}
        {step === 1 && <OTJLogStep2 ksbs={ksbs} onChange={setKsbs} />}
        {step === 2 && <OTJLogStep3 form={form} ksbs={ksbs} />}
      </div>
    </Modal>
  );
}
