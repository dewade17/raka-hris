import db from '@/lib/db';
import type { Prisma } from '@/generated/prisma/client';
import type { DepartmentListQuery, UpsertDepartmentInput } from './types';

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

export async function findCompanyDepartments(companyId: string, query?: DepartmentListQuery) {
  return db.department.findMany({
    where: query ? buildDepartmentListWhere(companyId, query) : { companyId },
    orderBy: [{ name: 'asc' }, { departmentId: 'asc' }],
    ...(query
      ? {
          skip: (query.page - 1) * query.pageSize,
          take: query.pageSize,
        }
      : {}),
    select: departmentSelect,
  });
}

export async function countCompanyDepartments(companyId: string, query: DepartmentListQuery) {
  return db.department.count({
    where: buildDepartmentListWhere(companyId, query),
  });
}

export async function countCompanyDepartmentsSummary(companyId: string) {
  const [total, active, inactive, deleted] = await Promise.all([
    db.department.count({
      where: {
        companyId,
        deletedAt: null,
      },
    }),
    db.department.count({
      where: {
        companyId,
        deletedAt: null,
        isActive: true,
      },
    }),
    db.department.count({
      where: {
        companyId,
        deletedAt: null,
        isActive: false,
      },
    }),
    db.department.count({
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

export async function deleteDepartmentRecord(companyId: string, departmentId: string) {
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

function buildDepartmentListWhere(companyId: string, query: DepartmentListQuery): Prisma.DepartmentWhereInput {
  const where: Prisma.DepartmentWhereInput = {
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
