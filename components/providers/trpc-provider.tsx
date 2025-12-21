"use client";

import { useState, useMemo } from "react";
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
} from "@tanstack/react-query";
import { trpc, createTRPCClient } from "../../lib/trpc/client";
import { ErrorModal, addError } from "../error-modal";

export function TRPCProvider({
  children,
  adminPassword,
}: {
  children: React.ReactNode;
  adminPassword?: string;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error) => {
            addError(error);
          },
        }),
        mutationCache: new MutationCache({
          onError: (error) => {
            addError(error);
          },
        }),
        defaultOptions: {
          queries: {
            retry: false,
          },
        },
      })
  );
  const trpcClient = useMemo(
    () => createTRPCClient(adminPassword),
    [adminPassword]
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ErrorModal />
      </QueryClientProvider>
    </trpc.Provider>
  );
}
