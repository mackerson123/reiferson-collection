import { Collection, Work } from "./types";
import { db } from "./db";
import { collections, works } from "./db/schema";
import { eq } from "drizzle-orm";

export async function loadCollectionsServer(): Promise<Collection[]> {
  try {
    const allCollections = await db.select().from(collections);
    const allWorks = await db.select().from(works);

    const collectionsWithWorks = allCollections.map((collection) => ({
      ...collection,
      works: allWorks.filter((work) => work.collectionId === collection.id),
    }));

    return collectionsWithWorks;
  } catch (error) {
    console.error("Error loading collections from database:", error);
    return [];
  }
}

export async function loadWorksServer(): Promise<Work[]> {
  try {
    const worksList = await db.select().from(works);
    return worksList;
  } catch (error) {
    console.error("Error loading works from database:", error);
    return [];
  }
}
