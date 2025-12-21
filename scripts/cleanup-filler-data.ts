import * as dotenv from "dotenv";
import { join } from "path";
import { readFileSync } from "fs";

// Load .env.local manually
const envPath = join(process.cwd(), ".env.local");
const envContent = readFileSync(envPath, "utf-8");
const result = dotenv.parse(envContent);
Object.assign(process.env, result);

async function cleanup() {
  try {
    console.log("Starting cleanup of filler data...");

    // Dynamically import db and schema after dotenv config
    const { db } = await import("../lib/db");
    const { works } = await import("../lib/db/schema");
    const { like, or, sql } = await import("drizzle-orm");

    // First, let's see what we have
    const allWorks = await db.query.works.findMany();
    console.log(`Total works in database: ${allWorks.length}`);

    // Identify filler entries - these have generic numbered titles
    const fillerPatterns = [
      /^Color Line Integration Photograph \d+$/,
      /^Charles M\. Conlon Baseball Photograph \d+$/,
      /^Negro Leagues Historical Photograph \d+$/,
      /^Negro Leagues Baseball Photograph \d+$/,
      /^American Icon Baseball Photograph \d+$/,
      /^American Baseball Icon Photograph \d+$/,
      // Catch any remaining numbered patterns
      /Photograph \d+$/,
    ];

    const fillerWorks = allWorks.filter((work) => {
      // Check if title matches any filler pattern
      const hasFillerTitle = fillerPatterns.some((pattern) =>
        pattern.test(work.title)
      );

      // Check if image is a placeholder
      const hasPlaceholderImage =
        work.imageUrl?.includes("placeholder") ||
        work.imageUrl?.includes("vintage-baseball-photograph.png") ||
        !work.imageUrl;

      return hasFillerTitle || (hasFillerTitle && hasPlaceholderImage);
    });

    console.log(`\nFound ${fillerWorks.length} filler entries to remove:`);

    // Group by collection for summary
    const byCollection: Record<string, number> = {};
    fillerWorks.forEach((work) => {
      byCollection[work.collectionId || "unknown"] =
        (byCollection[work.collectionId || "unknown"] || 0) + 1;
    });

    console.log("\nBreakdown by collection:");
    Object.entries(byCollection).forEach(([collection, count]) => {
      console.log(`  - ${collection}: ${count} filler entries`);
    });

    // List the first 10 to confirm
    console.log("\nSample of entries to be deleted:");
    fillerWorks.slice(0, 10).forEach((work) => {
      console.log(`  - "${work.title}" (${work.collectionId})`);
    });

    if (fillerWorks.length > 10) {
      console.log(`  ... and ${fillerWorks.length - 10} more`);
    }

    // Delete filler entries
    const fillerIds = fillerWorks.map((w) => w.id);

    if (fillerIds.length > 0) {
      const { inArray } = await import("drizzle-orm");
      await db.delete(works).where(inArray(works.id, fillerIds));
      console.log(`\n✓ Deleted ${fillerIds.length} filler entries`);
    }

    // Show remaining works
    const remainingWorks = await db.query.works.findMany();
    console.log(`\nRemaining works: ${remainingWorks.length}`);

    console.log("\nRemaining works by collection:");
    const remainingByCollection: Record<string, string[]> = {};
    remainingWorks.forEach((work) => {
      if (!remainingByCollection[work.collectionId || "unknown"]) {
        remainingByCollection[work.collectionId || "unknown"] = [];
      }
      remainingByCollection[work.collectionId || "unknown"].push(work.title);
    });

    Object.entries(remainingByCollection).forEach(([collection, titles]) => {
      console.log(`\n  ${collection} (${titles.length} works):`);
      titles.forEach((title) => console.log(`    - ${title}`));
    });

    console.log("\nCleanup completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Cleanup failed:", error);
    process.exit(1);
  }
}

cleanup();

