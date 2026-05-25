import type { Metadata } from 'next';
import { hasResolvedPermission, resolveMembershipPermissionKeys } from '@/features/auth/permissions/service';
import { getCompanyDepartments } from '@/features/company/departments/service';
import { validateDepartmentListQuery } from '@/features/company/departments/validation';
import { requirePermission } from '@/server/auth';
import { DepartmentPageClient, type DepartmentViewModel } from './components_departments/DepartmentPageClient';

export const metadata: Metadata = {
  title: 'Departments | RAKA HRIS',
};

type DepartmentsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DepartmentsPage({ searchParams }: DepartmentsPageProps) {
  const listQuery = validateDepartmentListQuery(await searchParams);
  const { company, membership } = await requirePermission('departments', 'view');
  const [data, permissionKeys] = await Promise.all([
    getCompanyDepartments(company.id, listQuery),
    resolveMembershipPermissionKeys({
      companyId: company.id,
      membershipId: membership.id,
      isOwner: membership.isOwner,
    }),
  ]);
  const pagination = data.pagination ?? {
    page: listQuery.page,
    pageSize: listQuery.pageSize,
    totalItems: data.departments.length,
    totalPages: 1,
  };

  return (
    <DepartmentPageClient
      key={`${pagination.page}:${pagination.pageSize}:${listQuery.status}:${listQuery.query}`}
      canDelete={hasResolvedPermission(permissionKeys, 'departments', 'delete')}
      canCreate={hasResolvedPermission(permissionKeys, 'departments', 'create')}
      canUpdate={hasResolvedPermission(permissionKeys, 'departments', 'update')}
      summary={data.summary}
      pagination={pagination}
      listQuery={listQuery}
      departments={data.departments.map(
        (department): DepartmentViewModel => ({
          id: department.id,
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
