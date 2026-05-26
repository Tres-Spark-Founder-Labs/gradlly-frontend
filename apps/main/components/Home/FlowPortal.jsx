import Reveal from "./Reveal";

const CARDS = [
  {
    tag: "Levy Donors",
    title: "Large employers, NHS Trusts, local councils",
    desc: "Link your DAS account and let Gradlly do the rest. Your expiring levy reaches SMEs in your region before it lapses — with full ESG reporting.",
    items: [
      "Link DAS account in under 48 hours via ESFA OAuth 2.0",
      "Automated expiry alerts before levy lapses",
      "Set transfer preferences by sector, region, programme type",
      "ESG impact report for annual social value reporting",
      "Compliance documentation auto-generated for every transfer",
    ],
    kpis: [
      { val: "48hrs", label: "Matched, not weeks" },
      { val: "100%", label: "ESFA compliance" },
    ],
  },
  {
    tag: "SME Employers",
    title: "5–249 employees. Any sector. No HR needed.",
    desc: "Check eligibility in seconds. Get registered, matched to a levy donor, and have a learner starting in weeks — at zero cost to your business.",
    items: [
      "Check eligibility instantly — no account required",
      "ESFA registration wizard — 20 minutes start to DAS-linked",
      "Matched to a levy donor automatically — no relationship required",
      "Choose from 4 AI apprenticeship programmes — 100% online",
      "£0 cost to learner — fully levy-funded from day one",
    ],
    kpis: [
      { val: "£5M", label: "Levy to transfer Year 2" },
      { val: ">80%", label: "EPA pass rate" },
    ],
  },
];

export default function FlowPortal() {
  return (
    <section id="flow" className="bg-amber-50 py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-widest text-stone-400 mb-3">
            FlowPortal — Levy Exchange
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight leading-tight mb-4">
            The platform that makes{" "}
            <em className="italic text-amber-600">£3.5 billion move.</em>
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="text-stone-500 text-lg max-w-2xl leading-relaxed mb-14">
            For the first time, large employers can route their expiring levy
            directly to the SMEs who need it most — automatically, compliantly,
            in 48 hours.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {CARDS.map((c, i) => (
            <Reveal key={i} delay={i * 160}>
              <div className="bg-white border border-amber-100 rounded-2xl p-10 relative overflow-hidden h-full">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-amber-500 to-yellow-400" />
                <span className="font-mono text-xs text-amber-600 uppercase tracking-widest block mb-3">
                  {c.tag}
                </span>
                <h3 className="font-serif text-2xl leading-snug mb-3">
                  {c.title}
                </h3>
                <p className="text-sm text-stone-500 leading-relaxed mb-6">
                  {c.desc}
                </p>
                <ul className="flex flex-col gap-2 mb-8">
                  {c.items.map((item, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2 text-sm leading-relaxed"
                    >
                      <span className="text-amber-500 font-bold mt-0.5 shrink-0">
                        →
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-4 flex-wrap">
                  {c.kpis.map((k, j) => (
                    <div
                      key={j}
                      className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3"
                    >
                      <div className="font-serif text-2xl text-amber-600 leading-none mb-1">
                        {k.val}
                      </div>
                      <div className="text-xs text-stone-400">{k.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
