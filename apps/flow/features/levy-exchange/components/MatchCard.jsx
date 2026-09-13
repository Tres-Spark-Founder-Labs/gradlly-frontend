"use client";

import { Building2 } from "lucide-react";

import Button from "@/components/ui/Button";
import TextBadge from "@/components/ui/TextBadge";

import {
  MATCH_APPLICATION_STATUS_META,
  OPEN_APPLICATION_STATUSES,
  formatGbpDecimal,
} from "../constants";

const isText = (value) => typeof value === "string" && value.trim() !== "";

function Figure({ label, value }) {
  if (value === null) return null;
  return (
    <div>
      <p className="text-xs font-medium text-neutral-500">{label}</p>
      <p className="text-sm font-semibold tabular-nums text-neutral-900">
        {value}
      </p>
    </div>
  );
}

/**
 * One MatchResultDto. Everything shown is a field of that DTO.
 *
 * donorDisplayName is rendered as sent: the API already substitutes
 * "Matched donor" for an anonymous donor (levy-matching.service.ts), so this
 * component never names a donor itself.
 *
 * Not shown, deliberately:
 *  - an estimated timeline. F4.2.3 AC3 asks for one, but MatchResultDto does
 *    not carry it, and a timeline computed here would be invented.
 *  - scoreBreakdown per dimension. Each dimension is 0, 50 or 100, and 50 is
 *    the config's wildcard for "this donor states no preference" — which the
 *    response does not mark. Rendered as a number or a bar it reads as a half
 *    match. It is still sent, unchanged, with the application.
 *
 * `latestApplication` is this SME's most recent application to this donor,
 * from GET /match-applications. While one is pending or confirmed the card
 * shows its status instead of offering a second application, which the API
 * would accept.
 */
export function MatchCard({ match, latestApplication, onApply, isApplying }) {
  const available = formatGbpDecimal(match?.transferableAmount);
  const surplus = formatGbpDecimal(match?.availableSurplus);
  const eligible =
    typeof match?.programmeEligible === "boolean"
      ? match.programmeEligible
      : null;

  const status = latestApplication?.status;
  const statusMeta = isText(status)
    ? (MATCH_APPLICATION_STATUS_META[status] ?? {
        label: status,
        color: "gray",
      })
    : null;
  const hasOpenApplication =
    isText(status) && OPEN_APPLICATION_STATUSES.includes(status);

  const canApply =
    !hasOpenApplication &&
    isText(match?.donorOrganisationId) &&
    isText(match?.transferableAmount);

  return (
    <li className="space-y-3 rounded-xl border border-neutral-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
            <Building2 className="size-4.5" aria-hidden />
          </span>
          <div className="min-w-0">
            {isText(match?.donorDisplayName) ? (
              <p className="truncate text-sm font-semibold text-neutral-900">
                {match.donorDisplayName}
              </p>
            ) : null}
            {isText(match?.matchScore) ? (
              <p className="text-xs text-neutral-500">
                Match score {match.matchScore}
              </p>
            ) : null}
          </div>
        </div>
        {eligible === null ? null : (
          <TextBadge
            variant="light"
            color={eligible ? "green" : "gray"}
            size="xs"
          >
            {eligible ? "Programme eligible" : "Programme not eligible"}
          </TextBadge>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Figure label="Transfer amount available to you" value={available} />
        <Figure label="Donor's total available surplus" value={surplus} />
      </div>

      <div className="flex items-center justify-between gap-3">
        {statusMeta ? (
          <TextBadge variant="light" color={statusMeta.color} size="xs">
            Your application: {statusMeta.label}
          </TextBadge>
        ) : (
          <span />
        )}
        {canApply ? (
          <Button size="sm" loading={isApplying} onClick={() => onApply(match)}>
            {`Apply for ${available}`}
          </Button>
        ) : null}
      </div>
    </li>
  );
}
