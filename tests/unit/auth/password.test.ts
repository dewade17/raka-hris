import { expect, test } from "vitest";
import {
  createUnusablePasswordHash,
  hashPassword,
  isUnusablePasswordHash,
  verifyPassword,
} from "@/server/password";

test("password hashes verify only the original password", async () => {
  const passwordHash = await hashPassword("CorrectHorse123");

  await expect(verifyPassword(passwordHash, "CorrectHorse123")).resolves.toBe(
    true,
  );
  await expect(verifyPassword(passwordHash, "WrongHorse123")).resolves.toBe(
    false,
  );
});

test("unusable password hashes cannot be used for password login", async () => {
  const passwordHash = createUnusablePasswordHash();

  expect(isUnusablePasswordHash(passwordHash)).toBe(true);
  await expect(verifyPassword(passwordHash, "CorrectHorse123")).resolves.toBe(
    false,
  );
});
