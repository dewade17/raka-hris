import type { UpdateCompanyProfileInput } from "./types";

type CompanyProfileValidationResult =
  | {
      success: true;
      data: UpdateCompanyProfileInput;
    }
  | {
      success: false;
      message: string;
    };

const supportedTimezones = new Set([
  "Asia/Jakarta",
  "Asia/Makassar",
  "Asia/Jayapura",
  "UTC",
]);

export function validateUpdateCompanyProfileRequest(
  payload: unknown,
): CompanyProfileValidationResult {
  if (!isRecord(payload)) {
    return {
      success: false,
      message: "Please complete the company profile form.",
    };
  }

  const name = normalizeRequiredText(payload.name);
  const email = normalizeOptionalEmail(payload.email);
  const phone = normalizeOptionalPhoneNumber(payload.phone);
  const logoUrl = normalizeOptionalText(payload.logoUrl);
  const addressLine1 = normalizeOptionalText(payload.addressLine1);
  const city = normalizeOptionalText(payload.city);
  const province = normalizeOptionalText(payload.province);
  const timezone = normalizeOptionalText(payload.timezone);

  if (name.length < 2) {
    return {
      success: false,
      message: "Company name must be at least 2 characters.",
    };
  }

  if (name.length > 191) {
    return {
      success: false,
      message: "Company name must be 191 characters or fewer.",
    };
  }

  if (email && !isValidEmail(email)) {
    return {
      success: false,
      message: "Please enter a valid company email address.",
    };
  }

  if (phone && !/^\+?[0-9-]{8,18}$/.test(phone)) {
    return {
      success: false,
      message: "Please enter a valid company phone number.",
    };
  }

  if (logoUrl && !isValidHttpUrl(logoUrl)) {
    return {
      success: false,
      message: "Logo URL must be a valid http or https URL.",
    };
  }

  if (email && email.length > 191) {
    return {
      success: false,
      message: "Company email must be 191 characters or fewer.",
    };
  }

  if (logoUrl && logoUrl.length > 500) {
    return {
      success: false,
      message: "Logo URL must be 500 characters or fewer.",
    };
  }

  if (phone && phone.length > 50) {
    return {
      success: false,
      message: "Company phone must be 50 characters or fewer.",
    };
  }

  if (addressLine1 && addressLine1.length > 255) {
    return {
      success: false,
      message: "Company address must be 255 characters or fewer.",
    };
  }

  if (city && city.length > 100) {
    return {
      success: false,
      message: "City must be 100 characters or fewer.",
    };
  }

  if (province && province.length > 100) {
    return {
      success: false,
      message: "Province must be 100 characters or fewer.",
    };
  }

  if (timezone && !supportedTimezones.has(timezone)) {
    return {
      success: false,
      message: "Please choose a supported timezone.",
    };
  }

  return {
    success: true,
    data: {
      name,
      email,
      phone,
      logoUrl,
      addressLine1,
      city,
      province,
      timezone,
    },
  };
}

function normalizeRequiredText(value: unknown) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
}

function normalizeOptionalText(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim().replace(/\s+/g, " ");

  return normalized || null;
}

function normalizeOptionalEmail(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim().toLowerCase();

  return normalized || null;
}

function normalizeOptionalPhoneNumber(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.replace(/\s+/g, "").trim();

  return normalized || null;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
