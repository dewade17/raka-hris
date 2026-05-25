import { NextResponse } from 'next/server';
import { createPosition, getCompanyPositions } from '@/features/company/positions/service';
import { validateUpsertPositionRequest } from '@/features/company/positions/validation';
import { getCompanyApiPermissionContext } from '../_utils/companyApiAuth';

export async function GET() {
  const context = await getCompanyApiPermissionContext('positions', 'view');

  if (!context.success) {
    return context.response;
  }

  const data = await getCompanyPositions(context.company.id);

  return NextResponse.json({
    success: true,
    ...data,
  });
}

export async function POST(request: Request) {
  const context = await getCompanyApiPermissionContext(
    'positions',
    'create',
    'You do not have permission to create positions.',
  );

  if (!context.success) {
    return context.response;
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

  const result = await createPosition(context.company.id, validation.data);

  return NextResponse.json(
    {
      success: result.success,
      message: result.message,
      ...(result.success ? { position: result.position } : {}),
    },
    { status: result.status },
  );
}
