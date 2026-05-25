import type { Metadata } from 'next';
import { getCompanyAccessManagementData, resolveMembershipPermissionKeys, hasResolvedPermission } from '@/features/auth/permissions/service';
import { requirePermission } from '@/server/auth';
import { RolesAccessPageClient } from './components_roles_access/RolesAccessPageClient';

export const metadata: Metadata = {
  title: 'Roles & Access | RAKA HRIS',
};

export default async function RolesAccessPage() {
  const { company, membership } = await requirePermission('access', 'view');
  const [data, permissionKeys] = await Promise.all([
    getCompanyAccessManagementData(company.id),
    resolveMembershipPermissionKeys({
      companyId: company.id,
      membershipId: membership.id,
      isOwner: membership.isOwner,
    }),
  ]);

  return (
    <RolesAccessPageClient
      data={data}
      canManageRoles={hasResolvedPermission(permissionKeys, 'access', 'manageRoles')}
      canAssignRoles={hasResolvedPermission(permissionKeys, 'access', 'assignRoles')}
    />
  );
}
