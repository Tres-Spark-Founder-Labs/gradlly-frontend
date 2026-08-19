"use client";

import { ArrowRight, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { fmt } from "./helpers";
import { T } from "./tokens";

export function TransferCard({ levy, transfers = [] }) {
  const [open, setOpen] = useState(false);
  const transferred = levy?.transferred ?? 0;

  return (
    <div
      onClick={() => setOpen((v) => !v)}
      role="button"
      tabIndex={0}
      className="h-full flex flex-col rounded-2xl overflow-hidden cursor-pointer transition-shadow hover:shadow-md"
      style={{
        backgroundColor: T.surface,
        border: `1px solid ${T.border}`,
        borderLeft: `3px solid ${T.green}`,
      }}
    >
      <div className="flex-1 p-5">
        <div className="flex items-start justify-between mb-4">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{ backgroundColor: T.greenLight }}
          >
            <ArrowRight className="h-4 w-4" style={{ color: T.green }} />
          </div>
          <span
            className="text-[10px] font-semibold uppercase tracking-wider"
            style={{ color: T.muted }}
          >
            {transfers.length > 0 ? `${transfers.length} active` : "—"}
          </span>
        </div>
        <p
          className="text-[26px] font-extrabold tabular-nums leading-none"
          style={{ color: T.green }}
        >
          {fmt(transferred)}
        </p>
        <p className="mt-1.5 text-xs font-semibold" style={{ color: T.muted }}>
          Transferred to SMEs
        </p>
        <p className="mt-2 text-xs" style={{ color: T.subtle }}>
          {transfers.length} active transfer{transfers.length !== 1 ? "s" : ""}{" "}
          this year
        </p>
      </div>
      <div
        className="overflow-hidden transition-all duration-500"
        style={{ maxHeight: open ? "150px" : "0" }}
      >
        <div
          className="px-5 pb-4 pt-3 space-y-2.5"
          style={{ borderTop: `1px solid ${T.border}` }}
        >
          {transfers.length === 0 ? (
            <p className="text-xs" style={{ color: T.muted }}>
              No active transfers
            </p>
          ) : (
            transfers.slice(0, 3).map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between gap-2"
              >
                <span
                  className="text-xs font-medium truncate"
                  style={{ color: T.ink }}
                >
                  {t.recipientOrgName ??
                    t.org ??
                    t.recipientName ??
                    "SME partner"}
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    className="text-xs font-bold tabular-nums"
                    style={{ color: T.green }}
                  >
                    {fmt(t.amount ?? 0)}
                  </span>
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                    style={{ backgroundColor: T.greenLight, color: T.green }}
                  >
                    {t.status ?? t.stage ?? "Active"}
                  </span>
                </div>
              </div>
            ))
          )}
          <Link
            href="/levy-transfer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-xs font-semibold hover:underline"
            style={{ color: T.blue }}
          >
            <PlusCircle className="h-3 w-3" /> New transfer
          </Link>
        </div>
      </div>
    </div>
  );
}
