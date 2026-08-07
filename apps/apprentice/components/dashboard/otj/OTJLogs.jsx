"use client";

import { useState } from "react";

import { QuickOtjLogSheet } from "@/features/otj/components/QuickOtjLogSheet";

import { OTJHeader } from "./OTJHeader";
import { OTJInfoCard } from "./OTJInfoCard";
import { OTJProgressBar } from "./OTJProgressBar";
import { OTJSessionsList } from "./OTJSessionsList";
import { OTJStatCards } from "./OTJStatCards";
import { OTJWeeklyChart } from "./OTJWeeklyChart";

const OTJ_DATA = {
  apprentice: {
    name: "Jamie Okafor",
    role: "Software Developer L4",
    standard: "ST0116",
    college: "Birmingham Met College",
  },
  today: { date: "Thursday, 20 March 2025", week: 54 },
  hours: { minimum: 439, logged: 198, remaining: 241, percent: 45 },
  pace: { needed: 4.2, actual: 3.9, gateway: "Dec 2025" },
};

export function OTJLogs() {
  const [logOpen, setLogOpen] = useState(false);

  return (
    <>
      <div className="space-y-6 pb-10">
        <OTJHeader data={OTJ_DATA} onLogSession={() => setLogOpen(true)} />
        <OTJStatCards />
        <OTJProgressBar data={OTJ_DATA} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <OTJWeeklyChart />
            <OTJSessionsList onLogSession={() => setLogOpen(true)} />
          </div>
          <div>
            <OTJInfoCard />
          </div>
        </div>
      </div>

      {/* F3.1.1 AC3 — the three-step wizard this replaced contradicted
          "single tap — no multi-step flow" outright. */}
      <QuickOtjLogSheet open={logOpen} onClose={() => setLogOpen(false)} />
    </>
  );
}
