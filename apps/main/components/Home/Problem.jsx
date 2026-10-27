import Reveal from "./Reveal";

const PROBLEMS = [
  {
    num: "01 / PORTALS 1·2·3",
    title: "Everyone's disconnected",
    desc: "Employers, providers, and apprentices share accountability but use entirely disconnected systems. OTJ hours live in spreadsheets. Ofsted evidence gets assembled the night before inspection.",
    stat: "2,700+",
    statLabel: "training providers managing learners on spreadsheets",
  },
  {
    num: "02 / PORTAL 4 · FLOWPORTAL",
    title: "£3.5B expires unspent",
    desc: "FlowPortal's Levy Exchange automates the entire transfer process — matching levy donors to SMEs in 48 hours, generating all ESFA compliance documentation automatically.",
    stat: "£3.5B",
    statLabel: "of levy funds expire annually without reaching SMEs",
  },
  {
    num: "03 / PORTAL 4 · AI PROGRAMMES",
    title: "SMEs locked out of AI skills",
    desc: "Four Level 3 AI apprenticeship programmes designed for SME working patterns — 100% online, no campus days, applied to real job tasks. At zero cost to the learner.",
    stat: "£45B",
    statLabel:
      "estimated productivity loss by 2030 if SME AI gap is not closed",
  },
];

export default function Problem() {
  return (
    <section className="bg-stone-100 py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-widest text-stone-400 mb-3">
            The Problem
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight leading-tight mb-4">
            Three challenges.{" "}
            <em className="italic text-emerald-700">Four portals.</em> One
            answer.
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="text-stone-500 text-lg max-w-2xl leading-relaxed mb-14">
            Gradlly was built to solve the three real barriers stopping UK
            apprenticeships from reaching their potential — for every party
            involved.
          </p>
        </Reveal>

        <div className="grid grid-cols-1  md:grid-cols-3 gap-px bg-stone-200 border border-stone-200 rounded-2xl overflow-hidden">
          {PROBLEMS.map((p, i) => (
            <Reveal key={i} delay={i * 120}>
              <div className="group bg-stone-50 hover:bg-white p-10 transition-colors relative overflow-hidden h-full">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-700 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
                <span className="font-mono text-xs text-stone-400 tracking-wide block mb-5">
                  {p.num}
                </span>
                <h3 className="font-serif text-2xl leading-snug mb-4">
                  {p.title}
                </h3>
                <p className="text-sm text-stone-500 leading-relaxed mb-6">
                  {p.desc}
                </p>
                <div className="font-serif text-4xl text-emerald-700">
                  {p.stat}
                </div>
                <div className="text-xs text-stone-400 mt-1">{p.statLabel}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
