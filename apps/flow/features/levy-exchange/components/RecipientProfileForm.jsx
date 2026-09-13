"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";

import { CheckboxField } from "@/components/form/CheckboxField";
import { InputField } from "@/components/form/InputField";
import { SingleSelectField } from "@/components/form/SingleSelectField";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { applyServerErrors } from "@/lib/errors";

import { RECIPIENT_PROFILE_SUGGESTIONS, formatIsoDate } from "../constants";
import {
  useRecipientProfile,
  useSaveRecipientProfile,
} from "../queries/levy-exchange.query";
import {
  recipientProfileDefaults,
  recipientProfileSchema,
  recipientProfileToForm,
  recipientProfileToPayload,
} from "../schemas";

const DAS_OPTIONS = [
  { value: "yes", text: "Yes" },
  { value: "no", text: "No" },
];

const TEXT_FIELDS = [
  { name: "sector", label: "Sector" },
  { name: "region", label: "Region" },
  { name: "employeeCountBand", label: "Employee count band" },
  { name: "programmeType", label: "Programme type" },
];

/**
 * F4.2.3 — the SME's levy recipient profile (GET/PUT
 * /levy-exchange/recipient-profile), which matching reads.
 *
 * The four text fields are free text with suggestions, because the API takes
 * any string and matching compares it to donor preferences by exact equality —
 * see RECIPIENT_PROFILE_SUGGESTIONS. Saving goes straight to the match search:
 * AC2 measures results from "an SME completing their profile".
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
          {TEXT_FIELDS.map((field) => (
            <div key={field.name}>
              <InputField
                name={field.name}
                label={field.label}
                register={register}
                error={errors[field.name]?.message}
                list={`${field.name}-suggestions`}
                autoComplete="off"
                required
              />
              <datalist id={`${field.name}-suggestions`}>
                {RECIPIENT_PROFILE_SUGGESTIONS[field.name].map((option) => (
                  <option key={option} value={option} />
                ))}
              </datalist>
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
