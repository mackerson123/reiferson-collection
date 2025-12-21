import { config } from "dotenv";
config({ path: ".env.local" });

import { readFileSync } from "fs";
import { join } from "path";

async function migrate() {
  const { db } = await import("../lib/db");
  const { collections, works } = await import("../lib/db/schema");

  try {
    console.log("Starting migration...");

    const collectionsPath = join(
      process.cwd(),
      "data",
      "json",
      "collections.json"
    );
    const worksPath = join(process.cwd(), "data", "json", "works.json");

    const collectionsData = JSON.parse(
      readFileSync(collectionsPath, "utf-8")
    );
    const worksData = JSON.parse(readFileSync(worksPath, "utf-8"));

    console.log(`Found ${collectionsData.collections.length} collections`);
    console.log(`Found ${worksData.works.length} works`);

    for (const collection of collectionsData.collections) {
      await db.insert(collections).values({
        id: collection.id,
        name: collection.name,
        description: collection.description,
        curatorNote: collection.curatorNote,
      });
      console.log(`Inserted collection: ${collection.id}`);
    }

    for (const work of worksData.works) {
      await db.insert(works).values({
        id: work.id,
        title: work.title,
        artist: work.artist,
        date: work.date,
        medium: work.medium,
        dimensions: work.dimensions,
        description: work.description,
        narrative: work.narrative,
        provenance: work.provenance,
        exhibition: work.exhibition,
        relatedObjects: work.relatedObjects || [],
        imageUrl: work.imageUrl,
        thumbnailUrl: work.thumbnailUrl,
        collectionId: work.collectionId,
      });
    }

    console.log(`Inserted ${worksData.works.length} works`);
    console.log("Migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrate();
