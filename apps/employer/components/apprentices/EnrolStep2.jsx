import { Plus } from "lucide-react";
import { useState } from "react";

import { Modal } from "@/components/ui/Modal";
import { useLinkedProviders } from "@/features/enrolments/queries/enrolments.query";
import {
  useCreateStandard,
  useProgrammes,
  useStandards,
} from "@/features/standards/queries/standards.query";

import { Field, Select } from "./EnrolFields";
import { T } from "./tokens";

const COHORTS = ["2024-A", "2024-B", "2024-D", "2025-A"];

// ─── Inline create-standard modal ─────────────────────────────────────────────

const STD_INIT = {
  programmeId: "",
  code: "",
  title: "",
  fundingBandMax: "",
  defaultDurationMonths: "",
};

function CreateStandardModal({ open, onClose, programmes, onCreated }) {
  const [form, setForm] = useState(STD_INIT);
  const createStandard = useCreateStandard();

  const setField = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await createStandard.mutateAsync({
      programmeId: form.programmeId,
      code: form.code,
      title: form.title,
      ...(form.fundingBandMax && {
        fundingBandMax: Number(form.fundingBandMax),
      }),
      ...(form.defaultDurationMonths && {
        defaultDurationMonths: Number(form.defaultDurationMonths),
      }),
      status: "active",
    });
    setForm(STD_INIT);
    onCreated?.(result?.id);
    onClose();
  };

  const progOptions = programmes.map((p) => ({ value: p.id, label: p.title }));

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      title="Create standard"
      description="Add a new apprenticeship standard to use in this enrolment."
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold border hover:opacity-75"
            style={{ borderColor: T.border, color: T.subtle }}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="inline-standard-form"
            disabled={createStandard.isPending}
            className="px-5 py-2 rounded-xl text-sm font-bold hover:opacity-80 disabled:opacity-50"
            style={{ backgroundColor: T.blue, color: "#fff" }}
          >
            {createStandard.isPending ? "Creating…" : "Create & select"}
          </button>
        </>
      }
    >
      <form
        id="inline-standard-form"
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        {progOptions.length === 0 ? (
          <div
            className="rounded-xl px-4 py-3 text-xs"
            style={{
              backgroundColor: T.amberLight,
              border: `1px solid ${T.amber}20`,
              color: T.amber,
            }}
          >
            No programmes found. Create a programme first in{" "}
            <strong>Settings → Standards</strong>.
          </div>
        ) : (
          <>
            <Select
              label="Programme"
              name="programmeId"
              options={progOptions}
              value={form.programmeId}
              onChange={setField}
            />
            <Field
              id="code"
              label="Code"
              placeholder="e.g. SW-L4"
              hint="Short unique identifier"
              value={form.code}
              onChange={setField}
            />
            <Field
              id="title"
              label="Standard title"
              placeholder="e.g. Software Developer L4"
              value={form.title}
              onChange={setField}
            />
            <div className="grid grid-cols-2 gap-3">
              <Field
                id="fundingBandMax"
                label="Funding band max (£)"
                type="number"
                placeholder="e.g. 18000"
                value={form.fundingBandMax}
                onChange={setField}
              />
              <Field
                id="defaultDurationMonths"
                label="Duration (months)"
                type="number"
                placeholder="e.g. 24"
                value={form.defaultDurationMonths}
                onChange={setField}
              />
            </div>
          </>
        )}
      </form>
    </Modal>
  );
}

// ─── Step 2 ───────────────────────────────────────────────────────────────────

