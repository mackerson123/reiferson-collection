import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../lib/db", () => ({
  db: {
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockResolvedValue([
        {
          id: "test-collection-1",
          name: "Test Collection",
          description: "A test collection",
          curatorNote: "Curator notes here",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]),
    }),
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([
          {
            id: "test-collection-1",
            name: "Test Collection",
            description: "A test collection",
            curatorNote: "Curator notes here",
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
              id: "test-collection-1",
              name: "Updated Name",
              description: "A test collection",
              curatorNote: "Curator notes here",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ]),
        }),
      }),
    }),
  },
}));

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
      const caller = appRouter.createCaller({ adminPassword: "wrong-password" });

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
