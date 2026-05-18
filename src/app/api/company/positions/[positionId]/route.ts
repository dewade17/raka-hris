import { NextResponse } from 'next/server';
import { deletePosition, updatePosition } from '@/features/company/positions/service';
import { validateUpsertPositionRequest } from '@/features/company/positions/validation';
import { getCompanyApiPermissionContext } from '../../_utils/companyApiAuth';

type PositionRouteContext = {
  params: Promise<{
    positionId: string;
  }>;
};

export async function PATCH(request: Request, context: PositionRouteContext) {
  const authContext = await getCompanyApiPermissionContext(
    'positions',
    'update',
    'You do not have permission to update positions.',
  );

  if (!authContext.success) {
    return authContext.response;
  }

  const payload = await request.json().catch(() => null);
  const validation = validateUpsertPositionRequest(payload);

  if (!validation.success) {
    return NextResponse.json(
      {
        success: false,
        message: validation.message,
      },
      { status: 400 },
    );
  }

  const { positionId } = await context.params;
  const result = await updatePosition(authContext.company.companyId, positionId, validation.data);

  return NextResponse.json(
    {
      success: result.success,
      message: result.message,
      ...(result.success ? { position: result.position } : {}),
    },
    { status: result.status },
  );
}

export async function DELETE(_request: Request, context: PositionRouteContext) {
  const authContext = await getCompanyApiPermissionContext(
    'positions',
    'delete',
    'You do not have permission to delete positions.',
  );

  if (!authContext.success) {
    return authContext.response;
  }

  const { positionId } = await context.params;
  const result = await deletePosition(authContext.company.companyId, positionId);

  return NextResponse.json(
    {
      success: result.success,
      message: result.message,
    },
    { status: result.status },
  );
}
