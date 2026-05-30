"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";

export const SESSIONS = [
  {
    id: "s1",
    title: "Built inventory feature to design spec",
    ksbs: ["K11", "S12"],
  },
  {
    id: "s2",
    title: "Stakeholder demo: reporting dashboard",
    ksbs: ["S15", "B7"],
  },
  {
    id: "s3",
    title: "Optimised search with a better algorithm",
    ksbs: ["S16", "K9"],
  },
];

export const PROJECT_KSBS = [
  "K11",
  "S12",
  "S15",
  "S16",
  "S17",
  "B6",
  "B7",
  "B8",
  "B9",
];

export const GAP_SUGGESTIONS = {
  K11: "Capture the design doc from your next feature build",
  S12: "Reflective account of building to a given spec",
  S15: "Record/slide your next demo and add a reflection",
  S16: "Annotated code from an algorithm-heavy task",
  B8: "Short reflection on why a feature mattered to the business",
  K4: "Document your approach to communicating with different stakeholders",
  K9: "Code walkthrough of an algorithm-heavy feature",
  K12: "Write up your test strategy for a recent feature",
  S5: "Document the different test types used in a recent project",
  S9: "Share a user story you refined with the team",
  S13: "Evidence of following the test framework in a sprint",
  S14: "PR history with commit messages and CI run",
  S17: "Code review showing secure coding patterns",
  B6: "Case study of a problem you solved proactively",
  B7: "Reflection on a presentation or demo you gave",
  B9: "Log of training, reading, or side-projects this quarter",
};

export function usePlanPageState() {
  const [planItems, setPlanItems] = useState([]);
  const [usedSessions, setUsedSessions] = useState(new Set());
  const [testimonyDone, setTestimonyDone] = useState(false);
  const [filter, setFilter] = useState("All gaps");
  const [projOpen, setProjOpen] = useState(false);
  const [projSelected, setProjSelected] = useState(new Set(PROJECT_KSBS));

  const doneKSBs = useMemo(
    () =>
      new Set(
        planItems.filter((i) => i.status === "done").flatMap((i) => i.ksbs),
      ),
    [planItems],
  );
  const plannedKSBs = useMemo(
    () => new Set(planItems.flatMap((i) => i.ksbs)),
    [planItems],
  );

  const totalEvidenced = 22 + doneKSBs.size;
  const doneCount = planItems.filter((i) => i.status === "done").length;
  const unplannedCount = 16 - new Set(planItems.flatMap((i) => i.ksbs)).size;

  function gapStatus(code) {
    const item = planItems.find((i) => i.ksbs.includes(code));
    if (!item) return "unplanned";
    return item.status === "done" ? "done" : "planned";
  }

  function addItem(item) {
    setPlanItems((p) => [
      ...p,
      { ...item, id: Date.now() + Math.random(), status: "planned" },
    ]);
    toast.success(`${item.ksbs.join(", ")} added to your plan.`);
  }

  function removeItem(id) {
    setPlanItems((p) => p.filter((i) => i.id !== id));
    toast("Item removed from plan.");
  }

  function updateItem(id, updates) {
    setPlanItems((p) => p.map((i) => (i.id === id ? { ...i, ...updates } : i)));
    if (updates.status === "done")
      toast.success("Marked done — KSBs counted as evidenced.");
  }

  function addProject() {
    const ksbs = Array.from(projSelected).filter((c) => !plannedKSBs.has(c));
    if (!ksbs.length) {
      toast("All selected KSBs already planned.");
      return;
    }
    addItem({
      title: "Work-based EPA project",
      ksbs,
      type: "Code / repo",
      work: "Work-based project (EPA)",
      date: "2025-10-01",
    });
    setProjOpen(false);
  }

  function convertSession(session) {
    addItem({
      title: session.title,
      ksbs: session.ksbs,
      type: "Reflective account",
      work: "Self-directed study",
      date: "",
    });
    setUsedSessions((p) => new Set([...p, session.id]));
  }

  function requestTestimony() {
    addItem({
      title: "Witness testimony — line manager",
      ksbs: ["B6", "B7"],
      type: "Witness testimony",
      work: "Work context",
      date: "2025-04-15",
    });
    setTestimonyDone(true);
  }

  return {
    planItems,
    filter,
    setFilter,
    projOpen,
    setProjOpen,
    projSelected,
    setProjSelected,
    doneKSBs,
    plannedKSBs,
    totalEvidenced,
    unplannedCount,
    doneCount,
    planCount: planItems.length,
    gapStatus,
    addItem,
    removeItem,
    updateItem,
    addProject,
    convertSession,
    requestTestimony,
    testimonyDone,
    availableSessions: SESSIONS.filter((s) => !usedSessions.has(s.id)),
  };
}
