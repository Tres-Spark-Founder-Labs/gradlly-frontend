import { Flag, GraduationCap, MapPin, Trophy } from "lucide-react";

import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { cn } from "@/utils/helper";

const STEPS = [
  {
    icon: MapPin,
    label: "On programme",
    sub: "Mar 2023",
    active: true,
    done: true,
  },
  { icon: Flag, label: "Gateway", sub: "Dec 2025", active: false, done: false },
  {
    icon: GraduationCap,
    label: "EPA window",
    sub: "Early 2026",
    active: false,
    done: false,
  },
  {
    icon: Trophy,
    label: "Qualified",
    sub: "~Mid 2026",
    active: false,
    done: false,
  },
];

export function DashboardJourneyCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-sm font-semibold text-neutral-800">
              Gateway in ~270 days · 15 Dec 2025
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Your journey to qualification
            </p>
          </div>
          <span className="text-xs font-semibold text-primary-700 bg-primary-50 border border-primary-200 px-2.5 py-1 rounded-full">
            52% · Week 54 of 104
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="relative flex items-start justify-between pt-1">
          {/* Track line */}
          <div className="absolute top-4 left-6 right-6 h-0.5 bg-neutral-100 z-0">
            <div
              className="h-full bg-gradient-to-r from-primary-600 to-primary-300 rounded-full"
              style={{ width: "34%" }}
            />
          </div>
          {STEPS.map((s) => (
            <div
              key={s.label}
              className="relative z-10 flex flex-col items-center gap-2 flex-1 min-w-0"
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border-2 bg-white transition-colors",
                  s.active
                    ? "border-primary-600 bg-primary-600 text-white shadow-md"
                    : "border-neutral-200 text-neutral-400",
                )}
              >
                <s.icon size={14} />
              </div>
              <p
                className={cn(
                  "text-xs font-semibold text-center leading-tight",
                  s.active ? "text-primary-700" : "text-neutral-500",
                )}
              >
                {s.label}
              </p>
              <p className="text-xs text-neutral-400 text-center">{s.sub}</p>
            </div>
          ))}
        </div>

        <p className="text-xs text-neutral-500 leading-relaxed border-t border-neutral-100 pt-4">
          EPA has two parts —{" "}
          <strong className="text-neutral-700">
            AM1: work-based project + questioning
          </strong>{" "}
          and{" "}
          <strong className="text-neutral-700">
            AM2: professional discussion
          </strong>{" "}
          underpinned by your portfolio. Graded{" "}
          <strong className="text-neutral-700">Pass / Distinction</strong>.
        </p>
      </CardContent>
    </Card>
  );
}
