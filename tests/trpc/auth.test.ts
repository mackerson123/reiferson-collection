import { describe, it, expect, vi, beforeEach } from "vitest";
import { appRouter } from "../../lib/trpc/router";

vi.mock("../../lib/db", () => ({
  db: {
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockResolvedValue([]),
    }),
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([{ id: "test" }]),
      }),
    }),
    update: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([{ id: "test" }]),
        }),
      }),
    }),
    delete: vi.fn().mockReturnValue({
      where: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([{ id: "test" }]),
      }),
    }),
  },
}));

describe("Authentication Middleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Public procedures (no auth required)", () => {
    it("collections.list should work without auth", async () => {
      const caller = appRouter.createCaller({ adminPassword: undefined });
      const result = await caller.collections.list();
      expect(result).toBeDefined();
    });

    it("works.list should work without auth", async () => {
      const caller = appRouter.createCaller({ adminPassword: undefined });
      const result = await caller.works.list();
      expect(result).toBeDefined();
    });
  });

  describe("Protected procedures (auth required)", () => {
    const protectedMutations = [
      {
        name: "collections.update",
        call: (caller: any) =>
          caller.collections.update({ id: "test", name: "Test" }),
      },
      {
        name: "collections.create",
        call: (caller: any) =>
          caller.collections.create({ id: "test", name: "Test" }),
      },
      {
        name: "works.create",
        call: (caller: any) =>
          caller.works.create({
            id: "test",
            title: "Test",
            imageUrl: "/test.jpg",
            collectionId: "test",
          }),
      },
      {
        name: "works.update",
        call: (caller: any) =>
          caller.works.update({ id: "test", title: "Updated" }),
      },
      {
        name: "works.delete",
        call: (caller: any) => caller.works.delete({ id: "test" }),
      },
    ];

    protectedMutations.forEach(({ name, call }) => {
      it(`${name} should reject when no password provided`, async () => {
        const caller = appRouter.createCaller({ adminPassword: undefined });
        await expect(call(caller)).rejects.toThrow();
      });

      it(`${name} should reject when wrong password provided`, async () => {
        const caller = appRouter.createCaller({
          adminPassword: "definitely-wrong-password-12345",
        });
        await expect(call(caller)).rejects.toThrow();
      });

      it(`${name} should succeed with correct password`, async () => {
        const correctPassword = process.env.ADMIN_PASSWORD;
        if (!correctPassword) {
          console.warn(`Skipping ${name} auth success test - ADMIN_PASSWORD not set`);
          return;
        }

        const caller = appRouter.createCaller({
          adminPassword: correctPassword,
        });
        const result = await call(caller);
        expect(result).toBeDefined();
      });
    });
  });
});

