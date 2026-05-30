import { AlertTriangle } from "lucide-react";

import { Card, CardHeader, CardContent } from "@/components/ui/Card";

const WEEKS = [
  { w: "W45", h: 5 },
  { w: "W46", h: 6 },
  { w: "W47", h: 4 },
  { w: "W48", h: 5 },
  { w: "W49", h: 3 },
  { w: "W50", h: 4 },
  { w: "W51", h: 2 },
  { w: "W52", h: 3 },
  { w: "W53", h: 5 },
  { w: "W54", h: 2, current: true },
];

const TARGET = 4.2;
const MAX = 8;
const VW = 400;
const VH = 130;
const LABEL_H = 22;
const GAP = 6;
const barW = VW / WEEKS.length - GAP;

export function OTJWeeklyChart() {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-sm font-semibold text-neutral-800">
          Weekly hours vs target
        </h2>
        <p className="text-xs text-neutral-400 mt-0.5">
          Last 10 weeks · target 4.2h/week
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <svg
          viewBox={`0 0 ${VW} ${VH + LABEL_H}`}
          width="100%"
          className="overflow-visible"
        >
          {[2, 4, 6, 8].map((v) => (
            <line
              key={v}
              x1="0"
              y1={VH - (v / MAX) * VH}
              x2={VW}
              y2={VH - (v / MAX) * VH}
              stroke="var(--color-neutral-100)"
              strokeWidth="1"
            />
          ))}
          <line
            x1="0"
            y1={VH - (TARGET / MAX) * VH}
            x2={VW}
            y2={VH - (TARGET / MAX) * VH}
            stroke="var(--color-primary-400)"
            strokeWidth="1.5"
            strokeDasharray="5 3"
          />
          <text
            x={VW - 2}
            y={VH - (TARGET / MAX) * VH - 5}
            textAnchor="end"
            fontSize="9"
            fill="var(--color-primary-500)"
          >
            target 4.2h
          </text>
          {WEEKS.map((wk, i) => {
            const bh = Math.max((wk.h / MAX) * VH, 4);
            const x = i * (barW + GAP) + GAP / 2;
            const fill = wk.current
              ? "var(--color-warning-400)"
              : wk.h < TARGET
                ? "var(--color-primary-200)"
                : "var(--color-primary-500)";
            return (
              <g key={wk.w}>
                <rect
                  x={x}
                  y={VH - bh}
                  width={barW}
                  height={bh}
                  rx="4"
                  fill={fill}
                />
                <text
                  x={x + barW / 2}
                  y={VH + 15}
                  textAnchor="middle"
                  fontSize="9"
                  fill="var(--color-neutral-400)"
                >
                  {wk.w}
                </text>
                <text
                  x={x + barW / 2}
                  y={VH - bh - 5}
                  textAnchor="middle"
                  fontSize="9"
                  fill="var(--color-neutral-600)"
                >
                  {wk.h}h
                </text>
              </g>
            );
          })}
        </svg>

        <div className="flex items-start gap-3 p-3 rounded-lg bg-warning-50 border border-warning-200">
          <AlertTriangle
            size={14}
            className="text-warning-600 mt-0.5 shrink-0"
          />
          <div>
            <p className="text-xs font-semibold text-warning-800">
              +6h — Log 6 more hours before 31 March to get back on pace.
            </p>
            <p className="text-xs text-warning-600 mt-0.5">
              You&apos;ve averaged 3.9h/week over the last month — just under
              the 4.2h you need.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-neutral-500 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-primary-500 inline-block" />{" "}
            On track
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-primary-200 inline-block" />{" "}
            Under target
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-warning-400 inline-block" />{" "}
            Current week
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
