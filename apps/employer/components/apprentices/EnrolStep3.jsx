"use client";

import {
  useEmployerManagerOptions,
  useLinkedProviders,
} from "@/features/enrolments/queries/enrolments.query";
import { useStandards } from "@/features/standards/queries/standards.query";

import { T } from "./tokens";

/** Mirrors EnrolmentPipelineState on the API (F1.2.5 AC5). */
const STAGES = [
  { label: "Invited", desc: "Magic-link sent to apprentice" },
  { label: "Account created", desc: "Apprentice registered on Portal 3" },
  { label: "Provider accepted", desc: "Training provider confirmed enrolment" },
  { label: "ILR created", desc: "Provider added to ILR" },
  { label: "DAS confirmed", desc: "ESFA DAS enrolment confirmed" },
];

function StageTracker({ activeStage = 0 }) {
  return (
    <div className="space-y-2">
      <p
        className="text-[10px] font-bold uppercase tracking-widest"
        style={{ color: T.muted }}
      >
        Enrolment stages
      </p>
      {STAGES.map((s, i) => {
        const done = i < activeStage;
        const current = i === activeStage;
        return (
          <div key={s.label} className="flex items-start gap-3">
            <div
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
              style={{
                backgroundColor: done ? T.green : current ? T.blue : T.border,
                color: done || current ? "#fff" : T.muted,
              }}
            >
              {done ? "✓" : i + 1}
            </div>
            <div>
              <p
                className="text-xs font-semibold"
                style={{ color: current ? T.blue : done ? T.green : T.muted }}
              >
                {s.label}
              </p>
              <p className="text-[11px]" style={{ color: T.muted }}>
                {s.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function EnrolStep3({ data, missing = [] }) {
  /**
   * The form holds ids for standard, provider and manager, so the review has
   * to resolve them back to names. Printing the raw values here would show the
   * employer three UUIDs and ask them to confirm.
   */
  const { data: standards = [] } = useStandards();
  const { data: providers = [] } = useLinkedProviders();
  const { data: managers = [] } = useEmployerManagerOptions();

  const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ");
  const standardName = standards.find((s) => s.id === data.standard)?.title;
  const providerName = providers.find(
    (p) => p.organisationId === data.provider,
  )?.name;
  const managerName = managers.find((m) => m.id === data.manager)?.displayName;

  const summary = [
    ["Name", fullName || "—"],
    ["Email", data.email || "—"],
    ["Employee ID", data.employeeId || "—"],
    ["Job title", data.jobTitle || "—"],
    ["Standard", standardName || "—"],
    ["Provider", providerName || "—"],
    ["Line manager", managerName || "—"],
    ["Start date", data.startDate || "—"],
  ];

  /**
   * Derived from the same `missingEnrolFields` the submit button uses, rather
   * than a hand-written list. The old checklist ticked "Training provider
   * selected" against a field no step collected, and carried a permanently
   * unticked "Commitment statement generated after submission" — which nothing
   * in the platform does.
   */
  const missingFields = new Set(missing.map((m) => m.field));
  const checks = [
    { field: "firstName", text: "Learner name provided" },
    { field: "email", text: "Email address provided" },
    { field: "standard", text: "Apprenticeship standard selected" },
    { field: "provider", text: "Training provider selected" },
    { field: "manager", text: "Line manager selected" },
    { field: "startDate", text: "Start date set" },
  ].map((c) => ({ ...c, ok: !missingFields.has(c.field) }));

  const allOk = checks.every((c) => c.ok);

  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold" style={{ color: T.ink }}>
        Review &amp; submit
      </p>
      <div
        className="rounded-xl px-4 py-3 space-y-2"
        style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
      >
        {summary.map(([l, v]) => (
          <div key={l} className="flex justify-between text-xs gap-4">
            <span style={{ color: T.muted }}>{l}</span>
            <span className="font-semibold text-right" style={{ color: T.ink }}>
              {v}
            </span>
          </div>
        ))}
      </div>
      <div
        className="rounded-xl px-4 py-3 space-y-2"
        style={{
          backgroundColor: allOk ? T.greenLight : T.amberLight,
          border: `1px solid ${allOk ? T.green : T.amber}20`,
        }}
      >
        {checks.map((c) => (
          <p
            key={c.text}
            className="text-xs font-medium"
            style={{ color: T.ink }}
          >
            {c.ok ? "✅" : "⚠️"} {c.text}
          </p>
        ))}
      </div>
      <div
        className="rounded-xl px-4 py-3"
        style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
      >
        <StageTracker activeStage={0} />
      </div>
      <p className="text-xs px-1" style={{ color: T.subtle }}>
        On submit we email the apprentice an invitation to set up their account,
        and notify {providerName || "the training provider"} that the enrolment
        is waiting for them to accept.
      </p>
    </div>
  );
}
