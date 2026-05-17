import { NextResponse } from 'next/server';
import { updateCompanyMemberRoles } from '@/features/auth/permissions/service';
import { getCompanyApiPermissionContext } from '../../../../_utils/companyApiAuth';

type CompanyMemberRolesRouteContext = {
  params: Promise<{
    membershipId: string;
  }>;
};

export async function PATCH(request: Request, context: CompanyMemberRolesRouteContext) {
  const authContext = await getCompanyApiPermissionContext(
    'access',
    'assignRoles',
    'You do not have permission to assign employee roles.',
  );

  if (!authContext.success) {
    return authContext.response;
  }

  const payload = await request.json().catch(() => null);

  if (!isRoleAssignmentPayload(payload)) {
    return NextResponse.json(
      {
        success: false,
        message: 'Please choose valid roles for this employee.',
      },
      { status: 400 },
    );
  }

  const { membershipId } = await context.params;
  const result = await updateCompanyMemberRoles(authContext.company.companyId, membershipId, payload.roleIds);

  return NextResponse.json(
    {
      success: result.success,
      message: result.message,
    },
    { status: result.status },
  );
}

function isRoleAssignmentPayload(payload: unknown): payload is { roleIds: string[] } {
  return Boolean(
    payload &&
      typeof payload === 'object' &&
      'roleIds' in payload &&
      Array.isArray(payload.roleIds) &&
      payload.roleIds.every((roleId) => typeof roleId === 'string'),
  );
}
