import type { Metadata } from 'next';
import { hasResolvedPermission, resolveMembershipPermissionKeys } from '@/features/auth/permissions/service';
import { getCompanyLocations } from '@/features/company/locations/service';
import { validateLocationListQuery } from '@/features/company/locations/validation';
import { requirePermission } from '@/server/auth';
import { LocationPageClient, type LocationViewModel } from './components_locations/LocationPageClient';

export const metadata: Metadata = {
  title: 'Locations | RAKA HRIS',
};

type LocationsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LocationsPage({ searchParams }: LocationsPageProps) {
  const listQuery = validateLocationListQuery(await searchParams);
  const { company, membership } = await requirePermission('locations', 'view');
  const [data, permissionKeys] = await Promise.all([
    getCompanyLocations(company.companyId, listQuery),
    resolveMembershipPermissionKeys({
      companyId: company.companyId,
      membershipId: membership.membershipId,
      isOwner: membership.isOwner,
    }),
  ]);
  const pagination = data.pagination ?? {
    page: listQuery.page,
    pageSize: listQuery.pageSize,
    totalItems: data.locations.length,
    totalPages: 1,
  };

  return (
    <LocationPageClient
      key={`${pagination.page}:${pagination.pageSize}:${listQuery.status}:${listQuery.query}`}
      canDelete={hasResolvedPermission(permissionKeys, 'locations', 'delete')}
      canCreate={hasResolvedPermission(permissionKeys, 'locations', 'create')}
      canUpdate={hasResolvedPermission(permissionKeys, 'locations', 'update')}
      summary={data.summary}
      pagination={pagination}
      listQuery={listQuery}
      locations={data.locations.map(
        (location): LocationViewModel => ({
          locationId: location.locationId,
          name: location.name,
          latitude: location.latitude,
          longitude: location.longitude,
          isActive: location.isActive,
          createdAt: location.createdAt.toISOString(),
          updatedAt: location.updatedAt.toISOString(),
          deletedAt: location.deletedAt?.toISOString() ?? null,
        }),
      )}
    />
  );
}
