import { Collection, Work } from "./types";
import { readFileSync } from "fs";
import { join } from "path";

// Server-side only data loading functions
export function loadCollectionsServer(): Collection[] {
  try {
    const collectionsPath = join(
      process.cwd(),
      "data",
      "json",
      "collections.json"
    );
    const worksPath = join(process.cwd(), "data", "json", "works.json");

    const collectionsData = JSON.parse(readFileSync(collectionsPath, "utf-8"));
    const worksData = JSON.parse(readFileSync(worksPath, "utf-8"));

    // Attach works to collections
    const collections = collectionsData.collections.map(
      (collection: Collection) => ({
        ...collection,
        works: worksData.works.filter(
          (work: Work) => work.collectionId === collection.id
        ),
      })
    );

    return collections;
  } catch (error) {
    console.error("Error loading collections from server:", error);
    // Fallback to original data if JSON doesn't exist yet
    try {
      const { collections } = require("../data/collections");
      return collections;
    } catch (fallbackError) {
      console.error("Fallback also failed:", fallbackError);
      return [];
    }
  }
}

export function loadWorksServer(): Work[] {
  try {
    const worksPath = join(process.cwd(), "data", "json", "works.json");
    const worksData = JSON.parse(readFileSync(worksPath, "utf-8"));
    return worksData.works;
  } catch (error) {
    console.error("Error loading works from server:", error);
    // Fallback to original data
    try {
      const { getAllWorks } = require("../data/collections");
      return getAllWorks();
    } catch (fallbackError) {
      console.error("Fallback also failed:", fallbackError);
      return [];
    }
  }
}
