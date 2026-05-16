import type { Metadata } from 'next';
import { getCompanyDepartments } from '@/features/company/departments/service';
import { requireActiveCompanyMembership } from '@/server/auth';
import { DepartmentPageClient, type DepartmentViewModel } from './components_departments/DepartmentPageClient';

export const metadata: Metadata = {
  title: 'Departments | RAKA HRIS',
};

export default async function DepartmentsPage() {
  const { company, membership } = await requireActiveCompanyMembership();
  const data = await getCompanyDepartments(company.companyId);

  return (
    <DepartmentPageClient
      canManage={membership.isOwner}
      summary={data.summary}
      departments={data.departments.map(
        (department): DepartmentViewModel => ({
          departmentId: department.departmentId,
          name: department.name,
          isActive: department.isActive,
          createdAt: department.createdAt.toISOString(),
          updatedAt: department.updatedAt.toISOString(),
          deletedAt: department.deletedAt?.toISOString() ?? null,
          assignedEmployees: department.assignedEmployees,
        }),
      )}
    />
  );
}
