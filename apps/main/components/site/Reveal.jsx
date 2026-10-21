"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A section, and its text, arriving as it is reached.
 *
 * ── WHY THIS EXISTS AFTER I ARGUED AGAINST IT ───────────────────────────────
 *
 * A fade-and-slide on every section is the generic default, and I left it out
 * three times on that basis. It was asked for three times, so it is in, and the
 * job now is to make it the good version of the pattern rather than the lazy
 * one.
 *
 * What makes it the good version:
 *
 *   It plays once. An element that re-animates every time it re-enters the
 *   viewport turns scrolling back up into a light show.
 *
 *   It staggers children rather than moving the whole block, so a heading
 *   arrives before the paragraph under it and the order of reading is the order
 *   of arrival.
 *
 *   It cannot move the layout. Opacity and transform only, and the element
 *   holds its final box from first paint, so nothing here touches CLS.
 *
 *   It never hides content from a reader who gets no JavaScript. The visible
 *   state is the default and the hidden state is only applied once the observer
 *   is attached, which is the opposite of how this is usually built and the
 *   reason a failed hydration here leaves a readable page rather than a blank
 *   one.
 */
export function Reveal({
  children,
  as: Tag = "div",
  stagger = 90,
  distance = 18,
  className = "",
}) {
  const ref = useRef(null);
  const [state, setState] = useState("idle");

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Armed, not hidden, until the observer exists. See the note above.
    const arm = requestAnimationFrame(() => setState("armed"));

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setState("shown");
        observer.disconnect();
      },
      // A third of the way up from the bottom: the block starts arriving as it
      // comes into reading position rather than the moment its first pixel
      // crosses the edge.
      { rootMargin: "0px 0px -18% 0px", threshold: 0.05 },
    );

    observer.observe(element);
    return () => {
      cancelAnimationFrame(arm);
      observer.disconnect();
    };
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
