"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, ShieldCheck, ShieldOff } from "lucide-react";
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { ServerErrorAlert } from "@/components/error/ServerErrorAlert";
import { InputField } from "@/components/form/InputField";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import {
  useConfirmMfa,
  useDisableMfa,
  useEnrollMfa,
} from "@/features/auth/queries/auth.query";
import { mfaCodeDefaults, mfaCodeSchema } from "@/features/auth/schemas";
import { applyServerErrors } from "@/lib/errors";

import { useAuthUser } from "../hooks/useAuthUser";

function CodeForm({ onSubmit, submitLabel, error, pending }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(mfaCodeSchema),
    defaultValues: mfaCodeDefaults,
    mode: "onSubmit",
  });
  const disabled = isSubmitting || pending;

  const submit = handleSubmit(async (values) => {
    try {
      await onSubmit(values);
    } catch (e) {
      applyServerErrors(e, setError);
    }
  });

  return (
    <form onSubmit={submit} noValidate className="space-y-3">
      <ServerErrorAlert error={error} />
      <fieldset disabled={disabled} className="contents space-y-3">
        <InputField
          required
          name="code"
          label="Authenticator code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="123456"
          register={register}
          error={errors.code?.message}
        />
        <Button type="submit" loading={disabled} disabled={disabled}>
          {submitLabel}
        </Button>
      </fieldset>
    </form>
  );
}

function EnrollmentFlow({ onDone }) {
  const [enrollment, setEnrollment] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [recoveryCodes, setRecoveryCodes] = useState(null);

  const enroll = useEnrollMfa();
  const confirm = useConfirmMfa();

  useEffect(() => {
    enroll.mutateAsync().then(setEnrollment);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!enrollment?.otpauthUrl) return;
    QRCode.toDataURL(enrollment.otpauthUrl)
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(null));
  }, [enrollment?.otpauthUrl]);

  const handleConfirm = async ({ code }) => {
    const result = await confirm.mutateAsync({ code });
    setRecoveryCodes(result?.recoveryCodes ?? []);
  };

  if (recoveryCodes) {
    return (
      <div className="space-y-4">
        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-amber-600" />
          <p className="text-sm text-amber-800">
            Save these recovery codes somewhere safe. Each can be used once to
            log in if you lose access to your authenticator app — they
            won&apos;t be shown again.
          </p>
        </div>
        <ul className="grid grid-cols-2 gap-2 rounded-lg bg-neutral-50 p-4 font-mono text-sm text-neutral-700">
          {recoveryCodes.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
        <Button onClick={onDone}>Done</Button>
      </div>
    );
  }

  if (!enrollment) {
    return <p className="text-sm text-neutral-400">Preparing setup…</p>;
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-neutral-600">
        Scan this QR code with an authenticator app (Google Authenticator,
        1Password, Authy, etc.), then enter the 6-digit code it shows.
      </p>
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        {qrDataUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={qrDataUrl}
            alt="Scan with your authenticator app"
            className="size-40 rounded-lg border border-neutral-200"
          />
        )}
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
            Can&apos;t scan? Enter this key manually
          </p>
          <p className="break-all rounded-lg bg-neutral-50 px-3 py-2 font-mono text-sm text-neutral-700">
            {enrollment.secret}
          </p>
        </div>
      </div>

      <CodeForm
        onSubmit={handleConfirm}
        submitLabel="Confirm and enable MFA"
        error={confirm.error}
        pending={confirm.isPending}
      />
    </div>
  );
}

export function MfaSetup() {
  const { user } = useAuthUser();
  const [setupOpen, setSetupOpen] = useState(false);
  const [disableOpen, setDisableOpen] = useState(false);
  const disableMfa = useDisableMfa();

  if (!user) return null;

  if (user.mfaEnabled) {
    return (
      <Card>
        <CardHeader className="flex items-center gap-2">
          <ShieldCheck className="size-4 text-green-600" />
          <h2 className="text-base font-semibold text-neutral-900">
            Two-factor authentication
          </h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-neutral-600">
            MFA is enabled on your account. You&apos;ll be asked for a code from
            your authenticator app each time you log in.
          </p>
          {disableOpen ? (
            <CodeForm
              onSubmit={async ({ code }) => {
                await disableMfa.mutateAsync({ code });
                setDisableOpen(false);
              }}
              submitLabel="Confirm disable"
              error={disableMfa.error}
              pending={disableMfa.isPending}
            />
          ) : (
            <Button
              color="black"
              variant="outline"
              startIcon={<ShieldOff className="size-4" />}
              onClick={() => setDisableOpen(true)}
            >
              Disable MFA
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex items-center gap-2">
        <ShieldCheck className="size-4 text-neutral-400" />
        <h2 className="text-base font-semibold text-neutral-900">
          Two-factor authentication
        </h2>
      </CardHeader>
      <CardContent className="space-y-4">
        {setupOpen ? (
          <EnrollmentFlow onDone={() => setSetupOpen(false)} />
        ) : (
          <>
            <p className="text-sm text-neutral-600">
              Add an extra layer of security to your account by requiring a code
              from an authenticator app when you log in.
            </p>
            <Button onClick={() => setSetupOpen(true)}>Enable MFA</Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
