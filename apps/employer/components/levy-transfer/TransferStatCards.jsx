"use client";

import { T } from "@/components/dashboard/levy/tokens";
import { useLevySurplus } from "@/features/levy/queries/levy.query";

const fmt = (n) => `£${Number(n ?? 0).toLocaleString("en-GB")}`;

function StatCard({ value, label, sub, accent, onClick }) {
  return (
    <div
      className="rounded-2xl p-5 transition-shadow hover:shadow-md"
      style={{
        backgroundColor: T.surface,
        border: `1px solid ${T.border}`,
        borderLeft: `3px solid ${accent}`,
        cursor: onClick ? "pointer" : "default",
      }}
      onClick={onClick}
    >
      <p
        className="text-[28px] font-extrabold tabular-nums leading-none"
        style={{ color: T.ink }}
      >
        {value}
      </p>
      <p className="text-xs font-semibold mt-1" style={{ color: T.ink }}>
        {label}
      </p>
      <p className="text-[11px] mt-0.5" style={{ color: T.muted }}>
        {sub}
      </p>
    </div>
  );
}

export function TransferStatCards({ onScrollToFinder }) {
  const { data: surplus, isLoading } = useLevySurplus();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="rounded-2xl p-5 h-24 animate-pulse"
            style={{ backgroundColor: T.card }}
          />
        ))}
      </div>
    );
  }

  if (!surplus) {
    return (
      <div
        className="rounded-2xl p-5 text-xs"
        style={{ backgroundColor: T.card, color: T.muted }}
      >
        Link a DAS donor account to see your transferable surplus here.
      </div>
    );
  }

  const usedPct = surplus.maxTransferable
    ? Math.round((surplus.alreadyTransferred / surplus.maxTransferable) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatCard
        value={fmt(surplus.maxTransferable)}
        label="Transfer allowance"
        sub={`50% cap · balance ${fmt(surplus.totalBalance)}`}
        accent={T.ink}
      />
      <StatCard
        value={fmt(surplus.alreadyTransferred)}
        label="Already transferred"
        sub={`${usedPct}% of allowance used`}
        accent={T.green}
      />
      <StatCard
        value={fmt(surplus.availableSurplus)}
        label="Remaining to transfer"
        sub="Available to SME partners"
        accent={T.amber}
        onClick={onScrollToFinder}
      />
    </div>
  );
}
