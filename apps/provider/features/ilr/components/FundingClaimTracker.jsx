"use client";

import { Scale } from "lucide-react";
import { useState } from "react";

import { CheckboxField } from "@/components/form/CheckboxField";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Pagination } from "@/components/ui/Pagination";
import { useRoleAccess } from "@/features/auth/hooks/useRoleAccess";

import { FundingClaimResolutionModal } from "./FundingClaimResolutionModal";
import {
  FUNDING_DISCREPANCY,
  FUNDING_DISCREPANCY_CLASSES,
  FUNDING_DISCREPANCY_LABELS,
  FUNDING_RESOLUTION_LABELS,
} from "../constants";
import { useFundingClaims } from "../queries/ilr.query";

const money = (value) =>
  typeof value === "number"
    ? `£${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : "—";

/**
 * F2.3.2 AC7 — "funding claim tracker shows: claimed amount, received amount,
 * any discrepancies, and resolution status".
 *
 * Claimed and received come from the enrolment's agreed price and the payments
 * the DAS sync pulled in; both are computed server-side on every read, so this
 * table never shows a cached number that has drifted from the payments below it
 * on the same page.
 */
function ClaimRow({ claim, canResolve, onResolve }) {
  const discrepancy = claim.discrepancy ?? FUNDING_DISCREPANCY.NONE;
  const isIssue = discrepancy !== FUNDING_DISCREPANCY.NONE;

  return (
    <li className="py-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-neutral-800">
            {claim.apprenticeName || "Unnamed learner"}
          </p>
          <p className="truncate text-xs text-neutral-400">
            {claim.standardTitle ?? "—"} · {claim.paymentCount} payment
            {claim.paymentCount === 1 ? "" : "s"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-neutral-400">Claimed</p>
            <p className="tabular-nums text-sm text-neutral-700">
              {money(claim.claimedAmount)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-neutral-400">Received</p>
            <p className="tabular-nums text-sm text-neutral-700">
              {money(claim.receivedAmount)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-neutral-400">Variance</p>
            {/*
             * Signed, and coloured only when it is a problem. An active
             * learner mid-programme has a large negative variance by design,
             * and painting that red would train people to ignore the colour.
             */}
            <p
              className={`tabular-nums text-sm ${
                isIssue ? "font-semibold text-rose-700" : "text-neutral-500"
              }`}
            >
              {claim.varianceAmount > 0 ? "+" : ""}
              {money(claim.varianceAmount)}
            </p>
          </div>

          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
              FUNDING_DISCREPANCY_CLASSES[discrepancy] ??
              FUNDING_DISCREPANCY_CLASSES.none
            }`}
          >
            {FUNDING_DISCREPANCY_LABELS[discrepancy] ?? discrepancy}
          </span>

          {claim.resolutionStatus ? (
            <span className="text-xs text-neutral-500">
              {FUNDING_RESOLUTION_LABELS[claim.resolutionStatus] ??
                claim.resolutionStatus}
            </span>
          ) : null}

          {canResolve && isIssue ? (
            <button
              type="button"
              onClick={() => onResolve(claim)}
              className="rounded-lg px-2 py-1 text-xs font-medium text-primary-700 transition-colors hover:bg-primary-50"
            >
              Update
            </button>
          ) : null}
        </div>
      </div>

      {claim.clawbackNotices?.length ? (
        <p className="mt-1 rounded-lg bg-rose-50/60 px-2.5 py-1.5 text-xs text-rose-800">
          {claim.clawbackNotices.join(" · ")}
        </p>
      ) : null}

      {claim.resolutionNote ? (
        <p className="mt-1 text-xs text-neutral-500">{claim.resolutionNote}</p>
      ) : null}
    </li>
  );
}

export function FundingClaimTracker() {
  const { can } = useRoleAccess();
  const canResolve = can("admin");

  const [page, setPage] = useState(1);
  const [discrepanciesOnly, setDiscrepanciesOnly] = useState(false);
  const [activeClaim, setActiveClaim] = useState(null);

  const { data, isLoading } = useFundingClaims({
    page,
    perPage: 20,
    discrepanciesOnly,
  });

  const claims = data?.claims ?? [];
  const meta = data?.meta ?? null;

  return (
    <Card>
      <CardHeader className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Scale className="size-4 text-neutral-400" aria-hidden />
          <h2 className="text-base font-semibold text-neutral-900">
            Funding claims
          </h2>
        </div>
        <CheckboxField
          name="discrepanciesOnly"
          label="Discrepancies only"
          checked={discrepanciesOnly}
          onChange={(e) => {
            setDiscrepanciesOnly(e.target.checked);
            setPage(1);
          }}
        />
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <p className="py-6 text-sm text-neutral-400">Loading claims…</p>
        ) : claims.length ? (
          <>
            <ul className="divide-y divide-neutral-100">
              {claims.map((claim) => (
                <ClaimRow
                  key={claim.enrolmentId}
                  claim={claim}
                  canResolve={canResolve}
                  onResolve={setActiveClaim}
                />
              ))}
            </ul>
            {meta ? <Pagination meta={meta} onPageChange={setPage} /> : null}
          </>
        ) : (
          <p className="py-6 text-sm text-neutral-400">
            {discrepanciesOnly
              ? "No funding discrepancies — every claim reconciles."
              : "No funding claims yet. Claims appear once enrolments are active."}
          </p>
        )}
      </CardContent>

      <FundingClaimResolutionModal
        claim={activeClaim}
        open={!!activeClaim}
        onClose={() => setActiveClaim(null)}
      />
    </Card>
  );
}
