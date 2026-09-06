"use client";

import { Receipt } from "lucide-react";
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
  useSaveFundingPayment,
  useStoredFundingPayments,
} from "../queries/levy-data.query";

const SIGNED_MONEY = /^-?\d{1,12}(\.\d{1,2})?$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

const BLANK = {
  externalReference: "",
  paymentDate: "",
  amount: "",
  currency: "GBP",
  fundingPeriod: "",
  clawbackNotice: "",
};

/**
 * ESFA funding payments (F1.1.5).
 *
 * Unlike the other three this writes one payment at a time, keyed on the
 * external reference — an upsert of a single row rather than a replace-all.
 * Selecting a stored payment loads it for correction; the blank option records
 * a new one.
 *
 * The values come from GET /das/manual/funding-payments, which returns the
 * stored amount as the string Postgres gave back. The display DTO types it as a
 * number: correcting a payment date on a row loaded from there could alter the
 * amount without anyone touching it.
 *
 * ── A NEGATIVE AMOUNT IS A CLAWBACK AND MUST SAY WHY ────────────────────────
 *
 * The API rejects a negative amount with no notice. Money leaving an employer's
 * account with no recorded reason is impossible to explain months later, once
 * whoever typed it has forgotten. The rule lives in the manual DTO only — the
 * sync service does not apply it, because discarding a real ESFA clawback for
 * failing a validation rule written for typed input would lose data rather than
 * protect it.
 */
export function FundingPaymentForm() {
  const stored = useStoredFundingPayments();
  const save = useSaveFundingPayment();

  const [selected, setSelected] = useState("");
  const [draft, setDraft] = useState(null);
  const [attempted, setAttempted] = useState(false);

  const selectedRow = useMemo(
    () =>
      selected
        ? stored.data?.find((p) => p.externalReference === selected)
        : null,
    [selected, stored.data],
  );

  const form =
    draft ??
    (selectedRow
      ? {
          externalReference: selectedRow.externalReference,
          paymentDate: selectedRow.paymentDate,
          amount: selectedRow.amount,
          currency: selectedRow.currency ?? "GBP",
          fundingPeriod: selectedRow.fundingPeriod ?? "",
          clawbackNotice: selectedRow.clawbackNotice ?? "",
        }
      : BLANK);

  const set = (key) => (e) => {
    const { value } = e.target;
    setDraft({ ...form, [key]: value });
  };

  const isNegative = form.amount.trim().startsWith("-");

  const validationError = (() => {
    if (!attempted) return null;
    if (!form.externalReference.trim()) {
      return "Payment reference: required. This identifies the payment, and is what a later correction matches on.";
    }
    if (!DATE.test(form.paymentDate.trim())) {
      return "Payment date: use YYYY-MM-DD.";
    }
    if (!SIGNED_MONEY.test(form.amount.trim())) {
      return `Amount: "${form.amount}" is not an amount. Use digits with up to two decimal places, for example 9876.54. A clawback is entered as a negative, for example -1200.00.`;
    }
    if (isNegative && !form.clawbackNotice.trim()) {
      return "Clawback reason: required for a negative amount. A deduction with no recorded reason cannot be explained later.";
    }
    return null;
  })();

  const onSubmit = (e) => {
    e.preventDefault();
    setAttempted(true);
    if (!form.externalReference.trim()) return;
    if (!DATE.test(form.paymentDate.trim())) return;
    if (!SIGNED_MONEY.test(form.amount.trim())) return;
    if (isNegative && !form.clawbackNotice.trim()) return;

    save.mutate(
      {
        externalReference: form.externalReference.trim(),
        paymentDate: form.paymentDate.trim(),
        amount: form.amount.trim(),
        currency: form.currency.trim() || "GBP",
        // Absent stays absent rather than becoming an empty string.
        ...(form.fundingPeriod.trim()
          ? { fundingPeriod: form.fundingPeriod.trim() }
          : {}),
        ...(form.clawbackNotice.trim()
          ? { clawbackNotice: form.clawbackNotice.trim() }
          : {}),
      },
      {
        onSuccess: () => {
          setDraft(null);
          setAttempted(false);
        },
      },
    );
  };

  const nothingStored = stored.isSuccess && stored.data.length === 0;

  return (
    <Card>
      <CardHeader className="flex items-center gap-3">
        <Receipt className="size-5 text-neutral-500" aria-hidden />
        <div>
          <h2 className="text-base font-semibold text-neutral-900">
            Funding payments
          </h2>
          <p className="text-sm text-neutral-500">
            One payment at a time, matched on its reference.
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {stored.isLoading ? (
          <LoadingRow label="Loading the stored payments…" />
        ) : null}

        {nothingStored ? (
          <NothingStoredYet>
            No funding payments have been entered yet, so the funding reports
            have nothing to draw on.
          </NothingStoredYet>
        ) : null}

        {stored.data?.length ? (
          <Field
            label="Payment"
            hint="Choose a stored payment to correct it, or leave blank to record a new one."
          >
            <select
              value={selected}
              onChange={(e) => {
                setSelected(e.target.value);
                setDraft(null);
                setAttempted(false);
              }}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
            >
              <option value="">New payment…</option>
              {stored.data.map((p) => (
                <option key={p.externalReference} value={p.externalReference}>
                  {p.paymentDate} · {p.amount} {p.currency} ·{" "}
                  {p.externalReference}
                </option>
              ))}
            </select>
          </Field>
        ) : null}

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Payment reference" required>
              <TextInput
                value={form.externalReference}
                onChange={set("externalReference")}
                readOnly={!!selected}
                className={selected ? "bg-neutral-50 text-neutral-600" : ""}
                placeholder="ESFA-PAY-2026-04-001"
              />
            </Field>

            <Field label="Payment date" required>
              <TextInput
                type="date"
                value={form.paymentDate}
                onChange={set("paymentDate")}
              />
            </Field>

            <Field
              label="Amount"
              required
              hint="A clawback is a negative amount, for example -1200.00."
            >
              <TextInput
                inputMode="decimal"
                value={form.amount}
                onChange={set("amount")}
                placeholder="9876.54"
              />
            </Field>

            <Field label="Currency">
              <TextInput
                value={form.currency}
                onChange={set("currency")}
                maxLength={3}
              />
            </Field>

            <Field label="Funding period" hint="Optional.">
              <TextInput
                value={form.fundingPeriod}
                onChange={set("fundingPeriod")}
                placeholder="2026-27"
              />
            </Field>

            {isNegative ? (
              <Field
                label="Clawback reason"
                required
                hint="Required because the amount is negative."
              >
                <TextInput
                  value={form.clawbackNotice}
                  onChange={set("clawbackNotice")}
                  placeholder="Withdrawal recorded in month 3"
                />
              </Field>
            ) : null}
          </div>

          <Button type="submit" loading={save.isPending}>
            {selected ? "Update payment" : "Record payment"}
          </Button>

          <SaveStatus
            error={
              validationError ??
              (save.isError
                ? errorText(save.error, "The payment could not be saved.")
                : null)
            }
            success={
              save.isSuccess && !draft
                ? selected
                  ? "Payment updated."
                  : "Payment recorded."
                : null
            }
          />
        </form>
      </CardContent>
    </Card>
  );
}
