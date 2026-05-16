import type { Metadata } from 'next';
import { getCompanyPositions } from '@/features/company/positions/service';
import { requireActiveCompanyMembership } from '@/server/auth';
import { PositionPageClient, type PositionViewModel } from './components_positions/PositionPageClient';

export const metadata: Metadata = {
  title: 'Positions | RAKA HRIS',
};

export default async function PositionsPage() {
  const { company, membership } = await requireActiveCompanyMembership();
  const data = await getCompanyPositions(company.companyId);

  return (
    <PositionPageClient
      canManage={membership.isOwner}
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
