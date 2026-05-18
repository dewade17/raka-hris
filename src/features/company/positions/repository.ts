import db from '@/lib/db';
import type { UpsertPositionInput } from './types';

const positionSelect = {
  positionId: true,
  name: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  _count: {
    select: {
      employeeLinks: true,
    },
  },
} as const;

export async function findCompanyPositions(companyId: string) {
  return db.position.findMany({
    where: {
      companyId,
    },
    orderBy: {
      name: 'asc',
    },
    select: positionSelect,
  });
}

export async function findCompanyPositionById(companyId: string, positionId: string) {
  return db.position.findFirst({
    where: {
      companyId,
      positionId,
    },
    select: positionSelect,
  });
}

export async function createPositionRecord(companyId: string, data: UpsertPositionInput) {
  return db.position.create({
    data: {
      companyId,
      name: data.name,
      isActive: data.isActive,
    },
    select: positionSelect,
  });
}

export async function updatePositionRecord(companyId: string, positionId: string, data: UpsertPositionInput) {
  const result = await db.position.updateMany({
    where: {
      companyId,
      positionId,
      deletedAt: null,
    },
    data: {
      name: data.name,
      isActive: data.isActive,
    },
  });

  if (result.count === 0) {
    return null;
  }

  return findCompanyPositionById(companyId, positionId);
}

export async function deletePositionRecord(companyId: string, positionId: string) {
  return db.position.updateMany({
    where: {
      companyId,
      positionId,
      deletedAt: null,
    },
    data: {
      isActive: false,
      deletedAt: new Date(),
    },
  });
}
