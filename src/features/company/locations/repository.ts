import db from '@/lib/db';
import type { UpsertLocationInput } from './types';

const locationSelect = {
  locationId: true,
  name: true,
  latitude: true,
  longitude: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
} as const;

export async function findCompanyLocations(companyId: string) {
  return db.location.findMany({
    where: {
      companyId,
    },
    orderBy: {
      name: 'asc',
    },
    select: locationSelect,
  });
}

export async function findCompanyLocationById(companyId: string, locationId: string) {
  return db.location.findFirst({
    where: {
      companyId,
      locationId,
    },
    select: locationSelect,
  });
}

export async function createLocationRecord(companyId: string, data: UpsertLocationInput) {
  return db.location.create({
    data: {
      companyId,
      name: data.name,
      latitude: data.latitude,
      longitude: data.longitude,
      isActive: data.isActive,
    },
    select: locationSelect,
  });
}

export async function updateLocationRecord(companyId: string, locationId: string, data: UpsertLocationInput) {
  const result = await db.location.updateMany({
    where: {
      companyId,
      locationId,
      deletedAt: null,
    },
    data: {
      name: data.name,
      latitude: data.latitude,
      longitude: data.longitude,
      isActive: data.isActive,
    },
  });

  if (result.count === 0) {
    return null;
  }

  return findCompanyLocationById(companyId, locationId);
}

export async function deleteLocationRecord(companyId: string, locationId: string) {
  return db.location.updateMany({
    where: {
      companyId,
      locationId,
      deletedAt: null,
    },
    data: {
      isActive: false,
      deletedAt: new Date(),
    },
  });
}
