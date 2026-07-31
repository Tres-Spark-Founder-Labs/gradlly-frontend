import { describe, expect, it, vi } from "vitest";

import {
  buildApprenticePayload,
  buildEnrolmentPayload,
  isEnrolFormComplete,
  missingEnrolFields,
  runEnrolment,
  summariseEnrolment,
} from "./enrol-flow";

const VALID_FORM = {
  firstName: "Alex",
  lastName: "Okafor",
  email: "alex@example.com",
  employeeId: "EMP-04821",
  jobTitle: "Junior Software Engineer",
  standard: "std-1",
  provider: "prov-1",
  manager: "mgr-1",
  startDate: "2026-09-01",
};

const okDeps = () => ({
  createApprentice: vi.fn().mockResolvedValue({ id: "app-1" }),
  createEnrolment: vi.fn().mockResolvedValue({ id: "enr-1" }),
  linkOrganisations: vi.fn().mockResolvedValue({}),
  setParticipants: vi.fn().mockResolvedValue({}),
  activate: vi.fn().mockResolvedValue({}),
});

describe("missingEnrolFields", () => {
  it("accepts a complete form", () => {
    expect(missingEnrolFields(VALID_FORM)).toEqual([]);
    expect(isEnrolFormComplete(VALID_FORM)).toBe(true);
  });

  it("requires the training provider (AC2)", () => {
    // No step ever collected this, yet step 3 displayed it and ticked a
    // checklist item for it. The form could be "complete" with no provider.
    const missing = missingEnrolFields({ ...VALID_FORM, provider: "" });
    expect(missing.map((m) => m.field)).toContain("provider");
  });

  it("requires the line manager (AC1)", () => {
    const missing = missingEnrolFields({ ...VALID_FORM, manager: "" });
    expect(missing.map((m) => m.field)).toContain("manager");
  });

  it("treats whitespace as missing", () => {
    expect(
      missingEnrolFields({ ...VALID_FORM, firstName: "   " }).map(
        (m) => m.field,
      ),
    ).toContain("firstName");
  });

  it("does not require employeeId or jobTitle", () => {
    // Offered per AC1, but an employer with no payroll references should not
    // be blocked from enrolling anyone.
    const form = { ...VALID_FORM, employeeId: "", jobTitle: "" };
    expect(isEnrolFormComplete(form)).toBe(true);
  });
});

describe("payload building", () => {
  it("sends employeeId and jobTitle when present", () => {
    // Both were collected by the form and silently dropped on submit.
    const body = buildApprenticePayload(VALID_FORM);
    expect(body.employeeId).toBe("EMP-04821");
    expect(body.jobTitle).toBe("Junior Software Engineer");
  });

  it("omits empty optional fields rather than sending empty strings", () => {
    const body = buildApprenticePayload({
      ...VALID_FORM,
      employeeId: "",
      jobTitle: "  ",
    });
    expect(body.employeeId).toBeUndefined();
    expect(body.jobTitle).toBeUndefined();
  });

  it("trims names and email", () => {
    const body = buildApprenticePayload({
      ...VALID_FORM,
      firstName: "  Alex ",
      email: " alex@example.com ",
    });
    expect(body.firstName).toBe("Alex");
    expect(body.email).toBe("alex@example.com");
  });

  it("includes the start date when given", () => {
    expect(buildEnrolmentPayload(VALID_FORM, "app-1")).toMatchObject({
      apprenticeId: "app-1",
      standardId: "std-1",
      plannedStartDate: "2026-09-01",
    });
  });

  it("omits the start date when absent", () => {
    expect(
      buildEnrolmentPayload({ ...VALID_FORM, startDate: "" }, "app-1"),
    ).not.toHaveProperty("plannedStartDate");
  });
});

