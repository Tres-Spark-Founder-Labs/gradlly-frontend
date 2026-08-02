"use client";

import { Lock } from "lucide-react";

import { SingleSelectField } from "@/components/form/SingleSelectField";
import { TextareaField } from "@/components/form/TextareaField";

import { SAR_GRADE_LABELS, SAR_GRADE_OPTIONS } from "../constants";

/**
 * One SAR section: guidance, narrative, and — where the judgement area
 * carries one — a self-assessed grade.
 *
 * When locked this renders as plain text rather than disabled inputs. A
 * greyed-out textarea reads as "we could not load this"; a paragraph reads as
 * a finished document, which is what a locked SAR is.
 */
export function SarSectionEditor({ section, locked, onChange }) {
  if (locked) {
    return (
      <div className="space-y-1.5 border-l-2 border-neutral-200 pl-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-neutral-900">{section.heading}</h3>
          {section.grade ? (
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-600">
              {SAR_GRADE_LABELS[section.grade] ?? section.grade}
            </span>
          ) : null}
        </div>
        <p className="whitespace-pre-wrap text-sm text-neutral-600">
          {section.narrative || "Not completed."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 border-l-2 border-neutral-200 pl-4">
      <div>
        <h3 className="font-semibold text-neutral-900">{section.heading}</h3>
        <p className="mt-0.5 text-xs text-neutral-400">{section.guidance}</p>
      </div>

      {section.graded ? (
        <div className="max-w-xs">
          <SingleSelectField
            name={`grade-${section.key}`}
            label="Self-assessed grade"
            options={SAR_GRADE_OPTIONS}
            value={section.grade ?? ""}
            setValue={(_, v) => onChange({ ...section, grade: v || null })}
            placeholder="Not yet judged"
            searchable={false}
          />
        </div>
      ) : null}

      <TextareaField
        name={`narrative-${section.key}`}
        rows={5}
        value={section.narrative}
        onChange={(e) => onChange({ ...section, narrative: e.target.value })}
      />
    </div>
  );
}

/** Small marker used by the panel header when a report is locked. */
export function LockedBadge({ lockedAt }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
      <Lock className="size-3" aria-hidden />
      Locked{lockedAt ? ` ${String(lockedAt).slice(0, 10)}` : ""}
    </span>
  );
}
