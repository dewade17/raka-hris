import { NextResponse } from 'next/server';
import { createDepartment, getCompanyDepartments } from '@/features/company/departments/service';
import { validateUpsertDepartmentRequest } from '@/features/company/departments/validation';
import { getCompanyApiPermissionContext } from '../_utils/companyApiAuth';

export async function GET() {
  const context = await getCompanyApiPermissionContext('departments', 'view');

  if (!context.success) {
    return context.response;
  }

  const data = await getCompanyDepartments(context.company.companyId);

  return NextResponse.json({
    success: true,
    ...data,
  });
}

export async function POST(request: Request) {
  const context = await getCompanyApiPermissionContext(
    'departments',
    'create',
    'You do not have permission to create departments.',
  );

  if (!context.success) {
    return context.response;
  }

  const payload = await request.json().catch(() => null);
  const validation = validateUpsertDepartmentRequest(payload);

  if (!validation.success) {
    return NextResponse.json(
      {
        success: false,
        message: validation.message,
      },
      { status: 400 },
    );
  }

  const result = await createDepartment(context.company.companyId, validation.data);

  return NextResponse.json(
    {
      success: result.success,
      message: result.message,
      ...(result.success ? { department: result.department } : {}),
    },
    { status: result.status },
  );
}
