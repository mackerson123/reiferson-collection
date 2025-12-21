"use client";

import { useState, useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc, createTRPCClient } from "../../lib/trpc/client";

export function TRPCProvider({
  children,
  adminPassword,
}: {
  children: React.ReactNode;
  adminPassword?: string;
}) {
  const [queryClient] = useState(() => new QueryClient());
  const trpcClient = useMemo(
    () => createTRPCClient(adminPassword),
    [adminPassword]
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}

