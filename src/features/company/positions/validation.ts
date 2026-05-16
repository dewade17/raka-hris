import type { UpsertPositionInput } from './types';

type PositionValidationResult =
  | {
      success: true;
      data: UpsertPositionInput;
    }
  | {
      success: false;
      message: string;
    };

export function validateUpsertPositionRequest(payload: unknown): PositionValidationResult {
  if (!isRecord(payload)) {
    return {
      success: false,
      message: 'Please complete the position form.',
    };
  }

  const name = normalizeRequiredText(payload.name);

  if (name.length < 2) {
    return {
      success: false,
      message: 'Position name must be at least 2 characters.',
    };
  }

  if (name.length > 191) {
    return {
      success: false,
      message: 'Position name must be 191 characters or fewer.',
    };
  }

  return {
    success: true,
    data: {
      name,
      isActive: typeof payload.isActive === 'boolean' ? payload.isActive : true,
    },
  };
}

function normalizeRequiredText(value: unknown) {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
