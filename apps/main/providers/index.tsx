"use client";

import { toasterConfig } from "@gradlly/hooks";
import { Toaster } from "react-hot-toast";

import type { DehydratedState } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { QueryProvider } from "@/lib/react-query";

interface ProvidersProps {
  children: ReactNode;
  dehydratedState?: DehydratedState | null;
}

export default function Providers({
  children,
  dehydratedState,
}: ProvidersProps): ReactNode {
  return (
    <QueryProvider {...(dehydratedState !== undefined && { dehydratedState })}>
      {children}
      <Toaster {...toasterConfig} />
    </QueryProvider>
  );
}
