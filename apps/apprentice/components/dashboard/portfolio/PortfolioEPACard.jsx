import { ExternalLink, Info } from "lucide-react";

import { Card, CardHeader, CardContent } from "@/components/ui/Card";

const POINTS = [
  "Your portfolio is the basis of AM2: the professional discussion at end-point assessment. You won't be marked on the portfolio itself — the assessor uses it to question you.",
  "Every KSB must be mapped to evidence in your portfolio matrix before gateway.",
  "Two grades available: Pass / Distinction.",
];

export function PortfolioEPACard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-info-50 shrink-0">
            <Info size={16} className="text-info-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-800">
              How your portfolio is used
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              End-point assessment · AM2
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <ul className="space-y-3">
          {POINTS.map((p, i) => (
            <li
              key={i}
              className="flex items-start gap-2.5 text-xs text-neutral-600 leading-relaxed"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5 shrink-0" />
              {p}
            </li>
          ))}
        </ul>
        <div className="pt-2 border-t border-neutral-100">
          <a
            href="https://www.instituteforapprenticeships.org/apprenticeship-standards/software-developer-v1-1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-700 hover:text-primary-800 transition-colors"
          >
            View the full standard (ST0116)
            <ExternalLink size={11} />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
