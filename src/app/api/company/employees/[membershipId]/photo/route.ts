import { NextResponse, type NextRequest } from 'next/server';
import {
  SupabaseStorageConfigurationError,
  getStorageObject,
  uploadStorageObject,
} from '@/lib/supabase-storage';
import { findCompanyEmployeeForManagement } from '@/features/company/employees/repository';
import { getCompanyApiPermissionContext } from '../../../_utils/companyApiAuth';

const MAX_EMPLOYEE_PHOTO_SIZE_BYTES = 2 * 1024 * 1024;
const allowedEmployeePhotoMimeTypes = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
]);

type EmployeePhotoRouteContext = {
  params: Promise<{
    membershipId: string;
  }>;
};

export const runtime = 'nodejs';

export async function GET(request: NextRequest, context: EmployeePhotoRouteContext) {
  const authContext = await getCompanyApiPermissionContext('employees', 'view');

  if (!authContext.success) {
    return authContext.response;
  }

  const { membershipId } = await context.params;
  const path = request.nextUrl.searchParams.get('path');
  const employeePhotoPathPrefix = getEmployeePhotoPathPrefix(authContext.company.id, membershipId);

  if (!path || !path.startsWith(employeePhotoPathPrefix)) {
    return NextResponse.json(
      {
        success: false,
        message: 'Employee photo could not be found.',
      },
      { status: 404 },
    );
  }

  try {
    const storageResponse = await getStorageObject(path);
    const contentType = storageResponse.headers.get('content-type') ?? 'application/octet-stream';

    return new Response(storageResponse.body, {
      status: 200,
      headers: {
        'Cache-Control': 'private, max-age=300',
        'Content-Type': contentType,
      },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: 'Employee photo could not be loaded.',
      },
      { status: 404 },
    );
  }
}

export async function POST(request: NextRequest, context: EmployeePhotoRouteContext) {
  const authContext = await getCompanyApiPermissionContext(
    'employees',
    'uploadPhoto',
    'You do not have permission to upload employee photos.',
  );

  if (!authContext.success) {
    return authContext.response;
  }

  const { membershipId } = await context.params;
  const employee = await findCompanyEmployeeForManagement(authContext.company.id, membershipId);

  if (!employee || employee.isOwner || employee.status === 'TERMINATED') {
    return NextResponse.json(
      {
        success: false,
        message: 'Employee photo cannot be uploaded for this record.',
      },
      { status: 400 },
    );
  }

  const formData = await request.formData().catch(() => null);
  const file = formData?.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json(
      {
        success: false,
        message: 'Please choose a profile photo to upload.',
      },
      { status: 400 },
    );
  }

  const validationMessage = validateEmployeePhotoFile(file);

  if (validationMessage) {
    return NextResponse.json(
      {
        success: false,
        message: validationMessage,
      },
      { status: 400 },
    );
  }

  const extension = allowedEmployeePhotoMimeTypes.get(file.type) ?? 'png';
  const objectPath = [
    getEmployeePhotoPathPrefix(authContext.company.id, membershipId),
    `${crypto.randomUUID()}.${extension}`,
  ].join('');

  try {
    const uploadedPhoto = await uploadStorageObject({
      path: objectPath,
      file,
      contentType: file.type,
    });

    const photoUrl = new URL(
      `/api/company/employees/${encodeURIComponent(membershipId)}/photo?path=${encodeURIComponent(uploadedPhoto.path)}`,
      request.url,
    ).toString();

    return NextResponse.json({
      success: true,
      message: 'Profile photo uploaded successfully.',
      photoUrl,
      path: uploadedPhoto.path,
    });
  } catch (error) {
    const message =
      error instanceof SupabaseStorageConfigurationError
        ? error.message
        : 'Profile photo could not be uploaded. Please try again.';

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 },
    );
  }
}

function getEmployeePhotoPathPrefix(companyId: string, membershipId: string) {
  return `companies/${companyId}/employees/${membershipId}/profile-photos/`;
}

function validateEmployeePhotoFile(file: File) {
  if (file.size <= 0) {
    return 'Please choose a profile photo that is not empty.';
  }

  if (file.size > MAX_EMPLOYEE_PHOTO_SIZE_BYTES) {
    return 'Profile photo must be 2 MB or smaller.';
  }

  if (!allowedEmployeePhotoMimeTypes.has(file.type)) {
    return 'Profile photo must be a PNG, JPG, or WebP file.';
  }

  return null;
}
