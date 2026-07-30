"use client";

import { useState } from "react";

import {
  useLevyExpiryCalendar,
  useLevySurplus,
} from "@/features/levy/queries/levy.query";
import { useLevyUtilisation } from "@/features/reporting/queries/reporting.query";

import { ActionCentre } from "./ActionCentre";
import { ApprenticeTable } from "./ApprenticeTable";
import { DasSyncBanner } from "./DasSyncBanner";
import { ExpiryAlert } from "./ExpiryAlert";
import { ExpiryModal } from "./ExpiryModal";
import { ExpiryTimeline } from "./ExpiryTimeline";
import { ExportModal } from "./ExportModal";
import { LevyUtilisation } from "./LevyUtilisation";
import { MonthlyChart } from "./MonthlyChart";
import { OverviewPanel } from "./OverviewPanel";
import { T } from "./tokens";
import { TransferHub } from "./TransferHub";
import { useDasSync } from "./useDasSync";
import { YearEndForecast } from "./YearEndForecast";

function SectionLabel({ children }) {
  return (
    <p
      className="text-[11px] font-bold uppercase tracking-[0.1em]"
      style={{ color: T.muted }}
    >
      {children}
    </p>
  );
}

export function Dashboard() {
  const das = useDasSync();
  const { data: levy } = useLevySurplus();
  const { data: expiryCalendar = [] } = useLevyExpiryCalendar();

  // F1.1.3. GET /reporting/levy-utilisation is purpose-built for this screen:
  // it returns the three utilisation segments, a 12-month contribution/spend
  // series, the forward forecast, and cost-per-apprentice rows. It existed all
  // along but was only ever consumed by the separate /reports page.
  const { data: utilisation, isLoading: utilisationLoading } =
    useLevyUtilisation();

  const [expiryModal, setExpiryModal] = useState(false);
  const [exportModal, setExportModal] = useState(false);
  const openExpiry = () => setExpiryModal(true);
  const openExport = () => setExportModal(true);

  return (
    <div
      className="space-y-8"
      style={{ animation: "slide-up 320ms var(--ease-out) both" }}
    >
      <div className="space-y-3">
        {/* Self-contained: reads the expiry calendar directly (F1.1.2). */}
        <ExpiryAlert />
        <DasSyncBanner
          balance={das.balance}
          isDegraded={das.isDegraded}
          fmtSyncedAt={das.fmtSyncedAt}
          onSync={das.sync}
        />
      </div>

      <section>
        <OverviewPanel
          das={das}
          levy={levy}
          onExpiryModal={openExpiry}
          onExport={openExport}
        />
      </section>

      <section className="space-y-4">
        <SectionLabel>Analysis</SectionLabel>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <LevyUtilisation
            segments={utilisation?.segments}
            isLoading={utilisationLoading}
            onExpiryModal={openExpiry}
          />
          <YearEndForecast
            forecast={utilisation?.forecast}
            segments={utilisation?.segments}
            isLoading={utilisationLoading}
            onExport={openExport}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 items-start">
          <MonthlyChart
            monthlySeries={utilisation?.monthlySeries}
            isLoading={utilisationLoading}
          />
          <ApprenticeTable
            rows={utilisation?.costPerApprentice}
            isLoading={utilisationLoading}
          />
        </div>
      </section>

      <section className="space-y-4">
        <SectionLabel>Planning & Transfers</SectionLabel>
        {/* TransferHub fetches its own transfers; it was previously handed
            match applications, which are a different resource and a different
            shape. */}
        <TransferHub levy={levy} />
        <ExpiryTimeline
          expiryCalendar={expiryCalendar}
          onExpiryModal={openExpiry}
        />
      </section>

      <ActionCentre levy={levy} onSync={das.sync} />

      <ExpiryModal
        open={expiryModal}
        onClose={() => setExpiryModal(false)}
        levy={levy}
      />
      <ExportModal open={exportModal} onClose={() => setExportModal(false)} />
    </div>
  );
}

export default Dashboard;
