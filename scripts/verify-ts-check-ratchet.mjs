#!/usr/bin/env node
/**
 * Security hardening pass, item 8 — the `@ts-check` ratchet.
 *
 * `@ts-check` is opt-in per file, which is what makes it adoptable: the API
 * boundary can be made type-safe today without first migrating every untyped
 * component. The weakness of opt-in is that it is also opt-*out* — deleting one
 * comment silently removes a file from the gate, and nothing notices.
 *
 * This script pins the set. `ts-check-manifest.json` records every file
 * currently checked; CI fails if any of them has lost its directive. Adding
 * files is expected and requires updating the manifest in the same commit, so
 * the set can only grow.
 *
 *   node scripts/verify-ts-check-ratchet.mjs          # verify (CI)
 *   node scripts/verify-ts-check-ratchet.mjs --update # re-record after adding
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const MANIFEST = join(ROOT, 'scripts', 'ts-check-manifest.json');
const APPS = ['employer', 'provider', 'apprentice', 'flow'];

/** Data-fetching layers only — this gate is about the API boundary. */
const SCANNED_SUBDIRS = ['services', 'queries'];

async function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walk(full)));
    } else if (/\.(js|jsx)$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

async function candidateFiles() {
  const files = [];
  for (const app of APPS) {
    const featuresDir = join(ROOT, 'apps', app, 'features');
    for (const file of await walk(featuresDir)) {
      const rel = relative(ROOT, file).split(sep).join('/');
      if (SCANNED_SUBDIRS.some((d) => rel.includes(`/${d}/`))) {
        files.push(rel);
      }
    }
  }
  return files.sort();
}

/**
 * Matches the directive itself, not a mention of it.
 *
 * The first version of this searched the first five lines for the substring
 * "@ts-check". That passed even after the real directive was deleted, because
 * the file's own doc comment explains the directive and sits inside that
 * window — the gate reported success while checking nothing. Caught by
 * deliberately removing the directive and expecting a failure that never came.
 *
 * tsc honours the directive only as a leading comment, so an exact line match
 * is both correct and what the compiler actually does.
 */
function hasTsCheck(relPath) {
  const source = readFileSync(join(ROOT, relPath), 'utf8');
  return source
    .split(/\r?\n/)
    .slice(0, 5)
    .some((line) => /^\s*(\/\/|\/\*)\s*@ts-check\s*(\*\/)?\s*$/.test(line));
}

const all = await candidateFiles();
const checked = all.filter(hasTsCheck);

if (process.argv.includes('--update')) {
  writeFileSync(MANIFEST, `${JSON.stringify({ checked }, null, 2)}\n`);
  console.log(
    `Recorded ${checked.length} of ${all.length} data-layer files as @ts-check'd.`,
  );
  process.exit(0);
}

if (!existsSync(MANIFEST)) {
  console.error(
    'No ts-check-manifest.json. Run: node scripts/verify-ts-check-ratchet.mjs --update',
  );
  process.exit(1);
}

const recorded = JSON.parse(readFileSync(MANIFEST, 'utf8')).checked ?? [];
const lost = recorded.filter((file) => !checked.includes(file));

if (lost.length > 0) {
  console.error(
    `\n✗ ${lost.length} file(s) lost their @ts-check directive:\n` +
      lost.map((f) => `  - ${f}`).join('\n') +
      '\n\nThe ratchet only turns one way. Restore the directive, or if the\n' +
      'file was deliberately removed from the gate, say so explicitly by\n' +
      'updating the manifest in the same commit.\n',
  );
  process.exit(1);
}

const added = checked.filter((file) => !recorded.includes(file));
console.log(
  `✓ ${recorded.length} file(s) still checked` +
    (added.length > 0
      ? `; ${added.length} newly checked and not yet recorded — run --update.`
      : ` of ${all.length} data-layer files.`),
);
