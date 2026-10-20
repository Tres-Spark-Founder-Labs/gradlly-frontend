"use client";

import { useId, useRef, useState } from "react";

import { Section, SectionHead } from "./Section";

/** content-v1.md §9. The three options, in the order the copy lists them. */
const INTERESTS = [
  { value: "continuo", label: "Continuo (verified skills)" },
  {
    value: "gradlly-ams",
    label: "Gradlly AMS and the Apprenticeship Passport",
  },
  { value: "both", label: "Both" },
];

const FIELDS = [
  { name: "name", label: "Name", type: "text", autoComplete: "name" },
  { name: "email", label: "Work email", type: "email", autoComplete: "email" },
  {
    name: "organisation",
    label: "Organisation",
    type: "text",
    autoComplete: "organization",
  },
];

export function BookADemo() {
  const formId = useId();
  const [state, setState] = useState("idle");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const summaryRef = useRef(null);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (state === "sending") return;

    const data = Object.fromEntries(new FormData(event.currentTarget));
    setState("sending");
    setErrors({});
    setMessage("");

    try {
      const response = await fetch("/api/demo-request", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      const payload = await response.json().catch(() => ({}));

      if (response.ok) {
        setState("sent");
        return;
      }

      setState("error");
      if (payload.errors) {
        setErrors(payload.errors);
        // The summary takes focus so a screen reader and a keyboard user both
        // land on what went wrong instead of being returned to the top.
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
      <Section id="book-a-demo" labelledBy="demo-sent-heading">
        <div className="max-w-xl rounded-card border-t-2 border-teal bg-white p-7 md:p-9">
          <h2
            id="demo-sent-heading"
            className="font-display text-subhead font-medium text-navy"
          >
            Request sent.
          </h2>
          <p className="mt-2 text-small text-slate">
            We will reply to the address you gave.
          </p>
        </div>
      </Section>
    );
  }

  return (
    <Section id="book-a-demo" labelledBy="book-a-demo-heading">
      <SectionHead id="book-a-demo-heading">
        See Gradlly with your own programme.
      </SectionHead>

      <p className="measure mt-6 text-body text-slate">
        Whether you hire into regulated roles or run apprenticeships,
        we&rsquo;ll walk you through the parts of Gradlly that matter to you.
      </p>

      <form
        onSubmit={onSubmit}
        noValidate
        className="mt-10 max-w-xl rounded-card border border-rule bg-white p-6 md:p-8"
      >
        {Object.keys(errors).length > 0 ? (
          <div
            ref={summaryRef}
            tabIndex={-1}
            role="alert"
            className="mb-6 rounded-control border-l-2 border-navy bg-paper p-4"
          >
            <p className="text-small font-semibold text-navy">
              Check these before sending
            </p>
            <ul className="mt-2 list-none space-y-1">
              {Object.entries(errors).map(([field, text]) => (
                <li key={field}>
                  <a
                    href={`#${formId}-${field}`}
                    className="text-small text-navy underline decoration-2 underline-offset-4"
                  >
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="space-y-5">
          {FIELDS.map(({ name, label, type, autoComplete }) => (
            <div key={name}>
              <label
                htmlFor={`${formId}-${name}`}
                className="block text-small font-medium text-navy"
              >
                {label}
              </label>
              <input
                id={`${formId}-${name}`}
                name={name}
                type={type}
                autoComplete={autoComplete}
                aria-invalid={errors[name] ? true : undefined}
                aria-describedby={
                  errors[name] ? `${formId}-${name}-error` : undefined
                }
                className={`mt-1.5 w-full rounded-control border bg-white px-3.5 py-2.5 text-small text-navy transition-colors duration-100 ease-out ${
                  errors[name] ? "border-2 border-navy" : "border-rule"
                }`}
              />
              {errors[name] ? (
                <p
                  id={`${formId}-${name}-error`}
                  className="mt-1.5 text-meta text-navy"
                >
                  {errors[name]}
                </p>
              ) : null}
            </div>
          ))}

          <fieldset>
            <legend className="text-small font-medium text-navy">
              I&apos;m interested in
            </legend>
            <div className="mt-2 space-y-2">
              {INTERESTS.map(({ value, label }) => (
                <label
                  key={value}
                  htmlFor={`${formId}-interest-${value}`}
                  className="flex items-start gap-2.5 text-small text-slate"
                >
                  <input
                    id={`${formId}-interest-${value}`}
                    type="radio"
                    name="interest"
                    value={value}
                    className="mt-1 accent-[var(--color-teal)]"
                  />
                  {label}
                </label>
              ))}
            </div>
            {errors.interest ? (
              <p className="mt-1.5 text-meta text-navy">{errors.interest}</p>
            ) : null}
          </fieldset>
        </div>

        {/*
          Honeypot. Positioned off screen rather than display:none, because
          some autofill still completes hidden fields and display:none is the
          state a bot checks for. aria-hidden and tabindex -1 keep it out of
          the accessibility tree and the tab order.
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
          />
        </div>

        <button
          type="submit"
          disabled={state === "sending"}
          className="mt-7 w-full rounded-control bg-navy px-6 py-3.5 text-small font-semibold text-paper transition-colors duration-[140ms] ease-out hover:bg-[#0d1a2c] disabled:opacity-60 sm:w-auto"
        >
          {state === "sending" ? "Sending" : "Request a demo"}
        </button>

        {message ? (
          <p role="alert" className="mt-4 text-small text-navy">
            {message}
          </p>
        ) : null}

        <p className="mt-5 text-meta text-slate">
          We use your details only to reply to this request.{" "}
          <a
            href="/privacy"
            className="underline decoration-rule decoration-2 underline-offset-4 hover:decoration-navy"
          >
            Privacy
          </a>
        </p>
      </form>

      <p className="mt-6 text-small text-slate">
        Or email us at{" "}
        <span
          className="font-medium text-navy"
          title="Placeholder. The contact email is in docs/marketing/LAUNCH-CHECKLIST.md."
        >
          [CONTACT EMAIL]
        </span>
      </p>
    </Section>
  );
}
