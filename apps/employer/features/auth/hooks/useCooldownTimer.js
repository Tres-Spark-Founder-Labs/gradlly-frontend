"use client";

import { useCallback, useEffect, useLayoutEffect, useState } from "react";

// useLayoutEffect fires synchronously before paint on the client.
// On the server there is no DOM, so fall back to useEffect to silence the
// "useLayoutEffect does nothing on the server" warning from React/Next.js.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Generic localStorage-backed countdown timer.
 *
 * @param {{ storageKey: string, cooldownMs: number, cooldownSeconds: number }} config
 * @returns {{ secondsLeft: number, canAct: boolean, isReady: boolean, triggerCooldown: () => void }}
 */
export function useCooldownTimer({ storageKey, cooldownMs, cooldownSeconds }) {
  const [{ secondsLeft, isReady }, setTimerState] = useState({
    secondsLeft: 0,
    isReady: false,
  });

  const getSecondsLeft = useCallback(() => {
    if (typeof window === "undefined") return 0;
    const raw = localStorage.getItem(storageKey);
    if (!raw) return 0;
    const remaining = cooldownMs - (Date.now() - Number(raw));
    return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
  }, [storageKey, cooldownMs]);

  // useLayoutEffect fires before paint — setState here is a synchronous DOM
  // read, not a cascading render, so react-hooks/set-state-in-effect does not
  // flag it. The initial useState values match the server render, so hydration
  // is clean; this update runs after hydration but before the first paint.
  useIsomorphicLayoutEffect(() => {
    setTimerState({ secondsLeft: getSecondsLeft(), isReady: true });
  }, [getSecondsLeft]);

  // Countdown tick — setState lives in the setTimeout callback, not the effect
  // body, so the React Compiler does not flag it as a synchronous effect call.
  useEffect(() => {
    if (!isReady || secondsLeft <= 0) return;
    const id = setTimeout(() => {
      setTimerState((prev) => ({ ...prev, secondsLeft: getSecondsLeft() }));
    }, 1000);
    return () => clearTimeout(id);
  }, [isReady, secondsLeft, getSecondsLeft]);

  const triggerCooldown = useCallback(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(storageKey, String(Date.now()));
    setTimerState((prev) => ({ ...prev, secondsLeft: cooldownSeconds }));
  }, [storageKey, cooldownSeconds]);

  return {
    secondsLeft,
    canAct: isReady && secondsLeft === 0,
    isReady,
    triggerCooldown,
  };
}
