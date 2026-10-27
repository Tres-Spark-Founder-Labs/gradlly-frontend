import { PRICING } from "./constants";
import Reveal from "./Reveal";

export default function Pricing() {
  return (
    <section id="pricing" className="py-28 px-6 bg-stone-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <Reveal className="w-full text-center  flex justify-center">
            <p className="font-mono text-xs uppercase tracking-widest text-stone-400 mb-3">
              Pricing
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight leading-tight mb-4">
              Transparent pricing.{" "}
              <em className="italic text-emerald-700">No surprises.</em>
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="text-stone-500 text-lg leading-relaxed">
              Every plan includes ESFA DAS integration, real-time sync, and full
              audit trail. No setup fees.
            </p>
          </Reveal>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRICING.map((p, i) => (
            <Reveal key={i} delay={i * 80}>
              <div
                className={`relative rounded-2xl p-8 flex flex-col h-full transition-all hover:-translate-y-1 ${
                  p.featured
                    ? "bg-emerald-700 text-white border-2 border-emerald-700 shadow-2xl shadow-emerald-900/30"
                    : "bg-white border border-stone-200 hover:shadow-lg"
                }`}
              >
                {p.featured && (
                  <span className="absolute top-4 right-4 font-mono text-xs tracking-wide uppercase bg-amber-400 text-white px-2.5 py-1 rounded-full">
                    Most popular
                  </span>
                )}

                <span
                  className={`font-mono text-xs uppercase tracking-widest mb-1 ${
                    p.featured ? "text-white/60" : "text-emerald-700"
                  }`}
                >
                  {p.portal}
                </span>

                <div
                  className={`font-serif text-2xl mb-2 ${p.featured ? "text-white" : ""}`}
                >
                  {p.name}
                </div>

                <div
                  className={`text-xs mb-6 leading-relaxed ${
                    p.featured ? "text-white/70" : "text-stone-400"
                  }`}
                >
                  {p.desc}
                </div>

                <div
                  className={`font-serif text-4xl leading-none mb-6 flex items-baseline gap-1 ${
                    p.featured ? "text-white" : ""
                  }`}
                >
                  {p.price}
                  <span
                    className={`text-sm font-sans font-normal ${
                      p.featured ? "text-white/60" : "text-stone-400"
                    }`}
                  >
                    {p.period}
                  </span>
                </div>

                <div
                  className={`h-px mb-5 ${p.featured ? "bg-white/15" : "bg-stone-100"}`}
                />

                <ul className="flex flex-col gap-2 mb-8 flex-1">
                  {p.features.map((f, j) => (
                    <li
                      key={j}
                      className={`flex items-start gap-2 text-xs leading-relaxed ${
                        p.featured ? "text-white/80" : "text-stone-500"
                      }`}
                    >
                      <span
                        className={`font-bold shrink-0 mt-0.5 ${
                          p.featured ? "text-amber-300" : "text-emerald-700"
                        }`}
                      >
                        ✓
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href="#"
                  className={`w-full text-center text-sm font-semibold py-2.5 rounded-full border transition-colors ${
                    p.featured
                      ? "border-white/30 text-white hover:bg-white/10"
                      : "border-stone-200 text-stone-800 hover:border-emerald-700 hover:text-emerald-700"
                  }`}
                >
                  {p.cta}
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
