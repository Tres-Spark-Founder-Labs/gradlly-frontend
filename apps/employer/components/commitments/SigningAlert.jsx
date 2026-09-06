"use client";

import { X } from "lucide-react";
import { useState } from "react";

import { T } from "@/components/dashboard/levy/tokens";

const KEY = "signing_alert_v1";

/**
 * sessionStorage does not exist while this renders on the server.
 *
 * "use client" marks the component as interactive; it does not stop Next from
 * server-rendering it first. Reading the store directly in the state
 * initialiser therefore threw a ReferenceError on the server pass — a second
 * way this banner could take the page down, independent of the property bug
 * below.
 */
function readDismissedId() {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage.getItem(KEY);
  } catch {
    // Private browsing and blocked storage both throw on access. A banner that
    // cannot remember a dismissal is a small annoyance; one that crashes the
    // commitment board is not.
    return null;
  }
}

export function SigningAlert({ statement, onSignNow, onViewDoc }) {
  /**
   * ── THE CRASH THIS FIXES ──────────────────────────────────────────────────
   *
   * This read `statement.apprentice.name`. `CommitmentBoardRowDto` has no
   * `apprentice` object — it is flat, with `apprenticeName: string | null` —
   * so the property access threw and took the whole route down through
   * app/error.jsx. It only surfaced once the seed produced a statement
   * awaiting the employer, because the banner renders only for
   * `actionRequired` rows: every employer with something to sign lost the
   * entire board, which is exactly the group the screen exists to serve.
   *
   * The same component also read `statement.id`, which the DTO does not carry
   * either (it is `statementId`). That one did not throw — it quietly stored
   * the string "undefined", so dismissing the banner never persisted and it
   * returned on every reload.
   */
  const statementId = statement?.statementId ?? null;
  const [dismissed, setDismissed] = useState(
    () => statementId !== null && readDismissedId() === statementId,
  );

  if (!statement || dismissed) return null;

  const dismiss = () => {
    if (typeof window !== "undefined" && statementId) {
      try {
        window.sessionStorage.setItem(KEY, statementId);
      } catch {
        // Dismissal is then per-render rather than per-session. Still better
        // than throwing out of an onClick.
      }
    }
    setDismissed(true);
  };

  // Nullable on the DTO. Named as missing rather than filled with a stand-in,
  // and the heading still says what needs doing.
  const apprenticeName = statement.apprenticeName;

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        backgroundColor: T.blueLight,
        border: `1px solid ${T.blue}30`,
        borderLeft: `3px solid ${T.blue}`,
      }}
    >
      <div className="flex items-start justify-between gap-3 px-4 py-3.5">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span
            className="mt-0.5 shrink-0 text-base leading-none"
            style={{ color: T.blue }}
          >
            ℹ
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold" style={{ color: T.blue }}>
              Action required
              {apprenticeName ? ` — ${apprenticeName}` : ""}
            </p>
            {!apprenticeName && (
              <p className="text-[11px] mt-0.5" style={{ color: T.muted }}>
                The apprentice&apos;s name is not recorded on this statement.
              </p>
            )}
            <p
              className="mt-1 text-xs leading-relaxed"
              style={{ color: T.subtle }}
            >
              This commitment statement is awaiting your signature as the final
              step before it becomes fully compliant.
            </p>
            <div className="mt-2.5 flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={onSignNow}
                className="px-3 py-1.5 rounded-lg text-xs font-bold hover:opacity-80 transition-opacity"
                style={{ backgroundColor: T.blue, color: "#fff" }}
              >
                Sign now
              </button>
              <button
                type="button"
                onClick={onViewDoc}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border hover:opacity-80 transition-opacity"
                style={{ borderColor: `${T.blue}40`, color: T.blue }}
              >
                View document
              </button>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-blue-100 transition-colors shrink-0"
          aria-label="Dismiss"
        >
          <X className="h-3.5 w-3.5" style={{ color: T.blue }} />
        </button>
      </div>
    </div>
  );
}
