import path from "node:path";

import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { APPS } from "../playwright.config";

const AUTH_DIR = path.join(process.cwd(), "e2e", ".auth");
const BLOCKING_IMPACTS = new Set(["serious", "critical"]);
const AUDIT_TIMEOUT_MS = 300_000;

const AUTH = {
  apprentice: path.join(AUTH_DIR, "tyler.json"),
  employer: path.join(AUTH_DIR, "employer.json"),
  flow: path.join(AUTH_DIR, "flow.json"),
  provider: path.join(AUTH_DIR, "provider.json"),
};

function formatViolations(findings) {
  if (!findings.length) return "No serious or critical axe violations.";

  return findings
    .flatMap(({ portal, route, violation }) =>
      violation.nodes.map(
        (node) =>
          `[${portal} ${route}] ${violation.id} (${violation.impact})\n` +
          `  element: ${node.target.join(" ")}\n` +
          `  html: ${node.html}\n` +
          `  ${node.failureSummary ?? violation.help}`,
      ),
    )
    .join("\n\n");
}

async function openRoute(page, portal, route) {
  const url = `${APPS[portal]}${route}`;
  const response = await page.goto(url, {
    waitUntil: "domcontentloaded",
    timeout: 60_000,
  });

  if (!response?.ok()) {
    throw new Error(
      `Audit precondition failed: ${url} returned HTTP ${response?.status() ?? "no response"}. ` +
        "Start the complete, pinned stack; Playwright deliberately does not boot it.",
    );
  }

  await expect(
    page,
    `Unexpected sign-in redirect while opening ${url}`,
  ).not.toHaveURL(/\/login(?:\?|$)/);
  await page
    .waitForLoadState("networkidle", { timeout: 15_000 })
    .catch(() => {});
  const isPublicFlowRoute =
    portal === "flow" && ["/eligibility", "/register"].includes(route);
  const main = page.locator(isPublicFlowRoute ? "main" : "main#main-content");
  await expect(
    main.first(),
    `The ${portal} shell did not finish loading for ${url}`,
  ).toBeVisible({ timeout: 60_000 });
}

async function auditCurrentPage(page, testInfo, portal, route, findings) {
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  const blocking = result.violations.filter((violation) =>
    BLOCKING_IMPACTS.has(violation.impact),
  );

  findings.push(...blocking.map((violation) => ({ portal, route, violation })));
  await testInfo.attach(
    `axe-${portal}-${route.replaceAll("/", "-") || "dashboard"}.json`,
    {
      body: Buffer.from(JSON.stringify(result, null, 2)),
      contentType: "application/json",
    },
  );
}

