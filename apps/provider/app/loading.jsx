import { GradllyLogo } from "@/assets/svgs/GradllyLogo";
import { PORTAL } from "@/config/portal.config";

export default function Loading() {
  return (
    <div className="gl-bg gl-grain fixed inset-0 flex flex-col items-center justify-center overflow-hidden select-none">
      {/* ── Rings + icon ──────────────────────────────────────────────── */}
      <div className="gl-e1 relative z-10 flex items-center justify-center w-32 h-32">
        {/* Outer counter-clockwise ring */}
        <div className="gl-ring-outer absolute inset-0 flex items-center justify-center">
          <svg
            width="128"
            height="128"
            viewBox="0 0 128 128"
            fill="none"
            className="gl-arc-outer"
          >
            {/* Track circle */}
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="var(--color-primary-200)"
              strokeWidth="1"
            />
            {/* Arc */}
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="var(--color-primary-700)"
              strokeWidth="1.25"
              strokeDasharray="28 336"
              strokeLinecap="round"
              strokeDashoffset="-10"
            />
          </svg>
        </div>

        {/* Inner clockwise ring */}
        <div className="gl-ring-inner absolute inset-0 flex items-center justify-center">
          <svg width="88" height="88" viewBox="0 0 88 88" fill="none">
            {/* Track */}
            <circle
              cx="44"
              cy="44"
              r="38"
              stroke="var(--color-primary-100)"
              strokeWidth="1"
            />
            {/* Two arc fragments */}
            <circle
              cx="44"
              cy="44"
              r="38"
              stroke="var(--color-primary-700)"
              strokeWidth="1"
              strokeDasharray="10 52 44 120"
              strokeLinecap="round"
              opacity="0.55"
            />
          </svg>
        </div>

        {/* Icon mark — SVG logo */}
        <div
          className="gl-icon relative z-10 w-[52px] h-[52px] rounded-2xl flex items-center justify-center"
          style={{
            background:
              "linear-gradient(145deg, #ffffff, var(--color-primary-50))",
            border:
              "1px solid color-mix(in srgb, var(--color-primary-700) 12%, transparent)",
          }}
        >
          <GradllyLogo />
        </div>
      </div>

      {/* ── Wordmark ──────────────────────────────────────────────────── */}
      <div className="relative z-10 mt-7 flex flex-col items-center gap-[7px]">
        <span className="gl-e2 text-[17px] font-semibold tracking-[-0.025em] text-primary-800">
          Gradlly
        </span>
        <span className="gl-e3 text-[9.5px] font-medium tracking-[0.22em] uppercase text-primary-600">
          {PORTAL.name}
        </span>
      </div>

      {/* ── Status row ────────────────────────────────────────────────── */}
      <div className="gl-e4 relative z-10 mt-8 flex flex-col items-center gap-4">
        {/* Three-dot pulse sequence */}
        <div className="flex items-center gap-[7px]">
          <span className="gl-d1 block w-[5px] h-[5px] rounded-full bg-primary-700" />
          <span className="gl-d2 block w-[5px] h-[5px] rounded-full bg-primary-700" />
          <span className="gl-d3 block w-[5px] h-[5px] rounded-full bg-primary-700" />
        </div>

        {/* Thin travel-bar */}
        <div
          className="w-32 h-px overflow-hidden rounded-full"
          style={{
            background:
              "color-mix(in srgb, var(--color-primary-700) 10%, transparent)",
          }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: "30%",
              background:
                "linear-gradient(90deg, transparent, var(--color-primary-700), transparent)",
              animation: "gl-track 1.8s cubic-bezier(0.4,0,0.6,1) infinite",
            }}
          />
        </div>
      </div>
    </div>
  );
}
