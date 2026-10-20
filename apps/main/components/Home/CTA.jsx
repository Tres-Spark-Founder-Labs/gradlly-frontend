import Reveal from "./Reveal";

const TRUST_BADGES = [
  "✓ ESFA Registered",
  "✓ Ofsted Ready",
  "✓ WCAG 2.1 AA",
  "✓ No setup fees",
  "✓ Free trial available",
];

export default function CTA() {
  return (
    <section className="bg-emerald-700 text-white text-center py-32 px-6 relative overflow-hidden">
      {/* Soft radial highlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 80% at 50% 50%, rgba(255,255,255,0.06) 0%, transparent 65%)",
        }}
      />

      <div className="max-w-4xl w-full mx-auto relative z-10">
        <Reveal className="w-full text-center  flex justify-center">
          Get started today
        </Reveal>

        <h2 className="font-serif text-4xl md:text-6xl tracking-tight leading-tight mb-6">
          The UK&apos;s apprenticeship future
          <br />
          starts with <em className="italic text-amber-300">your programme.</em>
        </h2>

        <p className="text-lg text-white/70 max-w-xl mx-auto mb-10 leading-relaxed">
          Join the employers, providers, and apprentices already building the
          future of UK apprenticeships on Gradlly. Four portals. One shared
          platform. Set up in minutes.
        </p>

        <div className="flex flex-wrap gap-4 justify-center mb-10">
          <a
            href="#"
            className="bg-white text-emerald-700 font-semibold px-8 py-3 rounded-full hover:bg-amber-50 hover:-translate-y-0.5 transition-all"
          >
            Start free today
          </a>
          <a
            href="#"
            className="border border-white/30 text-white font-semibold px-8 py-3 rounded-full hover:bg-white/10 transition-colors"
          >
            Book a live demo
          </a>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          {TRUST_BADGES.map((b) => (
            <span
              key={b}
              className="text-xs text-white/60 bg-white/10 border border-white/15 px-4 py-1.5 rounded-full"
            >
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
