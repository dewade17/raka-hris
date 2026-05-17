import { NextResponse } from 'next/server';
import { terminateCompanyEmployee, updateCompanyEmployee } from '@/features/company/employees/service';
import { validateTerminateCompanyEmployeeRequest, validateUpdateCompanyEmployeeRequest } from '@/features/company/employees/validation';
import { getActiveCompanyApiContext } from '../../_utils/companyApiAuth';

type EmployeeRouteContext = {
  params: Promise<{
    membershipId: string;
  }>;
};

export async function PATCH(request: Request, context: EmployeeRouteContext) {
  const authContext = await getActiveCompanyApiContext();

  if (!authContext.success) {
    return authContext.response;
  }

  if (!authContext.membership.isOwner) {
    return NextResponse.json(
      {
        success: false,
        message: 'Only the company owner can update employees.',
      },
      { status: 403 },
    );
  }

  const payload = await request.json().catch(() => null);
  const validation = validateUpdateCompanyEmployeeRequest(payload);

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
  const result = await updateCompanyEmployee(authContext.company.companyId, membershipId, validation.data);

  return NextResponse.json(
    {
      success: result.success,
      message: result.message,
    },
    { status: result.status },
  );
}

export async function DELETE(request: Request, context: EmployeeRouteContext) {
  const authContext = await getActiveCompanyApiContext();

  if (!authContext.success) {
    return authContext.response;
  }

  if (!authContext.membership.isOwner) {
    return NextResponse.json(
      {
        success: false,
        message: 'Only the company owner can terminate employees.',
      },
      { status: 403 },
    );
  }

  const payload = await request.json().catch(() => null);
  const validation = validateTerminateCompanyEmployeeRequest(payload);

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
  const result = await terminateCompanyEmployee(authContext.company.companyId, membershipId, authContext.membership.userId, validation.data);

  return NextResponse.json(
    {
      success: result.success,
      message: result.message,
    },
    { status: result.status },
  );
}
