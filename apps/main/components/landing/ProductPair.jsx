"use client";

import { useEffect, useRef, useState } from "react";

/**
 * content-v1.md §2, the two product cards and the line between them.
 *
 * The join is the design's signature moment. It is an SVG path rather than a
 * dotted border, so the dashes are real geometry that can be drawn: the stroke
 * is offset by its own length and animated to zero, left to right, once both
 * plates are in view. It plays once and does not reverse on scroll up, because
 * it is a statement about the two products, not a progress meter.
 *
 * A client component for exactly one reason: that single observer. Everything
 * else here is static markup.
 */
export function ProductPair() {
  const ref = useRef(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || drawn) return;

    // Reduced motion is handled in CSS, not here. The "pending" rule that
    // offsets the stroke lives inside a no-preference media query, so under
    // "reduce" the base rule applies and the line is simply drawn. Checking it
    // in JavaScript as well would mean setting state inside an effect for a
    // result the stylesheet already has.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setDrawn(true);
        observer.disconnect();
      },
      { threshold: 0.6 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [drawn]);

  return (
    <div className="mt-14 md:mt-20">
      <p className="text-small font-medium text-navy">
        Two products. Each works on its own.
      </p>

      <div
        ref={ref}
        className="mt-5 grid items-stretch gap-0 md:grid-cols-[1fr_auto_1fr]"
      >
        <Plate
          tone="teal"
          name="Continuo"
          summary="Verified skills for the workforce"
          audience="For employers and agencies"
          delay="320ms"
          points={[
            [
              "Verified skills.",
              "Confirmed by whoever assessed or observed them",
            ],
            [
              "Identity, right to work and DBS.",
              "Verified at source, live between jobs",
            ],
            ["Competence sign-off.", "Confirmed by the manager each quarter"],
          ]}
        />

        <Join drawn={drawn} />

        <Plate
          tone="brass"
          name="Gradlly AMS"
          summary="With the Apprenticeship Passport"
          audience="For training providers"
          delay="380ms"
          points={[
            [
              "Enrolment to end-point assessment.",
              "One place for delivery and funding compliance",
            ],
            [
              "Evidence built as delivery happens.",
              "Audit-ready without rebuilding by hand",
            ],
            [
              "A verified Passport for every apprentice.",
              "KSBs, hours and EPA result they keep",
            ],
          ]}
        />
      </div>
    </div>
  );
}

/**
 * A plate, not a card: radius 0, edge to edge, and the only two surfaces on the
 * page that cast the single shadow.
 *
 * White ink throughout. Navy on brass is 2.98:1, which fails even the
 * large-text threshold, and it rounds to 3.0 so a careless check passes it.
 */
function Plate({ tone, name, summary, audience, points, delay }) {
  const background = tone === "teal" ? "bg-teal" : "bg-brass";

  return (
    <div
      className={`enter-plate on-plate rounded-plate ${background} p-7 shadow-plate md:p-9`}
      style={{ "--enter-delay": delay }}
    >
      <h2 className="font-display text-plate font-normal text-white">{name}</h2>
      <p className="mt-1 text-small text-white/85">{summary}</p>
      <p className="mt-4 border-t border-white/25 pt-3 text-meta font-medium text-white/75">
        {audience}
      </p>

      <ul className="mt-6 list-none space-y-5">
        {points.map(([claim, detail]) => (
          <li key={claim}>
            <p className="text-small font-semibold text-white">{claim}</p>
            <p className="mt-0.5 text-small text-white/85">{detail}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * content-v1.md's "Link between the cards".
 *
 * Horizontal between the plates on desktop, vertical between them on mobile,
 * because the plates stack. Two paths rather than one rotated, so neither is a
 * sideways version of the other with sideways text.
 */
function Join({ drawn }) {
  const state = drawn ? "drawn" : "pending";

  return (
    <div className="flex flex-col items-center justify-center gap-5 py-7 md:w-48 md:px-4 md:py-0">
      <svg
        width="176"
        height="3"
        viewBox="0 0 176 3"
        aria-hidden
        focusable="false"
        className="join hidden w-full shrink-0 md:block"
        data-draw={state}
        style={{ "--join-origin": "left center", "--join-pending": "0 1" }}
      >
        <path
          d="M0 1.5 H176"
          stroke="var(--color-slate)"
          strokeWidth="3"
          strokeDasharray="3 9"
          strokeLinecap="round"
        />
      </svg>

      <svg
        width="3"
        height="64"
        viewBox="0 0 3 64"
        aria-hidden
        focusable="false"
        className="join shrink-0 md:hidden"
        data-draw={state}
        style={{ "--join-origin": "center top", "--join-pending": "1 0" }}
      >
        <path
          d="M1.5 0 V64"
          stroke="var(--color-slate)"
          strokeWidth="3"
          strokeDasharray="3 9"
          strokeLinecap="round"
        />
      </svg>

      <p className="max-w-56 text-center text-meta text-slate">
        Works together when apprentices move into work
      </p>
    </div>
  );
}
