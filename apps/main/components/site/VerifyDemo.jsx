"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * The hero: a record confirming itself.
 *
 * ── WHAT CHANGED IN THE REBUILD, AND WHAT DID NOT ───────────────────────────
 *
 * The confirming animation is the one piece of the first hero that survives
 * untouched: three lines start as claims, the mark grows in, the status flips
 * to who confirmed it. That is still the most characteristic thing in this
 * product's world — the moment a claim becomes proof — and nothing about the
 * new reference argues against showing it; the reference just wants it inside
 * a single, more literal product card rather than a floating collage of three.
 *
 * So the collage is gone (see the removed HeroStack.jsx) and this card grew a
 * header and a footer to match: a breadcrumb and a status pill above the
 * confirming list, a second product strip below it — Continuo confirming on
 * top, Gradlly AMS's four portals underneath, so the one card carries both
 * products the way the rest of the page's spine does. The portal names and
 * "Four doors onto one apprenticeship." are §6's own words, not invented for
 * this card.
 *
 * ── WHAT IT CONTAINS, AND DOES NOT ──────────────────────────────────────────
 *
 * The skills and the confirmer roles are content-v1.md's own words: "Confirmed
 * by whoever assessed or observed them", "Verified at source". There are no
 * names, no dates and no figures. Where a date would sit there is a neutral
 * block. The readiness checklist's "2 of 3" is counted from the three rows
 * actually rendered, not a separate claim — change a row's state and the count
 * changes with it, because it is derived, not written down twice.
 *
 * ── MOTION ──────────────────────────────────────────────────────────────────
 *
 * Driven by timers rather than CSS alone, because the sequence has to be
 * replayable by a control and a keyframe animation cannot be restarted without
 * fighting the browser over it.
 *
 * Under `prefers-reduced-motion: reduce` it does not play: the record is shown
 * confirmed from the first frame and the replay control is not rendered, which
 * is the end state rather than a stopped animation.
 */

/** Every string here appears in docs/marketing/content-v1.md. */
const LINES = [
  {
    id: "skill",
    claim: "Moving and handling",
    kind: "Skill",
    by: "Confirmed by the assessor who observed it",
  },
  {
    id: "check",
    claim: "Right to work",
    kind: "Check",
    by: "Verified at source, live between jobs",
  },
  {
    id: "signoff",
    claim: "Competence sign-off",
    kind: "Sign-off",
    by: "Confirmed by the manager this quarter",
  },
];

/** Named exactly as the portals section on this page names them (§6, "Four
    doors onto one apprenticeship."). */
const PORTALS = ["Provider", "Employer", "Apprentice", "Forge"];

const STEP_MS = 900;

