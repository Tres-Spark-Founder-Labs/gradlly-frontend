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
 * ── WHAT IS ASSERTED ────────────────────────────────────────────────────────
 *
 *   1. turbo's own exit code is propagated first — a real test failure stays a
 *      test failure and is not masked by anything here.
 *   2. Every non-exempt app reported a test-file count, and that count is >= 1.
 *   3. The number of apps that executed tests is not fewer than the number of
 *      non-exempt apps.
 *
 * (2) and (3) overlap deliberately. (2) catches an app that ran and found
 * nothing; (3) catches an app whose output never appeared at all — a task that
 * was skipped, filtered out, or silently dropped from the graph.
 *
 * ── PARSING TURBO ───────────────────────────────────────────────────────────
 *
 * turbo prefixes each line with `<package-name>:<task>: `, and vitest prints
 * ` Test Files  17 passed (17)`. The parenthesised number is the total, which
 * is the one that matters: `2 failed | 3 passed (5)` still executed five files.
 *
 * This holds on a cache hit — turbo replays the captured logs, verified against
 * a `FULL TURBO` run showing `2 cached, 2 total` with both summaries intact.
 * If that ever stops being true the counts go missing and this fails closed,
 * which is the correct direction to be wrong in.
 */
import { spawn } from 'node:child_process';

import { EXEMPT, readApps } from './lib/app-test-policy.mjs';

// Matching the ESC character is the entire point of stripping ANSI, so the
// control-character rule is switched off here rather than worked around.
// eslint-disable-next-line no-control-regex
const ANSI = /\u001b\[[0-9;]*m/g;
/** `@gradlly/employer:test: <rest>` */
const TURBO_LINE = /^(\S+):test:\s?(.*)$/;
/** ` Test Files  2 failed | 3 passed (5)` -> 5 */
const TEST_FILES = /Test Files\b.*\((\d+)\)/;
/** vitest's wording when a run matches nothing at all. */
const NO_TEST_FILES = /No test files found/i;

let apps;
try {
  apps = await readApps();
} catch (error) {
  console.error(`\n✗ ${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
}

/** package name -> app directory, so turbo's prefix can be attributed. */
const byPackageName = new Map(
  apps.filter((a) => a.packageName).map((a) => [a.packageName, a.name]),
);

/** app directory -> number of test files it reported. */
const counts = new Map();

function consume(chunk) {
  for (const rawLine of chunk.split(/\r?\n/)) {
    const line = rawLine.replace(ANSI, '');
    const m = TURBO_LINE.exec(line);
    if (!m) continue;

    const app = byPackageName.get(m[1]);
    if (!app) continue;

    const rest = m[2];
    const files = TEST_FILES.exec(rest);
    if (files) {
      counts.set(app, Number(files[1]));
    } else if (NO_TEST_FILES.test(rest)) {
      counts.set(app, 0);
    }
  }
}

const turboExit = await new Promise((resolve) => {
  const child = spawn('npx', ['turbo', 'run', 'test'], {
    shell: true,
    env: { ...process.env, FORCE_COLOR: '0' },
  });

  let stdoutTail = '';
  let stderrTail = '';

  // Streamed through so the developer sees the run live, and captured so it can
  // be asserted on afterwards. Partial lines are buffered — a summary split
  // across two chunks would otherwise be missed and read as "no count".
  child.stdout.on('data', (d) => {
    const s = String(d);
    process.stdout.write(s);
    const merged = stdoutTail + s;
    const idx = merged.lastIndexOf('\n');
    consume(merged.slice(0, idx + 1));
    stdoutTail = merged.slice(idx + 1);
  });

  child.stderr.on('data', (d) => {
    const s = String(d);
    process.stderr.write(s);
    const merged = stderrTail + s;
    const idx = merged.lastIndexOf('\n');
    consume(merged.slice(0, idx + 1));
    stderrTail = merged.slice(idx + 1);
  });

  child.on('close', (code) => {
    consume(stdoutTail);
    consume(stderrTail);
    resolve(code ?? 1);
  });

  child.on('error', (error) => {
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

const expected = apps.filter((a) => !EXEMPT.has(a.name));
const failures = [];
const executed = [];

for (const app of expected) {
  const count = counts.get(app.name);

  if (count === undefined) {
    failures.push(
      `${app.name}: ran no tests that this check could see. No "Test Files" ` +
        `summary appeared in turbo's output for ${app.packageName ?? app.name}.\n` +
        `      Either the task did not run, or its runner does not report a ` +
        `file count — both mean "Unit tests" is passing without evidence.`,
    );
    continue;
  }

  if (count === 0) {
    failures.push(
      `${app.name}: executed 0 test files. The task ran and exited clean ` +
        `having asserted nothing.\n` +
        `      A test script that matches no specs is not a passing test suite.`,
    );
    continue;
  }

  executed.push({ app: app.name, count });
}

if (executed.length < expected.length) {
  failures.push(
    `${executed.length} app(s) executed tests but ${expected.length} are ` +
      `non-exempt. Every app not named in EXEMPT must contribute test files.`,
  );
}

if (failures.length > 0) {
  console.error('\n✗ Test execution\n');
  for (const f of failures) console.error(`  ${f}\n`);
  process.exit(1);
}

const total = executed.reduce((sum, e) => sum + e.count, 0);
console.log(
  `\n✓ Test execution — ${executed.length}/${expected.length} non-exempt app(s) ` +
    `executed ${total} test file(s): ` +
    executed.map((e) => `${e.app} (${e.count})`).join(', ') +
    `; ${EXEMPT.size} exempt.`,
);
