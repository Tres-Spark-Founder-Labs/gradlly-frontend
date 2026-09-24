"use client";

import { BookOpen, ChevronDown, ChevronRight, Plus } from "lucide-react";
import { useState } from "react";

import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

import {
  useCreateProgramme,
  useCreateStandard,
  useProgrammes,
  useStandards,
} from "../queries/standards.query";

// ─── Tokens (match existing UI palette) ──────────────────────────────────────

const T = {
  ink: "#111827",
  muted: "#6b7280",
  subtle: "#374151",
  border: "#e5e7eb",
  surface: "#ffffff",
  card: "#f9fafb",
  green: "#1e6b3a",
  greenLight: "#eaf5ee",
  amber: "#b07e00",
  amberLight: "#fdf5d6",
  blue: "var(--color-primary-700)",
  blueLight: "var(--color-primary-50)",
};

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const map = {
    active: { bg: T.greenLight, color: T.green },
    draft: { bg: T.amberLight, color: T.amber },
    archived: { bg: "#f3f4f6", color: T.muted },
  };
  const { bg, color } = map[status] ?? map.draft;
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide"
      style={{ backgroundColor: bg, color }}
    >
      {status}
    </span>
  );
}

// ─── Field ────────────────────────────────────────────────────────────────────

function Field({
  id,
  label,
  type = "text",
  placeholder,
  hint,
  value,
  onChange,
  required,
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-xs font-semibold"
        style={{ color: T.subtle }}
      >
        {label}
        {required && <span style={{ color: "#ef4444" }}> *</span>}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        required={required}
        value={value ?? ""}
        onChange={(e) => onChange(id, e.target.value)}
        className="w-full rounded-xl px-3 py-2.5 text-sm border focus:outline-none focus:ring-2 focus:ring-blue-200"
        style={{
          borderColor: T.border,
          backgroundColor: T.surface,
          color: T.ink,
        }}
      />
      {hint && (
        <p className="text-[11px]" style={{ color: T.muted }}>
          {hint}
        </p>
      )}
    </div>
  );
}

function SelectField({ id, label, options, value, onChange, required }) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-xs font-semibold"
        style={{ color: T.subtle }}
      >
        {label}
        {required && <span style={{ color: "#ef4444" }}> *</span>}
      </label>
      <select
        id={id}
        required={required}
        value={value ?? ""}
        onChange={(e) => onChange(id, e.target.value)}
        className="w-full rounded-xl px-3 py-2.5 text-sm border focus:outline-none"
        style={{
          borderColor: T.border,
          backgroundColor: T.surface,
          color: T.ink,
        }}
      >
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ─── Create Programme Modal ───────────────────────────────────────────────────

const PROG_INIT = { code: "", title: "", description: "", status: "active" };

function CreateProgrammeModal({ open, onClose }) {
  const [form, setForm] = useState(PROG_INIT);
  const createProgramme = useCreateProgramme();

  const setField = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createProgramme.mutateAsync({
      code: form.code,
      title: form.title,
      ...(form.description && { description: form.description }),
      status: form.status,
    });
    setForm(PROG_INIT);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      title="New programme"
      description="Programmes group related apprenticeship standards."
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
          <Button
            type="submit"
            form="create-programme-form"
            variant="black"
            size="sm"
            loading={createProgramme.isPending}
          >
            Create programme
          </Button>
        </>
      }
    >
      <form
        id="create-programme-form"
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <Field
          id="code"
          label="Code"
          placeholder="e.g. LEVY-2025"
          value={form.code}
          onChange={setField}
          required
          hint="Short unique identifier for this programme"
        />
        <Field
          id="title"
          label="Title"
          placeholder="e.g. Levy-Funded Apprenticeships 2025"
          value={form.title}
          onChange={setField}
          required
        />
        <Field
          id="description"
          label="Description"
          placeholder="Optional"
          value={form.description}
          onChange={setField}
        />
        <SelectField
          id="status"
          label="Status"
          value={form.status}
          onChange={setField}
          options={[
            { value: "active", label: "Active" },
            { value: "draft", label: "Draft" },
            { value: "archived", label: "Archived" },
          ]}
        />
      </form>
    </Modal>
  );
}

// ─── Create Standard Modal ────────────────────────────────────────────────────

const STD_INIT = {
  programmeId: "",
  code: "",
  title: "",
  description: "",
  fundingBandMax: "",
  defaultDurationMonths: "",
  status: "active",
};

function CreateStandardModal({
  open,
  onClose,
  programmes,
  defaultProgrammeId,
}) {
  const [form, setForm] = useState({
    ...STD_INIT,
    programmeId: defaultProgrammeId ?? "",
  });
  const createStandard = useCreateStandard();

  const setField = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createStandard.mutateAsync({
      programmeId: form.programmeId,
      code: form.code,
      title: form.title,
      ...(form.description && { description: form.description }),
      ...(form.fundingBandMax && {
        fundingBandMax: Number(form.fundingBandMax),
      }),
      ...(form.defaultDurationMonths && {
        defaultDurationMonths: Number(form.defaultDurationMonths),
      }),
      status: form.status,
    });
    setForm(STD_INIT);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      title="New standard"
      description="Add an apprenticeship standard to a programme."
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
          <Button
            type="submit"
            form="create-standard-form"
            variant="black"
            size="sm"
            loading={createStandard.isPending}
          >
            Create standard
          </Button>
        </>
      }
    >
      <form
        id="create-standard-form"
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <SelectField
          id="programmeId"
          label="Programme"
          value={form.programmeId}
          onChange={setField}
          required
          options={programmes.map((p) => ({ value: p.id, label: p.title }))}
        />
        <Field
          id="code"
          label="Code"
          placeholder="e.g. SW-L4"
          value={form.code}
          onChange={setField}
          required
          hint="Short unique identifier for this standard"
        />
        <Field
          id="title"
          label="Title"
          placeholder="e.g. Software Developer L4"
          value={form.title}
          onChange={setField}
          required
        />
        <Field
          id="description"
          label="Description"
          placeholder="Optional"
          value={form.description}
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
            hint="Maximum levy funding"
          />
          <Field
            id="defaultDurationMonths"
            label="Duration (months)"
            type="number"
            placeholder="e.g. 24"
            value={form.defaultDurationMonths}
            onChange={setField}
            hint="Expected programme length"
          />
        </div>
        <SelectField
          id="status"
          label="Status"
          value={form.status}
          onChange={setField}
          options={[
            { value: "active", label: "Active" },
            { value: "draft", label: "Draft" },
            { value: "archived", label: "Archived" },
          ]}
        />
      </form>
    </Modal>
  );
}

