import { NextResponse } from 'next/server';
import { updateCompanyProfile } from '@/features/company/profile/service';
import { validateUpdateCompanyProfileRequest } from '@/features/company/profile/validation';
import { getCompanyApiPermissionContext } from '../_utils/companyApiAuth';

export async function PATCH(request: Request) {
  const authContext = await getCompanyApiPermissionContext(
    'companyProfile',
    'update',
    'You do not have permission to update the company profile.',
  );

  if (!authContext.success) {
    return authContext.response;
  }

  const payload = await request.json().catch(() => null);
  const validation = validateUpdateCompanyProfileRequest(payload);

  if (!validation.success) {
    return NextResponse.json(
      {
        success: false,
        message: validation.message,
      },
      { status: 400 },
    );
  }

  const result = await updateCompanyProfile(authContext.company.id, validation.data);

  return NextResponse.json(
    {
      success: result.success,
      message: result.message,
      ...(result.success ? { company: result.company } : {}),
    },
    { status: result.status },
  );
}
