import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import type { AppRouter } from "./router";

export const trpc = createTRPCReact<AppRouter>();

export function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export function createTRPCClient(adminPassword?: string) {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: `${getBaseUrl()}/api/trpc`,
        headers: () => {
          const headers: Record<string, string> = {};
          if (adminPassword) {
            headers["x-admin-password"] = adminPassword;
          }
          return headers;
        },
        transformer: superjson,
      }),
    ],
  });
}

