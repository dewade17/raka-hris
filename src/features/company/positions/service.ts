import { Prisma } from '@/generated/prisma/client';
import { archivePositionRecord, createPositionRecord, findCompanyPositions, updatePositionRecord } from './repository';
import type { PositionArchiveResult, PositionListData, PositionMutationResult, UpsertPositionInput } from './types';

export async function getCompanyPositions(companyId: string): Promise<PositionListData> {
  const positions = (await findCompanyPositions(companyId)).map(mapPositionRecord);

  return {
    positions,
    summary: {
      total: positions.filter((position) => !position.deletedAt).length,
      active: positions.filter((position) => !position.deletedAt && position.isActive).length,
      inactive: positions.filter((position) => !position.deletedAt && !position.isActive).length,
      archived: positions.filter((position) => position.deletedAt).length,
    },
  };
}

export async function createPosition(companyId: string, input: UpsertPositionInput): Promise<PositionMutationResult> {
  try {
    const position = await createPositionRecord(companyId, input);

    return {
      success: true,
      status: 201,
      message: 'Position created successfully.',
      position: mapPositionRecord(position),
    };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        success: false,
        status: 409,
        message: 'A position with this name already exists.',
      };
    }

    return {
      success: false,
      status: 500,
      message: 'Position could not be created right now. Please try again.',
    };
  }
}

export async function updatePosition(companyId: string, positionId: string, input: UpsertPositionInput): Promise<PositionMutationResult> {
  try {
    const position = await updatePositionRecord(companyId, positionId, input);

    if (!position) {
      return {
        success: false,
        status: 404,
        message: 'Position could not be found.',
      };
    }

    return {
      success: true,
      status: 200,
      message: 'Position updated successfully.',
      position: mapPositionRecord(position),
    };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        success: false,
        status: 409,
        message: 'A position with this name already exists.',
      };
    }

    return {
      success: false,
      status: 500,
      message: 'Position could not be updated right now. Please try again.',
    };
  }
}

export async function archivePosition(companyId: string, positionId: string): Promise<PositionArchiveResult> {
  try {
    const result = await archivePositionRecord(companyId, positionId);

    if (result.count === 0) {
      return {
        success: false,
        status: 404,
        message: 'Position could not be found.',
      };
    }

    return {
      success: true,
      status: 200,
      message: 'Position archived successfully.',
    };
  } catch {
    return {
      success: false,
      status: 500,
      message: 'Position could not be archived right now. Please try again.',
    };
  }
}

function mapPositionRecord(position: Awaited<ReturnType<typeof findCompanyPositions>>[number]) {
  return {
    positionId: position.positionId,
    name: position.name,
    isActive: position.isActive,
    createdAt: position.createdAt,
    updatedAt: position.updatedAt,
    deletedAt: position.deletedAt,
    assignedEmployees: position._count.employeeLinks,
  };
}

function isUniqueConstraintError(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
}
