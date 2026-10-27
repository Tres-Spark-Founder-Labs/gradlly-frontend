import { RESULTS } from "./constants";
import Reveal from "./Reveal";

export default function Results() {
  return (
    <section className="py-28 px-6 bg-stone-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <Reveal className="w-full text-center  flex justify-center">
            <p className="font-mono text-xs uppercase tracking-widest text-stone-400 mb-3">
              Early Results
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight leading-tight mb-4">
              Real results.{" "}
              <em className="italic text-emerald-700">Every portal.</em> Every
              party.
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="text-stone-500 text-lg leading-relaxed">
              Designed with apprentices, providers, and employers — not just for
              them.
            </p>
          </Reveal>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {RESULTS.map((r, i) => (
            <Reveal key={i} delay={(i % 3) * 120}>
              <div className="bg-white border border-stone-200 rounded-2xl p-10 text-center hover:-translate-y-1 hover:shadow-lg transition-all">
                <div className="font-serif text-5xl md:text-6xl text-emerald-700 leading-none tracking-tight mb-3">
                  {r.val}
                </div>
                <div className="text-sm text-stone-500 leading-relaxed">
                  {r.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
