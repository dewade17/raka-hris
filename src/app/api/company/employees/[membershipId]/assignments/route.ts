import { NextResponse } from 'next/server';
import { updateCompanyEmployeeAssignment } from '@/features/company/employees/service';
import { validateUpdateEmployeeAssignmentRequest } from '@/features/company/employees/validation';
import { getCompanyApiPermissionContext } from '../../../_utils/companyApiAuth';

type EmployeeAssignmentRouteContext = {
  params: Promise<{
    membershipId: string;
  }>;
};

export async function PATCH(request: Request, context: EmployeeAssignmentRouteContext) {
  const authContext = await getCompanyApiPermissionContext(
    'employees',
    'assign',
    'You do not have permission to update employee assignments.',
  );

  if (!authContext.success) {
    return authContext.response;
  }

  const payload = await request.json().catch(() => null);
  const validation = validateUpdateEmployeeAssignmentRequest(payload);

  if (!validation.success) {
    return NextResponse.json(
      {
        success: false,
        message: validation.message,
      },
      { status: 400 },
    );
  }

  const { membershipId } = await context.params;
  const result = await updateCompanyEmployeeAssignment(authContext.company.companyId, membershipId, validation.data);

  return NextResponse.json(
    {
      success: result.success,
      message: result.message,
    },
    { status: result.status },
  );
}
