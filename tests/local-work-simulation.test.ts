import { afterEach, describe, expect, it, vi } from "vitest";
import type { Work } from "../lib/db/schema";
import { withLocalWorkSimulation } from "../lib/local-work-simulation";

const date = new Date("2024-01-01T00:00:00.000Z");

function createWork(id: string, collectionId: string) {
  return {
    id,
    title: `Work ${id}`,
    artist: null,
    date: null,
    medium: null,
    dimensions: null,
    description: null,
    narrative: null,
    provenance: null,
    exhibition: null,
    relatedObjects: null,
    imageUrl: "/vintage-baseball-photograph.png",
    thumbnailUrl: null,
    collectionId,
    isPublished: true,
    createdAt: date,
    updatedAt: date,
  };
}

function createCollection(id: string, works: Work[]) {
  return {
    id,
    name: `Collection ${id}`,
    description: null,
    curatorNote: null,
    isPublished: true,
    sortOrder: 0,
    createdAt: date,
    updatedAt: date,
    works,
  };
}

describe("withLocalWorkSimulation", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("does nothing outside development", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("LOCAL_WORKS_TOTAL", "150");

    const collections = [
      createCollection("collection-1", [createWork("work-1", "collection-1")]),
    ];

    expect(withLocalWorkSimulation(collections)).toBe(collections);
  });

  it("pads development collections to the requested total", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("LOCAL_WORKS_TOTAL", "150");

    const collections = [
      createCollection(
        "collection-1",
        Array.from({ length: 123 }, (_, index) =>
          createWork(`work-${index + 1}`, "collection-1")
        )
      ),
    ];

    const result = withLocalWorkSimulation(collections);
    const works = result.flatMap((collection) => collection.works);

    expect(result).toHaveLength(2);
    expect(works).toHaveLength(150);
    expect(result[1].works.length).toBeGreaterThan(0);
    expect(collections[0].works).toHaveLength(123);
    expect(new Set(works.map((work) => work.id)).size).toBe(150);
    expect(works[149].id).toMatch(/^local-sim-/);
  });

  it("only clones from original works", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("LOCAL_WORKS_TOTAL", "4");

    const collections = [
      createCollection("collection-1", [createWork("work-1", "collection-1")]),
    ];

    const result = withLocalWorkSimulation(collections);
    const localWorks = result
      .flatMap((collection) => collection.works)
      .filter((work) => work.id.startsWith("local-sim-"));

    expect(localWorks).toHaveLength(3);
    expect(localWorks.every((work) => work.id.includes("work-1"))).toBe(true);
    expect(localWorks.every((work) => !work.title.includes(") (Local copy"))).toBe(
      true
    );
  });
});
