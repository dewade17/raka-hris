import type {
  GoogleWorkspaceSetupRequestInput,
  RegisterRequestInput,
} from "./types";

type RegisterValidationResult =
  | {
      success: true;
      data: RegisterRequestInput;
    }
  | {
      success: false;
      message: string;
    };

type GoogleWorkspaceSetupValidationResult =
  | {
      success: true;
      data: GoogleWorkspaceSetupRequestInput;
    }
  | {
      success: false;
      message: string;
    };

export function validateRegisterRequest(
  payload: unknown,
): RegisterValidationResult {
  if (!isRecord(payload)) {
    return {
      success: false,
      message: "Please complete the registration form.",
    };
  }

  const fullName = normalizeRequiredText(payload.fullName);
  const companyName = normalizeRequiredText(payload.companyName);
  const email = normalizeEmail(payload.email);
  const phoneNumber = normalizeOptionalPhoneNumber(payload.phoneNumber);
  const password = typeof payload.password === "string" ? payload.password : "";
  const seatLimit = normalizeSeatLimit(payload.seatLimit);

  if (fullName.length < 3) {
    return {
      success: false,
      message: "Full name must be at least 3 characters.",
    };
  }

  if (companyName.length < 2) {
    return {
      success: false,
      message: "Company name must be at least 2 characters.",
    };
  }

  if (!email || !isValidEmail(email)) {
    return {
      success: false,
      message: "Please enter a valid work email address.",
    };
  }

  if (!phoneNumber || !/^\+?[0-9-]{8,18}$/.test(phoneNumber)) {
    return {
      success: false,
      message: "Please enter a valid phone number.",
    };
  }

  if (password.length < 8) {
    return {
      success: false,
      message: "Password must be at least 8 characters.",
    };
  }

  if (password.length > 128) {
    return {
      success: false,
      message: "Password must be 128 characters or fewer.",
    };
  }

  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return {
      success: false,
      message: "Password must include at least one letter and one number.",
    };
  }

  if (!isValidSeatLimit(seatLimit)) {
    return {
      success: false,
      message: "Seat limit must be at least 1 user.",
    };
  }

  return {
    success: true,
    data: {
      fullName,
      companyName,
      email,
      phoneNumber,
      password,
      seatLimit,
    },
  };
}

export function validateGoogleWorkspaceSetupRequest(
  payload: unknown,
): GoogleWorkspaceSetupValidationResult {
  if (!isRecord(payload)) {
    return {
      success: false,
      message: "Please complete the workspace setup form.",
    };
  }

  const companyName = normalizeRequiredText(payload.companyName);
  const phoneNumber = normalizeOptionalPhoneNumber(payload.phoneNumber);
  const seatLimit = normalizeSeatLimit(payload.seatLimit);

  if (companyName.length < 2) {
    return {
      success: false,
      message: "Company name must be at least 2 characters.",
    };
  }

  if (!phoneNumber || !/^\+?[0-9-]{8,18}$/.test(phoneNumber)) {
    return {
      success: false,
      message: "Please enter a valid phone number.",
    };
  }

  if (!isValidSeatLimit(seatLimit)) {
    return {
      success: false,
      message: "Seat limit must be at least 1 user.",
    };
  }

  return {
    success: true,
    data: {
      companyName,
      phoneNumber,
      seatLimit,
    },
  };
}

function normalizeRequiredText(value: unknown) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
}

function normalizeOptionalPhoneNumber(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.replace(/\s+/g, "").trim();

  return normalized || null;
}

function normalizeEmail(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function normalizeSeatLimit(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.trunc(value);
  }

  if (typeof value === "string") {
    const parsed = Number(value);

    return Number.isFinite(parsed) ? Math.trunc(parsed) : 0;
  }

  return 0;
}

function isValidSeatLimit(value: number) {
  return Number.isInteger(value) && value >= 1 && value <= 10000;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
