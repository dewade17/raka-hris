import { Prisma } from '@/generated/prisma/client';
import {
  countCompanyDepartments,
  countCompanyDepartmentsSummary,
  createDepartmentRecord,
  deleteDepartmentRecord,
  findCompanyDepartments,
  updateDepartmentRecord,
} from './repository';
import type { DepartmentDeleteResult, DepartmentListData, DepartmentListQuery, DepartmentMutationResult, UpsertDepartmentInput } from './types';

export async function getCompanyDepartments(companyId: string, query?: DepartmentListQuery): Promise<DepartmentListData> {
  if (!query) {
    const [departmentRecords, summary] = await Promise.all([findCompanyDepartments(companyId), countCompanyDepartmentsSummary(companyId)]);

    return {
      departments: departmentRecords.map(mapDepartmentRecord),
      summary,
    };
  }

  const [totalItems, summary] = await Promise.all([countCompanyDepartments(companyId, query), countCompanyDepartmentsSummary(companyId)]);
  const pagination = createPaginationMeta(query, totalItems);
  const departments = (await findCompanyDepartments(companyId, { ...query, page: pagination.page })).map(mapDepartmentRecord);

  return {
    departments,
    summary,
    pagination,
  };
}

export async function createDepartment(companyId: string, input: UpsertDepartmentInput): Promise<DepartmentMutationResult> {
  try {
    const department = await createDepartmentRecord(companyId, input);

    return {
      success: true,
      status: 201,
      message: 'Department created successfully.',
      department: mapDepartmentRecord(department),
    };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        success: false,
        status: 409,
        message: 'A department with this name already exists.',
      };
    }

    return {
      success: false,
      status: 500,
      message: 'Department could not be created right now. Please try again.',
    };
  }
}

export async function updateDepartment(companyId: string, departmentId: string, input: UpsertDepartmentInput): Promise<DepartmentMutationResult> {
  try {
    const department = await updateDepartmentRecord(companyId, departmentId, input);

    if (!department) {
      return {
        success: false,
        status: 404,
        message: 'Department could not be found.',
      };
    }

    return {
      success: true,
      status: 200,
      message: 'Department updated successfully.',
      department: mapDepartmentRecord(department),
    };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        success: false,
        status: 409,
        message: 'A department with this name already exists.',
      };
    }

    return {
      success: false,
      status: 500,
      message: 'Department could not be updated right now. Please try again.',
    };
  }
}

export async function deleteDepartment(companyId: string, departmentId: string): Promise<DepartmentDeleteResult> {
  try {
    const result = await deleteDepartmentRecord(companyId, departmentId);

    if (result.count === 0) {
      return {
        success: false,
        status: 404,
        message: 'Department could not be found.',
      };
    }

    return {
      success: true,
      status: 200,
      message: 'Department deleted successfully.',
    };
  } catch {
    return {
      success: false,
      status: 500,
      message: 'Department could not be deleted right now. Please try again.',
    };
  }
}

function mapDepartmentRecord(department: Awaited<ReturnType<typeof findCompanyDepartments>>[number]) {
  return {
    id: department.id,
    name: department.name,
    isActive: department.isActive,
    createdAt: department.createdAt,
    updatedAt: department.updatedAt,
    deletedAt: department.deletedAt,
    assignedEmployees: department._count.employeeLinks,
  };
}

function isUniqueConstraintError(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
}

function createPaginationMeta(query: DepartmentListQuery, totalItems: number) {
  const totalPages = Math.max(1, Math.ceil(totalItems / query.pageSize));
  const page = Math.min(query.page, totalPages);

  return {
    page,
    pageSize: query.pageSize,
    totalItems,
    totalPages,
  };
}
