"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * The hero: a record confirming itself.
 *
 * ── WHY THIS AND NOT A HEADLINE WITH CARDS ──────────────────────────────────
 *
 * The most characteristic thing in this product's world is not a dashboard. It
 * is the moment a claim becomes proof: a line that says someone can do
 * something, and then a named person standing behind it. That is the entire
 * proposition, and it is a change over time, which means the honest way to show
 * it is to let it happen rather than to describe it in a paragraph beside a
 * static screenshot.
 *
 * So the hero runs it. Three lines start as claims. One by one the mark draws
 * in, the status flips, and the confirmation attaches. It plays once, settles,
 * and offers to run again.
 *
 * ── WHAT IT CONTAINS, AND DOES NOT ──────────────────────────────────────────
 *
 * The skills and the confirmer roles are content-v1.md's own words: "Confirmed
 * by whoever assessed or observed them", "Verified at source". There are no
 * names, no dates and no figures, because the thing being demonstrated is the
 * attaching, not a value. Where a date would sit there is a neutral block, the
 * same convention the other product visuals use.
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
    mark: "olive",
  },
  {
    id: "check",
    claim: "Right to work",
    kind: "Check",
    by: "Verified at source, live between jobs",
    mark: "olive",
  },
  {
    id: "signoff",
    claim: "Competence sign-off",
    kind: "Sign-off",
    by: "Confirmed by the manager this quarter",
    mark: "olive",
  },
];

const STEP_MS = 900;

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
      // The control still appears; only the arrival sequence is suppressed.
      const show = setTimeout(() => setMounted(true), 0);
      return () => clearTimeout(show);
    }

    // Scheduled rather than called in the effect body: setState there causes a
    // cascading render, and a frame's delay is imperceptible.
    //
    // It used to wait 700ms, which meant the record rendered confirmed and then
    // visibly blanked itself before rebuilding. The server-rendered state has
    // to stay confirmed, because that is what is correct with no JavaScript, so
    // the reset happens as early as it can instead.
    const show = setTimeout(() => setMounted(true), 0);
    const start = setTimeout(play, 60);
    return () => {
      clearTimeout(show);
      clearTimeout(start);
      clear();
    };
  }, [play]);

  return (
    <figure className="rounded-card border border-hairline bg-linen">
      <figcaption className="flex items-center justify-between gap-4 border-b border-hairline px-6 py-4">
        <span className="text-caption text-ink-muted">
          One worker, one record
        </span>
        {mounted ? (
          <button
            type="button"
            onClick={play}
            disabled={playing}
            className="rounded-control border border-hairline px-3 py-1.5 text-caption text-ink transition-colors duration-200 ease-out hover:border-ink disabled:opacity-45"
          >
            {playing ? "Confirming" : "Watch it confirm"}
          </button>
        ) : null}
      </figcaption>

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
                <span className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
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

      {/*
        The one line that says what just happened, for anyone who cannot see it
        happen. Polite, so it is not read over the headline on arrival.
      */}
      <p className="sr-only" role="status" aria-live="polite">
        {confirmed === LINES.length
          ? "All three lines confirmed."
          : `${confirmed} of ${LINES.length} lines confirmed.`}
      </p>

      <p className="border-t border-hairline px-6 py-4 text-caption text-ink-muted">
        Nothing on a Continuo record is a claim. Every line carries whoever
        confirmed it.
      </p>
    </figure>
  );
}
