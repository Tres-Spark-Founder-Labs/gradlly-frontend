"use client";

import { Bell, Download, Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { T } from "@/components/dashboard/levy/tokens";
import { SectionBoundary } from "@/components/ui/SectionBoundary";
import { useCommitmentBoard } from "@/features/commitments/queries/commitments.query";
import {
  cleanBoardFilters,
  deriveBoardFilterOptions,
} from "@/features/commitments/utils/board";

import { CommitmentBoardFilters } from "./CommitmentBoardFilters";
import { CommitmentBoardTable } from "./CommitmentBoardTable";
import { DocumentPanel } from "./DocumentPanel";
import { DraftDrawer } from "./DraftDrawer";
import { SigningAlert } from "./SigningAlert";
import { SignNowModal } from "./SignNowModal";

// ─── Dashboard ────────────────────────────────────────────────────────────────

export function CommitmentsDashboard() {
  const [modal, setModal] = useState(null); // { type: 'sign', statement } | null
  const [drawer, setDrawer] = useState(false);
  const [panel, setPanel] = useState(null);
  const [filters, setFilters] = useState({});

  /**
   * F1.3.1 — reads the board endpoint.
   *
   * This previously called `useCommitmentStatements`, which hits the list
   * endpoint scoped to the statement's owning organisation. Commitment
   * statements are drafted by the provider, so that returned nothing for an
   * employer: the screen rendered an empty table and looked like an employer
   * with no commitments rather than a query that could never match.
   *
   * It then filtered on a `pending_employer` status that no endpoint emits,
   * so the "awaiting your signature" alert could never appear either.
   */
  const { data, isLoading } = useCommitmentBoard(cleanBoardFilters(filters));

  /**
   * Memoised because `data?.rows ?? []` builds a fresh array on every render
   * when the query has not resolved, which would make the `useMemo` below
   * recompute every time and defeat the point of it.
   */
  const rows = useMemo(() => data?.rows ?? [], [data]);
  const actionRequiredCount = data?.actionRequiredCount ?? 0;

  // Options come from the rows themselves, so the dropdowns can only offer
  // values that exist in the data (AC4).
  const options = useMemo(() => deriveBoardFilterOptions(rows), [rows]);

  // AC3 — the first row the employer can actually sign drives the banner.
  const pendingSignature = rows.find((r) => r.actionRequired) ?? null;

  return (
    <div
      className="space-y-5"
      style={{ animation: "slide-up 320ms var(--ease-out) both" }}
    >
      {/* Top bar */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs" style={{ color: T.muted }}>
            Commitments
          </p>
          <h1 className="text-xl font-extrabold" style={{ color: T.ink }}>
            Commitment statements
          </h1>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border hover:opacity-75 transition-opacity"
            style={{ borderColor: T.border, color: T.subtle }}
          >
            <Download className="h-3.5 w-3.5" /> Download all
          </button>
          <button
            type="button"
            onClick={() => setDrawer(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold hover:opacity-80 transition-opacity"
            style={{ backgroundColor: T.blue, color: "#fff" }}
          >
            <Plus className="h-3.5 w-3.5" /> New statement
          </button>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-xl border hover:opacity-75 transition-opacity"
            style={{ borderColor: T.border, color: T.subtle }}
          >
            <Bell className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/*
        The banner is a shortcut to a row that also appears in the table below,
        so if it ever fails to render the board is still complete and still
        usable. Before this, a throw here reached app/error.jsx and replaced the
        whole route — every employer with a statement awaiting signature lost
        the entire commitment board, which is the one group the screen exists
        for. The failure is now confined to the shortcut.
      */}
      <SectionBoundary name="SigningAlert">
        {pendingSignature && (
          <SigningAlert
            statement={pendingSignature}
            onSignNow={() =>
              setModal({ type: "sign", statement: pendingSignature })
            }
            onViewDoc={() => setPanel(pendingSignature)}
          />
        )}
      </SectionBoundary>

      <div className="space-y-3">
        {/* AC4 */}
        <CommitmentBoardFilters
          filters={filters}
          onChange={setFilters}
          options={options}
          actionRequiredCount={actionRequiredCount}
        />
        {/* AC1, AC2, AC3 */}
        <CommitmentBoardTable
          rows={rows}
          isLoading={isLoading}
          onSign={(row) => setModal({ type: "sign", statement: row })}
          onView={setPanel}
        />
      </div>

      <SignNowModal
        open={modal?.type === "sign"}
        statement={modal?.statement ?? null}
        onClose={() => setModal(null)}
      />
      {drawer && <DraftDrawer onClose={() => setDrawer(false)} />}
      {panel && (
        <DocumentPanel statement={panel} onClose={() => setPanel(null)} />
      )}
    </div>
  );
}
