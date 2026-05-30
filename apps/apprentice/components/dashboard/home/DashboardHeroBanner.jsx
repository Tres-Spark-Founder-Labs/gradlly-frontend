import { ArrowRight, TrendingDown } from "lucide-react";
import Link from "next/link";

// ── Donut chart constants ─────────────────────────────────────────────────────
const R = 42;
const SW = 11;
const SZ = (R + SW) * 2 + 4; // viewBox size with 2px bleed
const CX = SZ / 2;
const CY = SZ / 2;
const CIRC = 2 * Math.PI * R;
const LOGGED_PCT = 45;
const MONTHLY_PCT = Math.round((14 / 18) * 100); // 14h of ~18h monthly target

function DonutChart() {
  const loggedArc = (LOGGED_PCT / 100) * CIRC;
  const _monthlyArc = (MONTHLY_PCT / 100) * CIRC;
  return (
    <div className="relative shrink-0" style={{ width: SZ, height: SZ }}>
      <svg width={SZ} height={SZ} viewBox={`0 0 ${SZ} ${SZ}`}>
        {/* Track */}
        <circle
          cx={CX}
          cy={CY}
          r={R}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={SW}
        />
        {/* Logged arc — amber */}
        <circle
          cx={CX}
          cy={CY}
          r={R}
          fill="none"
          stroke="#fbbf24"
          strokeWidth={SW}
          strokeLinecap="round"
          strokeDasharray={`${loggedArc.toFixed(2)} ${(CIRC - loggedArc).toFixed(2)}`}
          transform={`rotate(-90, ${CX}, ${CY})`}
        />
        {/* Monthly pace tick — white */}
        <circle
          cx={CX}
          cy={CY}
          r={R}
          fill="none"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth={SW}
          strokeLinecap="round"
          strokeDasharray={`1.5 ${CIRC - 1.5}`}
          transform={`rotate(${-90 + (MONTHLY_PCT / 100) * 360}, ${CX}, ${CY})`}
        />
      </svg>
      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
        <span className="text-2xl font-bold text-white leading-none">
          {LOGGED_PCT}%
        </span>
        <span className="text-[10px] text-white/55 font-medium">
          198 / 439h
        </span>
      </div>
    </div>
  );
}

const STATS = [
  { label: "Logged", value: "198h" },
  { label: "Remaining", value: "241h" },
  { label: "This month", value: "14h" },
  { label: "Need/week", value: "4.2h" },
];

export function DashboardHeroBanner({ onLogSession }) {
  return (
    <div
      className="rounded-xl overflow-hidden p-6"
      style={{
        background:
          "linear-gradient(140deg, var(--color-primary-800) 0%, var(--color-primary-600) 100%)",
        animation: "slide-up 320ms var(--ease-out) 60ms both",
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        {/* ── Left: text + CTAs ─────────────────────────────── */}
        <div className="flex-1 min-w-0 space-y-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-warning-300 bg-warning-400/20 border border-warning-400/25 px-2.5 py-1 rounded-full">
            <TrendingDown size={11} />
            4h behind monthly pace · OTJ
          </div>

          <div>
            <h2 className="text-lg font-bold text-white leading-snug">
              Log 6 more hours before 31 March
            </h2>
            <p className="text-sm text-white/65 mt-1.5 leading-relaxed max-w-sm">
              You&apos;re 45% through your off-the-job hours. A small catch-up
              now keeps your December gateway on track.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={onLogSession}
              className="shrink-0 inline-flex items-center h-9 px-4 text-sm font-semibold text-primary-900 bg-white rounded-lg hover:bg-neutral-100 active:scale-[0.97] transition-all select-none"
            >
              Log a session
            </button>
            <Link
              href="/otj-logs"
              className="shrink-0 inline-flex items-center gap-1.5 h-9 px-4 text-sm font-semibold text-white rounded-lg border border-white/25 hover:bg-white/10 active:scale-[0.97] transition-all select-none"
            >
              See my OTJ log <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* ── Right: chart + stats ──────────────────────────── */}
        <div className="flex flex-col items-center gap-4 shrink-0">
          <DonutChart />
          <div className="grid grid-cols-2 gap-x-8 gap-y-2">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-sm font-bold text-white leading-none">
                  {s.value}
                </p>
                <p className="text-[10px] text-white/45 mt-0.5 font-medium">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
