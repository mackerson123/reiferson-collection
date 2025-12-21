import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../server";
import { db } from "../../db";
import { works, collections } from "../../db/schema";
import { eq } from "drizzle-orm";

export const worksRouter = router({
  list: publicProcedure
    .input(
      z
        .object({
          collectionId: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      if (input?.collectionId) {
        const worksList = await db
          .select()
          .from(works)
          .where(eq(works.collectionId, input.collectionId));
        return { works: worksList };
      }

      const worksList = await db.select().from(works);
      return { works: worksList };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const work = await db
        .select()
        .from(works)
        .where(eq(works.id, input.id))
        .limit(1);

      if (work.length === 0) {
        throw new Error("Work not found");
      }

      if (work[0].collectionId) {
        const collection = await db
          .select()
          .from(collections)
          .where(eq(collections.id, work[0].collectionId))
          .limit(1);

        return {
          work: work[0],
          collection: collection[0] || null,
        };
      }

      return {
        work: work[0],
        collection: null,
      };
    }),

  create: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        artist: z.string().optional(),
        date: z.string().optional(),
        medium: z.string().optional(),
        dimensions: z.string().optional(),
        description: z.string().optional(),
        narrative: z.string().optional(),
        provenance: z.string().optional(),
        exhibition: z.string().optional(),
        relatedObjects: z.array(z.string()).optional(),
        imageUrl: z.string(),
        thumbnailUrl: z.string().optional(),
        collectionId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const [newWork] = await db.insert(works).values(input).returning();
      return newWork;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        artist: z.string().optional(),
        date: z.string().optional(),
        medium: z.string().optional(),
        dimensions: z.string().optional(),
        description: z.string().optional(),
        narrative: z.string().optional(),
        provenance: z.string().optional(),
        exhibition: z.string().optional(),
        relatedObjects: z.array(z.string()).optional(),
        imageUrl: z.string().optional(),
        thumbnailUrl: z.string().optional(),
        collectionId: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updates } = input;

      const [updated] = await db
        .update(works)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(eq(works.id, id))
        .returning();

      if (!updated) {
        throw new Error("Work not found");
      }

      return updated;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const [deleted] = await db
        .delete(works)
        .where(eq(works.id, input.id))
        .returning();

      if (!deleted) {
        throw new Error("Work not found");
      }

      return { success: true };
    }),
});

