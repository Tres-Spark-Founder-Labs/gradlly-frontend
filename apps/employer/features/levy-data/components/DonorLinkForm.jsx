"use client";

import { Building2 } from "lucide-react";
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
  useCreateDonorLink,
  useManualDonorLinks,
} from "../queries/levy-data.query";

/**
 * The DAS accounts this organisation holds (F4.1.1).
 *
 * Tranches and balances hang off these, so this is where an operator starts on
 * a fresh deployment. It is the single canonical way to create one: the tranche
 * form reads the list but never creates a link as a side effect of saving, so
 * there is never a question of which route produced a given account.
 */
export function DonorLinkForm() {
  const links = useManualDonorLinks();
  const create = useCreateDonorLink();

  const [label, setLabel] = useState("");
  const [dasAccountId, setDasAccountId] = useState("");
  const [attempted, setAttempted] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    setAttempted(true);
    if (!label.trim()) return;

    create.mutate(
      {
        label: label.trim(),
        ...(dasAccountId.trim() ? { dasAccountId: dasAccountId.trim() } : {}),
      },
      {
        onSuccess: () => {
          setLabel("");
          setDasAccountId("");
          setAttempted(false);
        },
      },
    );
  };

  return (
    <Card>
      <CardHeader className="flex items-center gap-3">
        <Building2 className="size-5 text-neutral-500" aria-hidden />
        <div>
          <h2 className="text-base font-semibold text-neutral-900">
            DAS accounts
          </h2>
          <p className="text-sm text-neutral-500">
            One per legal entity. Tranches are recorded against an account.
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {links.isLoading ? (
          <LoadingRow label="Loading your DAS accounts…" />
        ) : null}

        {links.isSuccess && links.data.length === 0 ? (
          <NothingStoredYet>
            No DAS accounts yet. Add the first one below.
          </NothingStoredYet>
        ) : null}

        {links.data?.length ? (
          <ul className="divide-y divide-neutral-100 rounded-lg border border-neutral-200">
            {links.data.map((l) => (
              <li
                key={l.id}
                className="flex items-baseline justify-between px-3 py-2 text-sm"
              >
                <span className="font-medium text-neutral-900">{l.label}</span>
                <span className="text-neutral-500">
                  {/* Absent stays absent — no dash standing in for an ID. */}
                  {l.dasAccountId ?? (
                    <em className="not-italic text-neutral-400">
                      no account ID recorded
                    </em>
                  )}
                </span>
              </li>
            ))}
          </ul>
        ) : null}

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Name"
              required
              error={
                attempted && !label.trim()
                  ? "Name: required. This is how the account is identified when choosing where tranches belong."
                  : null
              }
            >
              <TextInput
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Acme Manufacturing Ltd"
              />
            </Field>

            <Field label="DAS account ID" hint="Optional.">
              <TextInput
                value={dasAccountId}
                onChange={(e) => setDasAccountId(e.target.value)}
                placeholder="MDAS-11223344"
              />
            </Field>
          </div>

          <Button type="submit" loading={create.isPending}>
            Add account
          </Button>

          <SaveStatus
            error={
              create.isError
                ? errorText(create.error, "The account could not be added.")
                : null
            }
            success={create.isSuccess && !label ? "Account added." : null}
          />
        </form>
      </CardContent>
    </Card>
  );
}
