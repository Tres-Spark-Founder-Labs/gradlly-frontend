import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const HERE = path.dirname(fileURLToPath(import.meta.url));

/**
 * No fixture survives in this folder.
 *
 * ── WHY A SOURCE-SCANNING TEST ──────────────────────────────────────────────
 *
 * The component tests prove each tab renders what it was given. They cannot
 * prove a fixture is not sitting underneath as a fallback:
 * `a?.documents ?? DOCS` passes every test that supplies documents, and fails
 * only in production, where `a.documents` was never populated and the fallback
 * was the real behaviour for every apprentice.
 *
 * The property is about the source, so the test reads the source. It is the
 * cheapest guard against the next person adding "just a placeholder while the
 * endpoint lands" — which is exactly how the arrays removed here got in.
 *
 * ── COMMENTS ARE STRIPPED FIRST ─────────────────────────────────────────────
 *
 * Each rewritten component documents what it replaced, quoting the fixture
 * verbatim — "Marcus Reid", "CS-001", "01 Mar 2024" — because a reader needs to
 * know what was on screen before to understand why the code looks as it does.
 * A comment renders nothing, so matching it would fail the guard on the very
 * documentation that explains the fix, and the only way to pass would be to
 * delete that explanation. The property is "no component renders a fabricated
 * value", and stripping comments is what makes the test check exactly that
 * rather than something coarser.
 *
 * The final describe proves the stripping did not neuter the guard.
 */

const files = readdirSync(HERE).filter(
  (f) => f.startsWith("Profile") && f.endsWith(".jsx"),
);

/**
 * Executable source only.
 *
 * Deliberately simple: block comments, then line comments that are not part of
 * a `://` scheme. No component in this folder contains a string with `//` in
 * it, and the bite test below fails loudly if this ever strips too much.
 */
function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/[^\n]*/g, "$1");
}

const code = (file) =>
  stripComments(readFileSync(path.join(HERE, file), "utf8"));

/** The fixtures that shipped, exactly as an employer saw them. */
const INVENTED = [
  "Marcus Reid",
  "Sarah Rahman",
  "David Osei",
  "CS-001",
  "Progressing well",
  "OTJ on pace",
  "Jamie is making great progress",
];

const ARRAY_OF_OBJECTS = /^const\s+[A-Z][A-Z0-9_]*\s*=\s*\[\s*\{/m;
const WRITTEN_DATE =
  /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+20\d{2}\b/;
const DISCARDED_PROP = /\{\s*a:\s*_a\s*\}/;

describe("the profile drawer holds no fixture data", () => {
  it("has profile components to check", () => {
    // Guards the guard: a glob that silently matched nothing would make every
    // assertion below vacuously true.
    expect(files.length).toBeGreaterThanOrEqual(7);
  });

  it.each(files)(
    "%s declares no module-scope array of object literals",
    (file) => {
      // Every fixture in this folder took one shape: a module-scope SCREAMING
      // CASE array of object literals — MILESTONES, REVIEWS, SEED, DOCS. The
      // real constants are objects keyed by status (STATUS, TYPE_COLOR) or
      // arrays of strings (TABS), so neither trips this.
      expect(code(file)).not.toMatch(ARRAY_OF_OBJECTS);
    },
  );

  it.each(files)("%s renders no invented person or reference", (file) => {
    const source = code(file);
    for (const invented of INVENTED) {
      expect(source).not.toContain(invented);
    }
  });

  it.each(files)("%s hardcodes no calendar date", (file) => {
    // "01 Mar 2024", "Nov 2025", "28 Mar 2025 · 09:14" — every date in the old
    // drawer was written into the component. Dates now come from the API and
    // are formatted at render, so a month name beside a year is a fixture.
    expect(code(file)).not.toMatch(WRITTEN_DATE);
  });

  it("no longer hands the apprentice prop to a component that discards it", () => {
    // ProfileTimeline was `({ a: _a })` — it took the apprentice and threw it
    // away. The underscore-prefixed rename satisfied the linter, which is part
    // of why it survived review.
    for (const file of files) {
      expect(code(file)).not.toMatch(DISCARDED_PROP);
    }
  });

  it("normalizeApprentice no longer hardcodes milestones or recentActivity", () => {
    const source = stripComments(
      readFileSync(
        path.join(
          HERE,
          "../../features/apprentices/queries/apprentices.query.js",
        ),
        "utf8",
      ),
    );

    // These were `milestones: []` and `recentActivity: []`, which the drawer
    // rendered as "this apprentice has done nothing".
    expect(source).not.toMatch(/milestones:\s*\[\]/);
    expect(source).not.toMatch(/recentActivity:\s*\[\]/);
  });

  describe("the guard still bites after comments are stripped", () => {
    // Without these, a stripComments that removed too much would make every
    // assertion above pass against a file full of fixtures.
    // Written at column zero, as a real module-scope declaration is.
    const reintroduced = [
      "const DOCS = [",
      '  { name: "Commitment statement (CS-001)", date: "01 Mar 2024" },',
      "];",
      "export function ProfileDocuments({ a: _a }) {",
      "  return DOCS.map((d) => d.name);",
      "}",
    ].join("\n");

    it("still sees a module-scope array of object literals", () => {
      expect(stripComments(reintroduced)).toMatch(ARRAY_OF_OBJECTS);
    });

    it("still sees an invented reference", () => {
      expect(stripComments(reintroduced)).toContain("CS-001");
    });

    it("still sees a hardcoded date", () => {
      expect(stripComments(reintroduced)).toMatch(WRITTEN_DATE);
    });

    it("still sees a discarded apprentice prop", () => {
      expect(stripComments(reintroduced)).toMatch(DISCARDED_PROP);
    });

    it("keeps code that merely sits next to a comment", () => {
      const source = `
        // Marcus Reid used to appear here.
        const REAL = profile.reviews;
      `;
      expect(stripComments(source)).toContain("const REAL = profile.reviews;");
      expect(stripComments(source)).not.toContain("Marcus Reid");
    });
  });
});
