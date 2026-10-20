/* global document */

/**
 * Section screenshots at the three widths this design is built for.
 *
 * Not a test. A reviewing tool: it exists so each section can be looked at
 * before it is committed, which is the only way to catch the things a build and
 * a linter cannot see.
 *
 *   node apps/main/e2e/shots.mjs <name> [path]
 *
 * Writes to apps/main/e2e/shots/, which is ignored by git.
 */
import { mkdirSync } from "node:fs";
import path from "node:path";

import { chromium } from "@playwright/test";

const WIDTHS = [390, 768, 1440];
const BASE = process.env.MAIN_URL || "http://localhost:3005";

const [, , name = "page", route = "/"] = process.argv;
const outDir = path.join(process.cwd(), ".shots");
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();

for (const width of WIDTHS) {
  const context = await browser.newContext({
    viewport: { width, height: width >= 1024 ? 900 : Math.round(width * 1.8) },
    deviceScaleFactor: 2,
    // The page's one entrance animation runs on load. Screenshots are taken
    // with it already finished, so what is reviewed is the resting state.
    reducedMotion: "reduce",
  });
  const page = await context.newPage();

  const response = await page.goto(`${BASE}${route}`, {
    waitUntil: "networkidle",
    timeout: 60_000,
  });
  if (!response?.ok()) {
    throw new Error(
      `${BASE}${route} returned HTTP ${response?.status() ?? "no response"}. Is the dev server up?`,
    );
  }

  // Fonts decide the layout. Shooting before they land photographs the
  // fallback stack.
  await page.evaluate(() => document.fonts.ready);

  const file = path.join(outDir, `${name}-${width}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.log(`${width}  ${file}`);

  // A horizontal scrollbar is the single commonest responsive defect and is
  // invisible in a full-page screenshot, so it is asserted rather than looked
  // for.
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  if (overflow > 0) {
    console.error(`FAIL ${width}: horizontal overflow of ${overflow}px`);
    process.exitCode = 1;
  }

  await context.close();
}

await browser.close();
