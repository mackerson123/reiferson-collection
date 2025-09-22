import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { Collection } from "../../../../lib/types";

const DATA_PATH = join(process.cwd(), "data", "json", "collections.json");

export async function GET() {
  try {
    const data = readFileSync(DATA_PATH, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error("Error reading collections:", error);
    return NextResponse.json(
      { error: "Failed to read collections" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updatedCollection: Collection = await request.json();

    // Read current data
    const data = JSON.parse(readFileSync(DATA_PATH, "utf-8"));

    // Update the specific collection
    const index = data.collections.findIndex(
      (c: Collection) => c.id === updatedCollection.id
    );
    if (index === -1) {
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 404 }
      );
    }

    data.collections[index] = updatedCollection;

    // Write back to file
    writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating collection:", error);
    return NextResponse.json(
      { error: "Failed to update collection" },
      { status: 500 }
    );
  }
}
