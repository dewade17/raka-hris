import { Prisma } from '@/generated/prisma/client';
import { countCompanyLocations, countCompanyLocationsSummary, createLocationRecord, deleteLocationRecord, findCompanyLocations, updateLocationRecord } from './repository';
import type { LocationDeleteResult, LocationListData, LocationListQuery, LocationMutationResult, UpsertLocationInput } from './types';

export async function getCompanyLocations(companyId: string, query?: LocationListQuery): Promise<LocationListData> {
  if (!query) {
    const [locationRecords, summary] = await Promise.all([findCompanyLocations(companyId), countCompanyLocationsSummary(companyId)]);

    return {
      locations: locationRecords.map(mapLocationRecord),
      summary,
    };
  }

  const [totalItems, summary] = await Promise.all([countCompanyLocations(companyId, query), countCompanyLocationsSummary(companyId)]);
  const pagination = createPaginationMeta(query, totalItems);
  const locations = (await findCompanyLocations(companyId, { ...query, page: pagination.page })).map(mapLocationRecord);

  return {
    locations,
    summary,
    pagination,
  };
}

export async function createLocation(companyId: string, input: UpsertLocationInput): Promise<LocationMutationResult> {
  try {
    const location = await createLocationRecord(companyId, input);

    return {
      success: true,
      status: 201,
      message: 'Location created successfully.',
      location: mapLocationRecord(location),
    };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        success: false,
        status: 409,
        message: 'A location with this name already exists.',
      };
    }

    return {
      success: false,
      status: 500,
      message: 'Location could not be created right now. Please try again.',
    };
  }
}

export async function updateLocation(companyId: string, locationId: string, input: UpsertLocationInput): Promise<LocationMutationResult> {
  try {
    const location = await updateLocationRecord(companyId, locationId, input);

    if (!location) {
      return {
        success: false,
        status: 404,
        message: 'Location could not be found.',
      };
    }

    return {
      success: true,
      status: 200,
      message: 'Location updated successfully.',
      location: mapLocationRecord(location),
    };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        success: false,
        status: 409,
        message: 'A location with this name already exists.',
      };
    }

    return {
      success: false,
      status: 500,
      message: 'Location could not be updated right now. Please try again.',
    };
  }
}

export async function deleteLocation(companyId: string, locationId: string): Promise<LocationDeleteResult> {
  try {
    const result = await deleteLocationRecord(companyId, locationId);

    if (result.count === 0) {
      return {
        success: false,
        status: 404,
        message: 'Location could not be found.',
      };
    }

    return {
      success: true,
      status: 200,
      message: 'Location deleted successfully.',
    };
  } catch {
    return {
      success: false,
      status: 500,
      message: 'Location could not be deleted right now. Please try again.',
    };
  }
}

function mapLocationRecord(location: Awaited<ReturnType<typeof findCompanyLocations>>[number]) {
  return {
    id: location.id,
    name: location.name,
    latitude: location.latitude?.toString() ?? null,
    longitude: location.longitude?.toString() ?? null,
    isActive: location.isActive,
    createdAt: location.createdAt,
    updatedAt: location.updatedAt,
    deletedAt: location.deletedAt,
  };
}

function isUniqueConstraintError(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
}

function createPaginationMeta(query: LocationListQuery, totalItems: number) {
  const totalPages = Math.max(1, Math.ceil(totalItems / query.pageSize));
  const page = Math.min(query.page, totalPages);

  return {
    page,
    pageSize: query.pageSize,
    totalItems,
    totalPages,
  };
}
