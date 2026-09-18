"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, Info, XCircle } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";

import { CheckboxField } from "@/components/form/CheckboxField";
import { InputField } from "@/components/form/InputField";
import { SingleSelectField } from "@/components/form/SingleSelectField";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import TextBadge from "@/components/ui/TextBadge";
import { cn } from "@/utils/helper";

import { ELIGIBILITY_STATUS } from "../constants";
import {
  useCheckLevyEligibility,
  useLevyVocabulary,
} from "../queries/levy-exchange.query";
import {
  buildLevyEligibilitySchema,
  levyEligibilityDefaults,
} from "../schemas";

const toOptions = (values) =>
  (Array.isArray(values) ? values : []).map((value) => ({
    value,
    text: value,
  }));

const STATUS_META = {
  [ELIGIBILITY_STATUS.ELIGIBLE]: {
    color: "green",
    icon: CheckCircle2,
    title: "You look eligible",
  },
  [ELIGIBILITY_STATUS.CHECK_WITH_ADVISOR]: {
    color: "amber",
    icon: Info,
    title: "Let's check with an advisor",
  },
  [ELIGIBILITY_STATUS.NOT_ELIGIBLE]: {
    color: "red",
    icon: XCircle,
    title: "Not eligible right now",
  },
};

function ResultCard({ result, sector, region }) {
  const meta = STATUS_META[result.status] ?? STATUS_META.not_eligible;
  const Icon = meta.icon;
  const band = result.estimatedFundingBand;
  const isEligible = result.status === ELIGIBILITY_STATUS.ELIGIBLE;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2.5">
          <span
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-lg",
              meta.color === "green" && "bg-green-50 text-green-600",
              meta.color === "amber" && "bg-amber-50 text-amber-600",
              meta.color === "red" && "bg-red-50 text-red-600",
            )}
          >
            <Icon className="size-5" strokeWidth={1.9} aria-hidden />
          </span>
          <div>
            <h2 className="text-base font-semibold text-neutral-900">
              {meta.title}
            </h2>
            <TextBadge variant="light" color={meta.color} size="xs">
              {result.status?.replace(/_/g, " ")}
            </TextBadge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {band ? (
          <div className="rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3">
            <p className="text-xs font-medium text-neutral-500">
              Estimated funding band
            </p>
            <p className="mt-0.5 text-lg font-bold tabular-nums text-neutral-900">
              £{band.min.toLocaleString()} – £{band.max.toLocaleString()}
              <span className="ml-1 text-sm font-medium text-neutral-400">
                {band.currency}
              </span>
            </p>
          </div>
        ) : null}

        {result.nextSteps?.length ? (
          <div>
            <p className="mb-1.5 text-xs font-medium text-neutral-500">
              Next steps
            </p>
            <ul className="list-disc space-y-1 pl-5 text-sm text-neutral-600">
              {result.nextSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {isEligible ? (
          <Button
            href={`/register?sector=${encodeURIComponent(
              sector,
            )}&region=${encodeURIComponent(region)}`}
            color="green"
            endIcon={<ArrowRight className="size-4" />}
          >
            Start registration
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function EligibilityChecker() {
  // The same vocabulary the recipient profile and the donor's preferences use:
  // the funding band is keyed by sector and eligibility by employee count, so
  // a checker with its own list answered its own question, not the API's.
  const vocabularyQuery = useLevyVocabulary();
  const vocabulary = vocabularyQuery.data ?? null;

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(buildLevyEligibilitySchema(vocabulary)),
    defaultValues: levyEligibilityDefaults,
    mode: "onBlur",
  });

  const values = useWatch({ control });

  const { mutate, data: result, isPending, error } = useCheckLevyEligibility();

  const onSubmit = (form) => mutate(form);

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Levy funding</p>
        <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-neutral-900">
          Check your levy transfer eligibility
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Answer four quick questions to see whether your business qualifies for
          apprenticeship levy transfer funding — no account needed.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="grid gap-4 sm:grid-cols-2"
          >
            <SingleSelectField
              name="employeeCountBand"
              label="How many employees do you have?"
              options={toOptions(vocabulary?.closed?.employeeCountBand)}
              register={register}
              setValue={setValue}
              value={values.employeeCountBand ?? ""}
              error={errors.employeeCountBand?.message}
              placeholder="Select your employee count"
              searchable={false}
            />
            {/* Sector is an open field everywhere else, so it is free text here
                too, with the API's suggestions. A select would ask this SME to
                describe itself from five options and quietly decide its funding
                band on the answer. */}
            <div>
              <InputField
                name="sector"
                label="Which sector are you in?"
                register={register}
                error={errors.sector?.message}
                list="eligibility-sector-suggestions"
                autoComplete="off"
              />
              <datalist id="eligibility-sector-suggestions">
                {toOptions(vocabulary?.open?.sector).map((option) => (
                  <option key={option.value} value={option.value} />
                ))}
              </datalist>
            </div>
            <SingleSelectField
              name="region"
              label="Where are you based?"
              options={toOptions(vocabulary?.closed?.region)}
              register={register}
              setValue={setValue}
              value={values.region ?? ""}
              error={errors.region?.message}
              placeholder="Select your region"
            />
            <div className="flex items-end">
              <CheckboxField
                name="hasDasAccount"
                label="We already have a DAS account"
                register={register}
              />
            </div>
            <div className="sm:col-span-2">
              <Button
                type="submit"
                color="green"
                loading={isPending}
                disabled={!vocabulary}
              >
                Check eligibility
              </Button>
            </div>
          </form>

          {vocabularyQuery.isError ? (
            <p className="mt-4 text-sm text-danger-600" role="alert">
              {vocabularyQuery.error?.message ??
                "Could not load the sector, region and size options."}
            </p>
          ) : null}

          {error ? (
            <p className="mt-4 text-sm text-danger-600" role="alert">
              {error.message}
            </p>
          ) : null}
        </CardContent>
      </Card>

      {result ? (
        <ResultCard
          result={result}
          sector={values.sector}
          region={values.region}
        />
      ) : null}
    </div>
  );
}
