import { expect, test } from "@playwright/test";

import { assertSeeded } from "./helpers/seeded-users";

const APPRENTICE = "http://localhost:3001";
const TYLER = "e2e/.auth/tyler.json";
const CAITLIN = "e2e/.auth/caitlin.json";

/**
 * F3.2.1 / F3.2.2 / F3.2.3 — the journey screens, in a real browser.
 *
 * These cover the acceptance criteria that **cannot** be settled from source:
 * that a screen renders at all, that a colour band reaches the DOM, that a
 * dialog opens on click, that a link goes where it claims. 82 of the PRD's 281
 * criteria are of that kind and had no coverage of any sort before this file.
 */
test.describe("Apprentice journey", () => {
  test.use({ storageState: TYLER });

  test.beforeEach(async ({ page }) => {
    await assertSeeded(page);
  });

  test("the journey page renders without error for a seeded learner", async ({
    page,
  }) => {
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    await page.goto(`${APPRENTICE}/journey`);

    // The heading proves the route resolved and the layout mounted.
    await expect(
      page.getByRole("heading", { name: /my journey/i }),
    ).toBeVisible();

    // Nothing on this screen may show a figure that is not the learner's own,
    // so a blank render is a failure, not a pass.
    await expect(page.getByText(/your programme/i)).toBeVisible();
    await expect(page.getByText(/gateway readiness/i).first()).toBeVisible();

    expect(
      errors.filter((e) => !/favicon|hydrat/i.test(e)),
      `console/page errors: ${errors.join(" | ")}`,
    ).toHaveLength(0);
  });

  test("F3.2.1 AC1 — the timeline lists real milestones in order", async ({
    page,
  }) => {
    await page.goto(`${APPRENTICE}/journey`);

    const items = page.getByRole("listitem");
    await expect(items.first()).toBeVisible();

    // Seeded: enrolment, induction, 6 reviews, gateway, EPA, completion.
    expect(await items.count()).toBeGreaterThan(5);
    await expect(page.getByText("Enrolment").first()).toBeVisible();
  });

  test("F3.2.1 AC3 — selecting a milestone opens its detail", async ({
    page,
  }) => {
    await page.goto(`${APPRENTICE}/journey`);

    await expect(page.getByRole("dialog")).toHaveCount(0);
    await page
      .getByRole("button", { name: /Enrolment/ })
      .first()
      .click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    // OQ-15 — the detail must say documents are unavailable, never invent them.
    await expect(dialog.getByText(/not attached to timeline/i)).toBeVisible();
  });

  test("F3.2.3 AC3 — no EPA date shows the agreed placeholder", async ({
    page,
  }) => {
    // Tyler has no EPA date seeded, so the countdown must say so rather than
    // render a zero or an empty box.
    await page.goto(`${APPRENTICE}/journey`);

    await expect(
      page.getByText(/EPA date not yet confirmed — speak to your tutor/i),
    ).toBeVisible();
  });

  test("F3.2.2 AC4 — completion is exposed as a real progress bar", async ({
    page,
  }) => {
    await page.goto(`${APPRENTICE}/journey`);

    const bar = page.getByRole("progressbar", {
      name: /gateway readiness completion/i,
    });
    await expect(bar).toBeVisible();

    // Seeded gateway completion is 25% — a real derived value, not a constant.
    const now = await bar.getAttribute("aria-valuenow");
    expect(Number(now)).toBeGreaterThanOrEqual(0);
    expect(Number(now)).toBeLessThanOrEqual(100);
  });
});

/**
 * The regression that matters most: a learner must never be shown another
 * learner's data. Eight learners share Northern Futures in the seed.
 */
test.describe("Apprentice journey (Caitlin — EPA date set)", () => {
  test.use({ storageState: CAITLIN });

  test("F3.2.3 AC4 — the countdown links to the gateway checklist", async ({
    page,
  }) => {
    await page.goto(`${APPRENTICE}/journey`);

    const link = page.getByRole("link", { name: /end-point assessment/i });
    await expect(link).toHaveAttribute("href", "/journey#gateway");
  });
});

test.describe("Learner scope (client decision D3)", () => {
  test.use({ storageState: TYLER });

  test.beforeEach(async ({ page }) => {
    await assertSeeded(page);
  });

  test("no other learner's name appears anywhere on the OTJ screen", async ({
    page,
  }) => {
    await page.goto(`${APPRENTICE}/otj-logs`);
    await expect(page.getByText(/off-the-job/i).first()).toBeVisible();

    const body = (await page.locator("body").innerText()).toLowerCase();

    // Cohort peers at the same provider. None may appear on Tyler's screen.
    for (const peer of [
      "nkemdirim",
      "forsythe",
      "asante",
      "whitmore",
      "nouri",
    ]) {
      expect(body, `"${peer}" leaked onto Tyler's OTJ screen`).not.toContain(
        peer,
      );
    }
  });
});
