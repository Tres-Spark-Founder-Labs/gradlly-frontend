import { useState } from "react";

import { PORTALS } from "./constants";
import { MOCKUP_MAP } from "./Mockups";
import Reveal from "./Reveal";

const TAB_LABELS = [
  "01 Employer",
  "02 Provider",
  "03 Apprentice",
  "04 FlowPortal",
];

export default function Portals() {
  const [active, setActive] = useState(0);
  const p = PORTALS[active];
  const Mockup = MOCKUP_MAP[p.mockup];

  return (
    <section id="portals" className="py-28 px-6 bg-stone-50">
      <div className="max-w-6xl mx-auto">
        {/* Intro */}
        <div className="text-center mb-16">
          <Reveal className="w-full text-center  flex justify-center">
            <p className="font-mono text-xs text-center uppercase tracking-widest text-stone-400 mb-3">
              The Platform
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight leading-tight mb-4">
              Four portals. Every party.{" "}
              <em className="italic text-emerald-700">One truth.</em>
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="text-stone-500 text-lg max-w-2xl mx-auto leading-relaxed">
              Each portal is purpose-built for its users. All four share the
              same real-time data layer — so when an apprentice logs OTJ on
              their phone, their employer and provider see it immediately.
            </p>
          </Reveal>
        </div>

        {/* Tabs */}
        <Reveal>
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {TAB_LABELS.map((label, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`text-sm font-semibold px-5 py-2 rounded-full border transition-all ${
                  active === i
                    ? "bg-emerald-700 text-white border-emerald-700"
                    : "bg-transparent text-stone-800 border-stone-200 hover:border-emerald-700 hover:text-emerald-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 px-10 gap-12 items-center">
          <div>
            <span className="font-mono text-xs tracking-widest uppercase text-emerald-700 block mb-3">
              {p.num}
            </span>
            <h3 className="font-serif text-3xl md:text-4xl leading-tight tracking-tight mb-4">
              {p.title}
            </h3>
            <p className="text-stone-500 leading-relaxed mb-8">{p.desc}</p>

            <ul className="flex flex-col gap-3 mb-10">
              {p.features.map((f, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm leading-relaxed"
                >
                  <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center justify-center mt-0.5">
                    ✓
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap  gap-4">
              {p.kpis.map((k, i) => (
                <div
                  key={i}
                  className="bg-emerald-50 px-5  border border-emerald-100 rounded-xl py-3"
                >
                  <div className="font-serif text-3xl text-emerald-700 leading-none mb-1">
                    {k.val}
                  </div>
                  <div className="text-xs text-stone-400">{k.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="">
            <Mockup />
          </div>
        </div>
      </div>
    </section>
  );
}
