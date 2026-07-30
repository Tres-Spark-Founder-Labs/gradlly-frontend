"use client";
import { X } from "lucide-react";
import { useState } from "react";

import { T } from "@/components/dashboard/levy/tokens";
import { useLevyTransfers } from "@/features/levy/queries/levy.query";

const fmt = (n) => `£${Number(n ?? 0).toLocaleString("en-GB")}`;
const STATUS_COLOR = {
  draft: T.muted,
  pending_signatures: T.amber,
  pending_esfa: T.blue,
  confirmed: T.green,
  active: T.green,
  failed: T.red,
};

export function HistoryDrawer({ onClose }) {
  const [status, setStatus] = useState("all");
  const { data, isLoading } = useLevyTransfers(
    status === "all" ? {} : { status },
  );
  const transfers = data?.transfers ?? [];

  const TABS = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "confirmed", label: "Confirmed" },
    { key: "failed", label: "Failed" },
  ];

  return (
    <>
      <div
        className="fixed inset-0 z-[230] bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="fixed right-0 top-0 h-full z-[240] flex flex-col overflow-hidden shadow-2xl"
        style={{
          width: 480,
          backgroundColor: T.surface,
          borderLeft: `1px solid ${T.border}`,
          animation: "slide-in-right 300ms cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        <div
          className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{ borderBottom: `1px solid ${T.border}` }}
        >
          <div>
            <p className="text-sm font-bold" style={{ color: T.ink }}>
              Transfer history
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: T.muted }}>
              All levy transfers where you are donor or recipient
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-neutral-100"
            style={{ color: T.muted }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div
          className="flex shrink-0 px-5"
          style={{ borderBottom: `1px solid ${T.border}` }}
        >
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setStatus(key)}
              className="px-4 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors duration-150"
              style={{
                color: status === key ? T.blue : T.muted,
                borderColor: status === key ? T.blue : "transparent",
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto">
          {isLoading && (
            <p className="px-5 py-6 text-xs" style={{ color: T.muted }}>
              Loading…
            </p>
          )}
          {!isLoading && transfers.length === 0 && (
            <p className="px-5 py-6 text-xs" style={{ color: T.muted }}>
              No transfers found.
            </p>
          )}
          {transfers.map((t) => {
            const sc = STATUS_COLOR[t.status] ?? T.muted;
            return (
              <div
                key={t.id}
                className="px-5 py-3.5"
                style={{ borderBottom: `1px solid ${T.border}` }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-bold" style={{ color: T.ink }}>
                      {fmt(t.amount)}
                    </p>
                    <p
                      className="text-[10px] font-mono mt-0.5"
                      style={{ color: T.muted }}
                    >
                      {t.id}
                    </p>
                  </div>
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0"
                    style={{ backgroundColor: `${sc}22`, color: sc }}
                  >
                    {t.status}
                  </span>
                </div>
                <p className="text-[11px] mt-1.5" style={{ color: T.muted }}>
                  Created {new Date(t.createdAt).toLocaleDateString("en-GB")}
                  {t.confirmedAt &&
                    ` · confirmed ${new Date(t.confirmedAt).toLocaleDateString("en-GB")}`}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
