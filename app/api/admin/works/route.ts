import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { Work } from "../../../../lib/types";

const DATA_PATH = join(process.cwd(), "data", "json", "works.json");

export async function GET() {
  try {
    const data = readFileSync(DATA_PATH, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error("Error reading works:", error);
    return NextResponse.json(
      { error: "Failed to read works" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const newWork: Work = await request.json();

    // Read current data
    const data = JSON.parse(readFileSync(DATA_PATH, "utf-8"));

    // Add new work
    data.works.push(newWork);

    // Write back to file
    writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));

    return NextResponse.json(newWork);
  } catch (error) {
    console.error("Error creating work:", error);
    return NextResponse.json(
      { error: "Failed to create work" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updatedWork: Work = await request.json();

    // Read current data
    const data = JSON.parse(readFileSync(DATA_PATH, "utf-8"));

    // Update the specific work
    const index = data.works.findIndex((w: Work) => w.id === updatedWork.id);
    if (index === -1) {
      return NextResponse.json({ error: "Work not found" }, { status: 404 });
    }

    data.works[index] = updatedWork;

    // Write back to file
    writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating work:", error);
    return NextResponse.json(
      { error: "Failed to update work" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workId = searchParams.get("id");

    if (!workId) {
      return NextResponse.json({ error: "Work ID required" }, { status: 400 });
    }

    // Read current data
    const data = JSON.parse(readFileSync(DATA_PATH, "utf-8"));

    // Remove the work
    data.works = data.works.filter((w: Work) => w.id !== workId);

    // Write back to file
    writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting work:", error);
    return NextResponse.json(
      { error: "Failed to delete work" },
      { status: 500 }
    );
  }
}
