/**
 * Runs the unit tests and then proves they actually ran something.
 *
 * ── WHY THIS EXISTS, GIVEN verify-app-test-tasks.mjs ALREADY RUNS ───────────
 *
 * That check proves every app *has* a `test` task. It cannot prove the task
 * *did* anything. Those are different claims, and the gap between them is where
 * this repository has already been burned twice:
 *
 *   - `dead-code` was `echo`. It had a script. It ran. It measured nothing.
 *   - the OTJ category contract spec took an "app not found" branch and
 *     reported PASS having asserted nothing.
 *
 * A `test` script that resolves to no spec files is the same defect one layer
 * further in: turbo goes green, the step is named "Unit tests", and zero tests
 * executed. `vitest --passWithNoTests` produces exactly that, and so does a
 * glob that stops matching after a directory rename.
 *
 * ── WHY IT READS FILES INSTEAD OF PARSING TURBO'S OUTPUT ────────────────────
 *
 * The first version scraped turbo's stdout for vitest's ` Test Files N passed`
 * line, keyed on turbo's `<package>:test: ` line prefix. It worked locally,
 * under `CI=true`, and under `--log-order=grouped`. It failed on GitHub
 * Actions, because turbo detects Actions and switches to workflow-command
 * grouping — `::group::@gradlly/employer:test` followed by the task body with
 * **no per-line prefix**. Zero lines matched, and the gate reported that no
 * tests had run when in fact both summaries were sitting in the log,
 * unattributed.
 *
 * Log formatting is not a stable contract, and that was the second time in one
 * stage that parsing human-readable output bit us. So each app now writes a
 * machine-readable vitest report to a known path and this reads those files.
 * Attribution comes from the filesystem: the report at `apps/employer/...`
 * describes the employer app, whatever turbo prints.
 *
 * turbo's own `--summarize` JSON was the first choice and does not work — it
 * carries `cache`, `execution` (start/end/exitCode), `logFile`, `hash` and
 * `inputs`, but no test counts. turbo never parses its subprocess output, so it
 * cannot know what vitest did.
 *
 * ── WHY --force ─────────────────────────────────────────────────────────────
 *
 * A cache hit tells you a task succeeded on some machine, for some tree, at
 * some point. It is not evidence that anything executed for the commit under
 * test, and this script exists precisely to observe execution — replaying a
 * cached result would make it self-defeating. Plain `npm run test` keeps the
 * cache and stays fast for local use; this path always executes.
 *
 * ── WHY A STALE REPORT CANNOT PASS ──────────────────────────────────────────
 *
 * The report files are gitignored and are not in the `test` task's `outputs`,
 * so turbo neither caches nor restores them. Belt and braces on top of that:
 * every report is deleted before the run, and each one must carry a
 * `startTime` at or after the moment this script started. A file left behind by
 * an earlier run fails both checks.
 *
 * ── WHAT IS ASSERTED ────────────────────────────────────────────────────────
 *
 *   1. turbo's own exit code is propagated first — a real test failure stays a
 *      test failure and is not masked by anything here.
 *   2. Every non-exempt app produced a report, written by this run.
 *   3. That report contains at least one test file and at least one test.
 *   4. The number of apps that executed is not fewer than the number of
 *      non-exempt apps.
 */
import { spawn } from "node:child_process";
import { readFile, rm } from "node:fs/promises";
import { join } from "node:path";

import { APPS_DIR, EXEMPT, readApps } from "./lib/app-test-policy.mjs";

/** Where each app's test task is expected to write its report. */
const REPORT_RELATIVE = join(".vitest", "report.json");
/** Same path in POSIX form, for messages. */
const REPORT_DISPLAY = ".vitest/report.json";
const reportPathFor = (app) => join(APPS_DIR, app, REPORT_RELATIVE);

const runStart = Date.now();

let apps;
try {
  apps = await readApps();
} catch (error) {
  console.error(
    `\n✗ ${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exit(1);
}

const expected = apps.filter((a) => !EXEMPT.has(a.name));

// Delete first, so nothing left over from an earlier run can be mistaken for
// evidence of this one.
await Promise.all(apps.map((a) => rm(reportPathFor(a.name), { force: true })));

const turboExit = await new Promise((resolve) => {
  const child = spawn("npx", ["turbo", "run", "test", "--force"], {
    shell: true,
    stdio: "inherit",
  });
  child.on("close", (code) => resolve(code ?? 1));
  child.on("error", (error) => {
    console.error(`\n✗ Could not run turbo: ${error.message}\n`);
    resolve(1);
  });
});

// A genuine test failure is reported as a test failure. Nothing below should
// reinterpret it.
if (turboExit !== 0) {
  console.error(`\n✗ Unit tests failed (turbo exited ${turboExit}).\n`);
  process.exit(turboExit);
}

const failures = [];
const executed = [];

for (const app of expected) {
  const path = reportPathFor(app.name);

  let report;
  try {
    report = JSON.parse(await readFile(path, "utf8"));
  } catch {
    failures.push(
      `${app.name}: no test report at ${path}.\n` +
        `      Either the task never ran — \`turbo run test\` skips a package ` +
        `that does not define the task — or its \`test\` script does not write ` +
        `one. Expected \`vitest run --reporter=json ` +
        `--outputFile.json=${REPORT_DISPLAY}\`.`,
    );
    continue;
  }

  // Proves this run produced it, not a leftover file.
  if (typeof report.startTime !== "number" || report.startTime < runStart) {
    failures.push(
      `${app.name}: the report at ${path} predates this run ` +
        `(startTime ${report.startTime}, run started ${runStart}). ` +
        `It is stale and is not evidence that anything executed.`,
    );
    continue;
  }

  const files = Array.isArray(report.testResults)
    ? report.testResults.length
    : 0;
  const tests =
    typeof report.numTotalTests === "number" ? report.numTotalTests : 0;

  if (files === 0 || tests === 0) {
    failures.push(
      `${app.name}: executed ${files} test file(s) and ${tests} test(s). ` +
        `The task ran and exited clean having asserted nothing.\n` +
        `      A test script that matches no specs is not a passing test suite.`,
    );
    continue;
  }

  executed.push({ app: app.name, files, tests });
}

if (executed.length < expected.length) {
  failures.push(
    `${executed.length} app(s) executed tests but ${expected.length} are ` +
      `non-exempt. Every app not named in EXEMPT must contribute test files.`,
  );
}

if (failures.length > 0) {
  console.error("\n✗ Test execution\n");
  for (const f of failures) console.error(`  ${f}\n`);
  process.exit(1);
}

const totalFiles = executed.reduce((sum, e) => sum + e.files, 0);
const totalTests = executed.reduce((sum, e) => sum + e.tests, 0);
console.log(
  `\n✓ Test execution — ${executed.length}/${expected.length} non-exempt app(s) ` +
    `executed ${totalFiles} test file(s) and ${totalTests} test(s): ` +
    executed
      .map((e) => `${e.app} (${e.files} files, ${e.tests} tests)`)
      .join(", ") +
    `; ${EXEMPT.size} exempt.`,
);
