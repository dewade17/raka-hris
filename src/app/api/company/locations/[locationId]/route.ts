import { NextResponse } from 'next/server';
import { archiveLocation, updateLocation } from '@/features/company/locations/service';
import { validateUpsertLocationRequest } from '@/features/company/locations/validation';
import { createOwnerRequiredResponse, getActiveCompanyApiContext } from '../../_utils/companyApiAuth';

type LocationRouteContext = {
  params: Promise<{
    locationId: string;
  }>;
};

export async function PATCH(request: Request, context: LocationRouteContext) {
  const authContext = await getActiveCompanyApiContext();

  if (!authContext.success) {
    return authContext.response;
  }

  if (!authContext.membership.isOwner) {
    return createOwnerRequiredResponse();
  }

  const payload = await request.json().catch(() => null);
  const validation = validateUpsertLocationRequest(payload);

  if (!validation.success) {
    return NextResponse.json(
      {
        success: false,
        message: validation.message,
      },
      { status: 400 },
    );
  }

  const { locationId } = await context.params;
  const result = await updateLocation(authContext.company.companyId, locationId, validation.data);

  return NextResponse.json(
    {
      success: result.success,
      message: result.message,
      ...(result.success ? { location: result.location } : {}),
    },
    { status: result.status },
  );
}

export async function DELETE(_request: Request, context: LocationRouteContext) {
  const authContext = await getActiveCompanyApiContext();

  if (!authContext.success) {
    return authContext.response;
  }

  if (!authContext.membership.isOwner) {
    return createOwnerRequiredResponse();
  }

  const { locationId } = await context.params;
  const result = await archiveLocation(authContext.company.companyId, locationId);

  return NextResponse.json(
    {
      success: result.success,
      message: result.message,
    },
    { status: result.status },
  );
}
