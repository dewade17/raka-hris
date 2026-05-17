import { NextResponse } from 'next/server';
import { createCompanyRole } from '@/features/auth/permissions/service';
import { getCompanyApiPermissionContext } from '../../_utils/companyApiAuth';

export async function POST(request: Request) {
  const context = await getCompanyApiPermissionContext(
    'access',
    'manageRoles',
    'You do not have permission to create company roles.',
  );

  if (!context.success) {
    return context.response;
  }

  const payload = await request.json().catch(() => null);

  if (!isRolePayload(payload)) {
    return NextResponse.json(
      {
        success: false,
        message: 'Please provide a role name.',
      },
      { status: 400 },
    );
  }

  const result = await createCompanyRole(context.company.companyId, {
    name: payload.name,
    description: payload.description,
  });

  return NextResponse.json(
    {
      success: result.success,
      message: result.message,
    },
    { status: result.status },
  );
}

function isRolePayload(payload: unknown): payload is { name: string; description?: string | null } {
  return Boolean(
    payload &&
      typeof payload === 'object' &&
      'name' in payload &&
      typeof payload.name === 'string' &&
      (!('description' in payload) || typeof payload.description === 'string' || payload.description === null),
  );
}
