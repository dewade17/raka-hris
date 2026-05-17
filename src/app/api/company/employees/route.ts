import { NextResponse } from 'next/server';
import { createCompanyEmployee } from '@/features/company/employees/service';
import { validateCreateCompanyEmployeeRequest } from '@/features/company/employees/validation';
import { getActiveCompanyApiContext } from '../_utils/companyApiAuth';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const context = await getActiveCompanyApiContext();

  if (!context.success) {
    return context.response;
  }

  if (!context.membership.isOwner) {
    return NextResponse.json(
      {
        success: false,
        message: 'Only the company owner can create employees.',
      },
      { status: 403 },
    );
  }

  const payload = await request.json().catch(() => null);
  const validation = validateCreateCompanyEmployeeRequest(payload);

  if (!validation.success) {
    return NextResponse.json(
      {
        success: false,
        message: validation.message,
      },
      { status: 400 },
    );
  }

  const result = await createCompanyEmployee(context.company.companyId, context.company.name, validation.data);

  return NextResponse.json(
    {
      success: result.success,
      message: result.message,
      ...(result.success ? { membershipId: result.membershipId } : {}),
    },
    { status: result.status },
  );
}
