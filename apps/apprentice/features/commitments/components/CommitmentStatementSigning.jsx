"use client";

import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  Loader2,
} from "lucide-react";
import { useMemo, useState } from "react";

import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import TextBadge from "@/components/ui/TextBadge";
import { SignatureCapture } from "@/features/esignature/components/SignatureCapture";
import { useLearnerSummary } from "@/features/reporting/queries/reporting.query";

import {
  COMMITMENT_STATUS,
  SIGNATURE_STATUS,
  TRIPARTITE_PARTY,
} from "../constants";
import {
  useCommitmentStatements,
  useSignCommitmentStatement,
  useSignedDocumentUrl,
} from "../queries/commitments.query";
import { buildPlainSummary } from "../utils/plain-summary";
import { renderStatementText } from "../utils/statement-text";

/**
 * F3.4.1 Commitment Statement Signing — the apprentice's screen.
 *
 * All six criteria live here or in the modules it composes:
 *
 *   AC1  plain-English summary before the full document  → buildPlainSummary
 *   AC2  "View full statement" toggle                    → this file
 *   AC3  drawn or typed signature                        → SignatureCapture
 *   AC4  confirmation checkbox gates signing             → this file
 *   AC5  signed PDF in the document library              → useSignedDocumentUrl
 *   AC6  7-day reminder after the employer signs         → API, already built
 *        (commitment-chase.service.ts, SEVEN_DAYS)
 */
