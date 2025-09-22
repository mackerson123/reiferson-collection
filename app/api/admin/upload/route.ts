import { NextRequest, NextResponse } from "next/server";
import { writeFileSync } from "fs";
import { join } from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate filename
    const timestamp = Date.now();
    const fileExtension = file.name.split(".").pop();
    const filename = `uploaded-${timestamp}.${fileExtension}`;

    // Save to public directory
    const filepath = join(process.cwd(), "public", filename);
    writeFileSync(filepath, buffer);

    // Return the public URL
    const imageUrl = `/${filename}`;

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
