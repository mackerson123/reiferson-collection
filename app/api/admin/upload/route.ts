import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import {
  isAdminPasswordConfigured,
  isValidAdminPassword,
} from "../../../../lib/admin-auth";
import {
  optimizeImage,
  shouldOptimize,
  toWebpFilename,
} from "../../../../lib/optimize-image";

export async function POST(request: NextRequest) {
  try {
    const adminPassword = request.headers.get("x-admin-password");

    if (!isAdminPasswordConfigured()) {
      return NextResponse.json(
        { error: "ADMIN_PASSWORD not configured" },
        { status: 500 }
      );
    }

    if (!isValidAdminPassword(adminPassword)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    let uploadName = file.name;
    let uploadBody: File | Buffer = file;
    let contentType = file.type;

    if (shouldOptimize(file.type)) {
      const optimized = await optimizeImage(await file.arrayBuffer());
      uploadName = toWebpFilename(file.name);
      uploadBody = optimized.buffer;
      contentType = optimized.contentType;
    }

    const blob = await put(uploadName, uploadBody, {
      access: "public",
      contentType,
    });

    return NextResponse.json({ imageUrl: blob.url });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