describe("runEnrolment", () => {
  it("runs all five steps in order", async () => {
    const deps = okDeps();
    const result = await runEnrolment(deps, VALID_FORM, { orgId: "org-1" });

    expect(deps.createApprentice).toHaveBeenCalled();
    expect(deps.createEnrolment).toHaveBeenCalled();
    expect(deps.linkOrganisations).toHaveBeenCalled();
    expect(deps.setParticipants).toHaveBeenCalled();
    expect(deps.activate).toHaveBeenCalled();
    expect(result).toMatchObject({
      apprenticeId: "app-1",
      enrolmentId: "enr-1",
      activated: true,
      warnings: [],
    });
  });

  it("attaches both the employer and the chosen provider", async () => {
    // The employer link is what the row-level security policies key off, so
    // omitting it would leave the employer unable to read their own
    // apprentice's OTJ logs.
    const deps = okDeps();
    await runEnrolment(deps, VALID_FORM, { orgId: "org-1" });

    expect(deps.linkOrganisations).toHaveBeenCalledWith(
      expect.objectContaining({
        body: {
          employerOrganisationId: "org-1",
          providerOrganisationId: "prov-1",
        },
      }),
    );
  });

  it("attaches the line manager by id", async () => {
    const deps = okDeps();
    await runEnrolment(deps, VALID_FORM, { orgId: "org-1" });

    expect(deps.setParticipants).toHaveBeenCalledWith(
      expect.objectContaining({ body: { employerManagerUserId: "mgr-1" } }),
    );
  });

  it("activates, which is what sends the invitation and notifies the provider", async () => {
    // The original flow stopped after creating a draft, so AC3, AC4 and AC5
    // could never happen.
    const deps = okDeps();
    await runEnrolment(deps, VALID_FORM, { orgId: "org-1" });

    expect(deps.activate).toHaveBeenCalledWith({ orgId: "org-1", id: "enr-1" });
  });

  it("throws when the apprentice cannot be created", async () => {
    const deps = okDeps();
    deps.createApprentice.mockRejectedValue(new Error("email already in use"));

    await expect(
      runEnrolment(deps, VALID_FORM, { orgId: "org-1" }),
    ).rejects.toThrow("email already in use");
    expect(deps.createEnrolment).not.toHaveBeenCalled();
  });

  it("throws when the enrolment cannot be created", async () => {
    const deps = okDeps();
    deps.createEnrolment.mockRejectedValue(new Error("duplicate enrolment"));

    await expect(
      runEnrolment(deps, VALID_FORM, { orgId: "org-1" }),
    ).rejects.toThrow("duplicate enrolment");
  });

  it("reports a failed provider link as a warning, not a success", async () => {
    const deps = okDeps();
    deps.linkOrganisations.mockRejectedValue(new Error("provider not found"));

    const result = await runEnrolment(deps, VALID_FORM, { orgId: "org-1" });

    expect(result.warnings.map((w) => w.step)).toContain("links");
    expect(result.warnings[0].message).toMatch(/not be notified/i);
    // The rest of the sequence still runs — the enrolment exists either way.
    expect(deps.activate).toHaveBeenCalled();
  });

  it("reports a failed manager link, naming what the manager will miss", async () => {
    const deps = okDeps();
    deps.setParticipants.mockRejectedValue(new Error("not a member"));

    const result = await runEnrolment(deps, VALID_FORM, { orgId: "org-1" });

    const warning = result.warnings.find((w) => w.step === "manager");
    expect(warning.message).toMatch(/at-risk alerts/i);
  });

  it("reports a failed activation without claiming the apprentice was invited", async () => {
    const deps = okDeps();
    deps.activate.mockRejectedValue(new Error("standard has no funding band"));

    const result = await runEnrolment(deps, VALID_FORM, { orgId: "org-1" });

    expect(result.activated).toBe(false);
    expect(result.warnings.map((w) => w.step)).toContain("activate");
    expect(summariseEnrolment(result)).toMatch(/draft/i);
    expect(summariseEnrolment(result)).not.toMatch(/invitation/i);
  });
});

describe("summariseEnrolment", () => {
  it("claims an invitation only when activation succeeded cleanly", () => {
    const summary = summariseEnrolment({ activated: true, warnings: [] });
    expect(summary).toMatch(/invitation/i);
    expect(summary).toMatch(/notified the provider/i);
  });

  it("does not claim a clean run when there are warnings", () => {
    const summary = summariseEnrolment({
      activated: true,
      warnings: [{ step: "manager", message: "x" }],
    });
    expect(summary).toMatch(/need attention/i);
  });
});
