import { NextResponse } from "next/server";

// Simple endpoint to trigger any caching refresh if needed
export async function POST() {
  try {
    // In a more complex setup, you might clear caches here
    // For now, just return success to indicate data should be refetched
    return NextResponse.json({ success: true, timestamp: Date.now() });
  } catch (error) {
    console.error("Error refreshing:", error);
    return NextResponse.json({ error: "Failed to refresh" }, { status: 500 });
  }
}
