"use client";

// @ts-check

import { Info, Loader2, Plus, X } from "lucide-react";
import { useState } from "react";

import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import {
  useTransferPreferences,
  useUpdateTransferPreferences,
} from "@/features/levy/queries/levy.query";
import { cn } from "@/utils/helper";

/**
 * F4.1.3 — Transfer preference settings.
 *
 * ── WHY FREE TEXT AND NOT DROPDOWNS ─────────────────────────────────────────
 *
 * `sectors`, `regions`, `sizeBands` and `programmeTypes` are `string[]` on the
 * server with no enum behind them, and the SME directory searches them as free
 * text ("e.g. Manufacturing", "e.g. West Midlands"). Matching compares these
 * values to a recipient's profile by string equality.
 *
 * A dropdown would therefore have to invent a vocabulary, and any value that
 * did not exactly equal what recipients had typed would match nothing — a
 * donor would set preferences, see zero matches, and have no way to discover
 * why. Suggestions are offered as one-click chips because they are genuinely
 * helpful, but the field stays open so a donor can enter the value that
 * actually appears in the directory.
 */

const SUGGESTED = {
  sectors: [
    "Engineering & Manufacturing",
    "Health & Social Care",
    "Digital & Technology",
    "Construction",
    "Financial Services",
  ],
  regions: [
    "London",
    "North West",
    "Yorkshire and the Humber",
    "West Midlands",
    "South East",
  ],
  sizeBands: ["1-9", "10-49", "50-249", "250+"],
  programmeTypes: [
    "ST0145 Engineering Technician",
    "ST0415 Software Developer",
    "ST0215 Senior Healthcare Support Worker",
  ],
};

const EMPTY = {
  sectors: [],
  regions: [],
  sizeBands: [],
  programmeTypes: [],
  maxPerRecipient: "",
  openMatching: false,
  anonymousMatching: false,
};

