import { Info, CheckCircle, XCircle } from "lucide-react";

import { Card, CardHeader, CardContent } from "@/components/ui/Card";

const COUNTS = [
  "Workshops & lectures",
  "Online learning & self-study/research",
  "Shadowing, mentoring & coaching",
  "Project/assignment work teaching new KSBs",
  "Portfolio evidence & EPA prep",
  "Industry events",
];

const EXCLUDED = [
  "Initial onboarding/induction",
  "Standalone English & maths",
  "Progress reviews",
  "Training outside paid hours",
  "Normal day-to-day job tasks",
  "Anything not required by the standard",
];

export function OTJInfoCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-info-50 shrink-0">
            <Info size={16} className="text-info-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-800">
              How off-the-job training works on your standard
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Updated for the August 2025 funding rules
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs text-neutral-600 leading-relaxed">
          Your apprenticeship has a{" "}
          <strong className="text-neutral-800">
            fixed minimum of 439 hours
          </strong>{" "}
          of OTJ training published by Skills England. Since Aug 2025 it&apos;s
          a set figure — no longer tied to programme length. Must happen in paid
          working hours and develop your KSBs.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-success-700 mb-2 flex items-center gap-1.5">
              <CheckCircle size={12} /> Counts
            </p>
            <ul className="space-y-1.5">
              {COUNTS.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-1.5 text-xs text-neutral-600"
                >
                  <span className="text-success-500 shrink-0 mt-0.5">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold text-danger-700 mb-2 flex items-center gap-1.5">
              <XCircle size={12} /> Doesn&apos;t count
            </p>
            <ul className="space-y-1.5">
              {EXCLUDED.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-1.5 text-xs text-neutral-600"
                >
                  <span className="text-danger-400 shrink-0 mt-0.5">✕</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
