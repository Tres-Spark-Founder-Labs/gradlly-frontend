"use client";

import { T } from "@/components/dashboard/levy/tokens";
import {
  partyStatusMeta,
  statementStatusLabel,
} from "@/features/commitments/utils/board";

/** F1.3.1 AC2 — one pill per party, coloured by state. */
function PartyPill({ status }) {
  const { label, color, bg } = partyStatusMeta(status);
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap"
      style={{ backgroundColor: bg, color }}
    >
      {label}
    </span>
  );
}

const TH = ({ children, align = "left" }) => (
  <th
    className={`px-4 py-3 text-${align} text-[10px] font-bold uppercase tracking-wider whitespace-nowrap`}
    style={{ color: T.muted }}
  >
    {children}
  </th>
);

export function CommitmentBoardTable({ rows = [], onSign, onView, isLoading }) {
  if (isLoading) {
    return (
      <div
        className="rounded-2xl p-10 text-center text-sm"
        style={{
          backgroundColor: T.surface,
          border: `1px solid ${T.border}`,
          color: T.muted,
        }}
      >
        Loading commitment statements…
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: T.surface, border: `1px solid ${T.border}` }}
    >
      <div className="overflow-x-auto">
        <table className="w-full" style={{ minWidth: 900 }}>
          <thead
            style={{
              backgroundColor: T.card,
              borderBottom: `1px solid ${T.border}`,
            }}
          >
            {/* AC1 — name, provider, version, then one column per party. */}
            <tr>
              <TH>Apprentice</TH>
              <TH>Provider</TH>
              <TH>Version</TH>
              <TH>Employer</TH>
              <TH>Apprentice</TH>
              <TH>Provider</TH>
              <TH>Statement</TH>
              <TH align="right">Actions</TH>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-10 text-center text-sm"
                  style={{ color: T.muted }}
                >
                  No commitment statements match the current filters.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.statementId}
                  /* AC3 — "highlighted". A left accent plus a tinted row, so
                     it reads at a glance without relying on colour alone: the
                     Sign button only appears on these rows. */
                  style={{
                    borderLeft: `3px solid ${row.actionRequired ? T.blue : "transparent"}`,
                    backgroundColor: row.actionRequired
                      ? T.blueLight
                      : "transparent",
                    borderBottom: `1px solid ${T.border}`,
                  }}
                >
                  <td className="px-4 py-3">
                    <p
                      className="text-sm font-semibold whitespace-nowrap"
                      style={{ color: T.ink }}
                    >
                      {row.apprenticeName ?? "—"}
                    </p>
                    {row.standardName && (
                      <p className="text-[11px]" style={{ color: T.muted }}>
                        {row.standardName}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs" style={{ color: T.subtle }}>
                      {row.providerName ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-xs tabular-nums font-semibold"
                      style={{ color: T.ink }}
                    >
                      v{row.version}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <PartyPill status={row.employerStatus} />
                  </td>
                  <td className="px-4 py-3">
                    <PartyPill status={row.apprenticeStatus} />
                  </td>
                  <td className="px-4 py-3">
                    <PartyPill status={row.providerStatus} />
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs" style={{ color: T.subtle }}>
                      {statementStatusLabel(row.statementStatus)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onView?.(row)}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold hover:opacity-80 transition-opacity"
                        style={{ backgroundColor: "#f5f4f2", color: T.subtle }}
                      >
                        View
                      </button>
                      {/* Only rendered when the employer can actually sign
                          now — the API rejects an out-of-turn signature, so
                          offering the button otherwise would be a control
                          that fails when pressed. */}
                      {row.actionRequired && (
                        <button
                          type="button"
                          onClick={() => onSign?.(row)}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold hover:opacity-80 transition-opacity"
                          style={{ backgroundColor: T.blue, color: "#fff" }}
                        >
                          Sign
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
