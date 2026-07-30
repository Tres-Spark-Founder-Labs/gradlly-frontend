"use client";
import { X } from "lucide-react";

import { T } from "@/components/dashboard/levy/tokens";
import { useLevySurplus } from "@/features/levy/queries/levy.query";

const fmt = (n) => `£${Number(n ?? 0).toLocaleString("en-GB")}`;

export function PolicyAlert({ onViewESFA, onDismiss }) {
  const { data: surplus } = useLevySurplus();

  return (
    <div
      className="rounded-2xl p-4 flex items-start gap-3"
      style={{
        backgroundColor: T.greenLight,
        border: `1px solid ${T.green}33`,
        borderLeft: `3px solid ${T.green}`,
      }}
    >
      <div
        className="flex h-7 w-7 items-center justify-center rounded-full shrink-0 mt-0.5 text-xs font-bold"
        style={{ backgroundColor: T.green, color: "#fff" }}
      >
        ✓
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold" style={{ color: T.green }}>
          Transfer capacity: 50% from April 2025
        </p>
        <p className="text-xs mt-1 leading-relaxed" style={{ color: T.ink }}>
          Levy-paying employers can transfer up to 50% of their annual levy
          contribution to SMEs in their supply chain.
          {surplus &&
            ` You have ${fmt(surplus.availableSurplus)} still available to transfer.`}
        </p>
        <div className="flex items-center gap-3 mt-2 flex-wrap">
          <button
            type="button"
            onClick={onViewESFA}
            className="text-xs font-semibold hover:underline"
            style={{ color: T.green }}
          >
            View ESFA guidance →
          </button>
        </div>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-green-100 shrink-0 transition-colors"
        style={{ color: T.green }}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
