"use client";

import {
  HydrationBoundary,
  QueryClientProvider,
  type DehydratedState,
} from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useState, type ReactNode } from "react";

import { makeQueryClient } from "./query-client";

interface QueryProviderProps {
  children: ReactNode;
  dehydratedState?: DehydratedState | null;
}

const ReactQueryDevtools = dynamic(
  async () => {
    const devtoolsModule = await import("@tanstack/react-query-devtools");
    return devtoolsModule.ReactQueryDevtools;
  },
  { ssr: false },
);

function ReactQueryDevtoolsWrapper(): ReactNode {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
  );
}

export function QueryProvider({
  children,
  dehydratedState,
}: QueryProviderProps): ReactNode {
  const [queryClient] = useState(() => makeQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
      <ReactQueryDevtoolsWrapper />
    </QueryClientProvider>
  );
}
