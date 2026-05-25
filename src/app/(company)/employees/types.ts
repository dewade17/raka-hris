import type { MembershipStatus } from '@/generated/prisma/client';

export type EmployeeCreateAssignmentOption = {
  label: string;
  value: string;
};

export type EmployeeListAssignmentViewModel = {
  sourceId: string;
  name: string;
  isActive: boolean;
  deletedAt: string | null;
};

export type EmployeeListViewModel = {
  id: string;
  status: MembershipStatus;
  isOwner: boolean;
  joinedAt: string;
  user: {
    name: string;
    email: string | null;
  };
  employeeNumber: string | null;
  employmentType: string | null;
  hireDate: string | null;
  primaryDepartment: EmployeeListAssignmentViewModel | null;
  primaryPosition: EmployeeListAssignmentViewModel | null;
  hasCompleteProfile: boolean;
};

export type EmployeeListSummaryViewModel = {
  total: number;
  active: number;
  incompleteProfiles: number;
  withoutDepartment: number;
};
