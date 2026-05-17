import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasResolvedPermission, resolveMembershipPermissionKeys } from '@/features/auth/permissions/service';
import { getCompanyDepartments } from '@/features/company/departments/service';
import { getCompanyEmployeeProfile } from '@/features/company/employees/service';
import { getCompanyPositions } from '@/features/company/positions/service';
import { requirePermission } from '@/server/auth';
import { EmployeeProfilePageClient } from './components_employee_profile/EmployeeProfilePageClient';
import type { EmployeeAssignmentOption, EmployeeAssignmentViewModel, EmployeeProfileViewModel } from './types';

export const metadata: Metadata = {
  title: 'Employee Profile | RAKA HRIS',
};

type EmployeeProfilePageProps = {
  params: Promise<{
    membershipId: string;
  }>;
};

export default async function EmployeeProfilePage({ params }: EmployeeProfilePageProps) {
  const { membershipId } = await params;
  const { company, membership } = await requirePermission('employees', 'view');
  const [employee, departmentsData, positionsData, permissionKeys] = await Promise.all([
    getCompanyEmployeeProfile(company.companyId, membershipId),
    getCompanyDepartments(company.companyId),
    getCompanyPositions(company.companyId),
    resolveMembershipPermissionKeys({
      companyId: company.companyId,
      membershipId: membership.membershipId,
      isOwner: membership.isOwner,
    }),
  ]);

  if (!employee) {
    notFound();
  }

  const employeeViewModel = mapEmployeeProfileViewModel(employee);

  return (
    <EmployeeProfilePageClient
      employee={employeeViewModel}
      canAssign={hasResolvedPermission(permissionKeys, 'employees', 'assign')}
      canTerminate={hasResolvedPermission(permissionKeys, 'employees', 'terminate')}
      canUpdate={hasResolvedPermission(permissionKeys, 'employees', 'update')}
      departmentOptions={includeCurrentAssignmentOption(
        departmentsData.departments
          .filter((department) => department.isActive && !department.deletedAt)
          .map((department) => ({
            label: department.name,
            value: department.departmentId,
          })),
        employeeViewModel.primaryDepartment,
      )}
      positionOptions={includeCurrentAssignmentOption(
        positionsData.positions
          .filter((position) => position.isActive && !position.deletedAt)
          .map((position) => ({
            label: position.name,
            value: position.positionId,
          })),
        employeeViewModel.primaryPosition,
      )}
    />
  );
}

function mapEmployeeProfileViewModel(employee: NonNullable<Awaited<ReturnType<typeof getCompanyEmployeeProfile>>>): EmployeeProfileViewModel {
  const departments = employee.departments.map(mapAssignmentViewModel);
  const positions = employee.positions.map(mapAssignmentViewModel);

  return {
    membershipId: employee.membershipId,
    status: employee.status,
    isOwner: employee.isOwner,
    joinedAt: employee.joinedAt.toISOString(),
    lastLoginAt: toIsoString(employee.lastLoginAt),
    employmentEndedAt: toIsoString(employee.employmentEndedAt),
    user: employee.user,
    profile: employee.profile
      ? {
          employeeProfileId: employee.profile.employeeProfileId,
          employeeNumber: employee.profile.employeeNumber,
          phone: employee.profile.phone,
          emergencyContactName: employee.profile.emergencyContactName,
          emergencyContactPhone: employee.profile.emergencyContactPhone,
          birthDate: toIsoString(employee.profile.birthDate),
          birthPlace: employee.profile.birthPlace,
          gender: employee.profile.gender,
          maritalStatus: employee.profile.maritalStatus,
          addressLine1: employee.profile.addressLine1,
          city: employee.profile.city,
          province: employee.profile.province,
          employmentType: employee.profile.employmentType,
          hireDate: toIsoString(employee.profile.hireDate),
          probationEndDate: toIsoString(employee.profile.probationEndDate),
          photoUrl: employee.profile.photoUrl,
          notes: employee.profile.notes,
          updatedAt: employee.profile.updatedAt.toISOString(),
        }
      : null,
    departments,
    positions,
    primaryDepartment: employee.primaryDepartment ? mapAssignmentViewModel(employee.primaryDepartment) : null,
    primaryPosition: employee.primaryPosition ? mapAssignmentViewModel(employee.primaryPosition) : null,
  };
}

function mapAssignmentViewModel(assignment: NonNullable<Awaited<ReturnType<typeof getCompanyEmployeeProfile>>>['departments'][number]): EmployeeAssignmentViewModel {
  return {
    assignmentId: assignment.assignmentId,
    sourceId: assignment.sourceId,
    name: assignment.name,
    isPrimary: assignment.isPrimary,
    isActive: assignment.isActive,
    deletedAt: toIsoString(assignment.deletedAt),
    createdAt: assignment.createdAt.toISOString(),
  };
}

function includeCurrentAssignmentOption(options: EmployeeAssignmentOption[], currentAssignment: EmployeeAssignmentViewModel | null): EmployeeAssignmentOption[] {
  if (!currentAssignment || options.some((option) => option.value === currentAssignment.sourceId)) {
    return options;
  }

  return [
    ...options,
    {
      label: `${currentAssignment.name} (${currentAssignment.deletedAt ? 'archived' : 'inactive'})`,
      value: currentAssignment.sourceId,
      disabled: true,
    },
  ];
}

function toIsoString(value: Date | null) {
  return value?.toISOString() ?? null;
}
