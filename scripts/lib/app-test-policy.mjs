/**
 * One source of truth for "which apps are expected to run tests".
 *
 * Two checks depend on this list — `verify-app-test-tasks.mjs` (every app HAS a
 * test task) and `verify-test-execution.mjs` (every task actually RAN tests).
 * If each kept its own copy they would drift, and the drift would show up as a
 * check that quietly stops covering an app: the exact failure mode both scripts
 * exist to prevent.
 */
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const APPS_DIR = join(ROOT, 'apps');

/**
 * Apps knowingly without a test task, and why. Each entry is technical debt
 * with a name on it, not an approval — see OQ-5, where removing an app from
 * this list is the unit of P0-C progress.
 */
export const EXEMPT = new Map([
  [
    'provider',
    'No test runner adopted yet (337 source files). Largest untested app; ' +
      'highest priority to remove from this list.',
  ],
  [
    'flow',
    'No test runner adopted yet (220 source files). Portal 4 has zero ' +
      'acceptance-criteria coverage overall — see PROJECT-STATUS.md.',
  ],
  [
    'main',
    'Marketing site: static content, no data layer. Lowest value of the ' +
      'three, but still owes at least a render smoke test.',
  ],
]);

/**
 * Reads every app and its package manifest.
 *
 * Throws rather than returning an empty list when `apps/` cannot be read. A
 * check that treats "found nothing" as "nothing to check" is the bug in
 * miniature, so this fails closed and lets the caller exit non-zero.
 */
export async function readApps() {
  let entries;
  try {
    entries = await readdir(APPS_DIR, { withFileTypes: true });
  } catch (error) {
    throw new Error(
      `Cannot read ${APPS_DIR}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  const dirs = entries.filter((e) => e.isDirectory()).map((e) => e.name);
  if (dirs.length === 0) {
    throw new Error(`No apps found under ${APPS_DIR}. Expected at least one.`);
  }

  return Promise.all(
    dirs.map(async (name) => {
      let pkg = null;
      try {
        pkg = JSON.parse(
          await readFile(join(APPS_DIR, name, 'package.json'), 'utf8'),
        );
      } catch {
        // Left null; callers decide whether an unreadable manifest is fatal.
      }
      return {
        name,
        packageName: pkg?.name ?? null,
        testScript: pkg?.scripts?.test ?? null,
        exemptReason: EXEMPT.get(name) ?? null,
      };
    }),
  );
}
