import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import {
  isAdminPasswordConfigured,
  isValidAdminPassword,
} from "../admin-auth";

const t = initTRPC.context<{
  adminPassword?: string;
}>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!isAdminPasswordConfigured()) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "ADMIN_PASSWORD not configured",
    });
  }

  if (!isValidAdminPassword(ctx.adminPassword)) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid admin password",
    });
  }

  return next();
});

