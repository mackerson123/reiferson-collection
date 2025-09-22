import { writeFileSync } from "fs";
import { join } from "path";
import { collections } from "../data/collections";

// Convert collections data to JSON
const collectionsData = {
  collections: collections.map((collection) => ({
    id: collection.id,
    name: collection.name,
    description: collection.description,
    curatorNote: collection.curatorNote,
  })),
};

// Convert all works to JSON
const worksData = {
  works: collections.flatMap((collection) => collection.works),
};

// Write files
const dataDir = join(process.cwd(), "data", "json");

try {
  writeFileSync(
    join(dataDir, "collections.json"),
    JSON.stringify(collectionsData, null, 2)
  );

  writeFileSync(
    join(dataDir, "works.json"),
    JSON.stringify(worksData, null, 2)
  );

  console.log("Successfully converted data to JSON");
  console.log(`Collections: ${collectionsData.collections.length}`);
  console.log(`Works: ${worksData.works.length}`);
} catch (error) {
  console.error("Error converting data:", error);
}