async function measureContrast(page, portal, testInfo) {
  const measurements = await page.evaluate(() => {
    /**
     * Computed colours may be hex, rgb(), lab(), oklch() or color(). Painting
     * them to a canvas lets Chromium perform the standards-compliant sRGB
     * conversion instead of maintaining a partial CSS colour parser here.
     */
    const canvas = globalThis.document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context)
      throw new Error("Could not create a colour conversion canvas");

    const toRgb = (value) => {
      if (!globalThis.CSS.supports("color", value)) {
        throw new Error(`Invalid CSS colour in contrast specimen: ${value}`);
      }

      context.clearRect(0, 0, 1, 1);
      context.fillStyle = value;
      context.fillRect(0, 0, 1, 1);
      const [red, green, blue, alpha] = context.getImageData(0, 0, 1, 1).data;
      if (alpha !== 255) {
        throw new Error(
          `Contrast specimens must be opaque; received ${value} (alpha ${alpha})`,
        );
      }
      return [red, green, blue];
    };
    const luminance = (rgb) => {
      const linear = rgb.map((channel) => {
        const value = channel / 255;
        return value <= 0.04045
          ? value / 12.92
          : ((value + 0.055) / 1.055) ** 2.4;
      });
      return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
    };
    const ratio = (foreground, background) => {
      const lighter = Math.max(luminance(foreground), luminance(background));
      const darker = Math.min(luminance(foreground), luminance(background));
      return (lighter + 0.05) / (darker + 0.05);
    };
    const css = globalThis.getComputedStyle(
      globalThis.document.documentElement,
    );
    const token = (name) => css.getPropertyValue(name).trim();

    const specimens = [
      {
        name: "accent: white text / primary 700",
        foreground: "#ffffff",
        background: token("--color-primary-700"),
      },
      {
        name: "accent: primary 700 / primary 50",
        foreground: token("--color-primary-700"),
        background: token("--color-primary-50"),
      },
      {
        name: "accent: primary 600 / primary 100",
        foreground: token("--color-primary-600"),
        background: token("--color-primary-100"),
      },
      {
        name: "accent: primary 700 / primary 200",
        foreground: token("--color-primary-700"),
        background: token("--color-primary-200"),
      },
      {
        name: "accent: primary 400 / primary 950",
        foreground: token("--color-primary-400"),
        background: token("--color-primary-950"),
      },
      {
        name: "Ofsted red band",
        classes:
          "bg-danger-50 text-danger-600 ring-danger-200 text-xs font-semibold",
      },
      {
        name: "Ofsted amber band",
        classes:
          "bg-amber-50 text-amber-700 ring-amber-200 text-xs font-semibold",
      },
      {
        name: "Ofsted green band",
        classes:
          "bg-emerald-50 text-emerald-700 ring-emerald-200 text-xs font-semibold",
      },
      {
        name: "status: On track",
        classes:
          "bg-emerald-50 text-emerald-700 ring-emerald-200 text-xs font-semibold",
      },
      {
        name: "status: At risk",
        classes:
          "bg-amber-50 text-amber-700 ring-amber-200 text-xs font-semibold",
      },
      {
        name: "status: Overdue",
        classes:
          "bg-danger-50 text-danger-600 ring-danger-200 text-xs font-semibold",
      },
    ];

    const host = globalThis.document.createElement("div");
    host.style.cssText =
      "position:fixed;left:-10000px;top:0;background:#fff;z-index:-1";
    globalThis.document.body.append(host);

    const measured = specimens.map((specimen) => {
      let foreground = specimen.foreground;
      let background = specimen.background;
      let fontSize = 14;
      let fontWeight = 400;

      if (specimen.classes) {
        const element = globalThis.document.createElement("span");
        element.className = specimen.classes;
        element.textContent = specimen.name;
        host.append(element);
        const style = globalThis.getComputedStyle(element);
        foreground = style.color;
        background = style.backgroundColor;
        fontSize = Number.parseFloat(style.fontSize);
        fontWeight = Number.parseInt(style.fontWeight, 10) || 400;
        element.remove();
      }

      const isLarge =
        fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700);
      const threshold = isLarge ? 3 : 4.5;
      const value = ratio(toRgb(foreground), toRgb(background));
      return {
        name: specimen.name,
        foreground,
        background,
        fontSize,
        fontWeight,
        threshold,
        ratio: Number(value.toFixed(2)),
        passes: value >= threshold,
      };
    });

    host.remove();
    return measured;
  });

  await testInfo.attach(`contrast-${portal}.json`, {
    body: Buffer.from(JSON.stringify(measurements, null, 2)),
    contentType: "application/json",
  });
  console.log(`CONTRAST ${portal} ${JSON.stringify(measurements)}`);

  expect(
    measurements.filter((measurement) => !measurement.passes),
    `${portal} contrast failures`,
  ).toEqual([]);
}

function assertAxeGate(findings) {
  expect(findings.length, formatViolations(findings)).toBe(0);
}

