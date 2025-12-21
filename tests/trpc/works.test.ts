import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../lib/db", () => ({
  db: {
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([
            {
              id: "test-work-1",
              title: "Test Work",
              artist: "Test Artist",
              date: "2024",
              medium: "Oil on canvas",
              dimensions: "10x10",
              description: "Test description",
              narrative: "Test narrative",
              provenance: "Test provenance",
              exhibition: null,
              relatedObjects: null,
              imageUrl: "/test.jpg",
              thumbnailUrl: null,
              collectionId: "test-collection-1",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ]),
        }),
      }),
    }),
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([
          {
            id: "new-work",
            title: "New Work",
            imageUrl: "/new.jpg",
            collectionId: "test-collection-1",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]),
      }),
    }),
    update: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([
            {
              id: "test-work-1",
              title: "Updated Title",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ]),
        }),
      }),
    }),
    delete: vi.fn().mockReturnValue({
      where: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([{ id: "test-work-1" }]),
      }),
    }),
  },
}));

import { appRouter } from "../../lib/trpc/router";

describe("Works Router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("works.list", () => {
    it("should return all works", async () => {
      const { db } = await import("../../lib/db");
      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockResolvedValue([
          {
            id: "test-work-1",
            title: "Test Work",
            imageUrl: "/test.jpg",
            collectionId: "test-collection-1",
          },
        ]),
      } as any);

      const caller = appRouter.createCaller({ adminPassword: undefined });
      const result = await caller.works.list();

      expect(result).toHaveProperty("works");
      expect(Array.isArray(result.works)).toBe(true);
    });
  });

  describe("works.create (protected)", () => {
    it("should reject unauthorized requests", async () => {
      const caller = appRouter.createCaller({ adminPassword: undefined });

      await expect(
        caller.works.create({
          id: "new-work",
          title: "New Work",
          imageUrl: "/new.jpg",
          collectionId: "test-collection-1",
        })
      ).rejects.toThrow();
    });

    it("should allow authorized requests", async () => {
      const correctPassword = process.env.ADMIN_PASSWORD;
      if (!correctPassword) {
        console.warn("Skipping auth test - ADMIN_PASSWORD not set");
        return;
      }

      const caller = appRouter.createCaller({ adminPassword: correctPassword });

      const result = await caller.works.create({
        id: "new-work",
        title: "New Work",
        imageUrl: "/new.jpg",
        collectionId: "test-collection-1",
      });

      expect(result).toBeDefined();
    });
  });

  describe("works.update (protected)", () => {
    it("should reject unauthorized requests", async () => {
      const caller = appRouter.createCaller({ adminPassword: undefined });

      await expect(
        caller.works.update({
          id: "test-work-1",
          title: "Updated Title",
        })
      ).rejects.toThrow();
    });
  });

  describe("works.delete (protected)", () => {
    it("should reject unauthorized requests", async () => {
      const caller = appRouter.createCaller({ adminPassword: undefined });

      await expect(caller.works.delete({ id: "test-work-1" })).rejects.toThrow();
    });

    it("should allow authorized deletion", async () => {
      const correctPassword = process.env.ADMIN_PASSWORD;
      if (!correctPassword) {
        console.warn("Skipping auth test - ADMIN_PASSWORD not set");
        return;
      }

      const caller = appRouter.createCaller({ adminPassword: correctPassword });

      const result = await caller.works.delete({ id: "test-work-1" });

      expect(result).toHaveProperty("success", true);
    });
  });
});
