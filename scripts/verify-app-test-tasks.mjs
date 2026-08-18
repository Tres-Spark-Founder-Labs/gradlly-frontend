/**
 * Every app must define a `test` task, or say out loud that it does not.
 *
 * ── WHY THIS EXISTS ─────────────────────────────────────────────────────────
 *
 * CI runs `npm run test`, which is `turbo run test`. Turbo's model is that a
 * package without the task simply is not in the graph — it is skipped, not
 * failed. Three of the five apps had no `test` script, so the step named "Unit
 * tests" passed having covered two of them, and reported success exactly as it
 * would have if it had covered all five.
 *
 * That is the same failure this repository has already shipped twice: a check
 * that reports PASS without executing. `dead-code` was an echo; the OTJ
 * category contract took an "app not found" branch and warned to a log nobody
 * reads. This is the same shape one layer up, and the most dangerous of the
 * three, because the step is named after work it did not do.
 *
 * ── WHY AN EXEMPTION LIST AND NOT A PLACEHOLDER TEST ────────────────────────
 *
 * The obvious fix is to give each app a trivial `test` script so turbo stops
 * skipping it. That is worse than the problem: a placeholder that asserts
 * nothing and exits 0 makes the coverage gap invisible instead of merely
 * silent. An app is either tested, or it is on the EXEMPT list with a reason.
 *
 * ── THE RATCHET PROPERTY ────────────────────────────────────────────────────
 *
 * A NEW app is red by default, because it will not be in EXEMPT. Removing an
 * app's `test` script is red. The only way to be skipped is to be named in
 * `scripts/lib/app-test-policy.mjs`, in a commit, with a justification — which
 * is reviewable, unlike silence.
 *
 * ── WHAT THIS CHECK CANNOT DO ───────────────────────────────────────────────
 *
 * It proves an app HAS a test task. It cannot prove the task RAN anything —
 * a script pointing at zero spec files satisfies this check completely.
 * `verify-test-execution.mjs` closes that half, and the two share one
 * exemption list so they cannot drift apart.
 */
import { EXEMPT, readApps } from './lib/app-test-policy.mjs';

let apps;
try {
  apps = await readApps();
} catch (error) {
  // Fails closed. An unreadable apps/ directory is the one input this check
  // cannot do without, and treating it as "nothing to check" would reproduce
  // the exact bug being fixed.
  console.error(`\n✗ ${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
}

const failures = [];
const tested = [];
const skipped = [];

for (const app of apps) {
  if (app.packageName === null) {
    failures.push(`${app.name}: no readable package.json`);
    continue;
  }

  if (app.testScript) {
    tested.push(app.name);
    // An exempt app that has since gained tests should be taken off the list,
    // or the list stops describing reality.
    if (EXEMPT.has(app.name)) {
      failures.push(
        `${app.name}: has a "test" script but is still listed as EXEMPT. ` +
          `Remove it from EXEMPT in scripts/lib/app-test-policy.mjs.`,
      );
    }
    continue;
  }

  if (EXEMPT.has(app.name)) {
    skipped.push(app.name);
    continue;
  }

  failures.push(
    `${app.name}: no "test" script. \`turbo run test\` skips packages that do ` +
      `not define the task, so this app would be silently excluded from CI ` +
      `while the step still passes.\n` +
      `      Add a "test" script, or add "${app.name}" to EXEMPT in ` +
      `scripts/lib/app-test-policy.mjs with a reason.`,
  );
}

if (failures.length > 0) {
  console.error('\n✗ App test-task coverage\n');
  for (const f of failures) console.error(`  ${f}\n`);
  process.exit(1);
}

console.log(
  `✓ App test-task coverage — ${tested.length}/${apps.length} apps run tests` +
    (skipped.length > 0
      ? `; ${skipped.length} exempt with a recorded reason (${skipped.join(', ')})`
      : ''),
);
