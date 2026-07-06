/**
 * Backfill image optimization for works already in the database.
 *
 * New admin uploads are optimized automatically (see app/api/admin/upload/route.ts).
 * Run this once after uploading final photos that predate that pipeline, or any
 * time you suspect oversized originals are sitting in Vercel Blob:
 *
 *   pnpm db:optimize-images            # dry run, reports what would change
 *   pnpm db:optimize-images -- --apply # re-encode, re-upload, update DB rows
 *
 * Requires DATABASE_URL and BLOB_READ_WRITE_TOKEN in .env.local.
 * Only touches Blob-hosted images larger than SIZE_THRESHOLD_BYTES; static
 * /public paths and small files are skipped.
 */
import * as dotenv from "dotenv";
import { join } from "path";
import { readFileSync } from "fs";

const envPath = join(process.cwd(), ".env.local");
const envContent = readFileSync(envPath, "utf-8");
Object.assign(process.env, dotenv.parse(envContent));

const SIZE_THRESHOLD_BYTES = 500 * 1024;
const APPLY = process.argv.includes("--apply");

function isBlobUrl(url: string | null): url is string {
  return !!url && /https:\/\/[^/]*vercel-storage\.com\//.test(url);
}

async function run() {
  const { db } = await import("../lib/db");
  const { works } = await import("../lib/db/schema");
  const { eq } = await import("drizzle-orm");
  const { put } = await import("@vercel/blob");
  const { optimizeImage, toWebpFilename } = await import(
    "../lib/optimize-image"
  );

  const allWorks = await db.query.works.findMany();
  console.log(`Total works: ${allWorks.length}`);
  console.log(APPLY ? "Mode: APPLY" : "Mode: dry run (pass --apply to write)");

  let optimized = 0;
  let skipped = 0;
  let failed = 0;

  for (const work of allWorks) {
    if (!isBlobUrl(work.imageUrl)) {
      skipped++;
      continue;
    }

    try {
      const response = await fetch(work.imageUrl);
      if (!response.ok) {
        throw new Error(`fetch failed with status ${response.status}`);
      }
      const original = Buffer.from(await response.arrayBuffer());
      const contentType = response.headers.get("content-type") || "";
      const alreadyOptimized =
        contentType === "image/webp" && original.length < SIZE_THRESHOLD_BYTES;

      if (alreadyOptimized || original.length < SIZE_THRESHOLD_BYTES) {
        skipped++;
        continue;
      }

      const result = await optimizeImage(original);
      const savedPct = Math.round(
        (1 - result.buffer.length / original.length) * 100
      );
      console.log(
        `${work.id} "${work.title}": ${(original.length / 1024).toFixed(
          0
        )}KB -> ${(result.buffer.length / 1024).toFixed(0)}KB (-${savedPct}%)`
      );

      if (APPLY) {
        const filename = toWebpFilename(
          new URL(work.imageUrl).pathname.split("/").pop() || `${work.id}.jpg`
        );
        const blob = await put(filename, result.buffer, {
          access: "public",
          contentType: result.contentType,
        });
        await db
          .update(works)
          .set({ imageUrl: blob.url, updatedAt: new Date() })
          .where(eq(works.id, work.id));
      }
      optimized++;
    } catch (error) {
      failed++;
      console.error(`${work.id} "${work.title}": failed`, error);
    }
  }

  console.log(
    `\nDone. ${optimized} ${
      APPLY ? "optimized" : "would be optimized"
    }, ${skipped} skipped, ${failed} failed.`
  );
  process.exit(failed > 0 ? 1 : 0);
}

run();
