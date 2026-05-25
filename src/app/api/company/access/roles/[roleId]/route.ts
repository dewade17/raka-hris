import { NextResponse } from 'next/server';
import { deleteCompanyRole, updateCompanyRole } from '@/features/auth/permissions/service';
import { getCompanyApiPermissionContext } from '../../../_utils/companyApiAuth';

type CompanyRoleRouteContext = {
  params: Promise<{
    roleId: string;
  }>;
};

export async function PATCH(request: Request, context: CompanyRoleRouteContext) {
  const authContext = await getCompanyApiPermissionContext(
    'access',
    'manageRoles',
    'You do not have permission to update company roles.',
  );

  if (!authContext.success) {
    return authContext.response;
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

  const { roleId } = await context.params;
  const result = await updateCompanyRole(authContext.company.id, roleId, {
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

export async function DELETE(_request: Request, context: CompanyRoleRouteContext) {
  const authContext = await getCompanyApiPermissionContext(
    'access',
    'manageRoles',
    'You do not have permission to delete company roles.',
  );

  if (!authContext.success) {
    return authContext.response;
  }

  const { roleId } = await context.params;
  const result = await deleteCompanyRole(authContext.company.id, roleId);

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
