import { Prisma } from '@/generated/prisma/client';
import { createLocationRecord, deleteLocationRecord, findCompanyLocations, updateLocationRecord } from './repository';
import type { LocationDeleteResult, LocationListData, LocationMutationResult, UpsertLocationInput } from './types';

export async function getCompanyLocations(companyId: string): Promise<LocationListData> {
  const locations = (await findCompanyLocations(companyId)).map(mapLocationRecord);

  return {
    locations,
    summary: {
      total: locations.filter((location) => !location.deletedAt).length,
      active: locations.filter((location) => !location.deletedAt && location.isActive).length,
      inactive: locations.filter((location) => !location.deletedAt && !location.isActive).length,
      deleted: locations.filter((location) => location.deletedAt).length,
    },
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
    locationId: location.locationId,
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
