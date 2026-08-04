"use client";

import { ShieldAlert, Users, UsersRound } from "lucide-react";
import { useState } from "react";

import Button from "@/components/ui/Button";
import { TabNav } from "@/components/ui/TabNav";
import { useRoleAccess } from "@/features/auth/hooks/useRoleAccess";

import { AssignTutorModal } from "./AssignTutorModal";
import { CohortTable } from "./CohortTable";
import { InterventionQueue } from "./InterventionQueue";
import { TutorCaseloadPanel } from "./TutorCaseloadPanel";
import { useInterventionQueue } from "../queries/learners.query";

const TABS = {
  COHORT: "cohort",
  QUEUE: "queue",
  // F2.2.5 — caseload balance across tutors.
  CASELOAD: "caseload",
};

export function LearnersView() {
  const [tab, setTab] = useState(TABS.COHORT);
  const [assignOpen, setAssignOpen] = useState(false);
  const { can } = useRoleAccess();
  const canAssign = can("admin");

  // Surface the at-risk count as a tab badge (cheap; cached query).
  const { data: queue } = useInterventionQueue();
  const atRiskCount = queue?.atRiskCount ?? 0;

  const tabs = [
    { value: TABS.COHORT, label: "Cohort", icon: Users },
    {
      value: TABS.QUEUE,
      label: "At-risk queue",
      icon: ShieldAlert,
      badge: atRiskCount || undefined,
    },
    { value: TABS.CASELOAD, label: "Tutor caseload", icon: UsersRound },
  ];

  const renderTab = () => {
    if (tab === TABS.COHORT) return <CohortTable />;
    if (tab === TABS.QUEUE) return <InterventionQueue />;
    return <TutorCaseloadPanel />;
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[200px_1fr]">
      <TabNav
        tabs={tabs}
        value={tab}
        onChange={setTab}
        ariaLabel="Learner views"
      />
      <div className="min-w-0 space-y-4">
        {/* F2.2.5 AC1 — bulk assignment, offered where caseload is shown. */}
        {canAssign && tab === TABS.CASELOAD ? (
          <div className="flex justify-end">
            <Button
              size="sm"
              color="green"
              startIcon={<UsersRound className="size-4" />}
              onClick={() => setAssignOpen(true)}
            >
              Assign tutor
            </Button>
          </div>
        ) : null}
        {renderTab()}
      </div>

      {/* Keyed so each open starts from a clean selection. */}
      <AssignTutorModal
        key={assignOpen ? "open" : "closed"}
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
      />
    </div>
  );
}
