import sharp from "sharp";

export const MAX_EDGE_PX = 2560;
export const WEBP_QUALITY = 82;

const PASSTHROUGH_TYPES = new Set(["image/svg+xml", "image/gif"]);

export function shouldOptimize(contentType: string | null | undefined) {
  if (!contentType || !contentType.startsWith("image/")) return false;
  return !PASSTHROUGH_TYPES.has(contentType);
}

export async function optimizeImage(input: Buffer | ArrayBuffer) {
  const buffer = Buffer.isBuffer(input) ? input : Buffer.from(input);
  const output = await sharp(buffer)
    .rotate()
    .resize(MAX_EDGE_PX, MAX_EDGE_PX, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();
  return { buffer: output, contentType: "image/webp", extension: ".webp" };
}

export function toWebpFilename(filename: string) {
  return filename.replace(/\.[^./\\]+$/, "") + ".webp";
}
