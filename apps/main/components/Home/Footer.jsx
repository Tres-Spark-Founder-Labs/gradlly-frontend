const COLUMNS = [
  {
    title: "Platform",
    links: [
      "Employer Portal",
      "Provider Portal",
      "Apprentice Portal",
      "FlowPortal",
      "Pricing",
    ],
  },
  {
    title: "Company",
    links: ["About us", "Careers", "Press", "Blog"],
  },
  {
    title: "Resources",
    links: [
      "ESFA registration guide",
      "Levy Exchange explained",
      "Ofsted preparation guide",
      "OTJ compliance guide",
      "Help centre",
    ],
  },
];

const LEGAL_LINKS = [
  "Privacy policy",
  "Terms of service",
  "Cookie settings",
  "GDPR compliance",
];

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-white pt-20 pb-8 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Top grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="font-serif text-3xl mb-3">
              Gradl<span className="text-emerald-400">ly</span>
            </div>
            <p className="text-sm text-white/40 leading-relaxed max-w-[22ch] mb-6">
              The UK&apos;s first four-portal apprenticeship management
              platform.
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {["ESFA Registered", "Ofsted Ready", "WCAG 2.1 AA"].map((b) => (
                <span
                  key={b}
                  className="font-mono text-xs text-white/40 border border-white/10 px-2.5 py-1 rounded"
                >
                  {b}
                </span>
              ))}
            </div>
            <div className="text-sm text-white/30">hello@gradlly.com</div>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <div className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-5">
                {col.title}
              </div>
              <ul className="flex flex-col gap-3">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-white/50 hover:text-white transition-colors"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-white/25">
            © 2026 Gradlly Ltd. All rights reserved.
          </div>
          <div className="flex gap-6 flex-wrap justify-center">
            {LEGAL_LINKS.map((l) => (
              <a
                key={l}
                href="#"
                className="text-xs text-white/25 hover:text-white/60 transition-colors"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
