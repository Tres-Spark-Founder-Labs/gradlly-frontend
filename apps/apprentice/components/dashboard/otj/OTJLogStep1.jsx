const CATEGORIES = [
  "Self-study/research",
  "Workshop/training course",
  "Shadowing/mentoring",
  "Project work (new skills)",
  "Portfolio/EPA prep",
  "Industry event",
];

const INPUT =
  "w-full text-sm rounded-lg border border-neutral-200 px-3 py-2.5 text-neutral-800 " +
  "placeholder:text-neutral-400 bg-white focus:outline-none focus:ring-2 " +
  "focus:ring-primary-200 focus:border-primary-400 transition-colors";

export function OTJLogStep1({ form, onChange }) {
  const set = (k) => (e) => onChange((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-medium text-neutral-600 block mb-1.5">
          What did you do? <span className="text-danger-500">*</span>
        </label>
        <input
          type="text"
          value={form.title}
          onChange={set("title")}
          className={INPUT}
          placeholder="e.g. Completed unit testing module on Udemy"
          autoFocus
        />
      </div>

      <div>
        <label className="text-xs font-medium text-neutral-600 block mb-1.5">
          Category <span className="text-danger-500">*</span>
        </label>
        <select
          value={form.category}
          onChange={set("category")}
          className={INPUT}
        >
          <option value="">Select a category</option>
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-neutral-600 block mb-1.5">
            Date <span className="text-danger-500">*</span>
          </label>
          <input
            type="date"
            value={form.date}
            onChange={set("date")}
            className={INPUT}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-neutral-600 block mb-1.5">
            Hours <span className="text-danger-500">*</span>
          </label>
          <input
            type="number"
            min="0.5"
            max="24"
            step="0.5"
            value={form.hours}
            onChange={set("hours")}
            className={INPUT}
            placeholder="0.0"
          />
        </div>
      </div>
    </div>
  );
}
