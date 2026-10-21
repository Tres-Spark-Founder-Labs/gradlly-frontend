"use client";

import { useId, useMemo, useState } from "react";

/**
 * List and detail.
 *
 * A filterable list on the left, the selected item's detail on the right, which
 * becomes list-then-detail stacked at mobile. This is how the product itself
 * presents a record, and showing it here is more honest than describing it: a
 * reader can work the control and see what the shape of the thing is.
 *
 * The filter is a real filter over real content, not an ornament. It matches on
 * the item name and on the confirmation line, because a compliance lead looking
 * for "DBS" and one looking for "at source" are both looking for the same row.
 *
 * Selection is a radio group under the hood. Arrow keys move between options
 * for free, the current item is announced, and the detail panel is wired with
 * `aria-live="polite"` so a screen-reader user hears it change without being
 * interrupted mid-sentence.
 */
export function ListDetail({ items, label }) {
  const groupId = useId();
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(items[0].id);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return items;
    return items.filter(
      ({ name, by, detail }) =>
        name.toLowerCase().includes(needle) ||
        by.toLowerCase().includes(needle) ||
        detail.toLowerCase().includes(needle),
    );
  }, [items, query]);

  // The selected item can fall out of the filter. Showing its detail anyway is
  // wrong, and clearing the panel is worse, so the first match becomes current.
  const selected =
    filtered.find((item) => item.id === selectedId) ?? filtered[0] ?? null;

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
      <div>
        <label
          htmlFor={`${groupId}-filter`}
          className="block text-caption text-ink-muted"
        >
          Filter {label}
        </label>
        <input
          id={`${groupId}-filter`}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Skill, check or confirmation"
          className="mt-2 w-full rounded-control border border-hairline bg-linen px-4 py-3 text-body-sm text-ink transition-colors duration-200 ease-out placeholder:text-ink-muted focus:border-ink focus:outline-none"
        />

        {/* The count is a state, not decoration: it is the only thing that
            tells a reader the filter did something when every row matched. */}
        <p
          className="mt-3 text-caption text-ink-muted"
          role="status"
          aria-live="polite"
        >
          {filtered.length} of {items.length}
        </p>

        {filtered.length === 0 ? (
          /* The empty state. Says what happened and what to do, in the
             interface's voice, and offers the way out rather than apologising. */
          <div className="rule-top mt-4">
            <p className="display text-subhead text-ink">
              Nothing matches that
            </p>
            <p className="measure mt-2 text-body-sm text-ink-soft">
              A Continuo record carries skills, checks and confirmations. Try a
              shorter term, or clear the filter to see all {items.length}.
            </p>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mt-4 rounded-control border border-ink px-5 py-2.5 text-body-sm font-medium text-ink transition-colors duration-200 ease-out hover:bg-ink hover:text-linen"
            >
              Clear the filter
            </button>
          </div>
        ) : (
          <fieldset className="mt-4">
            <legend className="sr-only">{label}</legend>
            <div className="list-none">
              {filtered.map(({ id, name, by, mark }) => {
                const current = selected?.id === id;
                return (
                  <label
                    key={id}
                    htmlFor={`${groupId}-${id}`}
                    className={`flex cursor-pointer items-start gap-4 border-t border-hairline py-4 transition-colors duration-200 ease-out last:border-b ${
                      current ? "text-ink" : "text-ink-soft hover:text-ink"
                    }`}
                  >
                    <input
                      id={`${groupId}-${id}`}
                      type="radio"
                      name={groupId}
                      value={id}
                      checked={current}
                      onChange={() => setSelectedId(id)}
                      className="sr-only"
                    />
                    <span
                      className="mark mt-1.5 h-4"
                      style={{
                        "--mark":
                          mark === "terracotta"
                            ? "var(--color-terracotta)"
                            : "var(--color-olive)",
                        opacity: current ? 1 : 0.35,
                      }}
                      aria-hidden
                    />
                    <span className="flex-1">
                      <span
                        className={`block text-body-sm ${current ? "font-medium" : ""}`}
                      >
                        {name}
                      </span>
                      <span className="mt-0.5 block text-caption text-ink-muted">
                        {by}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        )}
      </div>

      {selected ? (
        <div
          className="rule-top self-start"
          aria-live="polite"
          aria-atomic="true"
        >
          <p className="text-caption text-ink-muted">Selected</p>
          <h3 className="display mt-3 text-section text-ink">
            {selected.name}
          </h3>
          <p className="measure mt-5 text-body text-ink-soft">
            {selected.detail}
          </p>
          <p className="mt-6 flex items-start gap-3 border-t border-hairline pt-4 text-caption text-ink-muted">
            <span
              className="mark mt-1 h-3"
              style={{
                "--mark":
                  selected.mark === "terracotta"
                    ? "var(--color-terracotta)"
                    : "var(--color-olive)",
              }}
              aria-hidden
            />
            {selected.by}
          </p>
        </div>
      ) : null}
    </div>
  );
}
