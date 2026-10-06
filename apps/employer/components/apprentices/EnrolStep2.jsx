import { Plus, Search } from "lucide-react";
import { useState } from "react";

import { Modal } from "@/components/ui/Modal";
import {
  useLinkedProviders,
  useLookupProviderByUkprn,
} from "@/features/enrolments/queries/enrolments.query";
import {
  useCreateStandard,
  useProgrammes,
  useStandards,
} from "@/features/standards/queries/standards.query";

import { Field, Select } from "./EnrolFields";
import { T } from "./tokens";

/*
 * ── THE COHORT SELECTOR IS GONE ─────────────────────────────────────────────
 *
 * It offered four invented options — "2024-A", "2024-B", "2024-D", "2025-A" —
 * in a form that creates a real enrolment. Two things were wrong with it.
 *
 * There is no cohort anywhere on the API: neither the enrolment nor the
 * apprentice DTO has such a field, and `normalizeApprentice` sets `cohort:
 * null`. So the options could not have been sourced; they were made up.
 *
 * And the value went nowhere. `cohort` existed in the drawer's form state and
 * was never included in the create payload, so an employer chose a cohort,
 * submitted, and the choice was discarded in silence — the enrolment they
 * believed they had filed under "2025-A" was filed under nothing.
 *
 * The roster's "cohort" filter is unrelated: it groups by the month of the
 * planned start date (see roster-export.js), which is captured by the field
 * directly above this comment.
 */

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

/**
 * Find a training provider by UKPRN, when none is linked yet.
 *
 * ── WHY THIS EXISTS ─────────────────────────────────────────────────────────
 *
 * This slot used to hold a warning: "No linked training providers yet. A
 * provider appears here once they have accepted an enrolment from you." True,
 * and a dead end — the list is populated by accepted enrolments, and an
 * enrolment cannot be sent without a provider. A new employer had no control
 * to click and no way out of the wizard.
 *
 * F1.2.5 AC2 describes a connection request, which does not exist. Until it
 * does, this is the entry point: the employer types the UKPRN they already
 * know from their contract, and the provider confirms by accepting the
 * enrolment, which is the consent step that was always there.
 */
function ProviderUkprnFinder({ onChange }) {
  const [ukprn, setUkprn] = useState("");
  const [found, setFound] = useState(null);
  const lookup = useLookupProviderByUkprn();

  const search = () => {
    const trimmed = ukprn.trim();
    if (!trimmed || lookup.isPending) return;
    lookup.mutate(trimmed, {
      onSuccess: (provider) => {
        setFound(provider);
        // Reported as `(name, value)` -- the shape Select and Field use -- so
        // the submit sequence links the provider without knowing which control
        // chose it.
        onChange("provider", provider.id);
        // The review step resolves provider names from the linked-provider
        // list, and a provider found this way is not on it yet -- that list is
        // built from acceptances. Without the name, step 3 would show "--" for
        // a provider it had just ticked as selected.
        onChange("providerName", provider.name);
      },
      onError: () => setFound(null),
    });
  };

  return (
    <div className="space-y-2">
      <label
        htmlFor="provider-ukprn"
        className="block text-xs font-semibold"
        style={{ color: T.subtle }}
      >
        Training provider
      </label>
      <p className="text-[11px]" style={{ color: T.muted }}>
        No provider is linked yet. Enter their UK Provider Reference Number — it
        is on your contract — and they confirm by accepting this enrolment.
      </p>
      <div className="flex gap-2">
        <input
          id="provider-ukprn"
          name="providerUkprn"
          inputMode="numeric"
          placeholder="e.g. 10012345"
          value={ukprn}
          onChange={(e) => setUkprn(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              search();
            }
          }}
          className="flex-1 rounded-xl px-3 py-2 text-sm"
          style={{ border: `1px solid ${T.border}`, color: T.ink }}
        />
        <button
          type="button"
          onClick={search}
          disabled={!ukprn.trim() || lookup.isPending}
          className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold disabled:opacity-50"
          style={{ backgroundColor: T.blue, color: "#fff" }}
        >
          <Search className="h-3.5 w-3.5" aria-hidden />
          {lookup.isPending ? "Searching…" : "Find"}
        </button>
      </div>

      {found ? (
        <p className="text-xs font-semibold" style={{ color: T.green }}>
          {found.name} selected · UKPRN {found.ukprn}
        </p>
      ) : null}

      {lookup.isError ? (
        <p className="text-xs" style={{ color: T.amber }}>
          No training provider found with that UKPRN. Check the number with your
          provider — a typo is the usual cause.
        </p>
      ) : null}
    </div>
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

      {/*
        The negotiated price. Nothing in the product asked for it before, and
        it is the number the levy reporting is built on: cost per apprentice
        averages it over completed enrolments
        (levy-roi-report.service.ts averageCostPerCompletion) and the roster
        footer totals it as committed spend. Both read zero until it is set.

        Optional, not required: an employer part-way through a negotiation
        should still be able to enrol, and the API treats it as optional too.
      */}
      <Field
        id="agreedPrice"
        label="Agreed price (£)"
        type="number"
        placeholder={
          selectedStandard?.fundingBandMax
            ? String(selectedStandard.fundingBandMax)
            : "e.g. 18000"
        }
        hint="The total you have agreed with the provider. Levy cost reporting is based on this figure. You can add it later."
        value={data.agreedPrice}
        onChange={onChange}
      />

      <Field
        id="startDate"
        label="Planned start date"
        type="date"
        value={data.startDate}
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
        <ProviderUkprnFinder onChange={onChange} />
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
