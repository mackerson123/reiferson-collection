import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";

const t = initTRPC.context<{
  adminPassword?: string;
}>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedPassword) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "ADMIN_PASSWORD not configured",
    });
  }

  if (!ctx.adminPassword || ctx.adminPassword !== expectedPassword) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid admin password",
    });
  }

  return next();
});

