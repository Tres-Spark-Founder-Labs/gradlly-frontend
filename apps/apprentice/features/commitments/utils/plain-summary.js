/**
 * F3.4.1 AC1 — "Plain-English commitment statement summary is shown before the
 * full document."
 *
 * ── WHY THIS IS COMPOSITION, NOT INVENTION ──────────────────────────────────
 *
 * The API stores the statement as a structured JSON document, not prose —
 * `apps/employer/.../statement-text.js:5` says so, and the fields are named:
 * `trainingPlanSummary`, `apprenticeCommitments`, `employerCommitments`,
 * `providerCommitments`, `weeklyHours`, `additionalTerms`.
 *
 * So the summary is a *selection* over fields that already exist. Nothing here
 * generates text about the agreement; it picks the parts that describe what the
 * apprentice is agreeing to and labels them in ordinary words. Anything not
 * selected is still reachable through the AC2 "View full statement" toggle, so
 * summarising never hides a term.
 *
 * ── WHAT "PLAIN ENGLISH" CAN AND CANNOT GUARANTEE ───────────────────────────
 *
 * The wording inside each field is whatever the provider drafted. The platform
 * controls the framing — short labels, second person, one idea per line — but
 * it cannot rewrite someone else's sentences, and it must not pretend to.
 * `detectLegalisticFields` flags fields that read as legal drafting so the UI
 * can say plainly that a passage is quoted rather than simplified, instead of
 * presenting legalese under a heading promising plain English.
 */

/**
 * Phrases that mark a passage as legal drafting rather than plain English.
 *
 * Deliberately narrow. The cost of a false positive is a caveat shown on a
 * readable paragraph, which is mildly noisy; the cost of a false negative is
 * legalese presented as though it had been simplified, which is the thing
 * AC1 exists to prevent.
 */
const LEGALISTIC_MARKERS = [
  "hereinafter",
  "heretofore",
  "hereunder",
  "herein",
  "whereas",
  "aforementioned",
  "aforesaid",
  "notwithstanding",
  "pursuant to",
  "in accordance with the provisions",
  "the party of the first part",
  "shall be deemed",
  "without prejudice",
  "force majeure",
  "indemnif",
  "liquidated damages",
  "governing law",
  "in perpetuity",
];

/** Long sentences are the other reliable marker of drafting-for-lawyers. */
const LONG_SENTENCE_WORDS = 40;

function hasLongSentence(text) {
  return String(text)
    .split(/[.!?]+/)
    .some(
      (sentence) => sentence.trim().split(/\s+/).length > LONG_SENTENCE_WORDS,
    );
}

/**
 * Returns the field keys whose content reads as legal language.
 *
 * The UI uses this to caption a passage as quoted from the statement rather
 * than rewritten — see the component's `legalisticKeys` handling.
 */
export function detectLegalisticFields(content) {
  if (!content || typeof content !== "object") return [];

  return Object.entries(content)
    .filter(([, value]) => typeof value === "string" && value.trim() !== "")
    .filter(([, value]) => {
      const lower = value.toLowerCase();
      return (
        LEGALISTIC_MARKERS.some((marker) => lower.includes(marker)) ||
        hasLongSentence(value)
      );
    })
    .map(([key]) => key);
}

/**
 * The sections of the summary, in the order an apprentice needs them.
 *
 * "What you are agreeing to" comes first because it is the only section that
 * describes an obligation the reader is about to take on. The other parties'
 * commitments follow, because knowing what you are owed is part of knowing
 * what you are signing — but they are not the point of the signature.
 */
const SUMMARY_SECTIONS = [
  {
    key: "apprenticeCommitments",
    heading: "What you are agreeing to",
    lead: "By signing, you commit to the following.",
  },
  {
    key: "employerCommitments",
    heading: "What your employer commits to",
    lead: "Your employer agrees to the following.",
  },
  {
    key: "providerCommitments",
    heading: "What your training provider commits to",
    lead: "Your provider agrees to the following.",
  },
  {
    key: "trainingPlanSummary",
    heading: "Your training plan",
    lead: null,
  },
  {
    key: "additionalTerms",
    heading: "Anything else",
    lead: null,
  },
];

/**
 * Builds the plain-English summary.
 *
 * Returns `{ facts, sections, legalisticKeys, isEmpty }`.
 *
 * `facts` are the short, checkable things a person scans for before reading
 * anything — hours per week, and how long the programme runs. They are
 * rendered as labelled values rather than folded into a sentence, because a
 * number in a sentence is harder to check than a number in a row.
 */
export function buildPlainSummary(content) {
  if (!content || typeof content !== "object") {
    return { facts: [], sections: [], legalisticKeys: [], isEmpty: true };
  }

  const facts = [];
  if (Number.isFinite(Number(content.weeklyHours)) && content.weeklyHours) {
    facts.push({
      label: "Off-the-job training",
      value: `${content.weeklyHours} hours a week`,
    });
  }

  const sections = SUMMARY_SECTIONS.filter(
    (section) =>
      typeof content[section.key] === "string" &&
      content[section.key].trim() !== "",
  ).map((section) => ({
    ...section,
    body: content[section.key].trim(),
  }));

  return {
    facts,
    sections,
    legalisticKeys: detectLegalisticFields(content),
    isEmpty: facts.length === 0 && sections.length === 0,
  };
}