function ChipList({ label, name, values, suggestions, onChange, disabled }) {
  const [draft, setDraft] = useState("");

  const add = (raw) => {
    const value = raw.trim();
    if (!value || values.includes(value)) return;
    onChange([...values, value]);
    setDraft("");
  };

  const remove = (value) => onChange(values.filter((v) => v !== value));

  const unusedSuggestions = suggestions.filter((s) => !values.includes(s));

  return (
    <fieldset className="w-full" disabled={disabled}>
      <legend className="block mb-1 text-sm font-medium text-gray-700">
        {label}
      </legend>

      <div
        className="flex flex-wrap gap-2 mb-2"
        role="list"
        aria-label={`Selected ${label.toLowerCase()}`}
      >
        {values.length === 0 && (
          <span className="text-sm text-gray-500">
            None set — all {label.toLowerCase()} accepted
          </span>
        )}
        {values.map((value) => (
          <span
            key={value}
            role="listitem"
            className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-green-50 text-green-800 border border-green-200 rounded"
          >
            {value}
            <button
              type="button"
              onClick={() => remove(value)}
              aria-label={`Remove ${value}`}
              className="p-0.5 rounded hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <X className="w-3 h-3" aria-hidden="true" />
            </button>
          </span>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          name={name}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              // Otherwise Enter submits the surrounding form and the donor
              // loses the value they were part-way through typing.
              e.preventDefault();
              add(draft);
            }
          }}
          placeholder={`Add a ${label.toLowerCase().replace(/s$/, "")}`}
          aria-label={`Add a ${label.toLowerCase().replace(/s$/, "")}`}
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => add(draft)}
          disabled={!draft.trim()}
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span className="sr-only">Add {label.toLowerCase()}</span>
        </Button>
      </div>

      {unusedSuggestions.length > 0 && (
        <div className="mt-2">
          <span className="text-xs text-gray-500">Suggestions:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {unusedSuggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => add(s)}
                className="px-2 py-0.5 text-xs text-gray-700 bg-gray-100 border border-gray-200 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                + {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </fieldset>
  );
}

export function TransferPreferences() {
  const { data, isLoading, isError, error } = useTransferPreferences();
  const { mutate: save, isPending } = useUpdateTransferPreferences();

  const [form, setForm] = useState(EMPTY);

  /**
   * Seed the form from the server the first time the fetch resolves, and again
   * if it refetches to something different.
   *
   * Adjusted during render against a tracked previous value rather than in an
   * effect. An effect would set state after paint, which renders the form once
   * with defaults and again with the donor's real preferences — a visible flash
   * of "no preferences set" on every load, and the cascading render
   * `react-hooks/set-state-in-effect` exists to prevent.
   *
   * `data` is `undefined` while loading and `null` for a donor who has never
   * saved any — the service maps the API's 404 to null precisely so this form
   * opens on defaults instead of an error.
   */
  const [seededFrom, setSeededFrom] = useState(undefined);
  if (data !== undefined && data !== seededFrom) {
    setSeededFrom(data);
    setForm(
      data
        ? {
            sectors: data.sectors ?? [],
            regions: data.regions ?? [],
            sizeBands: data.sizeBands ?? [],
            programmeTypes: data.programmeTypes ?? [],
            maxPerRecipient: data.maxPerRecipient ?? "",
            openMatching: Boolean(data.openMatching),
            anonymousMatching: Boolean(data.anonymousMatching),
          }
        : EMPTY,
    );
  }

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  const onSubmit = (e) => {
    e.preventDefault();
    save({
      sectors: form.sectors,
      regions: form.regions,
      sizeBands: form.sizeBands,
      programmeTypes: form.programmeTypes,
      // The column is nullable; an empty box means "no cap", not zero.
      maxPerRecipient: form.maxPerRecipient.trim() || null,
      openMatching: form.openMatching,
      anonymousMatching: form.anonymousMatching,
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center gap-2 py-8 text-gray-600">
          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          Loading your matching preferences…
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="py-8 text-red-700">
          Could not load your matching preferences.
          {error?.message ? ` ${error.message}` : ""}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-gray-900">
          Matching preferences
        </h2>
        <p className="text-sm text-gray-600">
          Applied to every future matching suggestion until you change them.
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          {/*
            AC4 — open matching. Placed first because turning it on makes the
            four preference lists inoperative, and a donor should see that
            before filling them in rather than after.
          */}
          <div className="p-3 border border-gray-200 rounded bg-gray-50">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.openMatching}
                onChange={(e) => set("openMatching")(e.target.checked)}
                className="mt-1 w-4 h-4 text-green-700 border-gray-300 rounded focus:ring-green-600"
              />
              <span>
                <span className="block text-sm font-medium text-gray-900">
                  Open matching — widest possible recipient pool
                </span>
                <span className="block text-sm text-gray-600">
                  Consider every SME regardless of the preferences below.
                </span>
              </span>
            </label>
          </div>

          {form.openMatching && (
            <p
              className="flex items-start gap-2 p-3 text-sm text-blue-800 bg-blue-50 border border-blue-200 rounded"
              role="status"
            >
              <Info className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
              <span>
                Open matching is on, so the preferences below are kept but not
                applied. Turn it off to narrow your pool again.
              </span>
            </p>
          )}

          <div
            className={cn(
              "space-y-6",
              form.openMatching && "opacity-50 pointer-events-none",
            )}
            aria-hidden={form.openMatching}
          >
            {/* AC1 — sector, region, size band, programme type. */}
            <ChipList
              label="Sectors"
              name="sectors"
              values={form.sectors}
              suggestions={SUGGESTED.sectors}
              onChange={set("sectors")}
              disabled={form.openMatching}
            />
            <ChipList
              label="Regions"
              name="regions"
              values={form.regions}
              suggestions={SUGGESTED.regions}
              onChange={set("regions")}
              disabled={form.openMatching}
            />
            <ChipList
              label="Size bands"
              name="sizeBands"
              values={form.sizeBands}
              suggestions={SUGGESTED.sizeBands}
              onChange={set("sizeBands")}
              disabled={form.openMatching}
            />
            <ChipList
              label="Programme types"
              name="programmeTypes"
              values={form.programmeTypes}
              suggestions={SUGGESTED.programmeTypes}
              onChange={set("programmeTypes")}
              disabled={form.openMatching}
            />
          </div>

          {/* AC2 — maximum transfer amount per SME recipient. */}
          <div className="w-full max-w-xs">
            <label
              htmlFor="maxPerRecipient"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Maximum per recipient (£)
            </label>
            <input
              id="maxPerRecipient"
              name="maxPerRecipient"
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              value={form.maxPerRecipient}
              onChange={(e) => set("maxPerRecipient")(e.target.value)}
              placeholder="No limit"
              aria-describedby="maxPerRecipient-help"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <p id="maxPerRecipient-help" className="mt-1 text-xs text-gray-500">
              Leave blank for no cap. Applies per SME, not in total.
            </p>
          </div>

          <div className="p-3 border border-gray-200 rounded">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.anonymousMatching}
                onChange={(e) => set("anonymousMatching")(e.target.checked)}
                className="mt-1 w-4 h-4 text-green-700 border-gray-300 rounded focus:ring-green-600"
              />
              <span>
                <span className="block text-sm font-medium text-gray-900">
                  Anonymous matching
                </span>
                <span className="block text-sm text-gray-600">
                  SMEs see &quot;Matched donor&quot; instead of your
                  organisation name until you confirm a transfer.
                </span>
              </span>
            </label>
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-gray-200">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2
                    className="w-4 h-4 animate-spin"
                    aria-hidden="true"
                  />
                  Saving…
                </>
              ) : (
                "Save preferences"
              )}
            </Button>
            {!data && (
              <span className="text-sm text-gray-500">
                You have not set any preferences yet.
              </span>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
