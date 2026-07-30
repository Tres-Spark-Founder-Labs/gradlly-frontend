"use client";
import { Bell, Download, ExternalLink } from "lucide-react";
import { useState } from "react";

import { T } from "@/components/dashboard/levy/tokens";
import { clientEnv } from "@/config/env/client";

import { ActiveTransfers } from "./ActiveTransfers";
import { CreateTransferModal } from "./CreateTransferModal";
import { ESFAModal } from "./ESFAModal";
import { ExpiryBanner } from "./ExpiryBanner";
import { HistoryDrawer } from "./HistoryDrawer";
import { PendingMatchApplications } from "./PendingMatchApplications";
import { PolicyAlert } from "./PolicyAlert";
import { SmeDirectory } from "./SmeDirectory";
import { TransferStatCards } from "./TransferStatCards";

export function LevyTransferDashboard() {
  const [banner, setBanner] = useState(true);
  const [policy, setPolicy] = useState(true);
  const [esfa, setEsfa] = useState(false);
  const [history, setHistory] = useState(false);
  const [createFor, setCreateFor] = useState(null);

  return (
    <div
      className="space-y-5"
      style={{ animation: "slide-up 320ms var(--ease-out) both" }}
    >
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs" style={{ color: T.muted }}>
            Levy Exchange
          </p>
          <h1 className="text-xl font-extrabold" style={{ color: T.ink }}>
            Levy transfer
          </h1>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* F1.1.4 AC6: surface the FlowPortal Levy Exchange (P4), where
              donor–SME matching is automated. Previously FlowPortal was only
              named in body copy with nothing to click. External target, so
              noopener/noreferrer. */}
          <a
            href={`${clientEnv.NEXT_PUBLIC_FLOW_URL}/eligibility`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold hover:opacity-80 transition-opacity"
            style={{ backgroundColor: T.blueLight, color: T.blue }}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            FlowPortal Levy Exchange
          </a>
          <button
            type="button"
            onClick={() => setHistory(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border hover:opacity-75 transition-opacity"
            style={{ borderColor: T.border, color: T.subtle }}
          >
            <Download className="h-3.5 w-3.5" /> Transfer history
          </button>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-xl border hover:opacity-75 transition-opacity"
            style={{ borderColor: T.border, color: T.subtle }}
          >
            <Bell className="h-4 w-4" />
          </button>
        </div>
      </div>

      {banner && (
        <ExpiryBanner
          onDismiss={() => setBanner(false)}
          onFindSME={() =>
            document
              .getElementById("match-applications")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          onLearnMore={() => setEsfa(true)}
        />
      )}

      <TransferStatCards
        onScrollToFinder={() =>
          document
            .getElementById("match-applications")
            ?.scrollIntoView({ behavior: "smooth" })
        }
      />

      {policy && (
        <PolicyAlert
          onViewESFA={() => setEsfa(true)}
          onDismiss={() => setPolicy(false)}
        />
      )}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_400px]">
        <div id="match-applications">
          <PendingMatchApplications onCreateTransfer={setCreateFor} />
          {/* F1.1.4 AC2 — browse/search opted-in SME recipients. */}
          <SmeDirectory />
        </div>
        <ActiveTransfers />
      </div>

      <ESFAModal open={esfa} onClose={() => setEsfa(false)} />
      {history && <HistoryDrawer onClose={() => setHistory(false)} />}
      <CreateTransferModal
        open={!!createFor}
        application={createFor}
        onClose={() => setCreateFor(null)}
      />
    </div>
  );
}
