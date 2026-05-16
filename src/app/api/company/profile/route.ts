import { NextResponse } from "next/server";
import { CompanyStatus, MembershipStatus } from "@/generated/prisma/client";
import { updateCompanyProfile } from "@/features/company/service";
import { validateUpdateCompanyProfileRequest } from "@/features/company/validation";
import { getCurrentAuthContext } from "@/server/auth";

export async function PATCH(request: Request) {
  const authContext = await getCurrentAuthContext();

  if (!authContext?.company || !authContext.membership) {
    return NextResponse.json(
      {
        success: false,
        message: "Please sign in to update the company profile.",
      },
      { status: 401 },
    );
  }

  if (
    authContext.company.status !== CompanyStatus.ACTIVE ||
    authContext.company.deletedAt ||
    authContext.membership.status !== MembershipStatus.ACTIVE
  ) {
    return NextResponse.json(
      {
        success: false,
        message: "This company profile is not available for updates.",
      },
      { status: 403 },
    );
  }

  if (!authContext.membership.isOwner) {
    return NextResponse.json(
      {
        success: false,
        message: "Only the company owner can update the company profile.",
      },
      { status: 403 },
    );
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

  const result = await updateCompanyProfile(
    authContext.company.companyId,
    validation.data,
  );

  return NextResponse.json(
    {
      success: result.success,
      message: result.message,
      ...(result.success ? { company: result.company } : {}),
    },
    { status: result.status },
  );
}
