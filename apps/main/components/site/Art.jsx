/**
 * Illustrative artwork.
 *
 * ── WHAT THESE ARE, HONESTLY ────────────────────────────────────────────────
 *
 * Generated compositions, not photographs. There is no stock library here and
 * no camera, so the choice was between nothing and drawing something, and these
 * are drawn: concentric arcs, stacked plates, overlapping fields and woven
 * lines in the palette, each one referencing the subject of the section it sits
 * in rather than being interchangeable decoration.
 *
 * They are abstract on purpose. An illustration of a care worker or a building
 * site would be a picture of a customer this product does not yet have, and a
 * rendered dashboard would be the fabricated screenshot problem again. An
 * abstract composition claims nothing while still giving the page the visual
 * weight it was missing.
 *
 * All SVG: sharp at any density, nothing to download, every colour a token.
 * Animation is ambient and slow, and stops under prefers-reduced-motion.
 */

const OLIVE = "var(--color-olive)";
const TERRACOTTA = "var(--color-terracotta)";
const CHARTREUSE = "var(--color-chartreuse)";
const SAND = "var(--color-sand)";
const LINEN = "var(--color-linen)";

/**
 * Concentric arcs, opening outward.
 *
 * For the record: a thing confirmed once, then confirmed again in each role, so
 * the record grows outward from the first line rather than being replaced.
 */
export function ArcField({ className = "" }) {
  const rings = [
    { r: 42, stroke: OLIVE, width: 1, dash: null, opacity: 1 },
    { r: 66, stroke: OLIVE, width: 1, dash: "5 7", opacity: 0.75 },
    { r: 92, stroke: TERRACOTTA, width: 1, dash: null, opacity: 0.6 },
    { r: 120, stroke: OLIVE, width: 1, dash: "3 9", opacity: 0.45 },
    { r: 150, stroke: TERRACOTTA, width: 1, dash: null, opacity: 0.3 },
  ];

  return (
    <svg
      viewBox="0 0 340 340"
      className={`h-auto w-full ${className}`}
      role="img"
      aria-label="Concentric rings opening outward, each one a further confirmation added to a record"
    >
      <rect width="340" height="340" fill={LINEN} rx="4" />
      <g transform="translate(170 170)">
        {rings.map(({ r, stroke, width, dash, opacity }, index) => (
          <circle
            key={r}
            r={r}
            fill="none"
            stroke={stroke}
            strokeWidth={width}
            strokeDasharray={dash ?? undefined}
            opacity={opacity}
            className="spin"
            style={{
              animationDuration: `${50 + index * 22}s`,
              animationDirection: index % 2 === 0 ? "normal" : "reverse",
            }}
          />
        ))}
        <circle r="13" fill={CHARTREUSE} />
        <circle r="13" fill="none" stroke={OLIVE} strokeWidth="1.5" />
      </g>
    </svg>
  );
}

/**
 * Stacked plates, offset.
 *
 * For the Passport: a document built a layer at a time during delivery, then
 * handed over whole.
 */
export function PlateStack({ className = "" }) {
  const plates = [
    { y: 128, fill: SAND, stroke: SAND },
    { y: 96, fill: LINEN, stroke: "var(--color-hairline)" },
    { y: 64, fill: LINEN, stroke: TERRACOTTA },
    { y: 32, fill: LINEN, stroke: TERRACOTTA },
  ];

  return (
    <svg
      viewBox="0 0 340 260"
      className={`h-auto w-full ${className}`}
      role="img"
      aria-label="Four plates stacked and offset, a record built one layer at a time"
    >
      {plates.map(({ y, fill, stroke }, index) => (
        <g
          key={y}
          className="lift"
          style={{ animationDelay: `${index * 0.6}s` }}
        >
          <rect
            x={34 + index * 12}
            y={y}
            width={238}
            height={72}
            rx="4"
            fill={fill}
            stroke={stroke}
            strokeWidth="1"
          />
          <rect
            x={50 + index * 12}
            y={y + 20}
            width={index === 3 ? 96 : 130}
            height="5"
            rx="2.5"
            fill={index >= 2 ? TERRACOTTA : "var(--color-hairline)"}
            opacity={index >= 2 ? 0.8 : 1}
          />
          <rect
            x={50 + index * 12}
            y={y + 36}
            width={index === 3 ? 150 : 76}
            height="5"
            rx="2.5"
            fill="var(--color-hairline)"
          />
        </g>
      ))}
    </svg>
  );
}

/**
 * Woven lines crossing a central band.
 *
 * For the two products meeting: separate paths that run on their own and cross
 * once, which is exactly what content-v1.md says about them.
 */
