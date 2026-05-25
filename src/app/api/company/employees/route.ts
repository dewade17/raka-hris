import { NextResponse } from 'next/server';
import { createCompanyEmployee } from '@/features/company/employees/service';
import { validateCreateCompanyEmployeeRequest } from '@/features/company/employees/validation';
import { getCompanyApiPermissionContext } from '../_utils/companyApiAuth';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const context = await getCompanyApiPermissionContext(
    'employees',
    'create',
    'You do not have permission to create employees.',
  );

  if (!context.success) {
    return context.response;
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

  const result = await createCompanyEmployee(context.company.id, context.company.name, validation.data);

  return NextResponse.json(
    {
      success: result.success,
      message: result.message,
      ...(result.success ? { id: result.id } : {}),
    },
    { status: result.status },
  );
}
