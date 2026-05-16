import type { Metadata } from 'next';
import { getCompanyLocations } from '@/features/company/locations/service';
import { requireActiveCompanyMembership } from '@/server/auth';
import { LocationPageClient, type LocationViewModel } from './components_locations/LocationPageClient';

export const metadata: Metadata = {
  title: 'Locations | RAKA HRIS',
};

export default async function LocationsPage() {
  const { company, membership } = await requireActiveCompanyMembership();
  const data = await getCompanyLocations(company.companyId);

  return (
    <LocationPageClient
      canManage={membership.isOwner}
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