export function WeaveField({ className = "" }) {
  return (
    <svg
      viewBox="0 0 340 220"
      className={`h-auto w-full ${className}`}
      role="img"
      aria-label="Two sets of lines running separately and crossing once in the middle"
    >
      <rect width="340" height="220" fill={LINEN} rx="4" />
      <g strokeWidth="1.5" fill="none" strokeLinecap="round">
        {[0, 1, 2, 3, 4].map((index) => (
          <path
            key={`o-${index}`}
            d={`M-10 ${34 + index * 14} C 110 ${34 + index * 14}, 150 ${110 + index * 6}, 350 ${150 + index * 10}`}
            stroke={OLIVE}
            opacity={0.5 - index * 0.06}
            className="weave"
            style={{ animationDelay: `${index * 0.35}s` }}
          />
        ))}
        {[0, 1, 2, 3, 4].map((index) => (
          <path
            key={`t-${index}`}
            d={`M-10 ${186 - index * 14} C 110 ${186 - index * 14}, 150 ${110 - index * 6}, 350 ${70 - index * 10}`}
            stroke={TERRACOTTA}
            opacity={0.5 - index * 0.06}
            className="weave"
            style={{ animationDelay: `${0.2 + index * 0.35}s` }}
          />
        ))}
      </g>
      <rect
        x="150"
        y="88"
        width="40"
        height="44"
        rx="4"
        fill={CHARTREUSE}
        opacity="0.9"
      />
      <rect
        x="150"
        y="88"
        width="40"
        height="44"
        rx="4"
        fill="none"
        stroke={OLIVE}
        strokeWidth="1.5"
      />
    </svg>
  );
}

/**
 * A grid of cells filling in.
 *
 * For compliance: obligations that go from open to covered, which is the Health
 * Score idea without putting a number on it.
 */
export function GridFill({ className = "" }) {
  const cells = Array.from({ length: 48 }, (_, index) => index);
  const filled = new Set([
    0, 1, 2, 3, 6, 7, 8, 12, 13, 14, 15, 18, 19, 24, 25, 26, 27, 30, 31, 32, 36,
    37, 38, 42, 43,
  ]);

  return (
    <svg
      viewBox="0 0 340 220"
      className={`h-auto w-full ${className}`}
      role="img"
      aria-label="A grid of cells, most of them filled, showing obligations covered against obligations open"
    >
      <rect width="340" height="220" fill={LINEN} rx="4" />
      {cells.map((index) => {
        const column = index % 8;
        const row = Math.floor(index / 8);
        const isFilled = filled.has(index);
        return (
          <rect
            key={index}
            x={26 + column * 36}
            y={26 + row * 28}
            width="28"
            height="20"
            rx="2"
            fill={isFilled ? OLIVE : "transparent"}
            stroke={isFilled ? OLIVE : "var(--color-hairline)"}
            strokeWidth="1"
            opacity={isFilled ? 0.88 : 1}
            className={isFilled ? "pulse" : undefined}
            style={
              isFilled ? { animationDelay: `${index * 0.07}s` } : undefined
            }
          />
        );
      })}
    </svg>
  );
}

/**
 * A figure made of the two product colours, with the chartreuse mark.
 *
 * For "who it's for": four audiences reading the same record from different
 * sides, drawn as four columns of different heights around one centre.
 */
export function AudienceField({ className = "" }) {
  const columns = [
    { x: 40, h: 96, fill: OLIVE },
    { x: 104, h: 148, fill: TERRACOTTA },
    { x: 168, h: 118, fill: TERRACOTTA },
    { x: 232, h: 170, fill: OLIVE },
  ];

  return (
    <svg
      viewBox="0 0 340 220"
      className={`h-auto w-full ${className}`}
      role="img"
      aria-label="Four columns of different heights, the four audiences, standing on one line"
    >
      <rect width="340" height="220" fill={LINEN} rx="4" />
      {columns.map(({ x, h, fill }, index) => (
        <g
          key={x}
          className="rise"
          style={{ animationDelay: `${index * 0.14}s` }}
        >
          <rect
            x={x}
            y={182 - h}
            width="48"
            height={h}
            rx="4"
            fill={fill}
            opacity="0.9"
          />
          <rect
            x={x}
            y={176 - h}
            width="48"
            height="4"
            rx="2"
            fill={CHARTREUSE}
          />
        </g>
      ))}
      <rect x="26" y="182" width="288" height="1.5" fill={OLIVE} />
    </svg>
  );
}
