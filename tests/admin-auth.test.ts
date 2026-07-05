import { describe, it, expect, afterEach } from "vitest";
import type { NextRequest } from "next/server";
import {
  isAdminPasswordConfigured,
  isValidAdminPassword,
} from "../lib/admin-auth";
import { POST } from "../app/api/admin/auth/route";

const originalAdminPassword = process.env.ADMIN_PASSWORD;

function restoreAdminPassword() {
  if (originalAdminPassword === undefined) {
    delete process.env.ADMIN_PASSWORD;
    return;
  }

  process.env.ADMIN_PASSWORD = originalAdminPassword;
}

function createAuthRequest(password: unknown) {
  return new Request("http://localhost/api/admin/auth", {
    method: "POST",
    body: JSON.stringify({ password }),
  }) as NextRequest;
}

describe("admin password validation", () => {
  afterEach(() => {
    restoreAdminPassword();
  });

  it("only accepts the configured password", () => {
    process.env.ADMIN_PASSWORD = "correct-admin-password";

    expect(isAdminPasswordConfigured()).toBe(true);
    expect(isValidAdminPassword("correct-admin-password")).toBe(true);
    expect(isValidAdminPassword("any-random-string")).toBe(false);
    expect(isValidAdminPassword("correct-admin-password-extra")).toBe(false);
    expect(isValidAdminPassword(undefined)).toBe(false);
  });

  it("rejects every password when ADMIN_PASSWORD is missing", () => {
    delete process.env.ADMIN_PASSWORD;

    expect(isAdminPasswordConfigured()).toBe(false);
    expect(isValidAdminPassword("correct-admin-password")).toBe(false);
  });
});

describe("admin auth API", () => {
  afterEach(() => {
    restoreAdminPassword();
  });

  it("rejects random strings", async () => {
    process.env.ADMIN_PASSWORD = "correct-admin-password";

    const response = await POST(createAuthRequest("any-random-string"));

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "Unauthorized" });
  });

  it("accepts the configured password", async () => {
    process.env.ADMIN_PASSWORD = "correct-admin-password";

    const response = await POST(createAuthRequest("correct-admin-password"));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true });
  });
});
