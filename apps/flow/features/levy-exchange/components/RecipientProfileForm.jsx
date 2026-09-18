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

import { formatIsoDate } from "../constants";
import {
  useLevyVocabulary,
  useRecipientProfile,
  useSaveRecipientProfile,
} from "../queries/levy-exchange.query";
import {
  buildRecipientProfileSchema,
  recipientProfileDefaults,
  recipientProfileOffListValues,
  recipientProfileToForm,
  recipientProfileToPayload,
} from "../schemas";

const DAS_OPTIONS = [
  { value: "yes", text: "Yes" },
  { value: "no", text: "No" },
];

const toOptions = (values) =>
  (Array.isArray(values) ? values : []).map((value) => ({
    value,
    text: value,
  }));

// Region and employee count are the vocabulary's closed fields: selects over
// its permitted values. Sector and programme type are open: free text with its
// suggestions. Both lists come from GET /levy-exchange/vocabulary, which the
// donor's preferences screen reads too — see ../constants.
const PROFILE_FIELDS = [
  { name: "sector", label: "Sector", closed: false },
  {
    name: "region",
    label: "Region",
    closed: true,
    placeholder: "Select your region",
  },
  {
    name: "employeeCountBand",
    label: "Employee count",
    closed: true,
    placeholder: "Select your employee count",
  },
  { name: "programmeType", label: "Programme type", closed: false },
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
  const vocabularyQuery = useLevyVocabulary();
  const vocabulary = vocabularyQuery.data ?? null;
  const options = (field) =>
    toOptions(
      field === "sector" || field === "programmeType"
        ? vocabulary?.open?.[field]
        : vocabulary?.closed?.[field],
    );

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(buildRecipientProfileSchema(vocabulary)),
    defaultValues: recipientProfileDefaults,
    mode: "onBlur",
  });
  const values = useWatch({ control });

  // undefined = still loading; null = no profile yet (the API's 404). The
  // vocabulary decides whether a stored closed value can be shown, so the form
  // is seeded once both have arrived.
  useEffect(() => {
    if (profile !== undefined && vocabulary) {
      reset(recipientProfileToForm(profile, vocabulary));
    }
  }, [profile, vocabulary, reset]);

  const save = useSaveRecipientProfile({
    onSuccess: () => router.push("/levy-exchange/matches"),
  });

  const onSubmit = (form) =>
    save.mutate(recipientProfileToPayload(form), {
      onError: (err) => applyServerErrors(err, setError),
    });

  if (isLoading || vocabularyQuery.isLoading) {
    return <p className="text-sm text-neutral-500">Loading your profile…</p>;
  }

  // Without the vocabulary the two closed fields have nothing to offer, and a
  // free-text fallback would send values the API refuses.
  if (vocabularyQuery.isError || !vocabulary) {
    return (
      <Card>
        <CardContent className="space-y-3 pt-6">
          <p className="text-sm text-danger-600" role="alert">
            {vocabularyQuery.error?.message ??
              "Could not load the sector, region and size options."}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => vocabularyQuery.refetch()}
          >
            Try again
          </Button>
        </CardContent>
      </Card>
    );
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
  const offList = recipientProfileOffListValues(profile, vocabulary);

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
          {PROFILE_FIELDS.map((field) => (
            <div key={field.name}>
              {field.closed ? (
                <SingleSelectField
                  name={field.name}
                  label={field.label}
                  options={options(field.name)}
                  register={register}
                  setValue={setValue}
                  value={values[field.name] ?? ""}
                  error={errors[field.name]?.message}
                  placeholder={field.placeholder}
                  searchable={false}
                  required
                />
              ) : (
                <>
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
                    {options(field.name).map((option) => (
                      <option key={option.value} value={option.value} />
                    ))}
                  </datalist>
                </>
              )}
              {/* A saved value a closed list does not contain — shown as the
                  API returned it, because the select cannot show it and
                  quietly blanking it would hide why this SME never matched. */}
              {offList[field.name] ? (
                <p className="mt-1 flex items-start gap-1 text-xs text-amber-700">
                  <Info className="mt-px size-3.5 shrink-0" aria-hidden />
                  <span>
                    {`Your saved value "${offList[field.name]}" is not one of the permitted values, so it cannot match a donor's preference and saving will be refused until you change it. Choose one from the list.`}
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
