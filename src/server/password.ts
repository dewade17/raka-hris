import { randomBytes } from "node:crypto";
import { hash, verify } from "@node-rs/argon2";

type Argon2Options = NonNullable<Parameters<typeof hash>[1]>;

const argon2Options: Argon2Options = {
  algorithm: 2,
  version: 1,
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
  outputLen: 32,
} as const;

export async function hashPassword(password: string) {
  return hash(password, argon2Options);
}

export async function verifyPassword(passwordHash: string, password: string) {
  if (isUnusablePasswordHash(passwordHash)) {
    return false;
  }

  return verify(passwordHash, password, argon2Options);
}

export function createUnusablePasswordHash() {
  return `oauth-disabled:${randomBytes(32).toString("base64url")}`;
}

export function isUnusablePasswordHash(passwordHash: string) {
  return passwordHash.startsWith("oauth-disabled:");
}
