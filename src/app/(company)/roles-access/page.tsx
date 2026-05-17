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
    getCompanyAccessManagementData(company.companyId),
    resolveMembershipPermissionKeys({
      companyId: company.companyId,
      membershipId: membership.membershipId,
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
