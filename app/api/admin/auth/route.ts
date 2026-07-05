import { NextRequest, NextResponse } from "next/server";
import {
  isAdminPasswordConfigured,
  isValidAdminPassword,
} from "../../../../lib/admin-auth";

export async function POST(request: NextRequest) {
  if (!isAdminPasswordConfigured()) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD not configured" },
      { status: 500 }
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const password =
    typeof body === "object" && body !== null && "password" in body
      ? body.password
      : undefined;

  if (typeof password !== "string" || !isValidAdminPassword(password)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
