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

/**
 * The drawer, plus the enrolment form.
 *
 * Widened beyond Profile*.jsx because the same class of fault was found next
 * door: EnrolStep2 offered four invented cohort options in a form that creates
 * real enrolments. A guard that stops at the components someone happened to fix
 * first only proves where the last read-through reached.
 *
 * EnrolStep3 is deliberately excluded from the array-of-objects rule by not
 * being listed: its STAGES array mirrors EnrolmentPipelineState on the API and
 * is real UI labelling, not a fixture.
 */
const files = readdirSync(HERE).filter(
  (f) =>
    (f.startsWith("Profile") ||
      f === "EnrolStep2.jsx" ||
      f === "EnrolDrawer.jsx") &&
    f.endsWith(".jsx"),
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

/**
 * An option list whose entries look like records rather than UI labels.
 *
 * `const COHORTS = ["2024-A", "2024-B", "2024-D", "2025-A"]` — four invented
 * options in a form that files a real enrolment, for a field the API does not
 * have. Keyed on the year-like shape so it catches identifiers without
 * catching legitimate label arrays such as ProfilePanel's TABS.
 */
const INVENTED_OPTION_LIST =
  /^const\s+[A-Z][A-Z0-9_]*\s*=\s*\[[^\]]*["']\d{4}-/m;

/**
 * A funding split asserted rather than read.
 *
 * The Overview tab rendered `${fmt(a.fundingBand)} — 100% levy` on every
 * apprentice. Nothing in the enrolment response describes the levy or
 * co-investment split, so the claim was invented and unconditional.
 */
const UNCONDITIONAL_FUNDING_CLAIM = /100\s*%\s*levy/i;

/**
 * A rate stated as fact with no source.
 *
 * "Current pace: 8 hrs/week · Required pace: 12 hrs/week" was shown to every
 * apprentice who was behind. No endpoint reports a weekly pace.
 */
const HARDCODED_RATE = /\d+\s*hrs?\s*\/\s*week/i;

/**
 * A field `normalizeApprentice` hardcodes to null, interpolated for display.
 *
 * `${a.tutorName} · ${a.tutorEmail}` printed the literal string "null" beside a
 * real tutor's name. Template interpolation has no null handling, so a
 * possibly-absent value has to be branched on, not embedded.
 */
const NULLABLE_INTERPOLATION =
  /\$\{[^}]*\b(tutorEmail|lineManagerEmail|providerContact)\b[^}]*\}/;

/**
 * The roster fields `normalizeApprentice` hands over as null unconditionally.
 *
 * Shared by the two rules below, because the same absence causes two different
 * visible faults: compared, it silently becomes 0; rendered, it prints the word
 * "null".
 */
const KNOWN_NULL_FIELDS = [
  "attendance",
  "otjActual",
  "otjExpected",
  "otjHoursCompleted",
  "otjHoursRequired",
  "tutorEmail",
  "lineManagerEmail",
  "lastActivity",
  "cohort",
];

const FIELD_ALTERNATION = KNOWN_NULL_FIELDS.join("|");

/**
 * How far back to look for the guard on a flagged expression.
 *
 * A JSX guard and the render it protects are separated by the whole opening
 * tag. ProfilePanel's cohort chip puts 228 characters of className and style
 * between `{a.cohort && (` and `{a.cohort}`, so a tighter window reported
 * correct code — a rule that fails working software is worse than no rule,
 * because the only way to satisfy it is to rewrite something already right.
 */
const GUARD_WINDOW = 400;

/**
 * A possibly-null field compared to a threshold without a presence test.
 *
 * `const attWarn = a.attendance < 85` — `null < 85` coerces to `0 < 85`, which
 * is true, so "Below 85% threshold" rendered for every apprentice in the
 * roster, always, about a figure nobody had measured. The null was incidental;
 * the badge was the fault, and it drove employers to act on attendance that did
 * not exist.
 *
 * Guarding is what makes it safe, so a comparison is only reported when no
 * presence test for the same field appears nearby. Written as a function rather
 * than one regex because "unless guarded" is not something a regex expresses.
 */
