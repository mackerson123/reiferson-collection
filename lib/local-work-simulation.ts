import type { Collection, Work } from "./db/schema";

type CollectionWithWorks = Collection & {
  works: Work[];
};

function getRequestedLocalWorksTotal() {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const rawTotal = process.env.LOCAL_WORKS_TOTAL;
  if (!rawTotal) {
    return null;
  }

  const total = Number.parseInt(rawTotal, 10);
  if (!Number.isFinite(total) || total <= 0) {
    return null;
  }

  return total;
}

function ensureMinimumCollections(collections: CollectionWithWorks[]) {
  if (collections.length !== 1) {
    return collections;
  }

  const [sourceCollection] = collections;

  return [
    sourceCollection,
    {
      ...sourceCollection,
      id: `local-sim-${sourceCollection.id}-2`,
      name: `${sourceCollection.name} (Local 2)`,
      sortOrder: sourceCollection.sortOrder + 1,
      works: [],
    },
  ];
}

export function withLocalWorkSimulation(collections: CollectionWithWorks[]) {
  const targetTotal = getRequestedLocalWorksTotal();
  if (!targetTotal) {
    return collections;
  }

  const currentTotal = collections.reduce(
    (sum, collection) => sum + collection.works.length,
    0
  );

  if (currentTotal >= targetTotal || currentTotal === 0) {
    return collections;
  }

  const simulatedCollections = ensureMinimumCollections(
    collections.map((collection) => ({
      ...collection,
      works: [...collection.works],
    }))
  );
  const sourceCollections = collections.filter(
    (collection) => collection.works.length > 0
  );
  const sourceWorksByCollection = sourceCollections.map((collection) => [
    ...collection.works,
  ]);
  const copiesNeeded = targetTotal - currentTotal;

  for (let i = 0; i < copiesNeeded; i++) {
    const targetCollection = simulatedCollections[i % simulatedCollections.length];
    const sourceWorks =
      sourceWorksByCollection[i % sourceWorksByCollection.length];
    const sourceWork =
      sourceWorks[Math.floor(i / sourceCollections.length) % sourceWorks.length];
    const copyNumber = currentTotal + i + 1;

    targetCollection.works.push({
      ...sourceWork,
      id: `local-sim-${sourceWork.id}-${copyNumber}`,
      title: `${sourceWork.title} (Local copy ${copyNumber})`,
      collectionId: targetCollection.id,
    });
  }

  return simulatedCollections;
}
