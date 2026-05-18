import type { Metadata } from 'next';
import { hasResolvedPermission, resolveMembershipPermissionKeys } from '@/features/auth/permissions/service';
import { getCompanyDepartments } from '@/features/company/departments/service';
import { requirePermission } from '@/server/auth';
import { DepartmentPageClient, type DepartmentViewModel } from './components_departments/DepartmentPageClient';

export const metadata: Metadata = {
  title: 'Departments | RAKA HRIS',
};

export default async function DepartmentsPage() {
  const { company, membership } = await requirePermission('departments', 'view');
  const [data, permissionKeys] = await Promise.all([
    getCompanyDepartments(company.companyId),
    resolveMembershipPermissionKeys({
      companyId: company.companyId,
      membershipId: membership.membershipId,
      isOwner: membership.isOwner,
    }),
  ]);

  return (
    <DepartmentPageClient
      canDelete={hasResolvedPermission(permissionKeys, 'departments', 'delete')}
      canCreate={hasResolvedPermission(permissionKeys, 'departments', 'create')}
      canUpdate={hasResolvedPermission(permissionKeys, 'departments', 'update')}
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
