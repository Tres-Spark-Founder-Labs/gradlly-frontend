"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A section, and its text, flowing in as it's reached and flowing back out as
 * it's left — in either scroll direction.
 *
 * ── WHY THIS NOW RE-ANIMATES, AFTER I ARGUED FOR "PLAYS ONCE" ───────────────
 *
 * The one-shot version of this component disconnected its observer after the
 * first arrival specifically so that scrolling back up wouldn't retrigger a
 * light show. That was a reasoned default, not a law, and the explicit brief
 * now is the opposite of it: obvious motion, flowing in and flowing out,
 * repeatable. So the observer is never disconnected except on unmount, and
 * every crossing — down past a section or back up through it — toggles the
 * state and replays the transition.
 *
 * What's kept from the original version, because none of it was in tension
 * with the new brief:
 *
 *   Children stagger rather than the whole block moving as one, so a heading
 *   still arrives before the paragraph under it (and leaves before it too,
 *   on the way out — see the shared transition-delay in globals.css).
 *
 *   It cannot move the layout. Opacity and translate only.
 *
 *   It never hides content from a reader who gets no JavaScript, or who has
 *   asked for less motion. The visible "idle" state is still the default and
 *   the only thing that can hide an element is the observer's own first
 *   callback, which never fires at all under prefers-reduced-motion.
 *
 * Driven by a CSS transition now rather than a one-shot keyframe animation,
 * which is what makes the reverse direction free: a transition animates
 * whichever way a property's value changes, so the same two rules (shown,
 * hidden) cover flowing in and flowing out without a second set of keyframes.
 */
export function Reveal({
  children,
  as: Tag = "div",
  stagger = 110,
  distance = 28,
  className = "",
}) {
  const ref = useRef(null);
  const [state, setState] = useState("idle");

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Every crossing, not just the first — this is the whole of the
        // change from the one-shot version. IntersectionObserver callbacks
        // are always async, so this setState is never the synchronous kind
        // that would need deferring into a rAF first.
        setState(entry.isIntersecting ? "shown" : "hidden");
      },
      // A third of the way up from the bottom: a block starts arriving as it
      // reaches reading position, and — on the way back up — has already
      // left reading position before it starts leaving the viewport.
      { rootMargin: "0px 0px -18% 0px", threshold: 0.05 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-reveal={state}
      className={`reveal ${className}`}
      style={{
        "--reveal-stagger": `${stagger}ms`,
        "--reveal-distance": `${distance}px`,
      }}
    >
      {children}
    </Tag>
  );
}
