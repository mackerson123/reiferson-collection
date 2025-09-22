import { Collection, Work, CollectionData } from "./types";

// For client-side, we'll use API calls
export async function loadCollectionsClient(): Promise<Collection[]> {
  try {
    const response = await fetch("/api/admin/collections");
    const data = await response.json();
    return data.collections;
  } catch (error) {
    console.error("Error loading collections:", error);
    return [];
  }
}

export async function loadWorksClient(): Promise<Work[]> {
  try {
    const response = await fetch("/api/admin/works");
    const data = await response.json();
    return data.works;
  } catch (error) {
    console.error("Error loading works:", error);
    return [];
  }
}

// For server-side rendering, we'll create a separate server component

// Helper functions compatible with existing code
export const getCollectionById = (
  collections: Collection[],
  id: string
): Collection | undefined => {
  return collections.find((collection) => collection.id === id);
};

export const getWorkById = (
  collections: Collection[],
  workId: string
): { work: Work; collection: Collection } | undefined => {
  for (const collection of collections) {
    const work = collection.works.find((w) => w.id === workId);
    if (work) {
      return { work, collection };
    }
  }
  return undefined;
};

export const getAllWorks = (collections: Collection[]): Work[] => {
  return collections.flatMap((collection) => collection.works);
};

export const getWorksByCollection = (
  collections: Collection[],
  collectionId: string
): Work[] => {
  const collection = getCollectionById(collections, collectionId);
  return collection?.works || [];
};