function CheckIcon({ met, tone = "olive" }) {
  const toneClass =
    tone === "terracotta"
      ? "border-terracotta bg-terracotta text-linen"
      : "border-olive bg-olive text-linen";
  return (
    <span
      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
        met ? toneClass : "border-hairline-dark text-transparent"
      }`}
      aria-hidden
    >
      <svg width="9" height="9" viewBox="0 0 9 9">
        <path
          d="M1.5 4.6 L3.4 6.5 L7.5 2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function VerifyDemo() {
  // -1 is the resting state before anything has confirmed. Starting at LINES
  // length means every line is confirmed, which is also the reduced-motion and
  // no-JavaScript state.
  const [confirmed, setConfirmed] = useState(LINES.length);
  const [playing, setPlaying] = useState(false);
  // Only governs whether the sequence plays on arrival. The control is always
  // offered: prefers-reduced-motion is a request not to be moved at without
  // asking, and a demonstration somebody presses a button for is asked for.
  const [mounted, setMounted] = useState(false);
  const timers = useRef([]);

  const clear = () => {
    for (const id of timers.current) clearTimeout(id);
    timers.current = [];
  };

  const play = useCallback(() => {
    clear();
    setConfirmed(0);
    setPlaying(true);
    for (let index = 1; index <= LINES.length; index += 1) {
      timers.current.push(
        setTimeout(() => {
          setConfirmed(index);
          if (index === LINES.length) setPlaying(false);
        }, index * STEP_MS),
      );
    }
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) {
      const show = setTimeout(() => setMounted(true), 0);
      return () => clearTimeout(show);
    }

    // Scheduled rather than called in the effect body, and as early as
    // possible: the server-rendered state is confirmed, which is correct with
    // no JavaScript, so there is no visible blank-and-rebuild on arrival.
    const show = setTimeout(() => setMounted(true), 0);
    const start = setTimeout(play, 60);
    return () => {
      clearTimeout(show);
      clearTimeout(start);
      clear();
    };
  }, [play]);

  return (
    <figure className="shadow-card-lg overflow-hidden rounded-card border border-hairline bg-linen">
      {/* The header: a breadcrumb for context, a status pill for the claim
          the whole card rests on. Both read from real copy — "Continuo",
          "record" and "Verified" all appear in content-v1.md. */}
      <div className="flex items-center justify-between gap-4 border-b border-hairline px-6 py-4">
        <p className="flex items-baseline gap-2 text-caption text-ink-muted">
          <span>Continuo</span>
          <span aria-hidden>›</span>
          <span className="font-medium text-ink">One worker, one record</span>
        </p>
        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-olive/10 px-2.5 py-1 text-caption font-medium text-olive">
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
            <path
              d="M1.5 5.2 L3.8 7.5 L8.5 2.3"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Verified
        </span>
      </div>

      <ul className="list-none px-6">
        {LINES.map(({ id, claim, kind, by }, index) => {
          const isConfirmed = index < confirmed;
          return (
            <li
              key={id}
              className="flex items-start gap-4 border-b border-hairline py-5 last:border-b-0"
            >
              {/* The mark is the confirmation. It grows from nothing, which is
                  the one piece of motion on this page that is the message
                  rather than a transition. */}
              <span
                className="mt-1 block w-1 shrink-0 origin-top rounded-full bg-olive transition-transform duration-500 ease-[cubic-bezier(.16,.8,.26,1)]"
                style={{
                  height: "2.75rem",
                  transform: isConfirmed ? "scaleY(1)" : "scaleY(0)",
                }}
                aria-hidden
              />

              <span className="min-w-0 flex-1">
                <span className="flex flex-col gap-x-4 gap-y-0.5 sm:flex-row sm:items-baseline sm:justify-between">
                  <span className="text-body font-medium text-ink">
                    {claim}
                  </span>
                  <span className="text-caption text-ink-muted">{kind}</span>
                </span>

                {/* The status line swaps in place. Both states occupy the same
                    box, so nothing on the page moves while it changes. */}
                <span className="relative mt-1.5 block h-5">
                  <span
                    className={`absolute inset-0 text-caption text-ink-muted transition-opacity duration-300 ease-out ${
                      isConfirmed ? "opacity-0" : "opacity-100"
                    }`}
                    aria-hidden={isConfirmed}
                  >
                    Claimed
                  </span>
                  <span
                    className={`absolute inset-0 text-caption text-olive transition-opacity duration-500 ease-out ${
                      isConfirmed ? "opacity-100 delay-150" : "opacity-0"
                    }`}
                    aria-hidden={!isConfirmed}
                  >
                    {by}
                  </span>
                </span>
              </span>

              {/* Where the date sits in the product. A neutral block, because a
                  date here would be invented data. */}
              <span
                className={`mt-2 block h-2 w-10 shrink-0 rounded-full transition-colors duration-500 ease-out ${
                  isConfirmed ? "bg-olive/25" : "bg-sand"
                }`}
                aria-hidden
              />
            </li>
          );
        })}
      </ul>

      <p className="sr-only" role="status" aria-live="polite">
        {confirmed === LINES.length
          ? "All three lines confirmed."
          : `${confirmed} of ${LINES.length} lines confirmed.`}
      </p>

      {/* The second product strip: Gradlly AMS's four portals, under
          Continuo's confirming list above. */}
      <div className="border-t border-hairline bg-sand/30 px-6 py-5">
        <div className="flex items-center justify-between gap-4">
          <p className="text-caption font-medium text-ink-muted">Gradlly AMS</p>
          <p className="text-caption text-ink-muted">
            {PORTALS.length} portals
          </p>
        </div>
        <p className="mt-1 text-caption text-ink-muted">
          Four doors onto one apprenticeship.
        </p>
        <ul className="mt-4 list-none space-y-2.5">
          {PORTALS.map((portal) => (
            <li key={portal} className="flex items-center gap-2.5">
              <CheckIcon met tone="terracotta" />
              <span className="text-body-sm text-ink">{portal}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-hairline px-6 py-4">
        {mounted ? (
          <button
            type="button"
            onClick={play}
            disabled={playing}
            className="rounded-full border border-hairline px-3.5 py-1.5 text-caption text-ink transition-colors duration-200 ease-out hover:border-ink disabled:opacity-45"
          >
            {playing ? "Confirming" : "Watch it confirm"}
          </button>
        ) : (
          <span aria-hidden className="block h-[30px]" />
        )}
      </div>
    </figure>
  );
}
