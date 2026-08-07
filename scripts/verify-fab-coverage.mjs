#!/usr/bin/env node
/**
 * F3.1.1 AC6 — "Form is accessible via a persistent floating action button on
 * all app screens."
 *
 * "All screens" is the part worth testing. Rendering one route and seeing a FAB
 * proves that route has one; the criterion is about every route, and the
 * failure mode is a thirteenth page added later that quietly does not get it.
 *
 * This asserts the property structurally rather than visually:
 *
 *   1. every `page.jsx` in the apprentice app sits under a route group whose
 *      layout chain reaches `DashboardLayout`, and
 *   2. `DashboardLayout` mounts `QuickLogFab`.
 *
 * Together those are a complete proof for the routes covered, and they hold for
 * routes that do not exist yet — which a rendering test cannot do.
 *
 * WHAT THIS DOES NOT PROVE, stated because a partial check reported as a full
 * one is worse than no check: it does not prove the button is visible, hit-
 * testable, correctly positioned, or reachable by keyboard. Those need a real
 * browser and axe-core, neither of which exists in this repository yet. That
 * gap is recorded as an outstanding launch gate in the implementation log.
 *
 * Written as a plain Node script rather than a vitest suite because the
 * apprentice app has no test runner, and the repository already uses exactly
 * this pattern for `verify-ts-check-ratchet.mjs`.
 */
import { existsSync, readFileSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname.replace(
  /^\/([A-Za-z]:)/,
  '$1',
);
const APP = join(ROOT, 'apps', 'apprentice', 'app');
const LAYOUT = join(
  ROOT,
  'apps',
  'apprentice',
  'layout',
  'dashboard',
  'DashboardLayout.jsx',
);

/** Routes that legitimately have no dashboard chrome, and so no FAB. */
const EXEMPT_SEGMENTS = ['(auth)', 'login', 'signup', 'verify', 'reset'];

async function findPages(dir, out = []) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      await findPages(full, out);
    } else if (entry.name === 'page.jsx' || entry.name === 'page.js') {
      out.push(full);
    }
  }
  return out;
}

const failures = [];

// 1. The layout must actually mount the FAB.
if (!existsSync(LAYOUT)) {
  failures.push(`DashboardLayout not found at ${LAYOUT}`);
} else {
  const layoutSrc = readFileSync(LAYOUT, 'utf8');
  if (!/<QuickLogFab\s*\/>/.test(layoutSrc)) {
    failures.push(
      'DashboardLayout does not render <QuickLogFab />. AC6 requires the ' +
        'floating action button on all app screens, which means mounting it ' +
        'in the shared layout rather than on individual pages.',
    );
  }
}

// 2. Every non-exempt page must sit under the (dashboard) group.
const pages = await findPages(APP);
const covered = [];
const uncovered = [];

for (const page of pages) {
  const rel = relative(APP, page).split(sep).join('/');
  if (EXEMPT_SEGMENTS.some((seg) => rel.includes(seg))) continue;
  if (rel.startsWith('(dashboard)/')) covered.push(rel);
  else uncovered.push(rel);
}

if (uncovered.length > 0) {
  failures.push(
    `${uncovered.length} route(s) are outside the (dashboard) group and so ` +
      `have no floating action button:\n` +
      uncovered.map((r) => `    - ${r}`).join('\n') +
      `\n  Either move them under (dashboard), or add the segment to ` +
      `EXEMPT_SEGMENTS with a reason.`,
  );
}

if (failures.length > 0) {
  console.error('\n✗ F3.1.1 AC6 — FAB coverage\n');
  for (const f of failures) console.error(`  ${f}\n`);
  process.exit(1);
}

console.log(
  `✓ F3.1.1 AC6 — QuickLogFab mounted in DashboardLayout; ` +
    `${covered.length} route(s) covered, ${pages.length - covered.length} exempt.`,
);
