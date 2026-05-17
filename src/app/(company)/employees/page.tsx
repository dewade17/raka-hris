import type { Metadata } from 'next';
import { getCompanyDepartments } from '@/features/company/departments/service';
import { getCompanyEmployeeList } from '@/features/company/employees/service';
import { getCompanyPositions } from '@/features/company/positions/service';
import { requireActiveCompanyMembership } from '@/server/auth';
import { EmployeeListPageClient } from './components_employees/EmployeeListPageClient';
import type { EmployeeCreateAssignmentOption, EmployeeListAssignmentViewModel, EmployeeListViewModel } from './types';

export const metadata: Metadata = {
  title: 'Employees | RAKA HRIS',
};

export default async function EmployeesPage() {
  const { company, membership } = await requireActiveCompanyMembership();
  const [data, departmentsData, positionsData] = await Promise.all([
    getCompanyEmployeeList(company.companyId),
    getCompanyDepartments(company.companyId),
    getCompanyPositions(company.companyId),
  ]);

  return (
    <EmployeeListPageClient
      canManage={membership.isOwner}
      summary={data.summary}
      departmentOptions={departmentsData.departments
        .filter((department) => department.isActive && !department.deletedAt)
        .map(mapDepartmentOption)}
      positionOptions={positionsData.positions
        .filter((position) => position.isActive && !position.deletedAt)
        .map(mapPositionOption)}
      employees={data.employees.map(
        (employee): EmployeeListViewModel => ({
          membershipId: employee.membershipId,
          status: employee.status,
          isOwner: employee.isOwner,
          joinedAt: employee.joinedAt.toISOString(),
          user: employee.user,
          employeeNumber: employee.employeeNumber,
          employmentType: employee.employmentType,
          hireDate: employee.hireDate?.toISOString() ?? null,
          primaryDepartment: employee.primaryDepartment ? mapAssignmentViewModel(employee.primaryDepartment) : null,
          primaryPosition: employee.primaryPosition ? mapAssignmentViewModel(employee.primaryPosition) : null,
          hasCompleteProfile: employee.hasCompleteProfile,
        }),
      )}
    />
  );
}

function mapAssignmentViewModel(assignment: {
  sourceId: string;
  name: string;
  isActive: boolean;
  deletedAt: Date | null;
}): EmployeeListAssignmentViewModel {
  return {
    sourceId: assignment.sourceId,
    name: assignment.name,
    isActive: assignment.isActive,
    deletedAt: assignment.deletedAt?.toISOString() ?? null,
  };
}

function mapDepartmentOption(department: {
  departmentId: string;
  name: string;
}): EmployeeCreateAssignmentOption {
  return {
    label: department.name,
    value: department.departmentId,
  };
}

function mapPositionOption(position: {
  positionId: string;
  name: string;
}): EmployeeCreateAssignmentOption {
  return {
    label: position.name,
    value: position.positionId,
  };
}
