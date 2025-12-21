import { router } from "./server";
import { collectionsRouter } from "./routers/collections";
import { worksRouter } from "./routers/works";

export const appRouter = router({
  collections: collectionsRouter,
  works: worksRouter,
});

export type AppRouter = typeof appRouter;

