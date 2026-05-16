import type { UpsertLocationInput } from './types';

type LocationValidationResult =
  | {
      success: true;
      data: UpsertLocationInput;
    }
  | {
      success: false;
      message: string;
    };

export function validateUpsertLocationRequest(payload: unknown): LocationValidationResult {
  if (!isRecord(payload)) {
    return {
      success: false,
      message: 'Please complete the location form.',
    };
  }

  const name = normalizeRequiredText(payload.name);
  const latitude = normalizeOptionalNumber(payload.latitude);
  const longitude = normalizeOptionalNumber(payload.longitude);

  if (name.length < 2) {
    return {
      success: false,
      message: 'Location name must be at least 2 characters.',
    };
  }

  if (name.length > 191) {
    return {
      success: false,
      message: 'Location name must be 191 characters or fewer.',
    };
  }

  if (latitude !== null && !Number.isFinite(latitude)) {
    return {
      success: false,
      message: 'Latitude must be a valid number.',
    };
  }

  if (longitude !== null && !Number.isFinite(longitude)) {
    return {
      success: false,
      message: 'Longitude must be a valid number.',
    };
  }

  if (latitude !== null && (latitude < -90 || latitude > 90)) {
    return {
      success: false,
      message: 'Latitude must be between -90 and 90.',
    };
  }

  if (longitude !== null && (longitude < -180 || longitude > 180)) {
    return {
      success: false,
      message: 'Longitude must be between -180 and 180.',
    };
  }

  return {
    success: true,
    data: {
      name,
      latitude,
      longitude,
      isActive: typeof payload.isActive === 'boolean' ? payload.isActive : true,
    },
  };
}

function normalizeRequiredText(value: unknown) {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';
}

function normalizeOptionalNumber(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const numericValue = typeof value === 'number' ? value : Number(value);

  return Number.isFinite(numericValue) ? numericValue : Number.NaN;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
