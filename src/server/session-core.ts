import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE_NAME = "raka_session";
export const SESSION_DURATION_DAYS = 90;
export const SESSION_RENEWAL_THRESHOLD_DAYS = 30;
export const SESSION_TOUCH_INTERVAL_MINUTES = 15;

const ONE_MINUTE_IN_MS = 60 * 1000;
const ONE_DAY_IN_MS = 24 * 60 * ONE_MINUTE_IN_MS;

export const SESSION_DURATION_MS = SESSION_DURATION_DAYS * ONE_DAY_IN_MS;
export const SESSION_RENEWAL_THRESHOLD_MS =
  SESSION_RENEWAL_THRESHOLD_DAYS * ONE_DAY_IN_MS;
export const SESSION_TOUCH_INTERVAL_MS =
  SESSION_TOUCH_INTERVAL_MINUTES * ONE_MINUTE_IN_MS;

export function createSessionExpiresAt(now = new Date()) {
  return new Date(now.getTime() + SESSION_DURATION_MS);
}

export function shouldRenewSession(expiresAt: Date, now = new Date()) {
  return expiresAt.getTime() - now.getTime() <= SESSION_RENEWAL_THRESHOLD_MS;
}

export function shouldTouchSession(
  lastUsedAt: Date | null | undefined,
  now = new Date(),
) {
  if (!lastUsedAt) {
    return true;
  }

  return now.getTime() - lastUsedAt.getTime() >= SESSION_TOUCH_INTERVAL_MS;
}

export function generateSessionToken() {
  return randomBytes(32).toString("base64url");
}

export function hashSessionToken(token: string, secret: string) {
  return createHmac("sha256", secret).update(token).digest("hex");
}

export function isSameTokenHash(firstHash: string, secondHash: string) {
  const first = Buffer.from(firstHash, "hex");
  const second = Buffer.from(secondHash, "hex");

  if (first.length !== second.length) {
    return false;
  }

  return timingSafeEqual(first, second);
}
