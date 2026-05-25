import type { MembershipStatus } from '@/generated/prisma/client';

export type EmployeeAssignmentSummary = {
  assignmentId: string;
  sourceId: string;
  name: string;
  isPrimary: boolean;
  isActive: boolean;
  deletedAt: Date | null;
  createdAt: Date;
};

export type CompanyEmployeeProfile = {
  id: string;
  status: MembershipStatus;
  isOwner: boolean;
  joinedAt: Date;
  lastLoginAt: Date | null;
  employmentEndedAt: Date | null;
  user: {
    name: string;
    email: string | null;
  };
  profile: {
    id: string;
    employeeNumber: string | null;
    phone: string | null;
    emergencyContactName: string | null;
    emergencyContactPhone: string | null;
    birthDate: Date | null;
    birthPlace: string | null;
    gender: string | null;
    maritalStatus: string | null;
    addressLine1: string | null;
    city: string | null;
    province: string | null;
    employmentType: string | null;
    hireDate: Date | null;
    probationEndDate: Date | null;
    photoUrl: string | null;
    notes: string | null;
    updatedAt: Date;
  } | null;
  departments: EmployeeAssignmentSummary[];
  positions: EmployeeAssignmentSummary[];
  primaryDepartment: EmployeeAssignmentSummary | null;
  primaryPosition: EmployeeAssignmentSummary | null;
};

export type CompanyEmployeeListItem = {
  id: string;
  status: MembershipStatus;
  isOwner: boolean;
  joinedAt: Date;
  user: {
    name: string;
    email: string | null;
  };
  employeeNumber: string | null;
  employmentType: string | null;
  hireDate: Date | null;
  primaryDepartment: EmployeeAssignmentSummary | null;
  primaryPosition: EmployeeAssignmentSummary | null;
  hasCompleteProfile: boolean;
};

export type CompanyEmployeeListData = {
  employees: CompanyEmployeeListItem[];
  summary: {
    total: number;
    active: number;
    incompleteProfiles: number;
    withoutDepartment: number;
  };
};

export type CreateCompanyEmployeeInput = {
  fullName: string;
  email: string;
  password: string;
  departmentId: string;
  positionId: string;
};

export type UpdateCompanyEmployeeInput = {
  fullName: string;
  email: string;
  status: Extract<MembershipStatus, 'ACTIVE' | 'SUSPENDED'>;
  employeeNumber: string | null;
  phone: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  birthDate: Date | null;
  birthPlace: string | null;
  gender: string | null;
  maritalStatus: string | null;
  addressLine1: string | null;
  city: string | null;
  province: string | null;
  employmentType: string | null;
  hireDate: Date | null;
  probationEndDate: Date | null;
  photoUrl: string | null;
  notes: string | null;
};

export type TerminateCompanyEmployeeInput = {
  terminationReason: string | null;
};

export type UpdateEmployeeAssignmentInput = {
  departmentId?: string | null;
  positionId?: string | null;
};

export type EmployeeCreateMutationResult =
  | {
      success: true;
      status: 201;
      message: string;
      id: string;
    }
  | {
      success: false;
      status: 400 | 409 | 500 | 502;
      message: string;
    };

export type EmployeeUpdateMutationResult =
  | {
      success: true;
      status: 200;
      message: string;
    }
  | {
      success: false;
      status: 400 | 404 | 409 | 500;
      message: string;
    };

export type EmployeeTerminateMutationResult =
  | {
      success: true;
      status: 200;
      message: string;
    }
  | {
      success: false;
      status: 400 | 404 | 500;
      message: string;
    };

export type EmployeeAssignmentMutationResult =
  | {
      success: true;
      status: 200;
      message: string;
    }
  | {
      success: false;
      status: 400 | 404 | 500;
      message: string;
    };
