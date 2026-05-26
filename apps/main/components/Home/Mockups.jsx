// ─── Shared primitives ──────────────────────────────────────────────────────

function MockupDots({ title }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
      <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
      <span className="ml-2 text-xs text-stone-400 font-mono">{title}</span>
    </div>
  );
}

function MockupRow({ label, right }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-stone-100 text-sm last:border-0">
      <span className="text-stone-700">{label}</span>
      {right}
    </div>
  );
}

function Badge({ color, children }) {
  const colors = {
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-red-50 text-red-700",
  };
  return (
    <span
      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors[color]}`}
    >
      {children}
    </span>
  );
}

// ─── Employer ───────────────────────────────────────────────────────────────

export function EmployerMockup() {
  return (
    <div className="bg-white border  border-stone-200 rounded-2xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.1)]">
      <MockupDots title="Employer Dashboard" />
      <div className="bg-stone-50 rounded-xl p-4 mb-4">
        <div className="text-xs text-stone-400 mb-1">
          Live Levy Balance · ESFA DAS
        </div>
        <div className="font-serif text-3xl text-emerald-700">£142,400</div>
        <div className="text-xs text-stone-400 mt-1">
          Expires in 8 months · £18K at risk
        </div>
        <div className="h-1.5 rounded-full bg-stone-100 mt-3 overflow-hidden">
          <div className="h-full w-[73%] rounded-full bg-linear-to-r from-emerald-700 to-emerald-500" />
        </div>
      </div>
      <div className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">
        Active Apprentices
      </div>
      <MockupRow
        label="Alex M. · Data Technician"
        right={<Badge color="green">On track</Badge>}
      />
      <MockupRow
        label="Priya K. · Software Dev"
        right={<Badge color="green">On track</Badge>}
      />
      <MockupRow
        label="Tom R. · AI Analyst"
        right={<Badge color="amber">Review due</Badge>}
      />
      <MockupRow
        label="Liv J. · Digital Marketer"
        right={<Badge color="red">OTJ behind</Badge>}
      />
      <div className="grid grid-cols-2 gap-3 mt-4">
        {[
          ["94%", "OTJ completion"],
          ["3 due", "EPA this quarter"],
        ].map(([n, l]) => (
          <div key={l} className="bg-stone-50 rounded-xl p-3 text-center">
            <div className="font-serif text-2xl text-emerald-700">{n}</div>
            <div className="text-xs text-stone-400">{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Provider ───────────────────────────────────────────────────────────────

export function ProviderMockup() {
  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.1)]">
      <MockupDots title="Provider Dashboard" />
      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-4">
        <div className="text-xs text-emerald-700 font-semibold uppercase tracking-wide mb-1">
          Live Ofsted EIF Score
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-serif text-4xl text-emerald-700">87</span>
          <span className="text-sm text-stone-400">/100 · Good</span>
        </div>
        <div className="h-1.5 rounded-full bg-emerald-100 mt-2 overflow-hidden">
          <div className="h-full w-[87%] rounded-full bg-emerald-700" />
        </div>
      </div>
      <MockupRow
        label="Quality of Education"
        right={<Badge color="green">Strong</Badge>}
      />
      <MockupRow
        label="Behaviours & Attitudes"
        right={<Badge color="green">Strong</Badge>}
      />
      <MockupRow
        label="Personal Development"
        right={<Badge color="amber">Good</Badge>}
      />
      <MockupRow
        label="Leadership & Management"
        right={<Badge color="amber">Good</Badge>}
      />
      <button className="w-full mt-4 bg-emerald-700 text-white text-sm font-semibold py-3 rounded-xl cursor-pointer">
        ↓ Download Ofsted Evidence Pack · &lt;60s
      </button>
    </div>
  );
}

// ─── Apprentice ─────────────────────────────────────────────────────────────

export function ApprenticeMockup() {
  const r = 40;
  const circ = 2 * Math.PI * r;
  const pct = 0.73;

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.1)]">
      <MockupDots title="Apprentice Portal" />
      <div className="flex justify-center py-4">
        <div className="relative w-24 h-24">
          <svg viewBox="0 0 100 100" className="w-24 h-24 -rotate-90">
            <circle
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke="#f5f5f4"
              strokeWidth="10"
            />
            <circle
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke="#15803d"
              strokeWidth="10"
              strokeDasharray={circ}
              strokeDashoffset={circ * (1 - pct)}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-serif text-2xl text-emerald-700">73%</span>
            <span className="text-xs text-stone-400">OTJ done</span>
          </div>
        </div>
      </div>
      <MockupRow
        label="KSBs Strong"
        right={<Badge color="green">8 of 12</Badge>}
      />
      <MockupRow
        label="KSBs Partial"
        right={<Badge color="amber">3 of 12</Badge>}
      />
      <MockupRow
        label="KSBs Missing"
        right={<Badge color="red">1 of 12</Badge>}
      />
      <MockupRow
        label="EPA Countdown"
        right={
          <span className="text-sm font-semibold text-emerald-700">
            89 days
          </span>
        }
      />
      <button className="w-full mt-4 bg-emerald-700 text-white text-sm font-semibold py-3 rounded-xl">
        + Log OTJ — takes &lt;30 seconds
      </button>
    </div>
  );
}

// ─── FlowPortal ─────────────────────────────────────────────────────────────

export function FlowMockup() {
  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.1)]">
      <MockupDots title="FlowPortal — Levy Exchange" />
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
        <div className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">
          ✓ Match Found · 31 hours
        </div>
        <div className="text-base font-semibold">NHS Trust → Your Agency</div>
        <div className="text-sm text-stone-400 mt-0.5">
          AI Analyst L3 · £8,000 funded
        </div>
      </div>
      <MockupRow
        label="Levy available to you"
        right={<span className="font-bold text-emerald-700">£8,000</span>}
      />
      <MockupRow
        label="Your cost"
        right={<span className="font-bold text-emerald-700">£0</span>}
      />
      <MockupRow
        label="Programme"
        right={<Badge color="green">AI Analyst L3</Badge>}
      />
      <MockupRow
        label="Learner start date"
        right={<span className="text-sm">3 weeks</span>}
      />
      <MockupRow
        label="ESFA compliance docs"
        right={<Badge color="green">Auto-generated</Badge>}
      />
      <button className="w-full mt-4 bg-amber-500 text-white text-sm font-semibold py-3 rounded-xl">
        Accept match & start onboarding →
      </button>
    </div>
  );
}

// ─── Lookup map ─────────────────────────────────────────────────────────────

export const MOCKUP_MAP = {
  employer: EmployerMockup,
  provider: ProviderMockup,
  apprentice: ApprenticeMockup,
  flow: FlowMockup,
};