export function EnrolStep2({ data, onChange }) {
  const [createOpen, setCreateOpen] = useState(false);

  const { data: standards = [], isLoading: standardsLoading } = useStandards();
  const { data: programmes = [], isLoading: progsLoading } = useProgrammes();
  const { data: providers = [], isLoading: providersLoading } =
    useLinkedProviders();

  const isLoading = standardsLoading || progsLoading;

  const standardOptions = standards.map((s) => ({
    value: s.id,
    label: s.title,
  }));

  const providerOptions = providers.map((p) => ({
    value: p.organisationId,
    label: p.ukprn ? `${p.name} · UKPRN ${p.ukprn}` : p.name,
  }));

  const selectedStandard = standards.find((s) => s.id === data.standard);

  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold" style={{ color: T.ink }}>
        Programme details
      </p>

      {/* Standard selector */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="standard-select"
            className="block text-xs font-semibold"
            style={{ color: T.subtle }}
          >
            Apprenticeship standard
          </label>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-1 text-[11px] font-semibold hover:underline"
            style={{ color: T.blue }}
          >
            <Plus className="h-3 w-3" />
            Create new
          </button>
        </div>

        {isLoading ? (
          <div
            className="rounded-xl px-3 py-2.5 text-xs border"
            style={{
              borderColor: T.border,
              backgroundColor: T.surface,
              color: T.muted,
            }}
          >
            Loading standards…
          </div>
        ) : standardOptions.length === 0 ? (
          <div
            className="rounded-xl px-4 py-3 text-xs"
            style={{
              backgroundColor: T.amberLight,
              border: `1px solid ${T.amber}20`,
              color: T.amber,
            }}
          >
            No standards yet.{" "}
            <button
              type="button"
              className="font-bold underline"
              onClick={() => setCreateOpen(true)}
            >
              Create your first standard
            </button>{" "}
            or add one via Settings → Standards.
          </div>
        ) : (
          <select
            id="standard-select"
            value={data.standard ?? ""}
            onChange={(e) => onChange("standard", e.target.value)}
            className="w-full rounded-xl px-3 py-2.5 text-sm border focus:outline-none"
            style={{
              borderColor: T.border,
              backgroundColor: T.surface,
              color: T.ink,
            }}
          >
            <option value="">Select…</option>
            {standardOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        )}
      </div>

      <Field
        id="startDate"
        label="Planned start date"
        type="date"
        value={data.startDate}
        onChange={onChange}
      />
      <Select
        label="Cohort assignment"
        name="cohort"
        options={COHORTS}
        value={data.cohort}
        onChange={onChange}
      />

      {selectedStandard && (
        <div
          className="rounded-xl px-4 py-3"
          style={{
            backgroundColor: T.blueLight,
            border: `1px solid ${T.blue}20`,
          }}
        >
          <p className="text-xs font-semibold" style={{ color: T.blue }}>
            {selectedStandard.fundingBandMax
              ? `Funding band: £${selectedStandard.fundingBandMax.toLocaleString()} max`
              : "Funding band: check with provider"}
          </p>
          {selectedStandard.defaultDurationMonths && (
            <p className="text-xs mt-0.5" style={{ color: T.muted }}>
              Typical duration: {selectedStandard.defaultDurationMonths} months
            </p>
          )}
        </div>
      )}

      {/*
        F1.2.5 AC2 — training provider.

        No step collected this before, even though step 3 displayed
        `data.provider` and ticked a "Training provider selected" checklist
        item for it. The value was always empty, so the enrolment was created
        with no provider attached and the provider was never notified.

        The list is providers who have accepted a previous enrolment from this
        employer, which is what an accepted connection request amounts to here.
      */}
      {providersLoading ? (
        <div
          className="h-16 rounded-xl animate-pulse"
          style={{ backgroundColor: T.card }}
        />
      ) : providerOptions.length === 0 ? (
        <div
          className="rounded-xl px-3 py-2.5 text-xs space-y-1"
          style={{
            backgroundColor: T.amberLight,
            color: T.amber,
            border: `1px solid ${T.amber}30`,
          }}
        >
          <p className="font-semibold">No linked training providers yet.</p>
          <p>
            A provider appears here once they have accepted an enrolment from
            you. Ask your provider to send you a connection request, or contact
            support to link them.
          </p>
        </div>
      ) : (
        <Select
          label="Training provider"
          name="provider"
          options={providerOptions}
          value={data.provider}
          onChange={onChange}
        />
      )}

      <CreateStandardModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        programmes={programmes}
        onCreated={(newId) => {
          if (newId) onChange("standard", newId);
        }}
      />
    </div>
  );
}
