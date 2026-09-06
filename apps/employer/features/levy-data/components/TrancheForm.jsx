"use client";

import { Hourglass, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

import {
  Field,
  LoadingRow,
  NothingStoredYet,
  SaveStatus,
  TextInput,
  errorText,
} from "./form-primitives";
import {
  useManualDonorLinks,
  useReplaceTranches,
  useStoredTranches,
} from "../queries/levy-data.query";

const MONEY = /^\d{1,12}(\.\d{1,2})?$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

const blankRow = () => ({ amount: "", expiresOn: "" });

/**
 * Levy tranches and their expiry dates (F1.1.2, F4.1.1).
 *
 * ── SCOPED TO ONE DAS ACCOUNT ───────────────────────────────────────────────
 *
 * An organisation may hold several linked accounts for separate legal entities,
 * and the write replaces the tranches on ONE of them. `donorLinkId` is chosen
 * explicitly rather than inferred, because a replace-all that guessed its own
 * scope would silently clear another entity's tranches.
 *
 * The account list is read-only here. Creating one happens in the DAS accounts
 * form, so there is one canonical way to create a link rather than two.
 *
 * ── LOADED FROM THE TRANCHE ROWS, NOT THE EXPIRY CALENDAR ───────────────────
 *
 * The dashboard's expiry banners read /levy-exchange/surplus/expiry-calendar,
 * a 24-month projection derived from these rows. It carries neither row
 * identity nor donorLinkId, so it cannot populate this form: loading it would
 * turn a handful of tranches into two dozen projected months and then save them
 * back as fact.
 */
export function TrancheForm() {
  const links = useManualDonorLinks();
  const save = useReplaceTranches();

  // `null` means "not chosen yet". With exactly one account the choice is not
  // a guess, so it is made here; with several, the operator picks.
  const [chosenLinkId, setChosenLinkId] = useState(null);
  const donorLinkId =
    chosenLinkId ?? (links.data?.length === 1 ? links.data[0].id : "");

  const stored = useStoredTranches(donorLinkId);

  const storedRows = useMemo(
    () =>
      stored.data?.length
        ? stored.data.map((t) => ({ amount: t.amount, expiresOn: t.expiresOn }))
        : [blankRow()],
    [stored.data],
  );

  const [draft, setDraft] = useState(null);
  const [attempted, setAttempted] = useState(false);

  const rows = draft ?? storedRows;
  const dirty = draft !== null;

  const update = (i, key) => (e) => {
    const { value } = e.target;
    setDraft(rows.map((r, j) => (j === i ? { ...r, [key]: value } : r)));
  };

  const filled = rows.filter((r) => r.amount.trim() || r.expiresOn.trim());

  const rowError = (() => {
    if (!attempted) return null;
    for (let i = 0; i < filled.length; i += 1) {
      const { amount, expiresOn } = filled[i];
      if (!MONEY.test(amount.trim())) {
        return `Row ${i + 1}, Amount: "${amount}" is not an amount. Use digits with up to two decimal places, for example 7800.00.`;
      }
      if (!DATE.test(expiresOn.trim())) {
        return `Row ${i + 1}, Expires on: "${expiresOn}" is not a date. Use YYYY-MM-DD.`;
      }
    }
    return null;
  })();

  const onSubmit = (e) => {
    e.preventDefault();
    setAttempted(true);
    if (!donorLinkId) return;

    for (const { amount, expiresOn } of filled) {
      if (!MONEY.test(amount.trim()) || !DATE.test(expiresOn.trim())) return;
    }

    save.mutate(
      {
        donorLinkId,
        tranches: filled.map((r) => ({
          amount: r.amount.trim(),
          expiresOn: r.expiresOn.trim(),
        })),
      },
      {
        onSuccess: () => {
          setDraft(null);
          setAttempted(false);
        },
      },
    );
  };

  const noLinks = links.isSuccess && links.data.length === 0;
  const storedCount = stored.data?.length ?? 0;
  const nothingStored = donorLinkId && stored.isSuccess && storedCount === 0;

  return (
    <Card>
      <CardHeader className="flex items-center gap-3">
        <Hourglass className="size-5 text-neutral-500" aria-hidden />
        <div>
          <h2 className="text-base font-semibold text-neutral-900">
            Levy tranches
          </h2>
          <p className="text-sm text-neutral-500">
            What expires, and when. These drive the expiry warnings.
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {links.isLoading ? (
          <LoadingRow label="Loading your DAS accounts…" />
        ) : null}

        {noLinks ? (
          <NothingStoredYet>
            No DAS account has been added yet. Tranches are recorded against an
            account, so add one in the DAS accounts section above before
            entering them.
          </NothingStoredYet>
        ) : null}

        {links.data?.length ? (
          <form onSubmit={onSubmit} className="space-y-4">
            <Field
              label="DAS account"
              required
              hint="Saving replaces the tranches on this account only."
            >
              <select
                value={donorLinkId}
                onChange={(e) => {
                  setChosenLinkId(e.target.value);
                  setDraft(null);
                  setAttempted(false);
                }}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
              >
                <option value="">Choose an account…</option>
                {links.data.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.label ?? l.dasAccountId ?? l.id}
                  </option>
                ))}
              </select>
            </Field>

            {donorLinkId && stored.isLoading ? (
              <LoadingRow label="Loading the stored tranches…" />
            ) : null}

            {nothingStored ? (
              <NothingStoredYet>
                No tranches stored for this account, so no expiry warnings can
                be raised for it.
              </NothingStoredYet>
            ) : null}

            {donorLinkId ? (
              <>
                <div className="space-y-3">
                  {rows.map((row, i) => (
                    <div
                      // Rows have no identity of their own and the list is only
                      // ever replaced wholesale, so the index is the key.
                      key={`tranche-row-${i}`}
                      className="flex items-end gap-3"
                    >
                      <div className="flex-1">
                        <Field label={i === 0 ? "Amount" : ""}>
                          <TextInput
                            inputMode="decimal"
                            value={row.amount}
                            onChange={update(i, "amount")}
                            placeholder="7800.00"
                            aria-label={`Tranche ${i + 1} amount`}
                          />
                        </Field>
                      </div>
                      <div className="flex-1">
                        <Field label={i === 0 ? "Expires on" : ""}>
                          <TextInput
                            type="date"
                            value={row.expiresOn}
                            onChange={update(i, "expiresOn")}
                            aria-label={`Tranche ${i + 1} expiry date`}
                          />
                        </Field>
                      </div>
                      <Button
                        type="button"
                        variant="neutral"
                        color="black"
                        iconOnly
                        aria-label={`Remove tranche ${i + 1}`}
                        onClick={() =>
                          setDraft(
                            rows.length === 1
                              ? [blankRow()]
                              : rows.filter((_, j) => j !== i),
                          )
                        }
                        startIcon={<Trash2 />}
                      />
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  color="black"
                  size="sm"
                  startIcon={<Plus />}
                  onClick={() => setDraft([...rows, blankRow()])}
                >
                  Add a tranche
                </Button>

                <Button type="submit" loading={save.isPending}>
                  Replace tranches
                </Button>

                <SaveStatus
                  error={
                    rowError ??
                    (save.isError
                      ? errorText(
                          save.error,
                          "The tranches could not be saved.",
                        )
                      : null)
                  }
                  success={
                    save.isSuccess && !dirty
                      ? `Saved. ${storedCount} tranche${
                          storedCount === 1 ? "" : "s"
                        } stored on this account.`
                      : null
                  }
                />
              </>
            ) : null}
          </form>
        ) : null}
      </CardContent>
    </Card>
  );
}
