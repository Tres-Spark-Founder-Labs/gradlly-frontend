"use client";

import { useState } from "react";

import { OTJLogModal } from "@/components/dashboard/otj/OTJLogModal";

import { DashboardActivity } from "./DashboardActivity";
import { DashboardGatewayChecklist } from "./DashboardGatewayChecklist";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardHeroBanner } from "./DashboardHeroBanner";
import { DashboardJourneyCard } from "./DashboardJourneyCard";
import { DashboardMetrics } from "./DashboardMetrics";
import { DashboardQuickActions } from "./DashboardQuickActions";
import { DashboardSupport } from "./DashboardSupport";
import { DashboardUpcoming } from "./DashboardUpcoming";

export default function Dashboard() {
  const [logOpen, setLogOpen] = useState(false);
  const open = () => setLogOpen(true);

  return (
    <>
      <div className="space-y-6 pb-10">
        <DashboardHeader />
        <DashboardHeroBanner onLogSession={open} />
        <DashboardMetrics />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-6">
            <DashboardJourneyCard />
            <DashboardGatewayChecklist />
            <DashboardQuickActions onLogSession={open} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <DashboardActivity />
            <DashboardUpcoming />
            <DashboardSupport />
          </div>
        </div>
      </div>

      <OTJLogModal open={logOpen} onClose={() => setLogOpen(false)} />
    </>
  );
}
