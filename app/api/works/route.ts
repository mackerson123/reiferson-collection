import { NextResponse } from "next/server";
import { loadWorksServer } from "../../../lib/server-data-loader";

export async function GET() {
  try {
    const works = loadWorksServer();
    return NextResponse.json({ works });
  } catch (error) {
    console.error("Error loading works:", error);
    return NextResponse.json({ error: "Failed to load works" }, { status: 500 });
  }
}