function nullableComparisons(source) {
  const comparison = new RegExp(
    String.raw`\ba\.(${FIELD_ALTERNATION})\s*(?:<|>|<=|>=)\s*-?\d`,
    "g",
  );
  const found = [];

  for (const match of source.matchAll(comparison)) {
    const field = match[1];
    // The guard may sit just before the comparison (`x !== null && x < 85`) or
    // on a line above it, so a window rather than an exact adjacency.
    const from = Math.max(0, match.index - GUARD_WINDOW);
    const window = source.slice(from, match.index + match[0].length);
    const guarded = new RegExp(
      String.raw`(${field}\s*(?:!==|!=)\s*(?:null|undefined)` +
        String.raw`|(?:null|undefined)\s*(?:!==|!=)\s*${field}` +
        String.raw`|Number\.isFinite\([^)]*${field}` +
        String.raw`|typeof\s+[\w.?]*${field}\s*(?:===|==)\s*["']number["'])`,
    ).test(window);

    if (!guarded) found.push(match[0]);
  }

  return found;
}

/**
 * An exported helper that compares one of its own parameters to a number
 * without first establishing it is one.
 *
 * ── WHY THE COMPONENT-SCOPED RULE COULD NOT SEE THIS ────────────────────────
 *
 * `nullableComparisons` keys on `a.FIELD`, the roster row. It found the
 * comparison when it sat in a component and missed it entirely when it sat in a
 * helper, because at the call site there is nothing to see: `epaDays(a.epaDaysLeft)`
 * is an ordinary function call. The null enters in one file and the comparison
 * happens in another, and a rule that only reads one of them finds nothing.
 *
 * So this reads the helper instead, and asks whether the parameter is
 * established as a number before it is compared. `epaDays` was
 * `days < 60 ? … : …` with no guard, and `null < 60` is true — a red chip
 * reading "nulld" on every roster row with no EPA date.
 *
 * Guards accepted: an isComparableNumber/isFinite style call, an explicit
 * null/undefined test, a typeof check, or an early return on falsiness.
 */
function unguardedHelperComparisons(source) {
  const found = [];
  // Exported arrow helpers, which is the only form this folder uses. A body
  // runs to the next top-level `export` or the end of the module.
  const helper = /export\s+const\s+(\w+)\s*=\s*\(([^)]*)\)\s*=>/g;

  for (const match of source.matchAll(helper)) {
    const [, name, rawParams] = match;
    const params = rawParams
      .split(",")
      .map((p) => p.trim())
      .filter((p) => /^\w+$/.test(p));
    if (params.length === 0) continue;

    const bodyStart = match.index + match[0].length;
    const next = source.slice(bodyStart).search(/\n\s*export\s/);
    const body = source.slice(
      bodyStart,
      next === -1 ? source.length : bodyStart + next,
    );

    for (const param of params) {
      const compares = new RegExp(
        String.raw`\b${param}\b[^;\n]{0,40}?(?:<|>|<=|>=)\s*-?\d`,
      ).test(body);
      if (!compares) continue;

      const guarded = new RegExp(
        String.raw`(isComparableNumber\([^)]*\b${param}\b` +
          String.raw`|Number\.isFinite\([^)]*\b${param}\b` +
          String.raw`|\b${param}\s*(?:===|!==|==|!=)\s*(?:null|undefined)` +
          String.raw`|typeof\s+${param}\s*(?:===|!==)\s*["']number["']` +
          String.raw`|if\s*\(\s*!\s*${param}\s*\)\s*return)`,
      ).test(body);

      if (!guarded) found.push(`${name}(${param})`);
    }
  }

  return found;
}

/**
 * A possibly-null field rendered straight into JSX.
 *
 * `{a.attendance}%` and `{a.otjHoursCompleted} hrs completed` printed the
 * literal string "null" on screen. Same family as NULLABLE_INTERPOLATION above,
 * but for `{expr}` rather than a template string — which is how these four
 * survived that rule.
 *
 * Only a bare field inside the braces matches. `{a.attendance ?? "—"}` and
 * `{attendance !== null && …}` both carry their own handling and are left
 * alone.
 */
