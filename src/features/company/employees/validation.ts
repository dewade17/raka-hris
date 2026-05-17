import { MembershipStatus } from '@/generated/prisma/client';
import type { CreateCompanyEmployeeInput, TerminateCompanyEmployeeInput, UpdateCompanyEmployeeInput, UpdateEmployeeAssignmentInput } from './types';

type EmployeeCreateValidationResult =
  | {
      success: true;
      data: CreateCompanyEmployeeInput;
    }
  | {
      success: false;
      message: string;
    };

type EmployeeAssignmentValidationResult =
  | {
      success: true;
      data: UpdateEmployeeAssignmentInput;
    }
  | {
      success: false;
      message: string;
    };

type EmployeeUpdateValidationResult =
  | {
      success: true;
      data: UpdateCompanyEmployeeInput;
    }
  | {
      success: false;
      message: string;
    };

type EmployeeTerminateValidationResult =
  | {
      success: true;
      data: TerminateCompanyEmployeeInput;
    }
  | {
      success: false;
      message: string;
    };

export function validateCreateCompanyEmployeeRequest(payload: unknown): EmployeeCreateValidationResult {
  if (!isRecord(payload)) {
    return {
      success: false,
      message: 'Please complete the employee form.',
    };
  }

  const fullName = normalizeRequiredText(payload.fullName);
  const email = normalizeEmail(payload.email);
  const password = typeof payload.password === 'string' ? payload.password : '';
  const departmentId = normalizeRequiredId(payload.departmentId);
  const positionId = normalizeRequiredId(payload.positionId);

  if (fullName.length < 3) {
    return {
      success: false,
      message: 'Full name must be at least 3 characters.',
    };
  }

  if (fullName.length > 191) {
    return {
      success: false,
      message: 'Full name must be 191 characters or fewer.',
    };
  }

  if (!email || !isValidEmail(email)) {
    return {
      success: false,
      message: 'Please enter a valid email address.',
    };
  }

  if (email.length > 191) {
    return {
      success: false,
      message: 'Email address must be 191 characters or fewer.',
    };
  }

  if (password.length < 8) {
    return {
      success: false,
      message: 'Password must be at least 8 characters.',
    };
  }

  if (password.length > 128) {
    return {
      success: false,
      message: 'Password must be 128 characters or fewer.',
    };
  }

  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return {
      success: false,
      message: 'Password must include at least one letter and one number.',
    };
  }

  if (!departmentId) {
    return {
      success: false,
      message: 'Please choose a department for this employee.',
    };
  }

  if (!positionId) {
    return {
      success: false,
      message: 'Please choose a position for this employee.',
    };
  }

  return {
    success: true,
    data: {
      fullName,
      email,
      password,
      departmentId,
      positionId,
    },
  };
}

export function validateUpdateCompanyEmployeeRequest(payload: unknown): EmployeeUpdateValidationResult {
  if (!isRecord(payload)) {
    return {
      success: false,
      message: 'Please complete the employee form.',
    };
  }

  const fullName = normalizeRequiredText(payload.fullName);
  const email = normalizeEmail(payload.email);
  const status = normalizeEditableMembershipStatus(payload.status);
  const employeeNumber = normalizeOptionalText(payload.employeeNumber, 100);
  const phone = normalizeOptionalText(payload.phone, 50);
  const emergencyContactName = normalizeOptionalText(payload.emergencyContactName, 191);
  const emergencyContactPhone = normalizeOptionalText(payload.emergencyContactPhone, 50);
  const birthDate = normalizeOptionalDate(payload.birthDate);
  const birthPlace = normalizeOptionalText(payload.birthPlace, 191);
  const gender = normalizeOptionalText(payload.gender, 20);
  const maritalStatus = normalizeOptionalText(payload.maritalStatus, 50);
  const addressLine1 = normalizeOptionalText(payload.addressLine1, 255);
  const city = normalizeOptionalText(payload.city, 100);
  const province = normalizeOptionalText(payload.province, 100);
  const employmentType = normalizeOptionalText(payload.employmentType, 50);
  const hireDate = normalizeOptionalDate(payload.hireDate);
  const probationEndDate = normalizeOptionalDate(payload.probationEndDate);
  const photoUrl = normalizeOptionalText(payload.photoUrl, 500);
  const notes = normalizeOptionalText(payload.notes, 2000);

  if (fullName.length < 3) {
    return {
      success: false,
      message: 'Full name must be at least 3 characters.',
    };
  }

  if (fullName.length > 191) {
    return {
      success: false,
      message: 'Full name must be 191 characters or fewer.',
    };
  }

  if (!email || !isValidEmail(email)) {
    return {
      success: false,
      message: 'Please enter a valid email address.',
    };
  }

  if (email.length > 191) {
    return {
      success: false,
      message: 'Email address must be 191 characters or fewer.',
    };
  }

  if (!status) {
    return {
      success: false,
      message: 'Please choose a valid employee status.',
    };
  }

  if (employeeNumber === undefined) {
    return {
      success: false,
      message: 'Employee number must be 100 characters or fewer.',
    };
  }

  if (phone === undefined) {
    return {
      success: false,
      message: 'Phone number must be 50 characters or fewer.',
    };
  }

  if (emergencyContactName === undefined) {
    return {
      success: false,
      message: 'Emergency contact name must be 191 characters or fewer.',
    };
  }

  if (emergencyContactPhone === undefined) {
    return {
      success: false,
      message: 'Emergency contact phone must be 50 characters or fewer.',
    };
  }

  if (birthDate === undefined) {
    return {
      success: false,
      message: 'Birth date is invalid.',
    };
  }

  if (birthPlace === undefined) {
    return {
      success: false,
      message: 'Birth place must be 191 characters or fewer.',
    };
  }

  if (gender === undefined) {
    return {
      success: false,
      message: 'Gender must be 20 characters or fewer.',
    };
  }

  if (maritalStatus === undefined) {
    return {
      success: false,
      message: 'Marital status must be 50 characters or fewer.',
    };
  }

  if (addressLine1 === undefined) {
    return {
      success: false,
      message: 'Address must be 255 characters or fewer.',
    };
  }

  if (city === undefined) {
    return {
      success: false,
      message: 'City must be 100 characters or fewer.',
    };
  }

  if (province === undefined) {
    return {
      success: false,
      message: 'Province must be 100 characters or fewer.',
    };
  }

  if (employmentType === undefined) {
    return {
      success: false,
      message: 'Employment type must be 50 characters or fewer.',
    };
  }

  if (hireDate === undefined) {
    return {
      success: false,
      message: 'Hire date is invalid.',
    };
  }

  if (probationEndDate === undefined) {
    return {
      success: false,
      message: 'Probation end date is invalid.',
    };
  }

  if (photoUrl === undefined) {
    return {
      success: false,
      message: 'Profile photo reference must be 500 characters or fewer.',
    };
  }

  if (notes === undefined) {
    return {
      success: false,
      message: 'Notes must be 2000 characters or fewer.',
    };
  }

  return {
    success: true,
    data: {
      fullName,
      email,
      status,
      employeeNumber,
      phone,
      emergencyContactName,
      emergencyContactPhone,
      birthDate,
      birthPlace,
      gender,
      maritalStatus,
      addressLine1,
      city,
      province,
      employmentType,
      hireDate,
      probationEndDate,
      photoUrl,
      notes,
    },
  };
}

