"use client";

import { useMemo, useState } from "react";

import { useApprenticeRoster } from "@/features/apprentices/queries/apprentices.query";
import { isFlagged } from "@/features/apprentices/utils/risk-status";
import {
  deriveFilterOptions,
  downloadRosterCsv,
  filterRoster,
  nextSortState,
  sortRoster,
} from "@/features/apprentices/utils/roster-export";
import { toastError } from "@/hooks/useToast";

import { EnrolDrawer } from "./EnrolDrawer";
import { statusMeta } from "./helpers";
import { OTJAlert } from "./OTJAlert";
import { ProfilePanel } from "./ProfilePanel";
import { ProviderModal } from "./ProviderModal";
import { RosterTable } from "./RosterTable";
import { RosterToolbar } from "./RosterToolbar";
import { StatCards } from "./StatCards";
import { T } from "./tokens";

export function ApprenticesDashboard() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [advanced, setAdvanced] = useState({});
  const [sort, setSort] = useState({ sortBy: null, sortOrder: "asc" });
  const [profile, setProfile] = useState(null);
  const [contact, setContact] = useState(null);
  const [enrol, setEnrol] = useState(false);

  const { roster, isLoading } = useApprenticeRoster();

  // F1.2.4 AC5 — the alert banner covers both flagged levels. Filtering on
  // `at_risk` alone silently excluded the overdue cases, which are the ones
  // most in need of the banner.
  const atRisk = useMemo(
    () => roster.filter((a) => isFlagged(a.status)),
    [roster],
  );

  // Options come from the roster itself, so they can only ever offer values
  // that exist in the data (F1.2.1 AC4).
  const options = useMemo(() => deriveFilterOptions(roster), [roster]);

  // Applies the search box, the status pills and the advanced dropdowns.
  // Previously only search was applied here while the pills were applied
  // inside the table, so this list did not match what was on screen — which
  // would have made the CSV export write rows the user could not see.
  const visible = useMemo(
    () => sortRoster(filterRoster(roster, { filter, search, advanced }), sort),
    [roster, filter, search, advanced, sort],
  );

  const handleExportCsv = () => {
    const wrote = downloadRosterCsv(visible);
    if (!wrote) toastError("There is nothing to export.");
  };

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center py-24"
        style={{ color: T.muted }}
      >
        <p className="text-sm">Loading apprentices…</p>
      </div>
    );
  }

  return (
    <div
      className="space-y-5"
      style={{ animation: "slide-up 320ms var(--ease-out) both" }}
    >
      <OTJAlert
        atRisk={atRisk}
        onContact={setContact}
        onViewProfile={setProfile}
      />

      <StatCards roster={roster} onFilter={setFilter} />

      {filter !== "all" && (
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold"
            style={{
              backgroundColor: T.blueLight,
              color: T.blue,
              border: `1px solid ${T.blue}20`,
            }}
          >
            {/* Reads the shared status map rather than an inline chain, which
                fell through to "EPA < 90 days" for any status it did not know
                — including "overdue". */}
            Filtering:{" "}
            {filter === "epa_imminent"
              ? "EPA < 90 days"
              : statusMeta(filter).label}
            <button
              type="button"
              onClick={() => setFilter("all")}
              className="hover:opacity-70"
            >
              ×
            </button>
          </span>
        </div>
      )}

      <div className="space-y-3">
        <RosterToolbar
          filter={filter}
          search={search}
          onFilter={setFilter}
          onSearch={setSearch}
          onEnrol={() => setEnrol(true)}
          onExportCsv={handleExportCsv}
          exportCount={visible.length}
          advanced={advanced}
          onAdvancedChange={setAdvanced}
          options={options}
        />
        {/* `visible` is already fully filtered, so the table no longer filters
            again — one source of truth for what is on screen and exported. */}
        <RosterTable
          apprentices={visible}
          filter="all"
          sort={sort}
          onSort={(column) => setSort((c) => nextSortState(c, column))}
          onView={setProfile}
          onContact={setContact}
        />
      </div>

      {/* S4 — Profile panel */}
      {profile && (
        <ProfilePanel
          apprentice={profile}
          onClose={() => setProfile(null)}
          onContact={setContact}
        />
      )}

      {/* S5 — Provider modal */}
      <ProviderModal
        open={!!contact}
        apprentice={
          contact ?? {
            provider: "",
            name: "",
            standard: "",
            otjActual: 0,
            otjExpected: 0,
            providerContact: { name: "", email: "", phone: "" },
          }
        }
        onClose={() => setContact(null)}
      />

      <EnrolDrawer open={enrol} onClose={() => setEnrol(false)} />
    </div>
  );
}
