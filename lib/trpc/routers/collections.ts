import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../server";
import { db } from "../../db";
import { collections, works } from "../../db/schema";
import { eq, asc } from "drizzle-orm";
import { withLocalWorkSimulation } from "../../local-work-simulation";

export const collectionsRouter = router({
  // Public query - only returns published collections with published works
  listPublished: publicProcedure.query(async () => {
    const publishedCollections = await db
      .select()
      .from(collections)
      .where(eq(collections.isPublished, true))
      .orderBy(asc(collections.sortOrder));

    const publishedWorks = await db
      .select()
      .from(works)
      .where(eq(works.isPublished, true));

    const collectionsWithWorks = publishedCollections.map((collection) => ({
      ...collection,
      works: publishedWorks.filter(
        (work) => work.collectionId === collection.id
      ),
    }));

    const visibleCollections = collectionsWithWorks.filter(
      (c) => c.works.length > 0
    );

    // Only return collections that have at least one published work
    return {
      collections: withLocalWorkSimulation(visibleCollections),
    };
  }),

  // Admin query - returns all collections including drafts
  list: publicProcedure.query(async () => {
    const allCollections = await db
      .select()
      .from(collections)
      .orderBy(asc(collections.sortOrder));
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
        description: z.string().nullish(),
        curatorNote: z.string().nullish(),
        isPublished: z.boolean().optional().default(false),
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
          isPublished: input.isPublished,
        })
        .returning();

      return newCollection;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        description: z.string().nullish(),
        curatorNote: z.string().nullish(),
        isPublished: z.boolean().optional(),
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

  // Toggle publish status
  togglePublish: protectedProcedure
    .input(z.object({ id: z.string(), publishWorks: z.boolean().optional() }))
    .mutation(async ({ input }) => {
      // Get current status
      const [current] = await db
        .select()
        .from(collections)
        .where(eq(collections.id, input.id));

      if (!current) {
        throw new Error("Collection not found");
      }

      const newStatus = !current.isPublished;

      // Update the collection
      const [updated] = await db
        .update(collections)
        .set({
          isPublished: newStatus,
          updatedAt: new Date(),
        })
        .where(eq(collections.id, input.id))
        .returning();

      // If publishing the collection and publishWorks is true, publish all works in this collection
      if (newStatus && input.publishWorks) {
        await db
          .update(works)
          .set({
            isPublished: true,
            updatedAt: new Date(),
          })
          .where(eq(works.collectionId, input.id));
      }

      return updated;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      // First, delete all works associated with this collection
      await db.delete(works).where(eq(works.collectionId, input.id));

      // Then delete the collection
      const [deleted] = await db
        .delete(collections)
        .where(eq(collections.id, input.id))
        .returning();

      if (!deleted) {
        throw new Error("Collection not found");
      }

      return { success: true };
    }),

  updateOrder: protectedProcedure
    .input(
      z.object({
        collectionIds: z.array(z.string()),
      })
    )
    .mutation(async ({ input }) => {
      const updates = input.collectionIds.map((id, index) =>
        db
          .update(collections)
          .set({
            sortOrder: index,
            updatedAt: new Date(),
          })
          .where(eq(collections.id, id))
      );

      await Promise.all(updates);

      return { success: true };
    }),
});