export function validateTerminateCompanyEmployeeRequest(payload: unknown): EmployeeTerminateValidationResult {
  if (payload === null || payload === undefined) {
    return {
      success: true,
      data: {
        terminationReason: null,
      },
    };
  }

  if (!isRecord(payload)) {
    return {
      success: false,
      message: 'Please provide a valid termination request.',
    };
  }

  const terminationReason = normalizeOptionalText(payload.terminationReason, 500);

  if (terminationReason === undefined) {
    return {
      success: false,
      message: 'Termination reason must be 500 characters or fewer.',
    };
  }

  return {
    success: true,
    data: {
      terminationReason,
    },
  };
}

export function validateUpdateEmployeeAssignmentRequest(payload: unknown): EmployeeAssignmentValidationResult {
  if (!isRecord(payload)) {
    return {
      success: false,
      message: 'Please choose an employee assignment before saving.',
    };
  }

  const hasDepartment = Object.hasOwn(payload, 'departmentId');
  const hasPosition = Object.hasOwn(payload, 'positionId');

  if (!hasDepartment && !hasPosition) {
    return {
      success: false,
      message: 'Please choose at least one assignment change before saving.',
    };
  }

  const data: UpdateEmployeeAssignmentInput = {};

  if (hasDepartment) {
    const departmentId = normalizeOptionalId(payload.departmentId);

    if (departmentId === undefined) {
      return {
        success: false,
        message: 'Selected department is invalid.',
      };
    }

    data.departmentId = departmentId;
  }

  if (hasPosition) {
    const positionId = normalizeOptionalId(payload.positionId);

    if (positionId === undefined) {
      return {
        success: false,
        message: 'Selected position is invalid.',
      };
    }

    data.positionId = positionId;
  }

  return {
    success: true,
    data,
  };
}

function normalizeOptionalId(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  if (typeof value !== 'string') {
    return undefined;
  }

  const normalized = value.trim();

  if (!normalized || normalized.length > 191) {
    return undefined;
  }

  return normalized;
}

function normalizeRequiredId(value: unknown) {
  if (typeof value !== 'string') {
    return '';
  }

  const normalized = value.trim();

  if (!normalized || normalized.length > 191) {
    return '';
  }

  return normalized;
}

function normalizeOptionalText(value: unknown, maxLength: number) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  if (typeof value !== 'string') {
    return undefined;
  }

  const normalized = value.trim().replace(/\s+/g, ' ');

  if (!normalized) {
    return null;
  }

  if (normalized.length > maxLength) {
    return undefined;
  }

  return normalized;
}

function normalizeOptionalDate(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  if (typeof value !== 'string') {
    return undefined;
  }

  const datePattern = /^\d{4}-\d{2}-\d{2}$/;

  if (!datePattern.test(value)) {
    return undefined;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date;
}

function normalizeRequiredText(value: unknown) {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';
}

function normalizeEmail(value: unknown) {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

function normalizeEditableMembershipStatus(value: unknown) {
  if (value === MembershipStatus.ACTIVE || value === MembershipStatus.SUSPENDED) {
    return value;
  }

  return null;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
