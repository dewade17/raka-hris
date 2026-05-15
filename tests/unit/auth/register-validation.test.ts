import { expect, test } from "vitest";
import {
  validateGoogleWorkspaceSetupRequest,
  validateRegisterRequest,
} from "@/features/auth/register/validation";

test("register validation normalizes production account input", () => {
  const result = validateRegisterRequest({
    fullName: "  Ni   Made  User ",
    companyName: "  Raka  HR ",
    email: " OWNER@RAKAHRIS.COM ",
    phoneNumber: " +62 812 3456 7890 ",
    password: "StrongPass123",
    seatLimit: "12",
  });

  expect(result.success).toBe(true);

  if (result.success) {
    expect(result.data.fullName).toBe("Ni Made User");
    expect(result.data.companyName).toBe("Raka HR");
    expect(result.data.email).toBe("owner@rakahris.com");
    expect(result.data.phoneNumber).toBe("+6281234567890");
    expect(result.data.seatLimit).toBe(12);
  }
});

test("register validation requires a stronger password", () => {
  const result = validateRegisterRequest({
    fullName: "Ni Made User",
    companyName: "Raka HR",
    email: "owner@rakahris.com",
    phoneNumber: "+6281234567890",
    password: "password",
    seatLimit: 10,
  });

  expect(result.success).toBe(false);
});

test("google workspace setup validation requires a valid seat limit", () => {
  const result = validateGoogleWorkspaceSetupRequest({
    companyName: "Raka HR",
    phoneNumber: "+6281234567890",
    seatLimit: 0,
  });

  expect(result.success).toBe(false);
});
