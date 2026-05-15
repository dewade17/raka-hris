import { expect, test } from "vitest";
import {
  SESSION_DURATION_MS,
  hashSessionToken,
  createSessionExpiresAt,
  generateSessionToken,
  isSameTokenHash,
  shouldRenewSession,
  shouldTouchSession,
} from "@/server/session-core";

test("session token generation returns URL-safe random values", () => {
  const firstToken = generateSessionToken();
  const secondToken = generateSessionToken();

  expect(firstToken).toMatch(/^[A-Za-z0-9_-]+$/);
  expect(firstToken).not.toBe(secondToken);
});

test("session token hashing is deterministic and fixed length", () => {
  const secret = "a-production-length-session-secret-value";
  const token = "token-value";
  const firstHash = hashSessionToken(token, secret);
  const secondHash = hashSessionToken(token, secret);

  expect(firstHash).toHaveLength(64);
  expect(firstHash).toBe(secondHash);
  expect(isSameTokenHash(firstHash, secondHash)).toBe(true);
});

test("session expiry is 90 days from the current time", () => {
  const now = new Date("2026-05-14T00:00:00.000Z");
  const expiresAt = createSessionExpiresAt(now);

  expect(expiresAt.getTime() - now.getTime()).toBe(SESSION_DURATION_MS);
});

test("session renewal is requested within the renewal window", () => {
  const now = new Date("2026-05-14T00:00:00.000Z");
  const expiresIn29Days = new Date(now.getTime() + 29 * 24 * 60 * 60 * 1000);
  const expiresIn31Days = new Date(now.getTime() + 31 * 24 * 60 * 60 * 1000);

  expect(shouldRenewSession(expiresIn29Days, now)).toBe(true);
  expect(shouldRenewSession(expiresIn31Days, now)).toBe(false);
});

test("session touch is throttled", () => {
  const now = new Date("2026-05-14T00:30:00.000Z");
  const recentUse = new Date("2026-05-14T00:20:00.000Z");
  const staleUse = new Date("2026-05-14T00:00:00.000Z");

  expect(shouldTouchSession(null, now)).toBe(true);
  expect(shouldTouchSession(recentUse, now)).toBe(false);
  expect(shouldTouchSession(staleUse, now)).toBe(true);
});
