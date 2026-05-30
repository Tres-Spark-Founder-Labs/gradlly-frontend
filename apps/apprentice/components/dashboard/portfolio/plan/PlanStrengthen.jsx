import { Bookmark, Link2, Plus } from "lucide-react";

const EV_COUNT = {
  K4: 0,
  K9: 1,
  K12: 1,
  S5: 0,
  S9: 0,
  S13: 1,
  S14: 0,
  S17: 1,
  B6: 0,
  B7: 1,
  B9: 0,
};

function IconBtn({ icon: Icon, title, colorCls }) {
  return (
    <button
      type="button"
      title={title}
      className={`p-1.5 rounded-lg text-neutral-400 transition-colors ${colorCls}`}
    >
      <Icon size={13} />
    </button>
  );
}

function StrengthenRow({ ksb }) {
  const count = EV_COUNT[ksb.code] ?? 0;
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-neutral-100 last:border-0 flex-wrap sm:flex-nowrap">
      <span className="px-2 py-0.5 bg-warning-100 text-warning-800 border border-warning-200 rounded text-xs font-bold shrink-0">
        {ksb.code}
      </span>
      <p className="text-xs text-neutral-600 flex-1 min-w-0 leading-snug">
        {ksb.label}
      </p>
      <span className="text-xs text-neutral-400 shrink-0 whitespace-nowrap">
        {count > 0 ? `${count} weak piece` : "No evidence"}
      </span>
      <div className="flex items-center gap-0.5 shrink-0">
        <IconBtn
          icon={Plus}
          title="Add evidence"
          colorCls="hover:text-primary-700 hover:bg-primary-50"
        />
        <IconBtn
          icon={Link2}
          title="Link OTJ session"
          colorCls="hover:text-info-700 hover:bg-info-50"
        />
        <IconBtn
          icon={Bookmark}
          title="Mark planned"
          colorCls="hover:text-success-700 hover:bg-success-50"
        />
      </div>
    </div>
  );
}

export function PlanStrengthen({ items }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-primary-300" />
        <h3 className="text-xs font-semibold text-neutral-700 uppercase tracking-wide">
          Strengthen — In progress{" "}
          <span className="text-neutral-400 font-normal normal-case">
            ({items.length})
          </span>
        </h3>
      </div>
      <div className="surface-card px-4 py-1">
        {items.map((ksb) => (
          <StrengthenRow key={ksb.code} ksb={ksb} />
        ))}
      </div>
    </div>
  );
}
