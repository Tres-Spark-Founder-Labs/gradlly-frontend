import { WHY } from "./constants";
import Reveal from "./Reveal";

export default function Why() {
  return (
    <section className="bg-stone-900 text-white py-28 px-6 relative overflow-hidden">
      {/* Decorative glow */}
      <div
        className="absolute -top-40 -right-40 w-125 h-125 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(46,102,73,0.15) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <p className="font-mono text-xs uppercase tracking-widest text-white/40 mb-3">
          Why Gradlly
        </p>
        <h2 className="font-serif text-white text-4xl md:text-5xl tracking-tight leading-tight mb-14 max-w-lg">
          Why the UK&apos;s apprenticeship future is built on{" "}
          <em className="italic text-amber-400">Gradlly.</em>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
          {WHY.map((w, i) => (
            <Reveal key={i} delay={(i % 3) * 120}>
              <div className="bg-stone-900 hover:bg-stone-800 p-10 transition-colors h-full">
                <div className="w-11 h-11 rounded-xl bg-emerald-900/50 border border-emerald-700/30 flex items-center justify-center text-xl mb-5">
                  {w.icon}
                </div>
                <div className="text-sm font-semibold text-white mb-2">
                  {w.title}
                </div>
                <p className="text-sm text-white/40 leading-relaxed">
                  {w.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
