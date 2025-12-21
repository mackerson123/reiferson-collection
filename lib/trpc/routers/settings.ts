import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../server";
import { db } from "../../db";
import { settings } from "../../db/schema";
import { eq } from "drizzle-orm";

const SETTINGS_ID = "site-settings";

export const settingsRouter = router({
  get: publicProcedure.query(async () => {
    const [siteSettings] = await db
      .select()
      .from(settings)
      .where(eq(settings.id, SETTINGS_ID))
      .limit(1);

    if (!siteSettings) {
      return {
        id: SETTINGS_ID,
        aboutTitle: "The Reiferson Collection",
        aboutContent: `The Reiferson Collection represents one of the most comprehensive archives of vintage baseball photography, documenting the evolution of America's pastime from the late 19th century through the integration era.

This collection focuses particularly on the often-overlooked stories of the color line in baseball, featuring rare photographs and documents that chronicle both the segregation and eventual integration of professional baseball.

From the pioneering work of photographers like Charles M. Conlon to the intimate documentation of Negro League players and the historic moments surrounding Jackie Robinson's breakthrough, these images preserve crucial moments in both sports and civil rights history.`,
        updatedAt: new Date(),
      };
    }

    return siteSettings;
  }),

  update: protectedProcedure
    .input(
      z.object({
        aboutTitle: z.string().min(1),
        aboutContent: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const [existing] = await db
        .select()
        .from(settings)
        .where(eq(settings.id, SETTINGS_ID))
        .limit(1);

      if (existing) {
        const [updated] = await db
          .update(settings)
          .set({
            aboutTitle: input.aboutTitle,
            aboutContent: input.aboutContent,
            updatedAt: new Date(),
          })
          .where(eq(settings.id, SETTINGS_ID))
          .returning();

        return updated;
      } else {
        const [created] = await db
          .insert(settings)
          .values({
            id: SETTINGS_ID,
            aboutTitle: input.aboutTitle,
            aboutContent: input.aboutContent,
          })
          .returning();

        return created;
      }
    }),
});

