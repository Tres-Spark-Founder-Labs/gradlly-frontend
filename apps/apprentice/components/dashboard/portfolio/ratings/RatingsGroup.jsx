import { RatingsRow } from "./RatingsRow";

function groupAvg(items, key) {
  const vals = items.map((i) => Number(i[key])).filter(Boolean);
  return vals.length
    ? (vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(1)
    : "—";
}

export function RatingsGroup({ label, items, onRate }) {
  const avgLast = groupAvg(items, "last");
  const avgToday = groupAvg(items, "today");

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-neutral-100 sticky top-0 bg-white z-10 pt-1">
        <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
          {label}{" "}
          <span className="text-neutral-400 font-normal normal-case">
            ({items.length} KSBs)
          </span>
        </p>
        <span className="text-xs text-neutral-400">
          avg {avgLast} →{" "}
          <strong className="text-neutral-700">{avgToday}</strong>
        </span>
      </div>
      <div>
        {items.map((item) => (
          <RatingsRow key={item.code} item={item} onRate={onRate} />
        ))}
      </div>
    </div>
  );
}
