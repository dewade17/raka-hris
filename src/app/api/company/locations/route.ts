import { NextResponse, type NextRequest } from 'next/server';
import { createLocation, getCompanyLocations } from '@/features/company/locations/service';
import { validateLocationListQuery, validateUpsertLocationRequest } from '@/features/company/locations/validation';
import { getCompanyApiPermissionContext } from '../_utils/companyApiAuth';

export async function GET(request: NextRequest) {
  const context = await getCompanyApiPermissionContext('locations', 'view');

  if (!context.success) {
    return context.response;
  }

  const listQuery = validateLocationListQuery(request.nextUrl.searchParams);
  const data = await getCompanyLocations(context.company.companyId, listQuery);

  return NextResponse.json({
    success: true,
    ...data,
  });
}

export async function POST(request: Request) {
  const context = await getCompanyApiPermissionContext(
    'locations',
    'create',
    'You do not have permission to create locations.',
  );

  if (!context.success) {
    return context.response;
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
