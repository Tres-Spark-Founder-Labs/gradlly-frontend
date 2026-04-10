import { cache } from "react";

import { makeQueryClient } from "./query-client";

import type { QueryClient } from "@tanstack/react-query";

let browserQueryClient: QueryClient | undefined;

export const getBrowserQueryClient = (): QueryClient => {
  if (typeof window === "undefined") {
    throw new Error(
      "getBrowserQueryClient() cannot be called during SSR. Use getServerQueryClient() on the server.",
    );
  }

  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }

  return browserQueryClient;
};

export const getServerQueryClient = cache((): QueryClient => {
  return makeQueryClient();
});
