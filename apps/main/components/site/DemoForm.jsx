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

/**
 * The only form on the site, and one of two components that ship JavaScript.
 *
 * Validation runs on the server as well as here. The browser's own checks are
 * a convenience for the person filling it in; they are not a control, because
 * anything can post to the route.
 */
export function DemoForm() {
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
        // The summary takes focus so a keyboard or screen-reader user lands on
        // what went wrong rather than back at the top of the page.
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
      <div className="border-l-4 border-teal pl-6">
        <h2 className="wide-md text-section text-navy">Request sent.</h2>
        <p className="measure mt-4 text-body text-slate">
          We will reply to the address you gave.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      {Object.keys(errors).length > 0 ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="mb-8 border-l-4 border-navy bg-paper p-5"
        >
          <p className="wide-md text-subhead text-navy">
            Check these before sending
          </p>
          <ul className="mt-3 list-none space-y-1.5">
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

      <div className="space-y-7">
        {FIELDS.map(({ name, label, type, autoComplete }) => (
          <div key={name}>
            <label
              htmlFor={`${formId}-${name}`}
              className="block text-ref text-slate"
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
              className={`mt-2 w-full border-b-2 bg-transparent pb-2 text-lead text-navy transition-colors duration-100 ease-out focus:border-navy focus:outline-none ${
                errors[name] ? "border-navy" : "border-rule"
              }`}
            />
            {errors[name] ? (
              <p
                id={`${formId}-${name}-error`}
                className="mt-2 text-ref text-navy"
              >
                {errors[name]}
              </p>
            ) : null}
          </div>
        ))}

        <fieldset>
          <legend className="text-ref text-slate">
            I&rsquo;m interested in
          </legend>
          <div className="mt-3">
            {INTERESTS.map(({ value, label }) => (
              <label
                key={value}
                htmlFor={`${formId}-interest-${value}`}
                className="flex items-start gap-3 border-t border-rule py-3.5 text-small text-navy last:border-b"
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
            <p className="mt-2 text-ref text-navy">{errors.interest}</p>
          ) : null}
        </fieldset>
      </div>

      {/*
        Honeypot. Positioned off screen rather than display:none, because some
        autofill still completes hidden fields and display:none is the state a
        bot checks for. aria-hidden and tabindex -1 keep it out of the
        accessibility tree and the tab order.
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
        className="mt-10 w-full bg-navy px-6 py-4 text-small font-semibold text-white transition-colors duration-[140ms] ease-out hover:bg-navy-deep disabled:opacity-60 sm:w-auto"
      >
        {state === "sending" ? "Sending" : "Request a demo"}
      </button>

      {message ? (
        <p role="alert" className="mt-4 text-small text-navy">
          {message}
        </p>
      ) : null}

      <p className="mt-6 text-ref text-slate">
        We use your details only to reply to this request.{" "}
        <a
          href="/privacy"
          className="underline decoration-rule decoration-2 underline-offset-4 hover:decoration-navy"
        >
          Privacy
        </a>
      </p>
    </form>
  );
}
