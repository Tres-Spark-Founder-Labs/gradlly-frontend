// lib/react-query/queryConfig.ts
import type { DefaultOptions } from "@tanstack/react-query";

function shouldRetry(failureCount: number, error: unknown): boolean {
  const MAX_RETRIES = 3;
  if (failureCount >= MAX_RETRIES) return false;
  const status =
    (error as { status?: number })?.status ??
    (error as { response?: { status?: number } })?.response?.status;
  if (typeof status === "number" && status >= 400 && status < 500) return false;
  return true;
}

function retryDelay(attemptIndex: number): number {
  return Math.min(1000 * 2 ** attemptIndex, 30_000);
}

export const queryConfig: DefaultOptions = {
  queries: {
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: shouldRetry,
    retryDelay,
  },
  mutations: {
    retry: (failureCount, error) =>
      failureCount < 1 && shouldRetry(failureCount, error),
    retryDelay,
  },
};
