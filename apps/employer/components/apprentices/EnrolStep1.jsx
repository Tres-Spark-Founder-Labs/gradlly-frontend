"use client";

import { useEmployerManagerOptions } from "@/features/enrolments/queries/enrolments.query";

import { Field, Select } from "./EnrolFields";
import { T } from "./tokens";

export function EnrolStep1({ data, onChange }) {
  // F1.2.5 AC1 — the line manager is a user, not a name. The API stores
  // `employerManagerUserId`, and this field used to be free text whose value
  // was dropped on submit, which is why no enrolment created here ever had a
  // manager to send OTJ approvals or at-risk alerts to.
  const { data: managers = [], isLoading: managersLoading } =
    useEmployerManagerOptions();

  // `displayName` is already "Jane Smith (jane.smith@example.com)" — appending
  // the email again would print it twice.
  const managerOptions = managers.map((m) => ({
    value: m.id,
    label: m.displayName || m.email,
  }));

  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold" style={{ color: T.ink }}>
        Learner details
      </p>
      <Field
        id="firstName"
        label="First name"
        value={data.firstName}
        onChange={onChange}
      />
      <Field
        id="lastName"
        label="Last name"
        value={data.lastName}
        onChange={onChange}
      />
      <Field
        id="email"
        label="Email address"
        type="email"
        hint="We email an invitation here so they can set up their account"
        value={data.email}
        onChange={onChange}
      />
      {/* AC1 — was not collected at all, despite the column existing and the
          roster offering search by it. */}
      <Field
        id="employeeId"
        label="Employee ID"
        placeholder="EMP-04821"
        hint="Your own payroll or staff reference (optional)"
        value={data.employeeId}
        onChange={onChange}
      />
      <Field
        id="dob"
        label="Date of birth"
        type="date"
        value={data.dob}
        onChange={onChange}
      />
      <Field
        id="nino"
        label="National Insurance no."
        placeholder="AB 12 34 56 C"
        value={data.nino}
        onChange={onChange}
      />
      <Field
        id="jobTitle"
        label="Job title"
        placeholder="Junior Software Engineer"
        value={data.jobTitle}
        onChange={onChange}
      />

      {managersLoading ? (
        <div
          className="h-16 rounded-xl animate-pulse"
          style={{ backgroundColor: T.card }}
        />
      ) : managerOptions.length === 0 ? (
        <div
          className="rounded-xl px-3 py-2.5 text-xs"
          style={{
            backgroundColor: T.amberLight,
            color: T.amber,
            border: `1px solid ${T.amber}30`,
          }}
        >
          No colleagues found in your organisation to name as a line manager.
          Invite them from Settings first — the line manager approves this
          apprentice&apos;s off-the-job logs and receives their at-risk alerts.
        </div>
      ) : (
        <Select
          label="Line manager"
          name="manager"
          options={managerOptions}
          value={data.manager}
          onChange={onChange}
        />
      )}
    </div>
  );
}