function nullableJsxRenders(source) {
  const render = new RegExp(
    String.raw`\{\s*a\.(${FIELD_ALTERNATION})\s*\}`,
    "g",
  );
  const found = [];

  for (const match of source.matchAll(render)) {
    const field = match[1];
    const from = Math.max(0, match.index - GUARD_WINDOW);
    const window = source.slice(from, match.index);

    /*
     * A truthiness guard counts, and is the common shape in JSX:
     * ProfilePanel writes `{a.cohort && (<span>{a.cohort}</span>)}`, which
     * never renders "null" because the branch does not run. Rejecting that
     * would be a rule that fails correct code, and the only way to satisfy it
     * would be to rewrite something that was already right.
     */
    const guarded = new RegExp(
      String.raw`(a\.${field}\s*(?:&&|\?)` +
        String.raw`|${field}\s*(?:!==|!=)\s*(?:null|undefined)` +
        String.raw`|Number\.isFinite\([^)]*${field}` +
        String.raw`|typeof\s+[\w.?]*${field}\s*(?:===|==)\s*["']number["'])`,
    ).test(window);

    if (!guarded) found.push(match[0]);
  }

  return found;
}

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

  it.each(files)("%s offers no invented option list", (file) => {
    expect(code(file)).not.toMatch(INVENTED_OPTION_LIST);
  });

  it.each(files)("%s asserts no funding split of its own", (file) => {
    expect(code(file)).not.toMatch(UNCONDITIONAL_FUNDING_CLAIM);
  });

  it.each(files)("%s states no rate the API does not report", (file) => {
    expect(code(file)).not.toMatch(HARDCODED_RATE);
  });

  it.each(files)("%s interpolates no known-null field for display", (file) => {
    // The fields normalizeApprentice sets to null unconditionally. Rendering
    // one through a template literal prints "null" to the screen.
    expect(code(file)).not.toMatch(NULLABLE_INTERPOLATION);
  });

  it.each(files)("%s renders no known-null field bare in JSX", (file) => {
    expect(nullableJsxRenders(code(file))).toEqual([]);
  });

  it.each(files)("%s compares no known-null field unguarded", (file) => {
    // Reported with the offending text: "found an unguarded comparison" sends
    // the next reader hunting, and the whole reason this rule exists is that
    // the fault is invisible on screen until you know which figure is fake.
    expect(nullableComparisons(code(file))).toEqual([]);
  });

  it("no longer hands the apprentice prop to a component that discards it", () => {
    // ProfileTimeline was `({ a: _a })` — it took the apprentice and threw it
    // away. The underscore-prefixed rename satisfied the linter, which is part
    // of why it survived review.
    for (const file of files) {
      expect(code(file)).not.toMatch(DISCARDED_PROP);
    }
  });

  /**
   * The non-component modules in this folder.
   *
   * A component-scoped rule reads only half the picture: the null enters at the
   * call site and the comparison happens in the helper, so neither file looks
   * wrong on its own. helpers.js is where the thresholds actually live.
   */
  const HELPER_MODULES = readdirSync(HERE).filter(
    (f) => f.endsWith(".js") && !f.endsWith(".test.js"),
  );

  it("has helper modules to check", () => {
    expect(HELPER_MODULES).toContain("helpers.js");
  });

  it.each(HELPER_MODULES)(
    "%s guards every parameter it compares to a threshold",
    (file) => {
      expect(unguardedHelperComparisons(code(file))).toEqual([]);
    },
  );

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

    /*
     * Each rule below is proved against the exact source it was written for.
     * A regex that matches nothing would otherwise pass every file in the
     * folder and look like a guard that found nothing wrong.
     */

    it("sees an invented option list, but not a legitimate label array", () => {
      expect(
        stripComments('const COHORTS = ["2024-A", "2024-B", "2025-A"];'),
      ).toMatch(INVENTED_OPTION_LIST);

      // ProfilePanel's TABS is an array of strings too, and must not trip it.
      expect(
        stripComments('const TABS = ["Overview", "Timeline", "Messages"];'),
      ).not.toMatch(INVENTED_OPTION_LIST);
    });

    it("sees a funding split asserted rather than read", () => {
      expect("{`${fmt(a.fundingBand)} — 100% levy`}").toMatch(
        UNCONDITIONAL_FUNDING_CLAIM,
      );
      expect("{fmt(a.fundingBand)}").not.toMatch(UNCONDITIONAL_FUNDING_CLAIM);
    });

    it("sees a rate no endpoint reports", () => {
      expect("Current pace: 8 hrs/week · Required pace: 12 hrs/week").toMatch(
        HARDCODED_RATE,
      );
    });

    it("sees an unguarded comparison, but not a guarded one", () => {
      // The exact line that shipped.
      expect(nullableComparisons("const attWarn = a.attendance < 85;")).toEqual(
        ["a.attendance < 8"],
      );

      // Every shape of presence test the fix could reasonably take.
      expect(
        nullableComparisons("a.attendance !== null && a.attendance < 85;"),
      ).toEqual([]);
      expect(
        nullableComparisons(
          "if (Number.isFinite(a.attendance)) { warn = a.attendance < 85; }",
        ),
      ).toEqual([]);
      expect(
        nullableComparisons(
          'typeof a.attendance === "number" ? a.attendance < 85 : false;',
        ),
      ).toEqual([]);

      // And the shape this component actually uses: the value is pulled
      // through numberOrNull into a local first, so no `a.FIELD` comparison
      // remains to report.
      expect(
        nullableComparisons(
          "const attendance = numberOrNull(a.attendance);\n" +
            "const below = attendance !== null && attendance < 85;",
        ),
      ).toEqual([]);
    });

    it("sees a known-null field rendered bare in JSX, but not a handled one", () => {
      // The exact lines that printed "null" on screen.
      expect(nullableJsxRenders("<span>{a.attendance}%</span>")).toEqual([
        "{a.attendance}",
      ]);
      expect(nullableJsxRenders("{a.otjHoursCompleted} hrs completed")).toEqual(
        ["{a.otjHoursCompleted}"],
      );

      // Handled forms carry their own absence behaviour and must pass.
      expect(nullableJsxRenders('{a.attendance ?? "Not recorded"}')).toEqual(
        [],
      );
      expect(
        nullableJsxRenders("{attendance !== null && <Dot v={attendance} />}"),
      ).toEqual([]);

      /*
       * The shape ProfilePanel actually uses, at its real width. The inner
       * render is bare, but the branch only runs when the value is truthy.
       *
       * Written out in full rather than collapsed to one line: the guard and
       * the render are 228 characters apart in the real file, and a one-line
       * version of this test passed while the component still failed.
       */
      const guardedChip = [
        "{a.cohort && (",
        "  <span",
        '    className="text-[10px] px-1.5 py-0.5 rounded font-semibold"',
        "    style={{ backgroundColor: T.card, color: T.muted }}",
        "  >",
        "    {a.cohort}",
        "  </span>",
        ")}",
      ].join("\n");
      expect(nullableJsxRenders(guardedChip)).toEqual([]);

      // A field that is genuinely always present is not in scope.
      expect(nullableJsxRenders("{a.provider}")).toEqual([]);
    });

    it("sees an unguarded helper comparison, but not a guarded one", () => {
      /*
       * epaDays exactly as it shipped. `daysUntil()` returns null when the
       * enrolment has no epaDate, `null < 60` is true, and RosterRow rendered
       * a red chip reading "nulld" on every row without one.
       */
      const shipped = [
        "export const epaDays = (days) =>",
        "  days < 60",
        "    ? { color: T.red, label: `${days}d` }",
        "    : days < 180",
        "      ? { color: T.amber, label: `${days}d` }",
        "      : null;",
      ].join("\n");
      expect(unguardedHelperComparisons(shipped)).toEqual(["epaDays(days)"]);

      // The same helper, guarded — the shape it has now.
      const guarded = [
        "export const epaDays = (days) =>",
        "  !isComparableNumber(days)",
        "    ? null",
        "    : days < 60",
        "      ? { color: T.red, label: `${days}d` }",
        "      : null;",
      ].join("\n");
      expect(unguardedHelperComparisons(guarded)).toEqual([]);

      // Both parameters are reported when both are unguarded, so fixing one
      // does not quietly satisfy the rule.
      const twoParams = [
        "export const otjColor = (actual, expected) =>",
        "  actual - expected >= 0 ? T.green : T.red;",
      ].join("\n");
      expect(unguardedHelperComparisons(twoParams)).toEqual([
        "otjColor(actual)",
        "otjColor(expected)",
      ]);

      // A helper that compares nothing numeric is not in scope.
      const stringsOnly = [
        "export const statusMeta = (s) =>",
        '  s === "on_track" ? { label: "On track" } : { label: "Unknown" };',
      ].join("\n");
      expect(unguardedHelperComparisons(stringsOnly)).toEqual([]);
    });

    it("sees a known-null field interpolated for display", () => {
      expect("`${a.tutorName} · ${a.tutorEmail}`").toMatch(
        NULLABLE_INTERPOLATION,
      );

      // Branching on the same field is the fix, and must not trip the rule.
      expect("a.tutorEmail ? a.tutorEmail : null").not.toMatch(
        NULLABLE_INTERPOLATION,
      );
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
