import { describe, expect, it, vi } from "vitest";

import { API_MAX_PER_PAGE, fetchAllPages } from "./fetch-all-pages";

/**
 * F1.2.1 AC7 — the roster reads every page rather than page 1.
 */
const pageOf = (page, total, perPage = API_MAX_PER_PAGE) => {
  const start = (page - 1) * perPage;
  const count = Math.max(0, Math.min(perPage, total - start));
  return {
    data: Array.from({ length: count }, (_, i) => ({ id: `row-${start + i}` })),
    meta: {
      total,
      page,
      perPage,
      totalPages: total === 0 ? 0 : Math.ceil(total / perPage),
    },
  };
};

describe("fetchAllPages", () => {
  it("returns all 500 rows of a five-page list, in page order", async () => {
    const fetchPage = vi.fn((page) => Promise.resolve(pageOf(page, 500)));

    const result = await fetchAllPages(fetchPage);

    expect(result.data).toHaveLength(500);
    expect(result.data[0].id).toBe("row-0");
    expect(result.data[499].id).toBe("row-499");
    expect(result.meta).toEqual({ total: 500, pages: 5 });
    expect(fetchPage.mock.calls.map(([page]) => page)).toEqual([1, 2, 3, 4, 5]);
  });

  it("requests the remaining pages at once, not one after another", async () => {
    const pending = [];
    const fetchPage = vi.fn((page) => {
      if (page === 1) return Promise.resolve(pageOf(1, 300));
      return new Promise((resolve) => {
        pending.push(() => resolve(pageOf(page, 300)));
      });
    });

    const result = fetchAllPages(fetchPage);
    // Let page 1 resolve and the rest be issued.
    await vi.waitFor(() => expect(pending).toHaveLength(2));
    // Pages 2 and 3 are both in flight before either has answered.
    expect(fetchPage).toHaveBeenCalledTimes(3);
    pending.forEach((resolve) => resolve());

    expect((await result).data).toHaveLength(300);
  });

  it("makes one request when everything fits on page 1", async () => {
    const fetchPage = vi.fn((page) => Promise.resolve(pageOf(page, 42)));

    const result = await fetchAllPages(fetchPage);

    expect(result.data).toHaveLength(42);
    expect(fetchPage).toHaveBeenCalledTimes(1);
  });

  it("handles an empty list and a response without meta", async () => {
    expect(
      (await fetchAllPages(() => Promise.resolve(pageOf(1, 0)))).data,
    ).toEqual([]);
    const noMeta = vi.fn(() => Promise.resolve({ data: [{ id: "a" }] }));
    expect((await fetchAllPages(noMeta)).data).toEqual([{ id: "a" }]);
    expect(noMeta).toHaveBeenCalledTimes(1);
  });

  it("drops a row that shifted across a page boundary between reads", async () => {
    const fetchPage = vi.fn((page) =>
      Promise.resolve(
        page === 1
          ? {
              data: [{ id: "a" }, { id: "b" }],
              meta: { total: 4, totalPages: 2 },
            }
          : {
              data: [{ id: "b" }, { id: "c" }],
              meta: { total: 4, totalPages: 2 },
            },
      ),
    );

    const result = await fetchAllPages(fetchPage);

    expect(result.data.map((r) => r.id)).toEqual(["a", "b", "c"]);
  });

  it("fails the whole read when any page fails — never a partial list", async () => {
    const fetchPage = vi.fn((page) =>
      page === 3
        ? Promise.reject(new Error("page 3 failed"))
        : Promise.resolve(pageOf(page, 500)),
    );

    await expect(fetchAllPages(fetchPage)).rejects.toThrow("page 3 failed");
  });
});
