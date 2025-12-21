import { router } from "./server";
import { collectionsRouter } from "./routers/collections";
import { worksRouter } from "./routers/works";
import { settingsRouter } from "./routers/settings";

export const appRouter = router({
  collections: collectionsRouter,
  works: worksRouter,
  settings: settingsRouter,
});

export type AppRouter = typeof appRouter;

