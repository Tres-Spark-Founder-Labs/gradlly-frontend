"use client";

import { Upload, X } from "lucide-react";
import { useRef, useState } from "react";

import { cn } from "@/utils/helper";

const TYPES = [
  { value: "code", label: "Code / repository" },
  { value: "document", label: "Document" },
  { value: "screenshot", label: "Screenshot or image" },
  { value: "presentation", label: "Presentation / demo" },
  { value: "reflection", label: "Reflective account" },
  { value: "testimony", label: "Witness testimony" },
  { value: "video", label: "Video" },
  { value: "link", label: "Link / URL" },
];

const OTJ = [
  { value: "s1", label: "REST API pagination research — 18 Mar · 3.5h" },
  { value: "s2", label: "Agile sprint planning & retro — 12 Mar · 4h" },
  { value: "s3", label: "Unit testing & TDD module — 6 Mar · 2.5h" },
];

const INPUT =
  "w-full text-sm rounded-lg border border-neutral-200 px-3 py-2.5 text-neutral-800 placeholder:text-neutral-400 bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-colors";

export function AddEvidenceStep1({ form, onChange }) {
  const [files, setFiles] = useState(form.files ?? []);
  const fileRef = useRef(null);
  const set = (k) => (e) => onChange((p) => ({ ...p, [k]: e.target.value }));

  function pickFiles(e) {
    const added = Array.from(e.target.files).map((f) => ({
      name: f.name,
      size: (f.size / 1024 / 1024).toFixed(2),
    }));
    const next = [...files, ...added];
    setFiles(next);
    onChange((p) => ({ ...p, files: next }));
  }

  function removeFile(i) {
    const next = files.filter((_, idx) => idx !== i);
    setFiles(next);
    onChange((p) => ({ ...p, files: next }));
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-medium text-neutral-600 block mb-1.5">
          Title <span className="text-danger-500">*</span>
        </label>
        <input
          type="text"
          value={form.title}
          onChange={set("title")}
          className={INPUT}
          placeholder="e.g. Inventory API — pagination & error handling"
          autoFocus
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-neutral-600 block mb-1.5">
            Evidence type <span className="text-danger-500">*</span>
          </label>
          <select value={form.type} onChange={set("type")} className={INPUT}>
            <option value="">Select type</option>
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-neutral-600 block mb-1.5">
            Date of activity <span className="text-danger-500">*</span>
          </label>
          <input
            type="date"
            value={form.date}
            onChange={set("date")}
            className={INPUT}
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-neutral-600 block mb-1.5">
          Description / what you did
        </label>
        <textarea
          value={form.description}
          onChange={set("description")}
          rows={3}
          className={cn(INPUT, "resize-none")}
          placeholder="Describe the task, your role, the decisions you made, and the outcome."
        />
      </div>

      <div>
        <label className="text-xs font-medium text-neutral-600 block mb-1.5">
          Upload files
        </label>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-full border-2 border-dashed border-neutral-200 rounded-xl p-5 text-center hover:border-primary-300 hover:bg-primary-50/20 transition-colors"
        >
          <Upload size={18} className="text-neutral-400 mx-auto mb-1.5" />
          <p className="text-xs font-medium text-neutral-600">
            Drag & drop or click to browse
          </p>
          <p className="text-xs text-neutral-400 mt-0.5">
            Images · PDFs · Code · Max 50MB per file
          </p>
        </button>
        <input ref={fileRef} type="file" multiple hidden onChange={pickFiles} />
        {files.map((f, i) => (
          <div
            key={i}
            className="flex items-center justify-between px-3 py-1.5 mt-1.5 bg-neutral-50 rounded-lg border border-neutral-100"
          >
            <span className="text-xs text-neutral-700 truncate">{f.name}</span>
            <div className="flex items-center gap-2 shrink-0 ml-2">
              <span className="text-xs text-neutral-400">{f.size} MB</span>
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="text-neutral-400 hover:text-danger-500 transition-colors"
              >
                <X size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div>
        <label className="text-xs font-medium text-neutral-600 block mb-1.5">
          Linked OTJ session{" "}
          <span className="text-neutral-400">(optional)</span>
        </label>
        <select
          value={form.otjSession}
          onChange={set("otjSession")}
          className={INPUT}
        >
          <option value="">Attach an existing OTJ log entry...</option>
          {OTJ.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
