"use client";

import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";
import { useMemo, useState } from "react";

import { cn } from "@/utils/helper";

import { EmptyState } from "./EmptyState";
import { Pagination } from "./Pagination";

/**
 * DataTable
 *
 * Reusable, fully responsive, config-driven table.
 * Renders a real <table> on md+ screens and a stacked card list on mobile,
 * so it never needs horizontal scrolling on small devices.
 *
 * Client-side sorting: any column with `sortable: true` becomes a clickable
 * header that cycles ascending → descending. Provide `sortValue(row)` to control
 * the comparison value (defaults to the row's value at `col.key`).
 *
 * Column shape:
 *   {
 *     key:       string,                 // unique id
 *     header:    string,                 // column heading
 *     cell:      (row) => ReactNode,     // cell renderer
 *     align?:    "left" | "right" | "center",
 *     sortable?: boolean,                // enable client-side sorting on this column
 *     sortValue?: (row) => string|number|Date, // value used for comparison
 *     headerClassName?: string,
 *     cellClassName?:   string,
 *     hideOnMobile?:    boolean,         // omit from the mobile card
 *     mobileLabel?:     string,          // label shown on the mobile card row
 *     primary?:         boolean,         // render prominently at top of mobile card
 *   }
 *
 * @param {object}   props
 * @param {Array}    props.columns
 * @param {Array}    props.data
 * @param {Function} [props.rowKey]         (row) => string | number  (defaults to row.id)
 * @param {boolean}  [props.isLoading]
 * @param {number}   [props.skeletonRows]
 * @param {object}   [props.empty]          { icon, title, description, action }
 * @param {object}   [props.meta]           API meta for pagination
 * @param {Function} [props.onPageChange]
 * @param {Function} [props.onPerPageChange] enables the rows-per-page selector
 * @param {Function} [props.onRowClick]      (row) => void — makes the whole row
 *   (and its mobile card) open details, matching the apprentice roster table.
 *   Clicks on a button/link/input/label inside a cell are left alone rather
 *   than also triggering navigation.
 * @param {string}   [props.className]
 */
