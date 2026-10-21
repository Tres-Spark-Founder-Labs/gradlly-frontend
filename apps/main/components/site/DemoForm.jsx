"use client";

import { useId, useRef, useState } from "react";

/** content-v1.md §9. The three options, in the order the copy lists them. */
const INTERESTS = [
  { value: "continuo", label: "Continuo (verified skills)" },
  {
    value: "gradlly-ams",
    label: "Gradlly AMS and the Apprenticeship Passport",
  },
  { value: "both", label: "Both" },
];

const FIELDS = {
  name: { label: "Name", type: "text", autoComplete: "name" },
  email: { label: "Work email", type: "email", autoComplete: "email" },
  organisation: {
    label: "Organisation",
    type: "text",
    autoComplete: "organization",
  },
};

const STEPS = [
  {
    id: "about",
    label: "About you",
    fields: ["name", "email", "organisation"],
  },
  { id: "interest", label: "What you want to see", fields: ["interest"] },
  { id: "review", label: "Review", fields: [] },
];

/** The same rules the route enforces, run early so a step cannot be left wrong. */
function validate(values, fields) {
  const errors = {};
  if (fields.includes("name") && values.name.trim().length < 2) {
    errors.name = "Enter your name.";
  }
  if (
    fields.includes("email") &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())
  ) {
    errors.email = "Enter a work email address so we can reply.";
  }
  if (
    fields.includes("organisation") &&
    values.organisation.trim().length < 2
  ) {
    errors.organisation = "Enter your organisation.";
  }
  if (fields.includes("interest") && !values.interest) {
    errors.interest = "Choose what you are interested in.";
  }
  return errors;
}

/**
 * The demo request, as a three-step task.
 *
 * ── WHY IT IS STAGED ────────────────────────────────────────────────────────
 *
 * Five fields in one column is not a long form, so the staging is not about
 * length. It is about the review step: this request goes to a person who will
 * reply to the address given, and a typed work email is the one field whose
 * error is invisible until a reply never arrives. Showing it back before
 * sending is the cheapest way to catch it.
 *
 * Validation runs per step, so a step cannot be left in an invalid state, and
 * again on the server, because the browser's checks are a convenience for the
 * person filling the form in rather than a control.
 *
 * Every state is designed, not only the populated one: in progress, invalid,
 * sending, failed and sent.
 */
