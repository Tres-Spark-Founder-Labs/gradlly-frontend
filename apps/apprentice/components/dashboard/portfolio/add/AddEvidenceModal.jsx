"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/utils/helper";

import { AddEvidenceStep1 } from "./AddEvidenceStep1";
import { AddEvidenceStep2 } from "./AddEvidenceStep2";
import { AddEvidenceStep3 } from "./AddEvidenceStep3";

const INIT = {
  title: "",
  type: "",
  date: "",
  description: "",
  files: [],
  otjSession: "",
};

const META = [
  {
    title: "Add portfolio evidence",
    description: "Step 1 of 3 · Evidence details",
  },
  {
    title: "Map to KSBs",
    description: "Step 2 of 3 · Knowledge, skills & behaviours",
  },
  {
    title: "Review & submit",
    description: "Step 3 of 3 · Check everything before submitting",
  },
];

function StepBar({ step }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      {[0, 1, 2].map((i) => (
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

export function AddEvidenceModal({ open, onClose, onSubmit }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INIT);
  const [ksbs, setKsbs] = useState([]);
  const [rating, setRating] = useState(0);
  const [declared, setDeclared] = useState(false);

  function handleClose() {
    onClose();
    setTimeout(() => {
      setStep(0);
      setForm(INIT);
      setKsbs([]);
      setRating(0);
      setDeclared(false);
    }, 350);
  }

  function handleSubmit(isDraft) {
    onSubmit({
      ...form,
      ksbs,
      rating,
      status: isDraft ? "draft" : "in_review",
    });
    toast.success(
      isDraft
        ? "Saved as draft."
        : "Evidence submitted — pending tutor approval.",
    );
    handleClose();
  }

  const step1ok = Boolean(form.title.trim() && form.type && form.date);
  const step2ok = ksbs.length > 0;
  const step3ok = declared;

  const footer =
    step === 0 ? (
      <>
        <Button variant="outline" size="sm" onClick={handleClose}>
          Cancel
        </Button>
        <Button size="sm" disabled={!step1ok} onClick={() => setStep(1)}>
          Next →
        </Button>
      </>
    ) : step === 1 ? (
      <>
        <Button variant="outline" size="sm" onClick={() => setStep(0)}>
          ← Back
        </Button>
        <Button size="sm" disabled={!step2ok} onClick={() => setStep(2)}>
          Next →
        </Button>
      </>
    ) : (
      <>
        <Button variant="outline" size="sm" onClick={() => handleSubmit(true)}>
          Save as draft
        </Button>
        <Button
          size="sm"
          disabled={!step3ok}
          onClick={() => handleSubmit(false)}
        >
          Submit for approval
        </Button>
      </>
    );

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="2xl"
      title={META[step].title}
      description={META[step].description}
      footer={footer}
    >
      <StepBar step={step} />
      <div
        key={step}
        style={{ animation: "slide-up 220ms var(--ease-out) both" }}
      >
        {step === 0 && <AddEvidenceStep1 form={form} onChange={setForm} />}
        {step === 1 && <AddEvidenceStep2 ksbs={ksbs} onChange={setKsbs} />}
        {step === 2 && (
          <AddEvidenceStep3
            form={form}
            ksbs={ksbs}
            rating={rating}
            setRating={setRating}
            declared={declared}
            setDeclared={setDeclared}
          />
        )}
      </div>
    </Modal>
  );
}
