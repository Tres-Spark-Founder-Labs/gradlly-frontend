"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";

import { CheckboxField } from "@/components/form/CheckboxField";
import { InputField } from "@/components/form/InputField";
import { SingleSelectField } from "@/components/form/SingleSelectField";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { applyServerErrors } from "@/lib/errors";

import { RECIPIENT_PROFILE_OPTIONS, formatIsoDate } from "../constants";
import {
  useRecipientProfile,
  useSaveRecipientProfile,
} from "../queries/levy-exchange.query";
import {
  recipientProfileDefaults,
  recipientProfileOffListValues,
  recipientProfileSchema,
  recipientProfileToForm,
  recipientProfileToPayload,
} from "../schemas";

const DAS_OPTIONS = [
  { value: "yes", text: "Yes" },
  { value: "no", text: "No" },
];

const toOptions = (list) => list.map((value) => ({ value, text: value }));

// Closed selects. The options are the donor side's values, byte for byte —
// see RECIPIENT_PROFILE_OPTIONS for why free text was the wrong shape.
const SELECT_FIELDS = [
  { name: "sector", label: "Sector", placeholder: "Select your sector" },
  { name: "region", label: "Region", placeholder: "Select your region" },
  {
    name: "employeeCountBand",
    label: "Employee count",
    placeholder: "Select your employee count",
  },
  {
    name: "programmeType",
    label: "Programme type",
    placeholder: "Select a programme",
  },
];

/**
 * F4.2.3 — the SME's levy recipient profile (GET/PUT
 * /levy-exchange/recipient-profile), which matching reads.
 *
 * Saving goes straight to the match search: AC2 measures results from
 * "an SME completing their profile".
 */
export function RecipientProfileForm() {
  const router = useRouter();
  const {
    data: profile,
    isLoading,
    isError,
    error,
    refetch,
  } = useRecipientProfile();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(recipientProfileSchema),
    defaultValues: recipientProfileDefaults,
    mode: "onBlur",
  });
  const values = useWatch({ control });

  // undefined = still loading; null = no profile yet (the API's 404).
  useEffect(() => {
    if (profile !== undefined) reset(recipientProfileToForm(profile));
  }, [profile, reset]);

  const save = useSaveRecipientProfile({
    onSuccess: () => router.push("/levy-exchange/matches"),
  });

  const onSubmit = (form) =>
    save.mutate(recipientProfileToPayload(form), {
      onError: (err) => applyServerErrors(err, setError),
    });

  if (isLoading) {
    return <p className="text-sm text-neutral-500">Loading your profile…</p>;
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="space-y-3 pt-6">
          <p className="text-sm text-danger-600" role="alert">
            {error?.message}
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Try again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const savedOn = formatIsoDate(profile?.updatedAt);
  const offList = recipientProfileOffListValues(profile);

  return (
    <Card>
      <CardContent className="pt-6">
        <p className="mb-4 text-sm text-neutral-500">
          {savedOn
            ? `Last saved ${savedOn}.`
            : "You have not created a recipient profile yet."}
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="grid gap-4 sm:grid-cols-2"
        >
          {SELECT_FIELDS.map((field) => (
            <div key={field.name}>
              <SingleSelectField
                name={field.name}
                label={field.label}
                options={toOptions(RECIPIENT_PROFILE_OPTIONS[field.name])}
                register={register}
                setValue={setValue}
                value={values[field.name] ?? ""}
                error={errors[field.name]?.message}
                placeholder={field.placeholder}
                searchable={false}
                required
              />
              {/* A saved value the list does not contain — shown as the API
                  returned it, because the select cannot show it and quietly
                  blanking it would hide why this SME never matched. */}
              {offList[field.name] ? (
                <p className="mt-1 flex items-start gap-1 text-xs text-amber-700">
                  <Info className="mt-px size-3.5 shrink-0" aria-hidden />
                  <span>
                    {`Your saved value "${offList[field.name]}" is not on the list donors choose from, so it cannot match a donor's preference. Choose one from the list.`}
                  </span>
                </p>
              ) : null}
            </div>
          ))}

          <InputField
            name="transferAmountRequired"
            label="Transfer amount required (£)"
            placeholder="15000.00"
            inputMode="decimal"
            autoComplete="off"
            register={register}
            error={errors.transferAmountRequired?.message}
            required
          />

          <SingleSelectField
            name="hasDasAccount"
            label="Do you already have a DAS account?"
            options={DAS_OPTIONS}
            register={register}
            setValue={setValue}
            value={values.hasDasAccount ?? ""}
            error={errors.hasDasAccount?.message}
            placeholder="Select Yes or No"
            searchable={false}
            required
          />

          <div className="sm:col-span-2">
            {/* Controlled: in register mode CheckboxField draws its tick from
                internal state that starts false and never reads the form's
                values, so a stored `true` would render unticked. */}
            <CheckboxField
              name="isListed"
              label="List us in the SME directory"
              description="Lets levy-paying employers searching for transfer recipients see your sector, region, programme type and amount required. While this is off, your profile is visible only to your organisation."
              checked={values.isListed === true}
              onChange={(e) =>
                setValue("isListed", e.target.checked, { shouldDirty: true })
              }
            />
          </div>

          <div className="sm:col-span-2">
            <Button
              type="submit"
              loading={save.isPending}
              endIcon={<ArrowRight className="size-4" />}
            >
              Save and find matches
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
