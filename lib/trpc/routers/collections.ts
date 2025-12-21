import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../server";
import { db } from "../../db";
import { collections, works } from "../../db/schema";
import { eq } from "drizzle-orm";

export const collectionsRouter = router({
  list: publicProcedure.query(async () => {
    const allCollections = await db.select().from(collections);
    const allWorks = await db.select().from(works);

    const collectionsWithWorks = allCollections.map((collection) => ({
      ...collection,
      works: allWorks.filter((work) => work.collectionId === collection.id),
    }));

    return { collections: collectionsWithWorks };
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const collection = await db
        .select()
        .from(collections)
        .where(eq(collections.id, input.id))
        .limit(1);

      if (collection.length === 0) {
        throw new Error("Collection not found");
      }

      const collectionWorks = await db
        .select()
        .from(works)
        .where(eq(works.collectionId, input.id));

      return {
        ...collection[0],
        works: collectionWorks,
      };
    }),

  create: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string().optional(),
        curatorNote: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const [newCollection] = await db
        .insert(collections)
        .values({
          id: input.id,
          name: input.name,
          description: input.description,
          curatorNote: input.curatorNote,
        })
        .returning();

      return newCollection;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        curatorNote: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updates } = input;

      const [updated] = await db
        .update(collections)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(eq(collections.id, id))
        .returning();

      if (!updated) {
        throw new Error("Collection not found");
      }

      return updated;
    }),
});