test.describe("apprentice portal", () => {
  test.use({ storageState: AUTH.apprentice });

  test("core routes and design tokens", async ({ page }, testInfo) => {
    test.setTimeout(AUDIT_TIMEOUT_MS);
    const findings = [];

    for (const route of ["/", "/otj-logs", "/journey", "/portfolio"]) {
      await test.step(`axe ${route}`, async () => {
        await openRoute(page, "apprentice", route);
        await auditCurrentPage(page, testInfo, "apprentice", route, findings);
      });
    }

    await measureContrast(page, "apprentice", testInfo);
    assertAxeGate(findings);
  });

  test("OTJ keyboard path, focus trap and submission", async ({
    page,
  }, testInfo) => {
    test.setTimeout(AUDIT_TIMEOUT_MS);
    const findings = [];

    await test.step("FAB is keyboard reachable and modal traps focus", async () => {
      await openRoute(page, "apprentice", "/otj-logs");
      const fab = page.getByRole("button", {
        name: "Log an off-the-job session",
      });
      await expect(fab).toBeVisible();

      await page.locator("body").focus();
      let reachedFab = false;
      for (let press = 0; press < 100; press += 1) {
        await page.keyboard.press("Tab");
        reachedFab = await fab.evaluate(
          (element) => globalThis.document.activeElement === element,
        );
        if (reachedFab) break;
      }
      expect(
        reachedFab,
        "FAB was not reachable in the keyboard tab order",
      ).toBe(true);

      const focusIndicator = await fab.evaluate((element) => {
        const style = globalThis.getComputedStyle(element);
        return {
          outlineStyle: style.outlineStyle,
          outlineWidth: style.outlineWidth,
          boxShadow: style.boxShadow,
        };
      });
      expect(
        focusIndicator.outlineStyle !== "none" ||
          focusIndicator.boxShadow !== "none",
        `FAB has no visible focus indicator: ${JSON.stringify(focusIndicator)}`,
      ).toBe(true);

      await page.keyboard.press("Enter");
      const dialog = page.getByRole("dialog", { name: "Log a session" });
      await expect(dialog).toBeVisible();
      await expect(dialog.getByRole("button", { name: "Close" })).toBeFocused();

      // The summary request decides whether logging is available. Wait until
      // the submit button joins the tab order before asserting the last-to-first
      // wrap; otherwise Shift+Tab correctly lands on Cancel while it is disabled.
      const submit = dialog.getByRole("button", { name: "Log session" });
      await expect(submit).toBeEnabled();
      await page.keyboard.press("Shift+Tab");
      await expect(submit).toBeFocused();
      await page.keyboard.press("Tab");
      await expect(dialog.getByRole("button", { name: "Close" })).toBeFocused();
      await auditCurrentPage(
        page,
        testInfo,
        "apprentice",
        "/otj-logs#quick-log-dialog",
        findings,
      );

      await page.keyboard.press("Escape");
      await expect(dialog).toBeHidden();
      await expect
        .soft(
          fab,
          "Closing the OTJ modal must restore focus to the FAB that opened it",
        )
        .toBeFocused();
    });

    await test.step("complete OTJ logging without a workaround", async () => {
      const fab = page.getByRole("button", {
        name: "Log an off-the-job session",
      });
      await fab.focus();
      await page.keyboard.press("Enter");

      const dialog = page.getByRole("dialog", { name: "Log a session" });
      await expect(dialog).toBeVisible();
      await dialog
        .getByLabel("What did you do?")
        .fill(`Launch accessibility audit ${Date.now()}`);
      await dialog.getByRole("button", { name: "Category" }).click();
      await page
        .getByRole("listbox", { name: "Category" })
        .getByRole("option")
        .first()
        .click();

      const startedAt = Date.now();
      await dialog.getByRole("button", { name: "Log session" }).click();
      await expect(
        page.getByRole("dialog", { name: "Session logged" }),
      ).toBeVisible({ timeout: 30_000 });
      const submissionMs = Date.now() - startedAt;
      console.log(`PERFORMANCE apprentice OTJ submission ${submissionMs}ms`);
      expect(
        submissionMs,
        "OTJ submission exceeded the PRD's 30 second target",
      ).toBeLessThan(30_000);
      await auditCurrentPage(
        page,
        testInfo,
        "apprentice",
        "/otj-logs#confirmation",
        findings,
      );
    });

    assertAxeGate(findings);
  });
});

test.describe("employer portal", () => {
  test.use({ storageState: AUTH.employer });

  test("levy, roster/profile, approvals and commitments", async ({
    page,
  }, testInfo) => {
    test.setTimeout(AUDIT_TIMEOUT_MS);
    const findings = [];
    for (const route of [
      "/levy-dashboard",
      "/apprentices",
      "/otj-approvals",
      "/commitments",
    ]) {
      await openRoute(page, "employer", route);
      await auditCurrentPage(page, testInfo, "employer", route, findings);

      if (route === "/apprentices") {
        const view = page
          .getByRole("button", { name: "View", exact: true })
          .first();
        await expect(view).toBeVisible();
        await view.click();
        const drawer = page.locator(".fixed.right-0.top-0").last();
        await expect(drawer).toBeVisible();
        await auditCurrentPage(
          page,
          testInfo,
          "employer",
          "/apprentices#profile-drawer",
          findings,
        );
      }
    }

    await measureContrast(page, "employer", testInfo);
    assertAxeGate(findings);
  });
});

test.describe("provider portal", () => {
  test.use({ storageState: AUTH.provider });

  test("cohort/profile, Ofsted and ILR", async ({ page }, testInfo) => {
    test.setTimeout(AUDIT_TIMEOUT_MS);
    const findings = [];
    await openRoute(page, "provider", "/learners");
    await auditCurrentPage(page, testInfo, "provider", "/learners", findings);

    const profileLink = page.getByTitle("View learner").first();
    await expect(profileLink).toBeVisible();
    await profileLink.click();
    await page.waitForURL(/\/learners\/[^/]+$/);
    await page.locator("main").first().waitFor({ state: "visible" });
    await auditCurrentPage(
      page,
      testInfo,
      "provider",
      new URL(page.url()).pathname,
      findings,
    );

    for (const route of ["/ofsted-hub", "/ilr"]) {
      await openRoute(page, "provider", route);
      await auditCurrentPage(page, testInfo, "provider", route, findings);
    }

    await measureContrast(page, "provider", testInfo);
    assertAxeGate(findings);
  });
});

test.describe("Flow portal", () => {
  test.use({ storageState: AUTH.flow });

  test("dashboard, eligibility checker and registration wizard", async ({
    page,
  }, testInfo) => {
    test.setTimeout(AUDIT_TIMEOUT_MS);
    const findings = [];
    for (const route of ["/", "/eligibility", "/register"]) {
      await openRoute(page, "flow", route);
      await auditCurrentPage(page, testInfo, "flow", route, findings);
    }

    await measureContrast(page, "flow", testInfo);
    assertAxeGate(findings);
  });
});
