import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../../../../lib/trpc/router";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => {
      const adminPassword = req.headers.get("x-admin-password") || undefined;
      return {
        adminPassword,
      };
    },
  });

export { handler as GET, handler as POST };

