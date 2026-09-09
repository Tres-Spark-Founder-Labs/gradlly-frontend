"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Hourglass,
  Phone,
} from "lucide-react";

import { useEnrolmentCommitmentStatus } from "@/features/commitments/queries/commitments.query";
import { PARTY_STATUS } from "@/features/commitments/utils/board";

import { attendanceColor } from "./helpers";
import { T } from "./tokens";

/**
 * Absent, said plainly.
 *
 * The tab used to fill gaps with "—" pulled from a hardcoded
 * `providerContact` object, which reads as a value rather than as a gap. This
 * names what is missing, in the muted tone that says "nothing here" rather
 * than the ink tone that says "this is the answer".
 */
const NotRecorded = ({ children }) => (
  <span className="text-xs font-normal italic" style={{ color: T.muted }}>
    {children}
  </span>
);

const Row = ({ label, value, accent }) => (
  <div className="flex items-start justify-between gap-3 py-1.5">
    <span className="text-xs shrink-0 w-32" style={{ color: T.muted }}>
      {label}
    </span>
    <span
      className="text-xs font-semibold text-right"
      style={{ color: accent ?? T.ink }}
    >
      {value}
    </span>
  </div>
);

/**
 * A field `normalizeApprentice` may hand over as null, as a number or nothing.
 *
 * Returns `null` for anything that is not a finite number, so a caller can
 * test presence once and never compare an absent value to a threshold.
 * `null < 85` coerces to `0 < 85` and is true, which is how this screen came
 * to warn about attendance nobody had measured.
 */
