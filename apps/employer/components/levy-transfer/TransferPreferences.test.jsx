import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { TransferPreferences } from "./TransferPreferences";

/**
 * F4.1.3 — transfer preference settings.
 *
 * The query hooks are mocked rather than the HTTP layer: what these tests are
 * about is the form's behaviour against the four acceptance criteria, not
 * request wiring. The payload assertions are the important ones — AC1 and AC2
 * are only met if what the donor entered is what reaches the API.
 *
 * `fireEvent` rather than `user-event`, matching `SmeDirectory.test.jsx` and
 * the rest of this app. `user-event` is not a dependency here and adding one
 * for a single suite is not worth the divergence.
 */
const save = vi.fn();
let queryState;

vi.mock("@/features/levy/queries/levy.query", () => ({
  useTransferPreferences: () => queryState,
  useUpdateTransferPreferences: () => ({ mutate: save, isPending: false }),
}));

function setQuery(overrides = {}) {
  queryState = {
    data: null,
    isLoading: false,
    isError: false,
    error: null,
    ...overrides,
  };
}

const saved = (overrides = {}) => ({
  sectors: [],
  regions: [],
  sizeBands: [],
  programmeTypes: [],
  maxPerRecipient: null,
  openMatching: false,
  anonymousMatching: false,
  ...overrides,
});

function addTo(labelPattern, value) {
  const input = screen.getByLabelText(labelPattern);
  fireEvent.change(input, { target: { value } });
  fireEvent.keyDown(input, { key: "Enter" });
}

const submit = () =>
  fireEvent.click(screen.getByRole("button", { name: /save preferences/i }));

describe("TransferPreferences (F4.1.3)", () => {
  beforeEach(() => {
    save.mockClear();
    setQuery();
  });

  it("opens on defaults for a donor who has never saved preferences", () => {
    // The service maps the API's 404 to null. Treating that as an error would
    // make every donor's first visit an error screen.
    render(<TransferPreferences />);

    expect(screen.getByText(/have not set any preferences yet/i)).toBeVisible();
    expect(
      screen.getByRole("button", { name: /save preferences/i }),
    ).toBeEnabled();
  });

  it("shows a loading state rather than an empty form while fetching", () => {
    setQuery({ isLoading: true });
    render(<TransferPreferences />);
    expect(
      screen.getByText(/loading your matching preferences/i),
    ).toBeVisible();
  });

  it("surfaces a load failure instead of silently showing defaults", () => {
    setQuery({ isError: true, error: { message: "boom" } });
    render(<TransferPreferences />);
    expect(screen.getByText(/could not load/i)).toBeVisible();
  });

  it("AC1 — hydrates all four preference lists from saved values", () => {
    setQuery({
      data: saved({
        sectors: ["Construction"],
        regions: ["London"],
        sizeBands: ["10-49"],
        programmeTypes: ["ST0415 Software Developer"],
        maxPerRecipient: "25000.00",
      }),
    });
    render(<TransferPreferences />);

    for (const value of [
      "Construction",
      "London",
      "10-49",
      "ST0415 Software Developer",
    ]) {
      expect(screen.getByText(value)).toBeVisible();
    }
    expect(screen.getByLabelText(/maximum per recipient/i)).toHaveValue(25000);
  });

  it("AC1/AC2 — sends what the donor entered", async () => {
    render(<TransferPreferences />);

    addTo(/add a sector/i, "Manufacturing");
    fireEvent.change(screen.getByLabelText(/maximum per recipient/i), {
      target: { value: "18000" },
    });
    submit();

    await waitFor(() => expect(save).toHaveBeenCalledTimes(1));
    expect(save).toHaveBeenCalledWith(
      expect.objectContaining({
        sectors: ["Manufacturing"],
        maxPerRecipient: "18000",
        openMatching: false,
      }),
    );
  });

  it("AC2 — an empty cap is sent as null, not zero", async () => {
    render(<TransferPreferences />);
    submit();

    await waitFor(() => expect(save).toHaveBeenCalled());
    // A cap of 0 means "transfer nothing to anyone" — the opposite of "no
    // cap", and it would silently disqualify every match.
    expect(save.mock.calls[0][0].maxPerRecipient).toBeNull();
  });

  it("AC4 — open matching explains that the lists stop applying", () => {
    render(<TransferPreferences />);

    fireEvent.click(screen.getByRole("checkbox", { name: /open matching/i }));

    expect(screen.getByRole("status")).toHaveTextContent(
      /kept but not applied/i,
    );
  });

  it("AC4 — open matching is sent, and preferences are preserved not cleared", async () => {
    setQuery({ data: saved({ sectors: ["Construction"] }) });
    render(<TransferPreferences />);

    fireEvent.click(screen.getByRole("checkbox", { name: /open matching/i }));
    submit();

    await waitFor(() => expect(save).toHaveBeenCalled());
    const payload = save.mock.calls[0][0];
    expect(payload.openMatching).toBe(true);
    // Turning open matching on must not destroy what the donor configured —
    // they will want it back when they turn it off again.
    expect(payload.sectors).toEqual(["Construction"]);
  });

  it("does not add a duplicate or a whitespace-only value", async () => {
    render(<TransferPreferences />);

    addTo(/add a region/i, "London");
    addTo(/add a region/i, "London");
    addTo(/add a region/i, "   ");
    submit();

    await waitFor(() => expect(save).toHaveBeenCalled());
    expect(save.mock.calls[0][0].regions).toEqual(["London"]);
  });

  it("a removed value is not sent", async () => {
    setQuery({ data: saved({ sectors: ["Construction", "Retail"] }) });
    render(<TransferPreferences />);

    fireEvent.click(screen.getByRole("button", { name: /remove retail/i }));
    submit();

    await waitFor(() => expect(save).toHaveBeenCalled());
    expect(save.mock.calls[0][0].sectors).toEqual(["Construction"]);
  });
});
