import { QueryCache, QueryClient } from "@tanstack/react-query";

import { ApiRequestError } from "../api/types";

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
        retryDelay: (attempt: number): number =>
          Math.min(1000 * 2 ** attempt, 30000),
        throwOnError: false,
      },
      mutations: {
        throwOnError: true,
      },
    },
    queryCache: new QueryCache({
      onError: (error, query): void => {
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("gradlly:query-error", {
              detail: { error, query } as { error: Error; query: unknown },
            }),
          );
        }
      },
    }),
  });
};
// window.addEventListener("gradlly:query-error", (e) => {
//   const { error, query } = (e as CustomEvent<{ error: Error; query: Query<unknown, Error> }>).detail;
// });
