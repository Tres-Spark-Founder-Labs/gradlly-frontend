"use client";

import { CheckCircle2, Circle, PenTool } from "lucide-react";

import {
  TRANSFER_PARTY,
  TRANSFER_PARTY_LABELS,
  formatIsoDate,
} from "../constants";

const isText = (value) => typeof value === "string" && value.trim() !== "";

/**
 * Both parties' signature slots, in the order the API returns them (donor
 * first). Each slot's state is the API's `signed`/`signedAt`; "next" is the
 * API's `nextParty`, never inferred from the status.
 */
export function TransferSignatures({ signatures, nextParty }) {
  const slots = Array.isArray(signatures) ? signatures : [];
  if (slots.length === 0) return null;

  return (
    <ol className="space-y-2">
      {slots.map((slot) => {
        const party = slot?.party;
        const label = isText(party)
          ? (TRANSFER_PARTY_LABELS[party] ?? party)
          : null;
        const isYou = party === TRANSFER_PARTY.RECIPIENT;
        const signed = slot?.signed === true;
        const isNext = !signed && isText(nextParty) && party === nextParty;
        const signedOn = signed ? formatIsoDate(slot?.signedAt) : null;

        const Icon = signed ? CheckCircle2 : isNext ? PenTool : Circle;
        const tone = signed
          ? "text-green-600"
          : isNext
            ? "text-amber-600"
            : "text-neutral-300";

        return (
          <li
            key={`${party}-${slot?.signOrder}`}
            className="flex items-center justify-between gap-3 rounded-lg border border-neutral-100 px-3 py-2"
          >
            <span className="flex items-center gap-2 text-sm text-neutral-800">
              <Icon className={`size-4 ${tone}`} aria-hidden />
              {label}
              {isYou ? (
                <span className="text-xs text-neutral-400">(you)</span>
              ) : null}
            </span>
            <span className="text-xs text-neutral-500">
              {signed
                ? signedOn
                  ? `Signed ${signedOn}`
                  : "Signed"
                : isNext
                  ? "Next to sign"
                  : "Not yet"}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
