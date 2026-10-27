import { TESTIMONIALS } from "./constants";
import Reveal from "./Reveal";

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-stone-100 py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-widest text-stone-400 mb-3">
            What they&apos;re saying
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight leading-tight mb-14">
            Hear it from the people{" "}
            <em className="italic text-emerald-700">Gradlly was built for.</em>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={i} delay={(i % 3) * 120}>
              <div className="bg-white border border-stone-200 rounded-2xl p-8 hover:-translate-y-1 hover:shadow-xl transition-all h-full flex flex-col">
                {/* Quote */}
                <div className="relative mb-6 flex-1">
                  <span className="absolute -top-3 -left-1 font-serif text-6xl text-emerald-50 leading-none select-none">
                    &quot;
                  </span>
                  <p className="relative z-10 text-sm text-stone-700 leading-relaxed">
                    {t.quote}
                  </p>
                </div>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center font-serif text-emerald-700 text-sm shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold leading-tight">
                      {t.name}
                    </div>
                    <div className="text-xs text-stone-400">{t.role}</div>
                    <span className="inline-block mt-1 text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {t.badge}
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
