import type { Metadata } from 'next';
import { hasResolvedPermission, resolveMembershipPermissionKeys } from '@/features/auth/permissions/service';
import { getCompanyPositions } from '@/features/company/positions/service';
import { requirePermission } from '@/server/auth';
import { PositionPageClient, type PositionViewModel } from './components_positions/PositionPageClient';

export const metadata: Metadata = {
  title: 'Positions | RAKA HRIS',
};

export default async function PositionsPage() {
  const { company, membership } = await requirePermission('positions', 'view');
  const [data, permissionKeys] = await Promise.all([
    getCompanyPositions(company.companyId),
    resolveMembershipPermissionKeys({
      companyId: company.companyId,
      membershipId: membership.membershipId,
      isOwner: membership.isOwner,
    }),
  ]);

  return (
    <PositionPageClient
      canDelete={hasResolvedPermission(permissionKeys, 'positions', 'delete')}
      canCreate={hasResolvedPermission(permissionKeys, 'positions', 'create')}
      canUpdate={hasResolvedPermission(permissionKeys, 'positions', 'update')}
      summary={data.summary}
      positions={data.positions.map(
        (position): PositionViewModel => ({
          positionId: position.positionId,
          name: position.name,
          isActive: position.isActive,
          createdAt: position.createdAt.toISOString(),
          updatedAt: position.updatedAt.toISOString(),
          deletedAt: position.deletedAt?.toISOString() ?? null,
          assignedEmployees: position.assignedEmployees,
        }),
      )}
    />
  );
}
