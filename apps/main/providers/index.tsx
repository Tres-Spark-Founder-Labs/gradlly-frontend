"use client";

import type { ReactNode } from "react";

import QueryProvider from "./query-provider";

interface ProvidersProps {
  children: ReactNode;
  dehydratedState?: unknown;
}

export default function Providers({ children, dehydratedState }: ProvidersProps): ReactNode {
  return <QueryProvider dehydratedState={dehydratedState}>{children}</QueryProvider>;
}
