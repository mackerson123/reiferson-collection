import { timingSafeEqual } from "node:crypto";

export function isAdminPasswordConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function isValidAdminPassword(adminPassword: string | null | undefined) {
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedPassword || !adminPassword) {
    return false;
  }

  const expected = Buffer.from(expectedPassword);
  const received = Buffer.from(adminPassword);

  if (expected.length !== received.length) {
    return false;
  }

  return timingSafeEqual(expected, received);
}
