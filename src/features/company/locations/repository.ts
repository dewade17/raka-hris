import db from '@/lib/db';
import type { Prisma } from '@/generated/prisma/client';
import type { LocationListQuery, UpsertLocationInput } from './types';

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

export async function findCompanyLocations(companyId: string, query?: LocationListQuery) {
  return db.location.findMany({
    where: query ? buildLocationListWhere(companyId, query) : { companyId },
    orderBy: [{ name: 'asc' }, { locationId: 'asc' }],
    ...(query
      ? {
          skip: (query.page - 1) * query.pageSize,
          take: query.pageSize,
        }
      : {}),
    select: locationSelect,
  });
}

export async function countCompanyLocations(companyId: string, query: LocationListQuery) {
  return db.location.count({
    where: buildLocationListWhere(companyId, query),
  });
}

export async function countCompanyLocationsSummary(companyId: string) {
  const [total, active, inactive, deleted] = await Promise.all([
    db.location.count({
      where: {
        companyId,
        deletedAt: null,
      },
    }),
    db.location.count({
      where: {
        companyId,
        deletedAt: null,
        isActive: true,
      },
    }),
    db.location.count({
      where: {
        companyId,
        deletedAt: null,
        isActive: false,
      },
    }),
    db.location.count({
      where: {
        companyId,
        deletedAt: {
          not: null,
        },
      },
    }),
  ]);

  return {
    total,
    active,
    inactive,
    deleted,
  };
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

function buildLocationListWhere(companyId: string, query: LocationListQuery): Prisma.LocationWhereInput {
  const where: Prisma.LocationWhereInput = {
    companyId,
  };

  if (query.query) {
    where.name = {
      contains: query.query,
    };
  }

  if (query.status === 'deleted') {
    where.deletedAt = {
      not: null,
    };
  } else {
    where.deletedAt = null;

    if (query.status === 'active') {
      where.isActive = true;
    }

    if (query.status === 'inactive') {
      where.isActive = false;
    }
  }

  return where;
}
