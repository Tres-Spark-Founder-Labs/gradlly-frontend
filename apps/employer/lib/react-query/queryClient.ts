import { QueryClient } from "@tanstack/react-query";

import { queryConfig } from "@/lib/react-query/query.config";

function makeQueryClient(): QueryClient {
  return new QueryClient({ defaultOptions: queryConfig });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient(): QueryClient {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}
