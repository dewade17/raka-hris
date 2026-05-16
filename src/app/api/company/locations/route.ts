import { NextResponse } from 'next/server';
import { createLocation, getCompanyLocations } from '@/features/company/locations/service';
import { validateUpsertLocationRequest } from '@/features/company/locations/validation';
import { createOwnerRequiredResponse, getActiveCompanyApiContext } from '../_utils/companyApiAuth';

export async function GET() {
  const context = await getActiveCompanyApiContext();

  if (!context.success) {
    return context.response;
  }

  const data = await getCompanyLocations(context.company.companyId);

  return NextResponse.json({
    success: true,
    ...data,
  });
}

export async function POST(request: Request) {
  const context = await getActiveCompanyApiContext();

  if (!context.success) {
    return context.response;
  }

  if (!context.membership.isOwner) {
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

  const result = await createLocation(context.company.companyId, validation.data);

  return NextResponse.json(
    {
      success: result.success,
      message: result.message,
      ...(result.success ? { location: result.location } : {}),
    },
    { status: result.status },
  );
}
