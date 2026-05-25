import { NextResponse } from 'next/server';
import { updateCompanyRolePermissions } from '@/features/auth/permissions/service';
import { getCompanyApiPermissionContext } from '../../../../_utils/companyApiAuth';

type CompanyRolePermissionsRouteContext = {
  params: Promise<{
    roleId: string;
  }>;
};

export async function PATCH(request: Request, context: CompanyRolePermissionsRouteContext) {
  const authContext = await getCompanyApiPermissionContext(
    'access',
    'manageRoles',
    'You do not have permission to update role permissions.',
  );

  if (!authContext.success) {
    return authContext.response;
  }

  const payload = await request.json().catch(() => null);

  if (!isPermissionPayload(payload)) {
    return NextResponse.json(
      {
        success: false,
        message: 'Please choose valid permissions for this role.',
      },
      { status: 400 },
    );
  }

  const { roleId } = await context.params;
  const result = await updateCompanyRolePermissions(authContext.company.id, roleId, payload.permissionKeys);

  return NextResponse.json(
    {
      success: result.success,
      message: result.message,
    },
    { status: result.status },
  );
}

function isPermissionPayload(payload: unknown): payload is { permissionKeys: string[] } {
  return Boolean(
    payload &&
      typeof payload === 'object' &&
      'permissionKeys' in payload &&
      Array.isArray(payload.permissionKeys) &&
      payload.permissionKeys.every((permissionKey) => typeof permissionKey === 'string'),
  );
}
