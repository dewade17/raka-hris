import type { LocationListQuery, LocationListStatus, UpsertLocationInput } from './types';

export const LOCATION_LIST_PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

const DEFAULT_LOCATION_LIST_QUERY: LocationListQuery = {
  page: 1,
  pageSize: 10,
  query: '',
  status: 'all',
};

type ListSearchParams = URLSearchParams | Record<string, string | string[] | undefined>;

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

export function validateLocationListQuery(searchParams: ListSearchParams): LocationListQuery {
  const page = normalizePositiveInteger(getSearchParamValue(searchParams, 'page'), DEFAULT_LOCATION_LIST_QUERY.page);
  const requestedPageSize = normalizePositiveInteger(getSearchParamValue(searchParams, 'pageSize'), DEFAULT_LOCATION_LIST_QUERY.pageSize);

  return {
    page,
    pageSize: LOCATION_LIST_PAGE_SIZE_OPTIONS.includes(requestedPageSize as (typeof LOCATION_LIST_PAGE_SIZE_OPTIONS)[number]) ? requestedPageSize : DEFAULT_LOCATION_LIST_QUERY.pageSize,
    query: normalizeRequiredText(getSearchParamValue(searchParams, 'query')).slice(0, 191),
    status: normalizeLocationListStatus(getSearchParamValue(searchParams, 'status')),
  };
}

function normalizeRequiredText(value: unknown) {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';
}

function normalizePositiveInteger(value: unknown, fallback: number) {
  const numericValue = typeof value === 'number' ? value : Number(value);

  return Number.isInteger(numericValue) && numericValue > 0 ? numericValue : fallback;
}

function normalizeLocationListStatus(value: unknown): LocationListStatus {
  return value === 'active' || value === 'inactive' || value === 'deleted' ? value : 'all';
}

function normalizeOptionalNumber(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const numericValue = typeof value === 'number' ? value : Number(value);

  return Number.isFinite(numericValue) ? numericValue : Number.NaN;
}

function getSearchParamValue(searchParams: ListSearchParams, key: string) {
  if (searchParams instanceof URLSearchParams) {
    return searchParams.get(key);
  }

  const value = searchParams[key];

  return Array.isArray(value) ? value[0] : value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
