import Reveal from "./Reveal";

const STEPS = [
  {
    n: "1",
    title: "Employer enrols",
    desc: "Creates apprentice profile, selects standard and provider, sends magic-link invitation. Levy balance updates automatically from ESFA DAS.",
  },
  {
    n: "2",
    title: "Provider takes over",
    desc: "Accepts learner, assigns tutor, creates ILR record, syncs to DAS. Commitment statement sent to all three parties for digital signing.",
  },
  {
    n: "3",
    title: "Apprentice logs progress",
    desc: "Logs OTJ in under 30 seconds. Builds KSB portfolio. Every entry visible to employer and provider instantly — no delays, no spreadsheets.",
  },
  {
    n: "4",
    title: "EPA. Completion. ROI.",
    desc: "Gateway readiness auto-calculated. EPA evidence pack exported in one click. Employer receives ROI report. Funding confirmed in DAS.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-stone-900 text-white py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <p className="font-mono text-xs uppercase tracking-widest text-white/40 mb-3">
            How it works
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-white tracking-tight leading-tight mb-4">
            From enrolment to EPA.{" "}
            <em className="italic text-amber-400">Connected in real time.</em>
          </h2>
          <p className="text-white/50 text-lg max-w-xl leading-relaxed">
            Four parties. One shared workflow. Every action visible to everyone
            the moment it happens.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
          {STEPS.map((s, i) => (
            <Reveal key={i} delay={i * 120}>
              <div className="group bg-stone-900 hover:bg-stone-800 p-10 transition-colors relative h-full">
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-emerald-700 to-emerald-400 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
                <div className="font-serif text-6xl text-white/5 leading-none mb-4">
                  {s.n}
                </div>
                <div className="font-serif text-xl text-white mb-3 leading-snug">
                  {s.title}
                </div>
                <p className="text-sm text-white/40 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
