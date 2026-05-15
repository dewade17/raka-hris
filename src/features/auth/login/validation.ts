import type { LoginRequestInput } from "./types";

type LoginValidationResult =
  | {
      success: true;
      data: LoginRequestInput;
    }
  | {
      success: false;
      message: string;
    };

export function validateLoginRequest(payload: unknown): LoginValidationResult {
  if (!isRecord(payload)) {
    return {
      success: false,
      message: "Please enter your email address and password.",
    };
  }

  const email = normalizeEmail(payload.email);
  const password = typeof payload.password === "string" ? payload.password : "";

  if (!email) {
    return {
      success: false,
      message: "Email address is required.",
    };
  }

  if (!isValidEmail(email)) {
    return {
      success: false,
      message: "Please enter a valid email address.",
    };
  }

  if (!password) {
    return {
      success: false,
      message: "Password is required.",
    };
  }

  if (password.length > 256) {
    return {
      success: false,
      message: "Password is too long.",
    };
  }

  return {
    success: true,
    data: {
      email,
      password,
      rememberMe: Boolean(payload.rememberMe),
    },
  };
}

export function normalizeEmail(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
