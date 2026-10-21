"use client";

import { useState } from "react";

/**
 * The record, reachable — Factory's version of the main site's ListDetail.
 *
 * A simpler build than the one at /: real buttons, a synced detail panel,
 * aria-live on the change, but no filter input and no single-open mobile
 * accordion. This page exists to compare a visual system, not to duplicate a
 * second production-grade interaction component — the data and the shape of
 * the interaction (select a category, read what stands behind it) are the
 * same; the engineering depth behind it on the real page is not re-built
 * here.
 */
export function RecordExplorer({ items }) {
  const [selectedId, setSelectedId] = useState(items[0].id);
  const selected = items.find((item) => item.id === selectedId) ?? items[0];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,4fr)_minmax(0,6fr)]">
      <div className="border-t border-carbon-lift">
        {items.map((item) => {
          const current = item.id === selectedId;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedId(item.id)}
              aria-current={current}
              className={`mech block w-full border-b border-carbon-lift py-3 text-left ${
                current ? "text-bone" : "text-warm-granite hover:text-bone"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <span
                  aria-hidden
                  className={`h-3.5 w-0.5 shrink-0 rounded-full ${
                    current ? "bg-signal-orange" : "bg-carbon-lift"
                  }`}
                />
                <span className={current ? "text-body" : "text-body-sm"}>
                  {item.name}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div
        key={selected.id}
        aria-live="polite"
        className="rounded-card border border-carbon-lift p-3"
      >
        <p className="font-mono text-caption uppercase tracking-tight text-pale-stone">
          Selected
        </p>
        <h3 className="display mt-2 text-heading font-normal tracking-tight text-bone">
          {selected.name}
        </h3>
        <p className="mt-4 text-body-sm text-warm-granite">{selected.detail}</p>
        <p className="mt-6 flex items-center gap-2.5 border-t border-carbon-lift pt-4 text-caption text-pale-stone">
          <span
            aria-hidden
            className="h-1.5 w-1.5 shrink-0 rounded-full bg-metric-green"
          />
          {selected.by}
        </p>
      </div>
    </div>
  );
}
