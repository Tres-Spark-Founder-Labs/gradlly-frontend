import { cn } from "@/utils/helper";

const GROUPS = [
  { label: "Knowledge", prefix: "K", count: 12 },
  { label: "Skills", prefix: "S", count: 17 },
  { label: "Behaviours", prefix: "B", count: 9 },
];

const ALL_KSBS = GROUPS.flatMap(({ prefix, count }) =>
  Array.from({ length: count }, (_, i) => `${prefix}${i + 1}`),
);

function KsbChip({ code, selected, onToggle }) {
  return (
    <button
      type="button"
      onClick={() => onToggle(code)}
      className={cn(
        "px-2.5 py-1 rounded-full text-xs font-medium border transition-colors",
        selected
          ? "bg-primary-700 border-primary-700 text-white"
          : "bg-white border-neutral-200 text-neutral-600 hover:border-primary-300 hover:text-primary-700",
      )}
    >
      {code}
    </button>
  );
}

export function OTJLogStep2({ ksbs, onChange }) {
  const toggle = (k) =>
    onChange((p) => (p.includes(k) ? p.filter((x) => x !== k) : [...p, k]));

  return (
    <div className="space-y-5">
      <p className="text-xs text-neutral-500 leading-relaxed">
        Tap the KSBs this session develops. You can skip this — they can be
        added later.
      </p>

      {GROUPS.map(({ label, prefix }) => (
        <div key={prefix}>
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">
            {label}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {ALL_KSBS.filter((k) => k.startsWith(prefix)).map((k) => (
              <KsbChip
                key={k}
                code={k}
                selected={ksbs.includes(k)}
                onToggle={toggle}
              />
            ))}
          </div>
        </div>
      ))}

      {ksbs.length > 0 && (
        <p className="text-xs text-primary-700 font-medium pt-1">
          {ksbs.length} KSB{ksbs.length !== 1 ? "s" : ""} selected:{" "}
          {ksbs.join(", ")}
        </p>
      )}
    </div>
  );
}
