import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import type { ReactNode } from "react";

import { getQueryClient } from "@/lib/react-query/queryClient";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";
import { ToasterProvider } from "@/providers/ToastProvider";

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const queryClient = getQueryClient();
  return (
    <ReactQueryProvider>
      <HydrationBoundary state={dehydrate(queryClient)}>
        {children}
      </HydrationBoundary>
      <ToasterProvider />
    </ReactQueryProvider>
  );
}
