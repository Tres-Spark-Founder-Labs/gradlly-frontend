const INPUT_CLS =
  "w-full text-sm rounded-lg border border-neutral-200 px-3 py-2.5 text-neutral-800 " +
  "placeholder:text-neutral-400 bg-white focus:outline-none focus:ring-2 " +
  "focus:ring-primary-200 focus:border-primary-400 transition-colors resize-none";

export function RatingsReflection({ value, onChange }) {
  return (
    <div className="mt-2 mb-4 space-y-2 p-4 rounded-xl bg-neutral-50 border border-neutral-100">
      <div>
        <p className="text-xs font-semibold text-neutral-700">
          Anything you want your tutor to know before the next review?
        </p>
        <p className="text-xs text-neutral-400 mt-0.5 mb-2">
          Optional · surfaces in your 10 Apr review prep · Sarah Chen will see
          this.
        </p>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className={INPUT_CLS}
          placeholder="e.g. I've been struggling with deployment pipelines but made good progress this sprint…"
        />
      </div>
    </div>
  );
}
