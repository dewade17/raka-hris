import { Prisma } from '@/generated/prisma/client';
import {
  createDepartmentRecord,
  deleteDepartmentRecord,
  findCompanyDepartments,
  updateDepartmentRecord,
} from './repository';
import type { DepartmentDeleteResult, DepartmentListData, DepartmentMutationResult, UpsertDepartmentInput } from './types';

export async function getCompanyDepartments(companyId: string): Promise<DepartmentListData> {
  const departments = (await findCompanyDepartments(companyId)).map(mapDepartmentRecord);

  return {
    departments,
    summary: {
      total: departments.filter((department) => !department.deletedAt).length,
      active: departments.filter((department) => !department.deletedAt && department.isActive).length,
      inactive: departments.filter((department) => !department.deletedAt && !department.isActive).length,
      deleted: departments.filter((department) => department.deletedAt).length,
    },
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
    departmentId: department.departmentId,
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
