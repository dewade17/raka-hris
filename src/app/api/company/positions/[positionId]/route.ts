import { NextResponse } from 'next/server';
import { archivePosition, updatePosition } from '@/features/company/positions/service';
import { validateUpsertPositionRequest } from '@/features/company/positions/validation';
import { createOwnerRequiredResponse, getActiveCompanyApiContext } from '../../_utils/companyApiAuth';

type PositionRouteContext = {
  params: Promise<{
    positionId: string;
  }>;
};

export async function PATCH(request: Request, context: PositionRouteContext) {
  const authContext = await getActiveCompanyApiContext();

  if (!authContext.success) {
    return authContext.response;
  }

  if (!authContext.membership.isOwner) {
    return createOwnerRequiredResponse();
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
  const authContext = await getActiveCompanyApiContext();

  if (!authContext.success) {
    return authContext.response;
  }

  if (!authContext.membership.isOwner) {
    return createOwnerRequiredResponse();
  }

  const { positionId } = await context.params;
  const result = await archivePosition(authContext.company.companyId, positionId);

  return NextResponse.json(
    {
      success: result.success,
      message: result.message,
    },
    { status: result.status },
  );
}
