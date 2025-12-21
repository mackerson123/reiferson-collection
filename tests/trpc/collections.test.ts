import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../lib/db", () => {
  const mockCollections = [
    {
      id: "test-collection-1",
      name: "Test Collection",
      description: "A test collection",
      curatorNote: "Curator notes here",
      sortOrder: 0,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockWorks = [
    {
      id: "test-work-1",
      title: "Test Work",
      imageUrl: "/test.jpg",
      collectionId: "test-collection-1",
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  let callIndex = 0;

  return {
    db: {
      select: vi.fn(() => ({
        from: vi.fn(() => {
          const isCollectionsQuery = callIndex % 2 === 0;
          callIndex++;

          const result = {
            orderBy: vi.fn(() =>
              Promise.resolve(isCollectionsQuery ? mockCollections : mockWorks)
            ),
            where: vi.fn(() => ({
              orderBy: vi.fn(() =>
                Promise.resolve(
                  isCollectionsQuery ? mockCollections : mockWorks
                )
              ),
            })),
            then: (resolve: any) =>
              resolve(isCollectionsQuery ? mockCollections : mockWorks),
          };

          return result;
        }),
      })),
      insert: vi.fn(() => ({
        values: vi.fn(() => ({
          returning: vi.fn(() => Promise.resolve(mockCollections)),
        })),
      })),
      update: vi.fn(() => ({
        set: vi.fn(() => ({
          where: vi.fn(() => ({
            returning: vi.fn(() =>
              Promise.resolve([
                {
                  ...mockCollections[0],
                  name: "Updated Name",
                },
              ])
            ),
          })),
        })),
      })),
    },
  };
});

import { appRouter } from "../../lib/trpc/router";

describe("Collections Router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("collections.list", () => {
    it("should return collections with works", async () => {
      const caller = appRouter.createCaller({ adminPassword: undefined });
      const result = await caller.collections.list();

      expect(result).toHaveProperty("collections");
      expect(Array.isArray(result.collections)).toBe(true);
    });
  });

  describe("collections.update (protected)", () => {
    it("should reject unauthorized requests", async () => {
      const caller = appRouter.createCaller({ adminPassword: undefined });

      await expect(
        caller.collections.update({
          id: "test-collection-1",
          name: "Updated Name",
        })
      ).rejects.toThrow();
    });

    it("should reject wrong password", async () => {
      const caller = appRouter.createCaller({
        adminPassword: "wrong-password",
      });

      await expect(
        caller.collections.update({
          id: "test-collection-1",
          name: "Updated Name",
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

      const result = await caller.collections.update({
        id: "test-collection-1",
        name: "Updated Name",
      });

      expect(result).toBeDefined();
    });
  });
});
