"use client";

import { toasterConfig } from "@gradlly/hooks";
import { Toaster } from "react-hot-toast";

import type { ReactNode } from "react";

import { QueryProvider } from "@/lib/react-query";

interface ProvidersProps {
  children: ReactNode;
  dehydratedState?: unknown;
}

export default function Providers({
  children,
  dehydratedState,
}: ProvidersProps): ReactNode {
  return (
    <QueryProvider dehydratedState={dehydratedState}>
      {children}
      <Toaster {...toasterConfig} />
    </QueryProvider>
  );
}
