"use client";

import { PoundSterling } from "lucide-react";
import { useState } from "react";

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
  useSaveLevyBalance,
  useStoredBalance,
} from "../queries/levy-data.query";

const MONEY = /^\d{1,12}(\.\d{1,2})?$/;

/**
 * The employer's current levy balance (F1.1.1).
 *
 * ── PRE-POPULATED, AND DERIVED RATHER THAN COPIED ───────────────────────────
 *
 * The form shows the stored values until the operator types something, at which
 * point `draft` takes over. Clearing `draft` after a save makes the fields snap
 * back to what was actually written — so if the API normalised a value, the
 * screen shows the stored version rather than the typed one.
 *
 * Pre-populating from GET /das/levy-balance — the endpoint the dashboard reads
 * — is safe here and only here: that DTO keeps `balance` as a string and
 * carries currency, accountId and ukprn, so a load-and-save-unchanged stores
 * the same row. The other three forms read purpose-built endpoints, because
 * their display endpoints round or omit fields.
 */
export function BalanceForm() {
  const stored = useStoredBalance();
  const save = useSaveLevyBalance();

  const [draft, setDraft] = useState(null);

  const form = draft ?? {
    balance: stored.data?.balance ?? "",
    currency: stored.data?.currency ?? "GBP",
    accountId: stored.data?.accountId ?? "",
    ukprn: stored.data?.ukprn ?? "",
  };

  const set = (key) => (e) => {
    const { value } = e.target;
    setDraft({ ...form, [key]: value });
  };

  const balanceError =
    draft && form.balance && !MONEY.test(form.balance.trim())
      ? "Enter digits with up to two decimal places, for example 48250.75. Remove any £ sign or thousands separator."
      : null;

  const canSave = MONEY.test((form.balance ?? "").trim()) && !save.isPending;

  const onSubmit = (e) => {
    e.preventDefault();
    if (!canSave) return;
    save.mutate(
      {
        balance: form.balance.trim(),
        currency: form.currency.trim() || "GBP",
        // Absent stays absent: an empty optional field is omitted rather than
        // sent as an empty string that would overwrite a real value with
        // nothing.
        ...(form.accountId.trim() ? { accountId: form.accountId.trim() } : {}),
        ...(form.ukprn.trim() ? { ukprn: form.ukprn.trim() } : {}),
      },
      { onSuccess: () => setDraft(null) },
    );
  };

  const nothingStored = stored.isSuccess && !stored.data?.balance;

  return (
    <Card>
      <CardHeader className="flex items-center gap-3">
        <PoundSterling className="size-5 text-neutral-500" aria-hidden />
        <div>
          <h2 className="text-base font-semibold text-neutral-900">
            Levy balance
          </h2>
          <p className="text-sm text-neutral-500">
            The figure the dashboard shows as your current balance.
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {stored.isLoading ? (
          <LoadingRow label="Loading the stored balance…" />
        ) : null}

        {nothingStored ? (
          <NothingStoredYet>
            No balance has been entered yet, so the dashboard has nothing to
            show. It will stay empty until one is saved here.
          </NothingStoredYet>
        ) : null}

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Balance"
              required
              error={balanceError}
              hint="As at today, from your DAS account."
            >
              <TextInput
                inputMode="decimal"
                value={form.balance}
                onChange={set("balance")}
                invalid={!!balanceError}
                placeholder="48250.75"
              />
            </Field>

            <Field label="Currency">
              <TextInput
                value={form.currency}
                onChange={set("currency")}
                maxLength={3}
                placeholder="GBP"
              />
            </Field>

            <Field label="DAS account ID" hint="Optional.">
              <TextInput
                value={form.accountId}
                onChange={set("accountId")}
                placeholder="MDAS-11223344"
              />
            </Field>

            <Field label="UKPRN" hint="Optional.">
              <TextInput
                value={form.ukprn}
                onChange={set("ukprn")}
                placeholder="10001234"
              />
            </Field>
          </div>

          <Button type="submit" disabled={!canSave} loading={save.isPending}>
            Save balance
          </Button>

          <SaveStatus
            error={
              save.isError
                ? errorText(save.error, "The balance could not be saved.")
                : null
            }
            success={save.isSuccess && !draft ? "Balance saved." : null}
          />
        </form>
      </CardContent>
    </Card>
  );
}
