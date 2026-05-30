"use client";

import { useState } from "react";

import { cn } from "@/utils/helper";

const TYPE_LABEL = {
  code: "Code / repository",
  document: "Document",
  screenshot: "Screenshot",
  presentation: "Presentation",
  reflection: "Reflective account",
  testimony: "Witness testimony",
  video: "Video",
  link: "Link / URL",
};

const RATING_LABEL = {
  1: "Weak",
  2: "Partial",
  3: "Good",
  4: "Strong",
  5: "Excellent",
};

export function AddEvidenceStep3({
  form,
  ksbs,
  rating,
  setRating,
  declared,
  setDeclared,
}) {
  const [witnessName, setWitnessName] = useState("");
  const isTestimony = form.type === "testimony";

  const ROWS = [
    { label: "Title", value: form.title || "—" },
    { label: "Type", value: TYPE_LABEL[form.type] ?? form.type ?? "—" },
    { label: "Date", value: form.date || "—" },
    {
      label: "Files",
      value: form.files?.length
        ? `${form.files.length} file(s) attached`
        : "None",
    },
    { label: "OTJ", value: form.otjSession ? "Session linked" : "None" },
  ];

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="rounded-xl bg-neutral-50 border border-neutral-100 p-4 space-y-2.5">
        {ROWS.map(({ label, value }) => (
          <div key={label} className="flex justify-between gap-4">
            <span className="text-xs text-neutral-400 shrink-0">{label}</span>
            <span className="text-xs font-medium text-neutral-700 text-right">
              {value}
            </span>
          </div>
        ))}
        {ksbs.length > 0 && (
          <div className="flex items-start gap-4 pt-2 border-t border-neutral-100">
            <span className="text-xs text-neutral-400 shrink-0">KSBs</span>
            <div className="flex flex-wrap gap-1 justify-end">
              {ksbs.map((k) => (
                <span
                  key={k}
                  className="text-xs bg-primary-50 text-primary-700 border border-primary-100 px-1.5 py-0.5 rounded font-medium"
                >
                  {k}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Self-rating */}
      <div>
        <p className="text-xs font-medium text-neutral-700 mb-2">
          How strongly does this evidence demonstrate these KSBs?
          <span className="font-normal text-neutral-400">
            {" "}
            (optional — feeds your scorecard)
          </span>
        </p>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRating(r)}
              className={cn(
                "flex-1 py-2 text-xs font-semibold rounded-lg border transition-all",
                rating === r
                  ? "bg-primary-600 border-primary-600 text-white"
                  : "bg-white border-neutral-200 text-neutral-500 hover:border-primary-300 hover:text-primary-700",
              )}
            >
              {r}
            </button>
          ))}
        </div>
        {rating > 0 && (
          <p className="text-xs text-center text-neutral-500 mt-1.5">
            {RATING_LABEL[rating]} demonstration
          </p>
        )}
      </div>

      {/* Declaration */}
      <div
        className={cn(
          "p-4 rounded-xl border transition-colors",
          declared
            ? "bg-primary-50 border-primary-200"
            : "bg-neutral-50 border-neutral-200",
        )}
      >
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={declared}
            onChange={(e) => setDeclared(e.target.checked)}
            className="mt-0.5 accent-primary-600 shrink-0"
          />
          <span className="text-xs text-neutral-700 leading-relaxed">
            {isTestimony
              ? "This testimony will be authenticated by the witness, not signed by me."
              : "I confirm this is my own work and accurately represents my skills and knowledge."}
          </span>
        </label>
        {isTestimony && (
          <input
            type="text"
            value={witnessName}
            onChange={(e) => setWitnessName(e.target.value)}
            placeholder="Witness name and job title"
            className="mt-3 w-full text-xs rounded-lg border border-neutral-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-200 bg-white"
          />
        )}
      </div>

      {/* Status note */}
      <p className="text-xs text-neutral-400 leading-relaxed">
        Submitted as{" "}
        <strong className="text-warning-600">⏳ Pending approval</strong>. Your
        tutor <strong className="text-neutral-600">Sarah Chen</strong> will
        review within 5 working days.
      </p>
    </div>
  );
}
