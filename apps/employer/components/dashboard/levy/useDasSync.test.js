import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Replace the query layer so these tests exercise the derivation logic, not
// the network. Declared before the import of the hook under test.
const mockUseDonorLinks = vi.fn();
const mockSyncMutation = {
  mutate: vi.fn(),
  isPending: false,
  isSuccess: false,
  isError: false,
};

vi.mock("@/features/levy/queries/levy.query", () => ({
  useDonorLinks: () => mockUseDonorLinks(),
  useSyncDonorLink: () => mockSyncMutation,
}));

const { useDasSync } = await import("./useDasSync");

/** A donor link shaped like DonorLinkResponseDto (lastBalance is a string). */
const link = ({
  status = "active",
  lastBalance = null,
  lastSyncedAt = null,
}) => ({
  id: `link-${status}-${lastBalance}`,
  organisationId: "org-1",
  label: null,
  dasAccountId: "das-1",
  status,
  lastErrorMessage: null,
  lastSyncedAt,
  lastBalance,
});

const givenLinks = (links, isLoading = false) =>
  mockUseDonorLinks.mockReturnValue({ data: links, isLoading });

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useDasSync — F1.1.1 AC1/AC2 (DAS-sourced balance)", () => {
  it("reads the balance from the DAS-synced lastBalance field", () => {
    givenLinks([link({ lastBalance: "12345.67" })]);
    const { result } = renderHook(() => useDasSync());
    expect(result.current.balance).toBeCloseTo(12345.67, 2);
  });

  it("sums balances across multiple linked DAS accounts", () => {
    givenLinks([
      link({ lastBalance: "1000.00" }),
      link({ lastBalance: "250.50" }),
    ]);
    const { result } = renderHook(() => useDasSync());
    expect(result.current.balance).toBeCloseTo(1250.5, 2);
  });

  it("ignores links with no balance yet rather than counting them as zero", () => {
    givenLinks([
      link({ lastBalance: "500.00" }),
      link({ status: "pending_consent", lastBalance: null }),
    ]);
    const { result } = renderHook(() => useDasSync());
    expect(result.current.balance).toBeCloseTo(500, 2);
  });

  it("reports balance as null when no DAS account is linked", () => {
    // Distinct from zero: "we don't know" must not render as "£0.00".
    givenLinks([]);
    const { result } = renderHook(() => useDasSync());
    expect(result.current.balance).toBeNull();
    expect(result.current.hasLink).toBe(false);
  });
});

describe("useDasSync — F1.1.1 AC3 (last synced)", () => {
  it("reports the most recent sync across all accounts", () => {
    givenLinks([
      link({ lastBalance: "1.00", lastSyncedAt: "2026-07-01T10:00:00.000Z" }),
      link({ lastBalance: "2.00", lastSyncedAt: "2026-07-30T14:32:00.000Z" }),
    ]);
    const { result } = renderHook(() => useDasSync());
    expect(result.current.lastSynced.toISOString()).toBe(
      "2026-07-30T14:32:00.000Z",
    );
  });

  it("reports null when nothing has ever synced", () => {
    givenLinks([link({ lastBalance: "1.00", lastSyncedAt: null })]);
    const { result } = renderHook(() => useDasSync());
    expect(result.current.lastSynced).toBeNull();
    expect(result.current.fmtSyncedAt()).toBe("never");
  });
});

describe("useDasSync — F1.1.1 AC4 (degraded mode)", () => {
  it("flags degraded when any linked account failed to sync", () => {
    // Deliberately some(), not every(): one stale account already makes the
    // displayed total understated, and under-warning is the costlier error.
    givenLinks([
      link({ status: "active", lastBalance: "500.00" }),
      link({ status: "error", lastBalance: "100.00" }),
    ]);
    const { result } = renderHook(() => useDasSync());
    expect(result.current.isDegraded).toBe(true);
  });

  it("is not degraded when every account is healthy", () => {
    givenLinks([link({ status: "active", lastBalance: "500.00" })]);
    const { result } = renderHook(() => useDasSync());
    expect(result.current.isDegraded).toBe(false);
  });

  it("is not degraded merely because no account is linked", () => {
    // No link is an onboarding state, not a fault.
    givenLinks([]);
    const { result } = renderHook(() => useDasSync());
    expect(result.current.isDegraded).toBe(false);
  });

  it("does not claim degraded while the links are still loading", () => {
    givenLinks([], true);
    const { result } = renderHook(() => useDasSync());
    expect(result.current.isDegraded).toBe(false);
  });
});