// ─── Programme row (expandable) ───────────────────────────────────────────────

function ProgrammeRow({ programme, standards, onAddStandard }) {
  const [open, setOpen] = useState(false);
  const programmeStandards = standards.filter(
    (s) => s.programmeId === programme.id,
  );

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: `1px solid ${T.border}` }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
        style={{ backgroundColor: T.surface }}
      >
        <div className="flex items-center gap-3 min-w-0">
          {open ? (
            <ChevronDown
              className="h-4 w-4 shrink-0"
              style={{ color: T.muted }}
            />
          ) : (
            <ChevronRight
              className="h-4 w-4 shrink-0"
              style={{ color: T.muted }}
            />
          )}
          <div className="min-w-0">
            <p
              className="text-sm font-semibold truncate"
              style={{ color: T.ink }}
            >
              {programme.title}
            </p>
            <p className="text-[11px]" style={{ color: T.muted }}>
              {programme.code} &nbsp;·&nbsp; {programmeStandards.length}{" "}
              standard
              {programmeStandards.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <StatusBadge status={programme.status} />
        </div>
      </button>

      {open && (
        <div
          className="border-t px-4 py-3 space-y-2"
          style={{ borderColor: T.border, backgroundColor: T.card }}
        >
          {programmeStandards.length === 0 ? (
            <p className="text-xs py-2" style={{ color: T.muted }}>
              No standards yet in this programme.
            </p>
          ) : (
            programmeStandards.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between gap-3 rounded-lg px-3 py-2"
                style={{
                  backgroundColor: T.surface,
                  border: `1px solid ${T.border}`,
                }}
              >
                <div>
                  <p className="text-xs font-semibold" style={{ color: T.ink }}>
                    {s.title}
                  </p>
                  <p className="text-[11px]" style={{ color: T.muted }}>
                    {s.code}
                    {s.fundingBandMax
                      ? ` · £${s.fundingBandMax.toLocaleString()} max`
                      : ""}
                    {s.defaultDurationMonths
                      ? ` · ${s.defaultDurationMonths}mo`
                      : ""}
                  </p>
                </div>
                <StatusBadge status={s.status} />
              </div>
            ))
          )}

          <button
            type="button"
            onClick={() => onAddStandard(programme.id)}
            className="flex items-center gap-1.5 text-xs font-semibold mt-1 hover:underline"
            style={{ color: T.blue }}
          >
            <Plus className="h-3.5 w-3.5" />
            Add standard
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Panel ────────────────────────────────────────────────────────────────────

export function ProgrammesPanel() {
  const [progModal, setProgModal] = useState(false);
  const [stdModal, setStdModal] = useState(null); // null | programmeId

  const { data: programmes = [], isLoading: progsLoading } = useProgrammes();
  const { data: standards = [], isLoading: stdsLoading } = useStandards();

  const isLoading = progsLoading || stdsLoading;

  return (
    <div className="space-y-6">
      {/* Programmes section */}
      <div
        className="rounded-2xl p-6"
        style={{ backgroundColor: T.surface, border: `1px solid ${T.border}` }}
      >
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: T.blueLight }}
            >
              <BookOpen className="h-4 w-4" style={{ color: T.blue }} />
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: T.ink }}>
                Programmes &amp; Standards
              </p>
              <p className="text-xs" style={{ color: T.muted }}>
                Programmes group standards. Each enrolment links to a standard.
              </p>
            </div>
          </div>
          <Button variant="black" size="sm" onClick={() => setProgModal(true)}>
            <Plus className="h-3.5 w-3.5 mr-1" />
            New programme
          </Button>
        </div>

        {isLoading ? (
          <p className="text-sm py-4" style={{ color: T.muted }}>
            Loading…
          </p>
        ) : programmes.length === 0 ? (
          <div
            className="rounded-xl px-4 py-6 text-center"
            style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
          >
            <p className="text-sm font-semibold mb-1" style={{ color: T.ink }}>
              No programmes yet
            </p>
            <p className="text-xs mb-3" style={{ color: T.muted }}>
              Create a programme first, then add apprenticeship standards to it.
            </p>
            <Button
              variant="black"
              size="sm"
              onClick={() => setProgModal(true)}
            >
              Create your first programme
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {programmes.map((p) => (
              <ProgrammeRow
                key={p.id}
                programme={p}
                standards={standards}
                onAddStandard={(programmeId) => setStdModal(programmeId)}
              />
            ))}
          </div>
        )}
      </div>

      <CreateProgrammeModal
        open={progModal}
        onClose={() => setProgModal(false)}
      />

      <CreateStandardModal
        open={!!stdModal}
        onClose={() => setStdModal(null)}
        programmes={programmes}
        defaultProgrammeId={stdModal}
      />
    </div>
  );
}