export function DataTable({
  columns = [],
  data = [],
  rowKey = (row) => row.id,
  isLoading = false,
  skeletonRows = 5,
  empty,
  meta,
  onPageChange,
  onPerPageChange,
  onRowClick,
  className,
}) {
  // A click that started on an interactive element inside a cell (the
  // "Resend"/"Revoke" buttons, a nested Link, a checkbox) should do only
  // that thing, not also navigate the row. Checking at the row level means
  // column authors never have to remember stopPropagation in their `cell`
  // renderers.
  const handleRowActivate = (row) => (e) => {
    if (!onRowClick) return;
    if (e.target.closest("button, a, input, select, textarea, label")) return;
    onRowClick(row);
  };
  // ── Sort state ──────────────────────────────────────────────────────────────
  // { key, direction: "asc" | "desc" } | null
  const [sort, setSort] = useState(null);

  const toggleSort = (col) => {
    if (!col.sortable) return;
    setSort((prev) => {
      if (!prev || prev.key !== col.key)
        return { key: col.key, direction: "asc" };
      if (prev.direction === "asc") return { key: col.key, direction: "desc" };
      return null; // third click clears sorting
    });
  };

  const sortedData = useMemo(() => {
    if (!sort) return data;
    const col = columns.find((c) => c.key === sort.key);
    if (!col) return data;
    const accessor = col.sortValue ?? ((row) => row?.[col.key]);
    const dir = sort.direction === "asc" ? 1 : -1;

    // Stable sort: decorate with original index as a tiebreaker.
    return data
      .map((row, index) => ({ row, index }))
      .sort((a, b) => {
        const av = accessor(a.row);
        const bv = accessor(b.row);
        const cmp = compareValues(av, bv);
        return cmp !== 0 ? cmp * dir : a.index - b.index;
      })
      .map((d) => d.row);
  }, [data, sort, columns]);

  const alignClass = {
    left: "text-left",
    right: "text-right",
    center: "text-center",
  };

  const mobileColumns = columns.filter((c) => !c.hideOnMobile);
  const primaryCol = mobileColumns.find((c) => c.primary) ?? mobileColumns[0];
  const secondaryCols = mobileColumns.filter((c) => c !== primaryCol);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        {isLoading ? (
          <SkeletonBody columns={columns} rows={skeletonRows} />
        ) : data.length === 0 ? (
          <EmptyBody empty={empty} />
        ) : (
          <>
            {/* ── Desktop table ── */}
            <div className="hidden md:block">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50">
                    {columns.map((col) => {
                      const active = sort?.key === col.key;
                      const headingBase = cn(
                        "px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-neutral-500",
                        alignClass[col.align ?? "left"],
                        col.headerClassName,
                      );
                      if (!col.sortable) {
                        return (
                          <th key={col.key} scope="col" className={headingBase}>
                            {col.header}
                          </th>
                        );
                      }
                      return (
                        <th key={col.key} scope="col" className={headingBase}>
                          <button
                            type="button"
                            onClick={() => toggleSort(col)}
                            aria-label={`Sort by ${col.header}`}
                            className={cn(
                              "group inline-flex items-center gap-1.5 rounded transition-colors hover:text-neutral-800",
                              col.align === "right" && "flex-row-reverse",
                              active && "text-neutral-800",
                            )}
                          >
                            <span>{col.header}</span>
                            <SortIcon
                              active={active}
                              direction={sort?.direction}
                            />
                          </button>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {sortedData.map((row) => (
                    <tr
                      key={rowKey(row)}
                      onClick={handleRowActivate(row)}
                      className={cn(
                        "border-b border-neutral-100 transition-colors duration-100 last:border-0 hover:bg-neutral-50/70",
                        onRowClick && "cursor-pointer",
                      )}
                    >
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className={cn(
                            "px-5 py-4 text-neutral-600",
                            alignClass[col.align ?? "left"],
                            col.cellClassName,
                          )}
                        >
                          {col.cell(row)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Mobile cards ── */}
            <ul className="divide-y divide-neutral-100 md:hidden">
              {sortedData.map((row) => (
                <li
                  key={rowKey(row)}
                  onClick={handleRowActivate(row)}
                  className={cn(
                    "space-y-3 p-4",
                    onRowClick && "cursor-pointer",
                  )}
                >
                  {primaryCol ? (
                    <div className="min-w-0">{primaryCol.cell(row)}</div>
                  ) : null}
                  <dl className="space-y-2 border-t border-neutral-100 pt-3">
                    {secondaryCols.map((col) => (
                      <div
                        key={col.key}
                        className="flex items-center justify-between gap-3"
                      >
                        <dt className="text-xs font-medium text-neutral-400">
                          {col.mobileLabel ?? col.header}
                        </dt>
                        <dd className="min-w-0 text-right text-sm text-neutral-700">
                          {col.cell(row)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {!isLoading && meta ? (
        <Pagination
          meta={meta}
          onPageChange={onPageChange}
          onPerPageChange={onPerPageChange}
        />
      ) : null}
    </div>
  );
}

// ─── Sort helpers ─────────────────────────────────────────────────────────────

function isNullish(v) {
  return v === null || v === undefined;
}

function compareValues(a, b) {
  // Nullish values sort last.
  const aNull = isNullish(a);
  const bNull = isNullish(b);
  if (aNull && bNull) return 0;
  if (aNull) return 1;
  if (bNull) return -1;

  // Dates → timestamps.
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();

  if (typeof a === "number" && typeof b === "number") return a - b;

  return String(a).localeCompare(String(b), undefined, {
    sensitivity: "base",
    numeric: true,
  });
}

function SortIcon({ active, direction }) {
  if (!active) {
    return (
      <ChevronsUpDown
        className="size-3.5 text-neutral-300 transition-colors group-hover:text-neutral-400"
        aria-hidden
      />
    );
  }
  return direction === "asc" ? (
    <ChevronUp className="size-3.5 text-primary-600" aria-hidden />
  ) : (
    <ChevronDown className="size-3.5 text-primary-600" aria-hidden />
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonBody({ columns, rows }) {
  return (
    <div className="divide-y divide-neutral-100">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center gap-4 px-5 py-4">
          {columns.map((col, c) => (
            <div
              key={col.key}
              className="h-4 animate-pulse rounded-md bg-neutral-100"
              style={{ width: c === 0 ? "30%" : "16%" }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyBody({ empty }) {
  return (
    <EmptyState
      icon={empty?.icon}
      title={empty?.title ?? "Nothing here yet"}
      description={empty?.description}
      action={empty?.action}
    />
  );
}
