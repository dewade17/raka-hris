import { NextResponse } from 'next/server';
import { updateCompanyEmployeeAssignment } from '@/features/company/employees/service';
import { validateUpdateEmployeeAssignmentRequest } from '@/features/company/employees/validation';
import { getActiveCompanyApiContext } from '../../../_utils/companyApiAuth';

type EmployeeAssignmentRouteContext = {
  params: Promise<{
    membershipId: string;
  }>;
};

export async function PATCH(request: Request, context: EmployeeAssignmentRouteContext) {
  const authContext = await getActiveCompanyApiContext();

  if (!authContext.success) {
    return authContext.response;
  }

  if (!authContext.membership.isOwner) {
    return NextResponse.json(
      {
        success: false,
        message: 'Only the company owner can update employee assignments.',
      },
      { status: 403 },
    );
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
