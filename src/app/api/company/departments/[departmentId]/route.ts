import { NextResponse } from 'next/server';
import { archiveDepartment, updateDepartment } from '@/features/company/departments/service';
import { validateUpsertDepartmentRequest } from '@/features/company/departments/validation';
import { getCompanyApiPermissionContext } from '../../_utils/companyApiAuth';

type DepartmentRouteContext = {
  params: Promise<{
    departmentId: string;
  }>;
};

export async function PATCH(request: Request, context: DepartmentRouteContext) {
  const authContext = await getCompanyApiPermissionContext(
    'departments',
    'update',
    'You do not have permission to update departments.',
  );

  if (!authContext.success) {
    return authContext.response;
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

  const { departmentId } = await context.params;
  const result = await updateDepartment(authContext.company.companyId, departmentId, validation.data);

  return NextResponse.json(
    {
      success: result.success,
      message: result.message,
      ...(result.success ? { department: result.department } : {}),
    },
    { status: result.status },
  );
}

export async function DELETE(_request: Request, context: DepartmentRouteContext) {
  const authContext = await getCompanyApiPermissionContext(
    'departments',
    'archive',
    'You do not have permission to archive departments.',
  );

  if (!authContext.success) {
    return authContext.response;
  }

  const { departmentId } = await context.params;
  const result = await archiveDepartment(authContext.company.companyId, departmentId);

  return NextResponse.json(
    {
      success: result.success,
      message: result.message,
    },
    { status: result.status },
  );
}
