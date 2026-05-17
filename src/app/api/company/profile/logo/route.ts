import { NextResponse, type NextRequest } from "next/server";
import { CompanyStatus, MembershipStatus } from "@/generated/prisma/client";
import {
  SupabaseStorageConfigurationError,
  getStorageObject,
  uploadStorageObject,
} from "@/lib/supabase-storage";
import { membershipHasPermission } from "@/features/auth/permissions/service";
import { getCurrentAuthContext } from "@/server/auth";

const MAX_COMPANY_LOGO_SIZE_BYTES = 2 * 1024 * 1024;
const allowedLogoMimeTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/svg+xml", "svg"],
]);

type CompanyLogoAccessResult =
  | {
      success: true;
      canUpdate: boolean;
      companyId: string;
    }
  | {
      success: false;
      response: NextResponse;
    };

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const authResult = await validateCompanyLogoAccess();

  if (!authResult.success) {
    return authResult.response;
  }

  const path = request.nextUrl.searchParams.get("path");
  const companyLogoPathPrefix = getCompanyLogoPathPrefix(authResult.companyId);

  if (!path || !path.startsWith(companyLogoPathPrefix)) {
    return NextResponse.json(
      {
        success: false,
        message: "Company logo could not be found.",
      },
      { status: 404 },
    );
  }

  try {
    const storageResponse = await getStorageObject(path);
    const contentType = storageResponse.headers.get("content-type") ?? "application/octet-stream";

    return new Response(storageResponse.body, {
      status: 200,
      headers: {
        "Cache-Control": "private, max-age=300",
        "Content-Type": contentType,
      },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Company logo could not be loaded.",
      },
      { status: 404 },
    );
  }
}

export async function POST(request: NextRequest) {
  const authResult = await validateCompanyLogoAccess();

  if (!authResult.success) {
    return authResult.response;
  }

  if (!authResult.canUpdate) {
    return NextResponse.json(
      {
        success: false,
        message: "You do not have permission to upload a company logo.",
      },
      { status: 403 },
    );
  }

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      {
        success: false,
        message: "Please choose a logo file to upload.",
      },
      { status: 400 },
    );
  }

  const validationMessage = validateCompanyLogoFile(file);

  if (validationMessage) {
    return NextResponse.json(
      {
        success: false,
        message: validationMessage,
      },
      { status: 400 },
    );
  }

  const extension = allowedLogoMimeTypes.get(file.type) ?? "png";
  const objectPath = [
    getCompanyLogoPathPrefix(authResult.companyId),
    `${crypto.randomUUID()}.${extension}`,
  ].join("");

  try {
    const uploadedLogo = await uploadStorageObject({
      path: objectPath,
      file,
      contentType: file.type,
    });

    const logoUrl = new URL(
      `/api/company/profile/logo?path=${encodeURIComponent(uploadedLogo.path)}`,
      request.url,
    ).toString();

    return NextResponse.json({
      success: true,
      message: "Company logo uploaded successfully.",
      logoUrl,
      path: uploadedLogo.path,
    });
  } catch (error) {
    const message =
      error instanceof SupabaseStorageConfigurationError
        ? error.message
        : "Company logo could not be uploaded. Please try again.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 },
    );
  }
}

async function validateCompanyLogoAccess(): Promise<CompanyLogoAccessResult> {
  const authContext = await getCurrentAuthContext();

  if (!authContext?.company || !authContext.membership) {
    return {
      success: false,
      response: NextResponse.json(
        {
          success: false,
          message: "Please sign in to access the company logo.",
        },
        { status: 401 },
      ),
    };
  }

  if (
    authContext.company.status !== CompanyStatus.ACTIVE ||
    authContext.company.deletedAt ||
    authContext.membership.status !== MembershipStatus.ACTIVE
  ) {
    return {
      success: false,
      response: NextResponse.json(
        {
          success: false,
          message: "This company profile is not available.",
        },
        { status: 403 },
      ),
    };
  }

  return {
    success: true,
    canUpdate:
      authContext.membership.isOwner ||
      (await membershipHasPermission(
        authContext.membership.membershipId,
        "companyProfile",
        "uploadLogo",
        authContext.company.companyId,
      )),
    companyId: authContext.company.companyId,
  };
}

function getCompanyLogoPathPrefix(companyId: string) {
  return `companies/${companyId}/logos/`;
}

function validateCompanyLogoFile(file: File) {
  if (file.size <= 0) {
    return "Please choose a logo file that is not empty.";
  }

  if (file.size > MAX_COMPANY_LOGO_SIZE_BYTES) {
    return "Company logo must be 2 MB or smaller.";
  }

  if (!allowedLogoMimeTypes.has(file.type)) {
    return "Company logo must be a PNG, JPG, WebP, or SVG file.";
  }

  return null;
}
