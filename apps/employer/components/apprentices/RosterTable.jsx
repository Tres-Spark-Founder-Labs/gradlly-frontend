"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import { RosterRow } from "./RosterRow";
import { T } from "./tokens";

/**
 * `sortable` previously only drew an icon — no handler was ever passed, so the
 * affordance was decorative. It now sorts, and the icon reflects the active
 * column and direction.
 */
const TH = ({ children, sortKey, sticky, sort, onSort }) => {
  const sortable = Boolean(sortKey);
  const active = sortable && sort?.sortBy === sortKey;
  const Icon = !active
    ? ArrowUpDown
    : sort.sortOrder === "asc"
      ? ArrowUp
      : ArrowDown;

  return (
    <th
      className={`px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider select-none whitespace-nowrap${sticky ? " bg-[#faf9f7]" : ""}`}
      style={{
        color: active ? T.ink : T.muted,
        cursor: sortable ? "pointer" : "default",
        ...(sticky
          ? {
              position: "sticky",
              left: 0,
              zIndex: 2,
              backgroundColor: T.card,
              boxShadow: "2px 0 4px rgba(0,0,0,0.06)",
            }
          : {}),
      }}
      onClick={sortable ? () => onSort?.(sortKey) : undefined}
      aria-sort={
        active
          ? sort.sortOrder === "asc"
            ? "ascending"
            : "descending"
          : undefined
      }
    >
      {sortable ? (
        <button
          type="button"
          className="flex items-center gap-1 uppercase tracking-wider font-bold text-[10px]"
          style={{ color: "inherit" }}
        >
          {children}
          <Icon className={`h-3 w-3 ${active ? "opacity-90" : "opacity-40"}`} />
        </button>
      ) : (
        <span className="flex items-center gap-1">{children}</span>
      )}
    </th>
  );
};

export function RosterTable({
  apprentices,
  filter,
  onView,
  onContact,
  sort,
  onSort,
}) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: T.surface, border: `1px solid ${T.border}` }}
    >
      <div className="overflow-x-auto">
        <table className="w-full" style={{ minWidth: 700 }}>
          <thead
            style={{
              backgroundColor: T.card,
              borderBottom: `1px solid ${T.border}`,
            }}
          >
            <tr>
              <th
                className="px-4 py-3 w-10"
                style={{
                  position: "sticky",
                  left: 0,
                  zIndex: 2,
                  backgroundColor: T.card,
                }}
              >
                <input
                  type="checkbox"
                  className="rounded"
                  style={{ accentColor: T.blue }}
                />
              </th>
              {/* Standard and Provider are now sortable too: they carry real
                  values since the mapper stopped discarding them. */}
              <TH sticky sortKey="name" sort={sort} onSort={onSort}>
                Apprentice
              </TH>
              <TH sortKey="standard" sort={sort} onSort={onSort}>
                Standard
              </TH>
              <TH sortKey="provider" sort={sort} onSort={onSort}>
                Provider
              </TH>
              <TH sortKey="otjActual" sort={sort} onSort={onSort}>
                OTJ progress
              </TH>
              <TH sortKey="epaDate" sort={sort} onSort={onSort}>
                EPA date
              </TH>
              <TH sortKey="attendance" sort={sort} onSort={onSort}>
                Attendance
              </TH>
              <TH sortKey="lastActivity" sort={sort} onSort={onSort}>
                Last activity
              </TH>
              <TH sortKey="status" sort={sort} onSort={onSort}>
                Status
              </TH>
              <th
                className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider"
                style={{ color: T.muted }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {apprentices.length === 0 ? (
              <tr>
                <td
                  colSpan={10}
                  className="px-4 py-10 text-center text-sm"
                  style={{ color: T.muted }}
                >
                  No apprentices match the current filter.
                </td>
              </tr>
            ) : (
              apprentices.map((a, i) => (
                <RosterRow
                  key={a.id}
                  a={a}
                  index={i}
                  onView={onView}
                  onContact={onContact}
                  isFiltered={
                    filter &&
                    filter !== "all" &&
                    a.status !== filter &&
                    !(filter === "epa_imminent" && a.epaDaysLeft < 90)
                  }
                />
              ))
            )}
          </tbody>
          <tfoot>
            <tr
              style={{
                backgroundColor: T.card,
                borderTop: `1px solid ${T.border}`,
              }}
            >
              <td
                colSpan={10}
                className="px-5 py-3 text-xs"
                style={{ color: T.muted }}
              >
                {apprentices.length} apprentices · Total committed:{" "}
                <strong style={{ color: T.ink }}>
                  £
                  {apprentices
                    .reduce((s, a) => s + a.levyCost, 0)
                    .toLocaleString("en-GB")}
                </strong>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
