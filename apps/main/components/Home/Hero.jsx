export default function Hero() {
  return (
    <section className="relative min-h-screen  flex flex-col items-center justify-center text-center md:px-6 pt-36 pb-24 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0   pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% -10%, rgba(46,102,73,0.1) 0%, transparent 65%), radial-gradient(ellipse 50% 40% at 85% 85%, rgba(184,150,58,0.08) 0%, transparent 55%)",
          }}
        />
        <div
          className="absolute inset-0  opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage:
              "radial-gradient(ellipse 90% 85% at 50% 30%, black 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10  w-full px-3  md:max-w-4xl mx-auto">
        {/* Tag */}
        <div
          className="inline-flex items-center gap-2  font-mono text-xs font-medium tracking-widest uppercase text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-4 py-1.5 rounded-full mb-8"
          style={{ animation: "fadeUp 0.8s 0.1s ease forwards", opacity: 0 }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
          UK&apos;s First Four-Portal Apprenticeship Platform
        </div>

        {/* Heading */}
        <h1
          className="font-serif text-5xl md:text-7xl leading-[1.02] tracking-tight mb-6"
          style={{ animation: "fadeUp 0.9s 0.3s ease forwards", opacity: 0 }}
        >
          The UK&apos;s apprenticeship{" "}
          <em className="italic text-emerald-700">future</em> starts here.
        </h1>

        {/* Description */}
        <p
          className="text-lg md:text-xl text-stone-500 max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ animation: "fadeUp 0.9s 0.5s ease forwards", opacity: 0 }}
        >
          Gradlly connects employers, training providers, apprentices, and SMEs
          on one shared real-time platform — zero levy waste, every learner
          supported, every programme seamless.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-wrap gap-4 justify-center mb-16"
          style={{ animation: "fadeUp 0.9s 0.7s ease forwards", opacity: 0 }}
        >
          <a
            href="#"
            className="flex items-center gap-2 bg-emerald-700 text-white font-semibold px-6 py-3 rounded-full hover:bg-emerald-600 hover:-translate-y-0.5 transition-all shadow-lg shadow-emerald-900/20"
          >
            Start for free today <span>›</span>
          </a>
          <a
            href="#portals"
            className="flex items-center gap-2 border border-stone-200 font-semibold px-6 py-3 rounded-full hover:border-emerald-700 text-emerald-700 transition-colors"
          >
            Explore the platform
          </a>
        </div>

        {/* Portal pills */}
        <div
          className="flex flex-wrap gap-3 justify-center"
          style={{ animation: "fadeUp 0.9s 0.9s ease forwards", opacity: 0 }}
        >
          {[
            ["01", "Employer Portal"],
            ["02", "Provider Portal"],
            ["03", "Apprentice Portal"],
            ["04", "FlowPortal"],
          ].map(([n, l]) => (
            <div
              key={n}
              className="flex items-center gap-2 bg-white border border-stone-200 rounded-full px-4 py-2 text-sm font-medium shadow-sm hover:border-emerald-700 hover:-translate-y-0.5 transition-all cursor-default"
            >
              <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-mono flex items-center justify-center">
                {n}
              </span>
              {l}
            </div>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-xs text-stone-400 tracking-widest uppercase"
        style={{ animation: "fadeIn 1s 1.2s ease forwards", opacity: 0 }}
      >
        <div className="w-px h-10 bg-linear-to-b from-emerald-700 to-transparent" />
        scroll
      </div>

      {/* Keyframes (scoped to this section) */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </section>
  );
}
