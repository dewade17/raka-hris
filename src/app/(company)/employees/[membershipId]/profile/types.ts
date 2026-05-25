import type { MembershipStatus } from '@/generated/prisma/client';

export type EmployeeAssignmentOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

export type EmployeeAssignmentViewModel = {
  assignmentId: string;
  sourceId: string;
  name: string;
  isPrimary: boolean;
  isActive: boolean;
  deletedAt: string | null;
  createdAt: string;
};

export type EmployeeProfileViewModel = {
  id: string;
  status: MembershipStatus;
  isOwner: boolean;
  joinedAt: string;
  lastLoginAt: string | null;
  employmentEndedAt: string | null;
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
    birthDate: string | null;
    birthPlace: string | null;
    gender: string | null;
    maritalStatus: string | null;
    addressLine1: string | null;
    city: string | null;
    province: string | null;
    employmentType: string | null;
    hireDate: string | null;
    probationEndDate: string | null;
    photoUrl: string | null;
    notes: string | null;
    updatedAt: string;
  } | null;
  departments: EmployeeAssignmentViewModel[];
  positions: EmployeeAssignmentViewModel[];
  primaryDepartment: EmployeeAssignmentViewModel | null;
  primaryPosition: EmployeeAssignmentViewModel | null;
};

export type EmployeeAssignmentFormValues = {
  departmentId?: string;
  positionId?: string;
};

export type EmployeeProfileEditFormValues = {
  fullName: string;
  email: string;
  status: 'ACTIVE' | 'SUSPENDED';
  employeeNumber?: string;
  phone?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  birthDate?: string;
  birthPlace?: string;
  gender?: string;
  maritalStatus?: string;
  addressLine1?: string;
  city?: string;
  province?: string;
  employmentType?: string;
  hireDate?: string;
  probationEndDate?: string;
  photoUrl?: string;
  notes?: string;
};
