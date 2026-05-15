import { expect, test } from "vitest";
import { validateLoginRequest } from "@/features/auth/login/validation";

test("login validation normalizes email and remember me", () => {
  const result = validateLoginRequest({
    email: "  USER@Example.COM ",
    password: "secret-password",
    rememberMe: "yes",
  });

  expect(result.success).toBe(true);

  if (result.success) {
    expect(result.data.email).toBe("user@example.com");
    expect(result.data.rememberMe).toBe(true);
  }
});

test("login validation rejects malformed email", () => {
  const result = validateLoginRequest({
    email: "not-an-email",
    password: "secret-password",
  });

  expect(result.success).toBe(false);
});
