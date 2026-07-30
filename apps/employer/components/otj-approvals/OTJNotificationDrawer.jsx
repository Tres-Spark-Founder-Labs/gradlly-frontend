"use client";
import { X } from "lucide-react";
import { useState } from "react";

import { T } from "@/components/dashboard/levy/tokens";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import {
  DIGEST_FREQUENCIES,
  DIGEST_FREQUENCY_LABELS,
} from "@/features/otj/constants";
import {
  useDigestPreference,
  useUpdateDigestPreference,
} from "@/features/otj/queries/otj.query";
import {
  describeFrequency,
  formatNextDigest,
} from "@/features/otj/utils/digest-schedule";

const ORDER = [
  DIGEST_FREQUENCIES.DAILY,
  DIGEST_FREQUENCIES.WEEKLY,
  DIGEST_FREQUENCIES.OFF,
];

export function OTJNotificationDrawer({ onClose }) {
  const { user } = useAuthUser();
  const { data, isLoading } = useDigestPreference();
  const { mutate: save, isPending } = useUpdateDigestPreference();

  /**
   * Local draft so the segmented control responds immediately.
   *
   * Null until the manager picks something, and read through to the server
   * value below — no effect is needed to seed it, and syncing state from an
   * effect would only add a cascading render.
   */
  const [draft, setDraft] = useState(null);

  const serverFreq = data?.frequency ?? null;
  const selected = draft ?? serverFreq;
  const dirty = Boolean(draft && serverFreq && draft !== serverFreq);

  const handleSave = () => {
    if (!selected || !dirty) return;
    save({ frequency: selected }, { onSuccess: onClose });
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[230] bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="fixed right-0 top-0 h-full z-[240] flex flex-col shadow-2xl w-full sm:w-[400px]"
        style={{
          backgroundColor: T.surface,
          borderLeft: `1px solid ${T.border}`,
          animation: "slide-in-right 300ms cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        <div
          className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{ borderBottom: `1px solid ${T.border}` }}
        >
          <p className="text-sm font-bold" style={{ color: T.ink }}>
            OTJ digest settings
          </p>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-neutral-100"
            style={{ color: T.muted }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div>
            <p
              className="text-xs font-semibold mb-2"
              style={{ color: T.subtle }}
            >
              Digest frequency
            </p>

            {isLoading || !selected ? (
              <div
                className="h-9 w-56 rounded-xl animate-pulse"
                style={{ backgroundColor: T.card }}
              />
            ) : (
              <div
                className="inline-flex rounded-xl overflow-hidden"
                role="group"
                aria-label="Digest frequency"
                style={{ border: `1px solid ${T.border}` }}
              >
                {ORDER.map((value, i) => {
                  const active = selected === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setDraft(value)}
                      disabled={isPending}
                      className="px-4 py-2 text-xs font-semibold transition-all disabled:opacity-50"
                      style={{
                        backgroundColor: active ? T.ink : "transparent",
                        color: active ? "#fff" : T.subtle,
                        borderRight:
                          i < ORDER.length - 1
                            ? `1px solid ${T.border}`
                            : "none",
                      }}
                    >
                      {DIGEST_FREQUENCY_LABELS[value]}
                    </button>
                  );
                })}
              </div>
            )}

            {selected && (
              <p
                className="text-xs mt-2"
                style={{
                  color:
                    selected === DIGEST_FREQUENCIES.OFF ? T.amber : T.muted,
                }}
              >
                {selected === DIGEST_FREQUENCIES.OFF ? "⚠ " : ""}
                {describeFrequency(selected)}
              </p>
            )}
          </div>

          {/*
            The recipient is the signed-in manager's account email. There is no
            multi-recipient storage in the API, so this is shown read-only
            rather than as an editable field with an "+ Add recipient" button
            that saved nothing — which is what was here before, pre-filled with
            a hardcoded address that belonged to no one signed in.
          */}
          <div>
            <p
              className="text-xs font-semibold mb-2"
              style={{ color: T.subtle }}
            >
              Sent to
            </p>
            <div
              className="w-full px-3 py-2 rounded-xl text-xs border"
              style={{
                borderColor: T.border,
                color: T.ink,
                backgroundColor: T.card,
              }}
            >
              {user?.email ?? "your account email"}
            </div>
            <p className="text-xs mt-1.5" style={{ color: T.muted }}>
              Digests go to your account email. Change it in account settings.
            </p>
          </div>

          {selected !== DIGEST_FREQUENCIES.OFF && (
            <div
              className="rounded-xl px-4 py-3"
              style={{
                backgroundColor: T.card,
                border: `1px solid ${T.border}`,
              }}
            >
              <p
                className="text-[10px] font-bold uppercase tracking-wider mb-1"
                style={{ color: T.muted }}
              >
                Next scheduled digest
              </p>
              <p className="text-xs font-semibold" style={{ color: T.ink }}>
                {formatNextDigest(selected) ?? "—"}
              </p>
            </div>
          )}
        </div>

        <div
          className="shrink-0 px-5 py-4"
          style={{ borderTop: `1px solid ${T.border}` }}
        >
          <button
            type="button"
            onClick={handleSave}
            disabled={!dirty || isPending}
            className="w-full py-2.5 rounded-xl text-sm font-bold hover:opacity-80 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: T.blue, color: "#fff" }}
          >
            {isPending ? "Saving…" : dirty ? "Save settings" : "Saved"}
          </button>
        </div>
      </div>
    </>
  );
}
