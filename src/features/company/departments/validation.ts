import type { DepartmentListQuery, DepartmentListStatus, UpsertDepartmentInput } from './types';

export const DEPARTMENT_LIST_PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

const DEFAULT_DEPARTMENT_LIST_QUERY: DepartmentListQuery = {
  page: 1,
  pageSize: 10,
  query: '',
  status: 'all',
};

type ListSearchParams = URLSearchParams | Record<string, string | string[] | undefined>;

type DepartmentValidationResult =
  | {
      success: true;
      data: UpsertDepartmentInput;
    }
  | {
      success: false;
      message: string;
    };

export function validateUpsertDepartmentRequest(payload: unknown): DepartmentValidationResult {
  if (!isRecord(payload)) {
    return {
      success: false,
      message: 'Please complete the department form.',
    };
  }

  const name = normalizeRequiredText(payload.name);

  if (name.length < 2) {
    return {
      success: false,
      message: 'Department name must be at least 2 characters.',
    };
  }

  if (name.length > 191) {
    return {
      success: false,
      message: 'Department name must be 191 characters or fewer.',
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

export function validateDepartmentListQuery(searchParams: ListSearchParams): DepartmentListQuery {
  const page = normalizePositiveInteger(getSearchParamValue(searchParams, 'page'), DEFAULT_DEPARTMENT_LIST_QUERY.page);
  const requestedPageSize = normalizePositiveInteger(getSearchParamValue(searchParams, 'pageSize'), DEFAULT_DEPARTMENT_LIST_QUERY.pageSize);

  return {
    page,
    pageSize: DEPARTMENT_LIST_PAGE_SIZE_OPTIONS.includes(requestedPageSize as (typeof DEPARTMENT_LIST_PAGE_SIZE_OPTIONS)[number]) ? requestedPageSize : DEFAULT_DEPARTMENT_LIST_QUERY.pageSize,
    query: normalizeRequiredText(getSearchParamValue(searchParams, 'query')).slice(0, 191),
    status: normalizeDepartmentListStatus(getSearchParamValue(searchParams, 'status')),
  };
}

function normalizeRequiredText(value: unknown) {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';
}

function normalizePositiveInteger(value: unknown, fallback: number) {
  const numericValue = typeof value === 'number' ? value : Number(value);

  return Number.isInteger(numericValue) && numericValue > 0 ? numericValue : fallback;
}

function normalizeDepartmentListStatus(value: unknown): DepartmentListStatus {
  return value === 'active' || value === 'inactive' || value === 'deleted' ? value : 'all';
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
