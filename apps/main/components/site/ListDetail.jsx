"use client";

import { useId, useMemo, useState } from "react";

import { RecordLineMock } from "./Mocks";

/**
 * List and detail — §04, "The record."
 *
 * ── THREE SHAPES, ONE STATE ──────────────────────────────────────────────────
 *
 * There is exactly one piece of state, selectedId, and three ways it gets
 * drawn:
 *
 *   Below 768px, there is no separate detail region at all. Each category is
 *   its own disclosure, and opening one reveals its detail directly beneath
 *   it — a single-open accordion, which falls out of selectedId for free:
 *   there is only ever one id selected, so there is only ever one panel open.
 *
 *   From 768px, the list and the detail split into two columns (3fr list,
 *   5fr detail) and the detail for whichever category is selected renders
 *   once, in the second column, rather than inline under the list.
 *
 *   From 1024px, a third column — the section's own heading and intro — sits
 *   to the left of both, laid out by the page, not by this component.
 *
 * Both detail renderings (the mobile inline one and the md+ panel) share the
 * same DetailBody, so the content and the product-record mockup inside it
 * never drift apart. The inline copy is always in the DOM, toggled with the
 * `hidden` attribute rather than mounted and unmounted, so a button's
 * aria-controls always resolves to a real element — unmounting it would leave
 * eight of the nine buttons pointing at nothing most of the time.
 *
 * Selection is a set of real buttons, not radio inputs standing in for them:
 * aria-expanded is true in both the accordion sense (mobile) and the
 * "this is what the other column is showing" sense (md+), and aria-controls
 * holds regardless of which of those two the viewport is currently doing.
 * Never relies on colour alone — the current category also carries a
 * heavier weight on its name and a solid rather than faint mark.
 *
 * The filter is a real filter over real content, not an ornament. It matches
 * on the item name and the confirmation line, because a compliance lead
 * looking for "DBS" and one looking for "at source" are both looking for the
 * same row.
 */

function DetailBody({ item, headingId }) {
  return (
    <>
      <p className="text-caption text-ink-muted">Selected</p>
      <h3
        id={headingId}
        className="display mt-3 scroll-mt-24 text-section text-ink"
      >
        {item.name}
      </h3>
      <p className="measure mt-5 text-body text-ink-soft">{item.detail}</p>
      <div className="mt-8">
        <RecordLineMock item={item} />
      </div>
    </>
  );
}

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
    <div className="md:grid md:grid-cols-[minmax(0,3fr)_minmax(0,5fr)] md:items-start md:gap-10 lg:gap-12">
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
          <div className="mt-4">
            <p className="sr-only">{label}</p>
            {filtered.map((item) => {
              const { id, name, by, mark } = item;
              const current = selected?.id === id;
              const panelId = `${groupId}-${id}-panel`;
              const headingId = `${groupId}-${id}-heading`;

              return (
                <div
                  key={id}
                  className="border-t border-hairline last:border-b"
                >
                  <button
                    type="button"
                    aria-expanded={current}
                    aria-controls={panelId}
                    onClick={() => setSelectedId(id)}
                    className={`flex w-full items-start gap-4 py-4 text-left transition-colors duration-200 ease-out ${
                      current ? "text-ink" : "text-ink-soft hover:text-ink"
                    }`}
                  >
                    <span
                      className="mark mt-1.5 h-4 shrink-0"
                      style={{
                        "--mark":
                          mark === "terracotta"
                            ? "var(--color-terracotta)"
                            : "var(--color-olive)",
                        opacity: current ? 1 : 0.35,
                      }}
                      aria-hidden
                    />
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block text-body-sm ${current ? "font-medium" : ""}`}
                      >
                        {name}
                      </span>
                      <span className="mt-0.5 block text-caption text-ink-muted">
                        {by}
                      </span>
                    </span>
                    {/* The expand/collapse cue. Only meaningful below md, where
                        there is no second column to show that a selection did
                        anything — the "+" is otherwise an unexplained glyph. */}
                    <span
                      className="mt-1 shrink-0 text-ink-muted transition-transform duration-200 ease-out md:hidden"
                      style={{ transform: current ? "rotate(45deg)" : "none" }}
                      aria-hidden
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        focusable="false"
                      >
                        <path
                          d="M6 1v10M1 6h10"
                          stroke="currentColor"
                          strokeWidth="1.3"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                  </button>

                  {/* The panel element is always in the DOM — see the file
                      note on why unmounting it would break aria-controls for
                      the eight categories not currently open — but its
                      content only mounts when it is the open one, so eight
                      hidden copies of the mockup are never rendered at once.
                      Hidden by the `hidden` attribute below md, and by
                      md:hidden above it regardless of that attribute, since
                      from md the detail lives in the second column instead. */}
                  <div
                    id={panelId}
                    hidden={!current}
                    className="pb-6 md:hidden"
                  >
                    {current ? (
                      <DetailBody item={item} headingId={headingId} />
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* The md+ detail column. Hidden outright below md, where each
          category carries its own detail inline instead. */}
      <div className="hidden md:block">
        {selected ? (
          <div
            key={selected.id}
            className="enter"
            style={{ "--enter-delay": "0ms" }}
            aria-live="polite"
            aria-atomic="true"
          >
            <DetailBody
              item={selected}
              headingId={`${groupId}-${selected.id}-heading-panel`}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