export function DemoForm() {
  const formId = useId();
  const [step, setStep] = useState(0);
  const [values, setValues] = useState({
    name: "",
    email: "",
    organisation: "",
    interest: "",
    role: "",
  });
  const [errors, setErrors] = useState({});
  const [state, setState] = useState("idle");
  const [message, setMessage] = useState("");
  const headingRef = useRef(null);
  const summaryRef = useRef(null);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const set = (key) => (event) =>
    setValues((previous) => ({ ...previous, [key]: event.target.value }));

  const goTo = (next) => {
    setStep(next);
    setErrors({});
    // Focus the step heading rather than the first field: a screen-reader user
    // needs to hear which step they are on before they hear what it asks for.
    requestAnimationFrame(() => headingRef.current?.focus());
  };

  const onNext = (event) => {
    event.preventDefault();
    const found = validate(values, current.fields);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    goTo(step + 1);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (state === "sending") return;

    const found = validate(values, [
      "name",
      "email",
      "organisation",
      "interest",
    ]);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      setStep(0);
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setState("sending");
    setMessage("");

    try {
      const response = await fetch("/api/demo-request", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });
      const payload = await response.json().catch(() => ({}));

      if (response.ok) {
        setState("sent");
        return;
      }

      setState("error");
      if (payload.errors) {
        setErrors(payload.errors);
        setStep(0);
        requestAnimationFrame(() => summaryRef.current?.focus());
      } else {
        setMessage(
          payload.message ||
            "That could not be sent. Try again, or email us directly.",
        );
      }
    } catch {
      setState("error");
      setMessage(
        "That could not be sent, which may be the connection. Try again, or email us directly.",
      );
    }
  };

  if (state === "sent") {
    return (
      <div className="rule-top">
        <p className="text-caption text-ink-muted">Confirmed</p>
        <h3 className="display mt-3 text-section text-ink">Request sent.</h3>
        <p className="measure mt-4 text-body text-ink-soft">
          We will reply to <strong className="text-ink">{values.email}</strong>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={isLast ? onSubmit : onNext} noValidate>
      {/* Progress. A reader needs to know how much is left before they start,
          which is the whole reason a staged form is tolerable. */}
      <ol className="flex list-none gap-2" aria-label="Progress">
        {STEPS.map(({ id, label }, index) => {
          const done = index < step;
          const here = index === step;
          return (
            <li key={id} className="flex-1">
              <span
                className={`block h-0.5 ${done || here ? "bg-ink" : "bg-hairline"}`}
                aria-hidden
              />
              <span
                className={`mt-2 block text-caption ${here ? "text-ink" : "text-ink-muted"}`}
              >
                <span className="tabular-nums">{index + 1}</span> {label}
                {here ? <span className="sr-only"> (current step)</span> : null}
              </span>
            </li>
          );
        })}
      </ol>

      <h3
        ref={headingRef}
        tabIndex={-1}
        className="display mt-8 text-subhead text-ink focus:outline-none"
      >
        {current.label}
      </h3>

      {Object.keys(errors).length > 0 ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="mt-5 border-l-2 border-ink bg-sand px-5 py-4"
        >
          <p className="text-body-sm font-medium text-ink">
            Check these before continuing
          </p>
          <ul className="mt-2 list-none space-y-1">
            {Object.entries(errors).map(([field, text]) => (
              <li key={field}>
                <a
                  href={`#${formId}-${field}`}
                  className="text-body-sm text-ink underline decoration-1 underline-offset-4"
                >
                  {text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {current.id === "about" ? (
        <div className="mt-6 space-y-6">
          {current.fields.map((key) => {
            const { label, type, autoComplete } = FIELDS[key];
            return (
              <div key={key}>
                <label
                  htmlFor={`${formId}-${key}`}
                  className="block text-caption text-ink-muted"
                >
                  {label}
                </label>
                <input
                  id={`${formId}-${key}`}
                  name={key}
                  type={type}
                  autoComplete={autoComplete}
                  value={values[key]}
                  onChange={set(key)}
                  aria-invalid={errors[key] ? true : undefined}
                  aria-describedby={
                    errors[key] ? `${formId}-${key}-error` : undefined
                  }
                  className={`mt-2 w-full rounded-control border bg-linen px-4 py-3 text-body text-ink transition-colors duration-200 ease-out focus:border-ink focus:outline-none ${
                    errors[key] ? "border-ink" : "border-hairline"
                  }`}
                />
                {errors[key] ? (
                  <p
                    id={`${formId}-${key}-error`}
                    className="mt-2 text-caption text-ink"
                  >
                    {errors[key]}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : null}

      {current.id === "interest" ? (
        <fieldset className="mt-6">
          <legend className="text-caption text-ink-muted">
            I&rsquo;m interested in
          </legend>
          <div id={`${formId}-interest`} className="mt-3">
            {INTERESTS.map(({ value, label }) => (
              <label
                key={value}
                htmlFor={`${formId}-interest-${value}`}
                className="flex cursor-pointer items-start gap-3 border-t border-hairline py-4 text-body-sm text-ink last:border-b"
              >
                <input
                  id={`${formId}-interest-${value}`}
                  type="radio"
                  name="interest"
                  value={value}
                  checked={values.interest === value}
                  onChange={set("interest")}
                  className="mt-1 accent-[var(--color-terracotta)]"
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      {current.id === "review" ? (
        <dl className="mt-6">
          {[
            ["Name", values.name],
            ["Work email", values.email],
            ["Organisation", values.organisation],
            [
              "Interested in",
              INTERESTS.find(({ value }) => value === values.interest)?.label,
            ],
          ].map(([term, value]) => (
            <div
              key={term}
              className="flex flex-wrap gap-x-6 gap-y-1 border-t border-hairline py-4 last:border-b"
            >
              <dt className="w-40 shrink-0 text-caption text-ink-muted">
                {term}
              </dt>
              <dd className="flex-1 text-body-sm text-ink">{value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {/*
        Honeypot. Off screen rather than display:none, because some autofill
        still completes hidden fields and display:none is the state a bot checks
        for. Lives outside the steps so it is present on the submitting step.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor={`${formId}-role`}>Leave this field empty</label>
        <input
          id={`${formId}-role`}
          name="role"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.role}
          onChange={set("role")}
        />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => goTo(step - 1)}
            className="rounded-full border border-ink px-6 py-3 text-body-sm font-medium text-ink transition-colors duration-200 ease-out hover:bg-ink hover:text-linen"
          >
            Back
          </button>
        ) : null}

        <button
          type="submit"
          disabled={state === "sending"}
          className="rounded-full bg-terracotta px-7 py-3 text-body-sm font-medium text-linen transition-colors duration-200 ease-out hover:bg-coral disabled:opacity-60"
        >
          {isLast
            ? state === "sending"
              ? "Sending"
              : "Request a demo"
            : "Continue"}
        </button>
      </div>

      {message ? (
        <p role="alert" className="mt-4 text-body-sm text-ink">
          {message}
        </p>
      ) : null}

      <p className="mt-6 text-caption text-ink-muted">
        We use your details only to reply to this request.{" "}
        <a
          href="/privacy"
          className="underline decoration-hairline decoration-1 underline-offset-4 hover:decoration-ink"
        >
          Privacy
        </a>
      </p>
    </form>
  );
}
