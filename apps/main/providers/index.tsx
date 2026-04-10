"use client";

import QueryProvider from "./query-provider";

import type { ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
  dehydratedState?: unknown;
}

export default function Providers({
  children,
  dehydratedState,
}: ProvidersProps): ReactNode {
  return (
    <QueryProvider dehydratedState={dehydratedState}>{children}</QueryProvider>
  );
}
