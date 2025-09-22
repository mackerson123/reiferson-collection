import { NextResponse } from "next/server";
import { loadCollectionsServer } from "../../../lib/server-data-loader";

export async function GET() {
  try {
    const collections = loadCollectionsServer();
    return NextResponse.json({ collections });
  } catch (error) {
    console.error("Error loading collections:", error);
    return NextResponse.json({ error: "Failed to load collections" }, { status: 500 });
  }
}
