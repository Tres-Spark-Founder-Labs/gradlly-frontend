"use client";

import { makeQueryClient } from "@gradlly/lib";
import { HydrationBoundary, QueryClientProvider } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useState, type ReactNode } from "react";

interface QueryProviderProps {
  children: ReactNode;
  dehydratedState?: unknown;
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

export default function QueryProvider({
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
