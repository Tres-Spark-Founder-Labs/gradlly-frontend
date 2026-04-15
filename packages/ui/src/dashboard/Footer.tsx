import Link from "next/link";

import type { FooterData } from "@gradlly/utils";

interface FooterProps {
  data: FooterData;
}

export function Footer({ data }: FooterProps) {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white/70 px-4 py-4 backdrop-blur md:px-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-xs text-slate-500">{data.copyright}</p>
        <div className="flex flex-wrap gap-6">
          {data.sections.map((section) => (
            <div key={section.title} className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-500">
                {section.title}
              </span>
              {section.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs text-slate-600 hover:text-slate-900"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