function numberOrNull(value) {
  if (value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

const ATTENDANCE_THRESHOLD = 85;

/**
 * The employer's own position on this enrolment's statement.
 *
 * ── WHY THIS READS actionRequired AND NOT JUST THE STATUS ───────────────────
 *
 * Signing is sequential. `employerCanSignNow()` in commitment-board.service.ts
 * computes `actionRequired` as "the employer is unsigned AND every party with
 * a lower signOrder has already signed", and the sign endpoint rejects an
 * out-of-turn attempt. Its comment says why: "requires employer signature" has
 * to mean the employer is *next*, not merely unsigned.
 *
 * `employerStatus === PENDING` is true from the moment the statement is
 * published, including while the tutor or apprentice still has to sign. Gating
 * on it alone offered a Sign button the API would refuse, and told the employer
 * the ball was in their court when it was not — the exact failure that comment
 * exists to prevent.
 *
 * Five outcomes, one of them nothing: a missing board row means no statement
 * exists for this enrolment, which is not the same as an unsigned one.
 */
function commitmentMeta({ status, actionRequired }) {
  if (status === PARTY_STATUS.SIGNED) {
    return { label: "Signed", color: T.green, Icon: CheckCircle2 };
  }
  if (status === PARTY_STATUS.PENDING) {
    return actionRequired
      ? {
          label: "Awaiting your signature",
          color: T.amber,
          Icon: AlertTriangle,
          canSign: true,
        }
      : {
          // Unsigned, but not the employer's turn. Neutral, because there is
          // nothing for them to do and nothing they are late for.
          label: "Waiting on other parties",
          color: T.muted,
          Icon: Hourglass,
        };
  }
  if (status === PARTY_STATUS.NOT_SENT) {
    // Nothing for the employer to do yet, so it is stated neutrally rather
    // than as a warning against them.
    return { label: "Not yet sent for signature", color: T.muted, Icon: Clock };
  }
  return null;
}

export function ProfileOverview({ a, profile, onContact }) {
  const fmt = (n) => `£${n.toLocaleString("en-GB")}`;

  const commitment = useEnrolmentCommitmentStatus(a.enrolmentId);
  const commitmentState = commitmentMeta(commitment);

  /*
   * Every figure below is tested for presence before it is compared or
   * rendered. `normalizeApprentice` hands most of these over as null, and the
   * previous version compared and interpolated them raw — printing "null%" on
   * screen, and warning "Below 85% threshold" for every apprentice in the
   * roster because `null < 85` is true.
   */
  const attendance = numberOrNull(a.attendance);
  const attendanceBelowThreshold =
    attendance !== null && attendance < ATTENDANCE_THRESHOLD;

  // The aggregate's own OTJ percentage — the one figure here the API really
  // reports. `a.otjActual` and `a.otjExpected` are both hardcoded null.
  const otjPercent = numberOrNull(profile?.otj?.otjPercent);
  const sessionsLogged = numberOrNull(profile?.otj?.totalCount);
  // How far behind, from the enrolment. Positive means behind; see
  // behindPercentLabel, which treats zero and negatives as "not behind".
  const behindPercent = numberOrNull(a.otjBehindPercent);

  /**
   * The tutor, from the profile aggregate rather than the roster row.
   *
   * `a.tutorEmail` is hardcoded `null` in `normalizeApprentice`, and the old
   * code interpolated it straight into a template string — so an apprentice
   * with a tutor rendered "Marcus Reid · null" on screen. The aggregate's
   * `tutor` carries `{ userId, name }` and no email, so only the name is shown:
   * a field is either rendered from a value that exists or not rendered.
   */
  const tutorName = profile?.tutor?.name ?? a.tutorName ?? null;

  return (
    <div className="space-y-5">
      {/* Programme details */}
      <section>
        <p
          className="text-[10px] font-bold uppercase tracking-widest mb-3"
          style={{ color: T.muted }}
        >
          Programme
        </p>
        <div
          className="rounded-xl px-4 py-1"
          style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
        >
          <Row label="Provider" value={a.provider} accent={T.blue} />
          <Row
            label="Assigned tutor"
            value={tutorName ?? <NotRecorded>No tutor assigned</NotRecorded>}
          />
          <Row
            label="Line manager"
            value={
              a.lineManager ?? (
                <NotRecorded>No line manager recorded</NotRecorded>
              )
            }
          />
          <Row label="Start date" value={a.startDate} />
          <Row label="Expected end" value={a.expectedEndDate} />
          {/*
            The agreed price alone. This said `${fmt(a.fundingBand)} — 100%
            levy`, asserting the funding split on every apprentice regardless
            of how they are funded — nothing in the enrolment response says
            anything about the levy/co-investment split, so the claim was
            invented. A price of zero is not a £0 band either; it is a price
            nobody has agreed yet.
          */}
          <Row
            label="Funding band"
            value={
              a.fundingBand ? (
                fmt(a.fundingBand)
              ) : (
                <NotRecorded>No agreed price recorded</NotRecorded>
              )
            }
          />
          {/*
            Rendered only when the board actually has a row for this enrolment.
            This previously read `a.commitmentSigned`, hardcoded to false in
            normalizeApprentice, so every apprentice showed "Awaiting
            signature" — sending employers to chase signatures that already
            existed.
          */}
          {commitmentState && (
            <div className="flex items-start justify-between gap-3 py-1.5">
              <span
                className="text-xs w-32 shrink-0"
                style={{ color: T.muted }}
              >
                Commitment
              </span>
              <span
                className="flex items-center gap-1 text-xs font-semibold"
                style={{ color: commitmentState.color }}
              >
                <commitmentState.Icon className="h-3.5 w-3.5" aria-hidden />
                {commitmentState.label}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* OTJ summary */}
      <section>
        <p
          className="text-[10px] font-bold uppercase tracking-widest mb-3"
          style={{ color: T.muted }}
        >
          Off-the-job training
        </p>
        <div
          className="rounded-xl p-4 space-y-3"
          style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
        >
          {/*
            Only three figures here are real, and only two come from the
            aggregate: its otjPercent and totalCount, plus otjBehindPercent from
            the enrolment. "Expected by now" and the hours completed/required
            pair are hardcoded null in normalizeApprentice — this block used to
            interpolate them straight into the markup, so an employer read
            "null%" and "null hrs completed of null hrs required".
          */}
          {otjPercent === null && behindPercent === null ? (
            <p className="text-xs" style={{ color: T.muted }}>
              No off-the-job progress has been calculated for this apprentice
              yet.
            </p>
          ) : (
            <>
              <div className="flex items-end gap-6">
                {otjPercent !== null && (
                  <div>
                    <p
                      className="text-[28px] font-extrabold tabular-nums leading-none"
                      style={{
                        color: behindPercent > 0 ? T.amber : T.green,
                      }}
                    >
                      {Math.round(otjPercent)}%
                    </p>
                    <p className="text-xs mt-1" style={{ color: T.muted }}>
                      Actual progress
                    </p>
                  </div>
                )}
                {behindPercent !== null && behindPercent > 0 && (
                  <div>
                    <p
                      className="text-xl font-bold tabular-nums leading-none"
                      style={{ color: T.red }}
                    >
                      {Math.round(behindPercent)}%
                    </p>
                    <p className="text-xs mt-1" style={{ color: T.muted }}>
                      Behind
                    </p>
                  </div>
                )}
                {sessionsLogged !== null && (
                  <div>
                    <p
                      className="text-xl font-bold tabular-nums leading-none"
                      style={{ color: T.muted }}
                    >
                      {sessionsLogged}
                    </p>
                    <p className="text-xs mt-1" style={{ color: T.muted }}>
                      {sessionsLogged === 1
                        ? "Session logged"
                        : "Sessions logged"}
                    </p>
                  </div>
                )}
              </div>
              {/*
                "Expected by now" is not in the aggregate and not on the
                enrolment. Named rather than replaced with a second guess — the
                whole point of removing the hardcoded pace line was not to
                substitute a different invented figure for an invented one.
              */}
              <p className="text-xs" style={{ color: T.muted }}>
                Target percentage and logged hours are not reported for this
                enrolment. The Activity tab lists the sessions themselves.
              </p>
            </>
          )}
        </div>
      </section>

      {/* Attendance */}
      <section>
        <p
          className="text-[10px] font-bold uppercase tracking-widest mb-3"
          style={{ color: T.muted }}
        >
          Attendance
        </p>
        <div
          className="rounded-xl px-4 py-3 flex items-center justify-between"
          style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
        >
          {/*
            attendance is hardcoded null in normalizeApprentice, and this block
            compared it to a threshold: `null < 85` coerces to `0 < 85`, so
            "Below 85% threshold" rendered for every apprentice in the roster,
            always, about a figure nobody had measured. attendanceColor(null)
            returned red for the same reason, so the dot agreed with it.

            The badge was the fault, not the null — it told an employer to act
            on attendance that does not exist.
          */}
          {attendance === null ? (
            <span className="text-xs" style={{ color: T.muted }}>
              Attendance is not recorded for this apprentice.
            </span>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: attendanceColor(attendance) }}
                />
                <span
                  className="text-sm font-bold"
                  style={{ color: attendanceColor(attendance) }}
                >
                  {attendance}%
                </span>
              </div>
              {attendanceBelowThreshold && (
                <span
                  className="text-xs font-semibold"
                  style={{ color: T.amber }}
                >
                  Below {ATTENDANCE_THRESHOLD}% threshold
                </span>
              )}
            </>
          )}
        </div>
      </section>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2 pt-1">
        <button
          type="button"
          onClick={() => onContact?.(a)}
          className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold hover:opacity-80 transition-opacity"
          style={{ backgroundColor: T.blueLight, color: T.blue }}
        >
          <Phone className="h-3.5 w-3.5" /> Contact provider
        </button>
        {/*
          Offered only when the employer's signature is the one outstanding.
          Driven by the hardcoded flag, this button appeared on every
          apprentice — including those whose statement was signed, and those
          with no statement at all.
        */}
        {commitmentState?.canSign && (
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold hover:opacity-80 transition-opacity"
            style={{ backgroundColor: T.amberLight, color: T.amber }}
          >
            Sign commitment statement
          </button>
        )}
      </div>
    </div>
  );
}
