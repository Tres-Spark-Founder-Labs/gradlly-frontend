import { ApiRequestError } from "@gradlly/api";
import { QueryCache, QueryClient, type Query } from "@tanstack/react-query";

/**
 * makeQueryClient factory — called once per render context.
 * Next.js 16 App Router requires a factory instead of a singleton
 * because module-level singletons are shared across all RSC requests
 * on the server, causing cross-request state contamination. A factory
 * ensures each server request gets a fresh QueryClient instance while
 * the browser reuses a single instance per tab via getBrowserQueryClient.
 */
export const makeQueryClient = (): QueryClient => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: (failureCount: number, error: unknown): boolean => {
          if (error instanceof ApiRequestError) {
            if ([401, 403, 404].includes(error.statusCode)) {
              return false;
            }
          }

          return failureCount < 3;
        },
        retryDelay: (attempt: number): number => Math.min(1000 * 2 ** attempt, 30000),
        throwOnError: false,
      },
      mutations: {
        throwOnError: true,
      },
    },
    queryCache: new QueryCache({
      onError: (error: unknown, query: Query): void => {
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent<{ error: unknown; query: Query }>("gradlly:query-error", {
              detail: { error, query },
            }),
          );
        }
      },
    }),
  });
};
