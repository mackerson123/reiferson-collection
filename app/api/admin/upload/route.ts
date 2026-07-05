import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import {
  isAdminPasswordConfigured,
  isValidAdminPassword,
} from "../../../../lib/admin-auth";

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

    const blob = await put(file.name, file, {
      access: "public",
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