export function CommitmentStatementSigning() {
  // The same source `useEnrolmentJourney` reads for its own enrolment id.
  const summary = useLearnerSummary();
  const enrolmentId = summary.data?.activeEnrolmentId ?? null;

  const statements = useCommitmentStatements(enrolmentId);

  /**
   * The one that matters is the newest statement that is not a cancelled
   * draft. An apprentice can have several versions over time (F1.3.3 keeps the
   * history), but only ever one they are being asked to sign.
   */
  const statement = useMemo(() => {
    const rows = statements.data ?? [];
    const live = rows.filter(
      (row) => row.status !== COMMITMENT_STATUS.CANCELLED,
    );
    return live[live.length - 1] ?? null;
  }, [statements.data]);

  const [showFull, setShowFull] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [signatureDataUrl, setSignatureDataUrl] = useState(null);

  const sign = useSignCommitmentStatement(statement?.id);
  const signedDocument = useSignedDocumentUrl(statement?.id, statement?.status);

  const plain = useMemo(
    () => buildPlainSummary(statement?.content),
    [statement?.content],
  );

  const mySignature = (statement?.signatures ?? []).find(
    (row) => row.party === TRIPARTITE_PARTY.APPRENTICE,
  );
  const alreadySigned = mySignature?.status === SIGNATURE_STATUS.SIGNED;

  /**
   * AC4 — the checkbox *gates the control*, it does not fail the submit.
   *
   * Letting someone press Sign and then rejecting them teaches that the
   * checkbox is a formality to click past. A disabled button with the reason
   * stated next to it is the honest version, and it is also the accessible
   * one: `aria-describedby` ties the reason to the control for a screen reader
   * rather than leaving it as nearby text.
   */
  const blockingReason = !confirmed
    ? "Tick the confirmation box to enable signing."
    : !signatureDataUrl
      ? "Add your signature to enable signing."
      : null;

  if (summary.isLoading || statements.isLoading) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-neutral-500">
          <Loader2 className="mx-auto mb-2 h-4 w-4 animate-spin" />
          Loading your commitment statement…
        </CardContent>
      </Card>
    );
  }

  if (!statement) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <FileText className="mx-auto mb-2 h-5 w-5 text-neutral-400" />
          <p className="text-sm font-medium text-neutral-700">
            No commitment statement yet
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            Your training provider prepares this, and your employer signs it
            before it reaches you. You will be notified when it is your turn.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── AC1: the summary, before the full document ────────────────── */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-neutral-800">
              Your commitment statement, in short
            </h2>
            {alreadySigned ? (
              <TextBadge color="green" startIcon={<CheckCircle2 />} size="sm">
                You signed this
              </TextBadge>
            ) : null}
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {plain.isEmpty ? (
            <p className="text-sm text-neutral-500">
              This statement has no readable content yet. Do not sign until it
              does — use “View full statement” below to check.
            </p>
          ) : null}

          {plain.facts.length > 0 ? (
            <dl className="grid gap-3 sm:grid-cols-2">
              {plain.facts.map((fact) => (
                <div
                  key={fact.label}
                  className="rounded-lg border border-neutral-200 px-3 py-2"
                >
                  <dt className="text-xs text-neutral-500">{fact.label}</dt>
                  <dd className="text-sm font-semibold text-neutral-900">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}

          {plain.sections.map((section) => {
            const quoted = plain.legalisticKeys.includes(section.key);
            return (
              <section key={section.key} className="space-y-1.5">
                <h3 className="text-sm font-semibold text-neutral-800">
                  {section.heading}
                </h3>
                {section.lead ? (
                  <p className="text-xs text-neutral-500">{section.lead}</p>
                ) : null}
                <p className="whitespace-pre-line text-sm text-neutral-700">
                  {section.body}
                </p>
                {/*
                  The platform selects and labels; it cannot rewrite the
                  provider's wording. Saying so is better than presenting legal
                  drafting under a heading that promises plain English.
                */}
                {quoted ? (
                  <p className="text-xs italic text-neutral-500">
                    Quoted from the statement as written — this passage has not
                    been simplified.
                  </p>
                ) : null}
              </section>
            );
          })}
        </CardContent>
      </Card>

      {/* ── AC2: the full document, behind a toggle ───────────────────── */}
      <Card>
        <CardHeader>
          <button
            type="button"
            onClick={() => setShowFull((open) => !open)}
            aria-expanded={showFull}
            aria-controls="full-statement"
            className="flex w-full items-center justify-between gap-2 text-left"
          >
            <span className="text-sm font-semibold text-neutral-800">
              View full statement
            </span>
            {showFull ? (
              <ChevronUp className="h-4 w-4 text-neutral-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-neutral-500" />
            )}
          </button>
        </CardHeader>
        {showFull ? (
          <CardContent>
            <pre
              id="full-statement"
              className="max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-neutral-50 p-4 text-xs leading-relaxed text-neutral-700"
            >
              {renderStatementText(statement.content)}
            </pre>
          </CardContent>
        ) : null}
      </Card>

      {/* ── AC5: the signed PDF, once everyone has signed ─────────────── */}
      {statement.status === COMMITMENT_STATUS.SIGNED ? (
        <Card>
          <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
            <div>
              <p className="text-sm font-semibold text-neutral-800">
                Signed commitment statement
              </p>
              <p className="text-xs text-neutral-500">
                Everyone has signed. This is also in your documents.
              </p>
            </div>
            <Button
              href={signedDocument.data?.url ?? undefined}
              disabled={!signedDocument.data?.url}
              startIcon={<Download />}
            >
              {signedDocument.isLoading ? "Preparing…" : "Download PDF"}
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {/* ── AC3 + AC4: sign ───────────────────────────────────────────── */}
      {alreadySigned ? null : (
        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold text-neutral-800">
              Sign your commitment statement
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <SignatureCapture
              onChange={setSignatureDataUrl}
              disabled={sign.isPending}
            />

            <label className="flex items-start gap-2.5 text-sm text-neutral-700">
              <input
                type="checkbox"
                checked={confirmed}
                disabled={sign.isPending}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-neutral-300"
              />
              <span>I confirm I have read and understood my commitment</span>
            </label>

            {sign.isError ? (
              <p role="alert" className="text-sm text-danger-600">
                {sign.error?.message ??
                  "Your signature could not be saved. Please try again."}
              </p>
            ) : null}

            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                disabled={Boolean(blockingReason) || sign.isPending}
                aria-describedby={blockingReason ? "sign-blocked" : undefined}
                onClick={() => sign.mutate({ signatureDataUrl })}
              >
                {sign.isPending ? "Signing…" : "Sign statement"}
              </Button>
              {blockingReason ? (
                <p id="sign-blocked" className="text-xs text-neutral-500">
                  {blockingReason}
                </p>
              ) : null}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
