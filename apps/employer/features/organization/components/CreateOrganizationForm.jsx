"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { City, Country, State } from "country-state-city";
import { useEffect, useMemo, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";

import { ServerErrorAlert } from "@/components/error/ServerErrorAlert";
import { InputField } from "@/components/form/InputField";
import { SingleSelectField } from "@/components/form/SingleSelectField";
import Button from "@/components/ui/Button";
import { PORTAL } from "@/config/portal.config";
import { useCreateOrganization } from "@/features/organization/queries/organizations.query";
import {
  createOrganizationDefaults,
  createOrganizationSchema,
} from "@/features/organization/schemas";
import { applyServerErrors } from "@/lib/errors";

const COUNTRY_OPTIONS = Country.getAllCountries().map((c) => ({
  value: c.isoCode,
  text: c.name,
}));

const CITY_CAP = 300;

function getRegionOptions(isoCode) {
  if (!isoCode) return { options: [], isTruncated: false };
  const states = State.getStatesOfCountry(isoCode);
  if (states.length > 0) {
    return {
      options: states.map((s) => ({ value: s.name, text: s.name })),
      isTruncated: false,
    };
  }
  const cities = City.getCitiesOfCountry(isoCode) ?? [];
  return {
    options: cities
      .slice(0, CITY_CAP)
      .map((c) => ({ value: c.name, text: c.name })),
    isTruncated: cities.length > CITY_CAP,
  };
}

function getRegionLabel(isoCode) {
  if (!isoCode) return "State / County";
  const states = State.getStatesOfCountry(isoCode);
  return states.length > 0 ? "State / County" : "City";
}

export function CreateOrganizationForm({ onSuccess }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    setValue,
    control,
  } = useForm({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: createOrganizationDefaults,
    mode: "onBlur",
  });

  const {
    mutateAsync,
    isPending,
    error: serverError,
  } = useCreateOrganization();
  const disabled = isSubmitting || isPending;

  const selectedCountryCode = useWatch({
    control,
    name: "country",
    defaultValue: "",
  });
  const selectedCity = useWatch({ control, name: "city", defaultValue: "" });

  const { options: regionOptions, isTruncated: regionListTruncated } = useMemo(
    () => getRegionOptions(selectedCountryCode),
    [selectedCountryCode],
  );
  const regionLabel = useMemo(
    () => getRegionLabel(selectedCountryCode),
    [selectedCountryCode],
  );

  const prevCountryRef = useRef(selectedCountryCode);
  useEffect(() => {
    if (prevCountryRef.current !== selectedCountryCode) {
      prevCountryRef.current = selectedCountryCode;
      setValue("city", "", { shouldValidate: false });
    }
  }, [selectedCountryCode, setValue]);

  const onSubmit = async (values) => {
    try {
      const countryName =
        Country.getCountryByCode(values.country)?.name ?? values.country;
      const payload = {
        ...values,
        country: countryName,
        portalType: PORTAL.key,
      };
      await mutateAsync(payload);
      onSuccess?.();
    } catch (error) {
      applyServerErrors(error, setError);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <ServerErrorAlert showFieldList error={serverError} />

      <fieldset disabled={disabled} className="contents space-y-4">
        {/* Company identity */}
        <InputField
          required
          name="name"
          label="Company Name"
          placeholder="Acme Ltd"
          autoComplete="organization"
          register={register}
          error={errors.name?.message}
        />

        {/* Registration identifiers */}
        <div className="grid grid-cols-2 gap-3">
          <InputField
            required
            name="ukprn"
            label="UKPRN"
            placeholder="10000000"
            inputMode="numeric"
            maxLength={8}
            register={register}
            error={errors.ukprn?.message}
          />
          <InputField
            required
            name="postcode"
            label="Postcode"
            autoComplete="postal-code"
            register={register}
            error={errors.postcode?.message}
          />
        </div>

        {/* Contact details */}
        <div className="grid grid-cols-2 gap-3">
          <InputField
            required
            name="orgEmail"
            label="Company Email"
            type="email"
            placeholder="contact@yourcompany.com"
            autoComplete="email"
            register={register}
            error={errors.orgEmail?.message}
          />
          <InputField
            name="orgPhone"
            label="Company Phone"
            type="tel"
            autoComplete="tel"
            register={register}
            error={errors.orgPhone?.message}
          />
        </div>

        <InputField
          name="website"
          label="Website"
          type="url"
          placeholder="https://"
          register={register}
          error={errors.website?.message}
        />

        {/* Location */}
        <InputField
          required
          name="address"
          label="Address"
          autoComplete="street-address"
          register={register}
          error={errors.address?.message}
        />

        <SingleSelectField
          required
          name="country"
          label="Country"
          options={COUNTRY_OPTIONS}
          register={register}
          setValue={setValue}
          value={selectedCountryCode}
          error={errors.country?.message}
          placeholder="Select country"
        />

        <div>
          <SingleSelectField
            required
            name="city"
            label={regionLabel}
            options={regionOptions}
            register={register}
            setValue={setValue}
            value={selectedCity}
            disabled={!selectedCountryCode || disabled}
            error={errors.city?.message}
            placeholder={
              selectedCountryCode
                ? `Select ${regionLabel.toLowerCase()}`
                : "Select a country first"
            }
          />
          {regionListTruncated && (
            <p className="mt-1 text-xs text-neutral-400">
              Showing first {CITY_CAP} cities. Type to search for yours.
            </p>
          )}
        </div>

        <Button loading={disabled} disabled={disabled} fullWidth type="submit">
          Create Organisation
        </Button>
      </fieldset>
    </form>
  );
}
