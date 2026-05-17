import type { Metadata } from 'next';
import { hasResolvedPermission, resolveMembershipPermissionKeys } from '@/features/auth/permissions/service';
import { getCompanyLocations } from '@/features/company/locations/service';
import { requirePermission } from '@/server/auth';
import { LocationPageClient, type LocationViewModel } from './components_locations/LocationPageClient';

export const metadata: Metadata = {
  title: 'Locations | RAKA HRIS',
};

export default async function LocationsPage() {
  const { company, membership } = await requirePermission('locations', 'view');
  const [data, permissionKeys] = await Promise.all([
    getCompanyLocations(company.companyId),
    resolveMembershipPermissionKeys({
      companyId: company.companyId,
      membershipId: membership.membershipId,
      isOwner: membership.isOwner,
    }),
  ]);

  return (
    <LocationPageClient
      canArchive={hasResolvedPermission(permissionKeys, 'locations', 'archive')}
      canCreate={hasResolvedPermission(permissionKeys, 'locations', 'create')}
      canUpdate={hasResolvedPermission(permissionKeys, 'locations', 'update')}
      summary={data.summary}
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
