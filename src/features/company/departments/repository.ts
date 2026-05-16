import db from '@/lib/db';
import type { UpsertDepartmentInput } from './types';

const departmentSelect = {
  departmentId: true,
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

export async function findCompanyDepartments(companyId: string) {
  return db.department.findMany({
    where: {
      companyId,
    },
    orderBy: {
      name: 'asc',
    },
    select: departmentSelect,
  });
}

export async function findCompanyDepartmentById(companyId: string, departmentId: string) {
  return db.department.findFirst({
    where: {
      companyId,
      departmentId,
    },
    select: departmentSelect,
  });
}

export async function createDepartmentRecord(companyId: string, data: UpsertDepartmentInput) {
  return db.department.create({
    data: {
      companyId,
      name: data.name,
      isActive: data.isActive,
    },
    select: departmentSelect,
  });
}

export async function updateDepartmentRecord(companyId: string, departmentId: string, data: UpsertDepartmentInput) {
  const result = await db.department.updateMany({
    where: {
      companyId,
      departmentId,
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

  return findCompanyDepartmentById(companyId, departmentId);
}

export async function archiveDepartmentRecord(companyId: string, departmentId: string) {
  return db.department.updateMany({
    where: {
      companyId,
      departmentId,
      deletedAt: null,
    },
    data: {
      isActive: false,
      deletedAt: new Date(),
    },
  });
}
