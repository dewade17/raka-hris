import { NextResponse } from 'next/server';
import { CompanyStatus, MembershipStatus } from '@/generated/prisma/client';
import { getCurrentAuthContext } from '@/server/auth';

export async function getActiveCompanyApiContext() {
  const authContext = await getCurrentAuthContext();

  if (!authContext?.company || !authContext.membership) {
    return {
      success: false as const,
      response: NextResponse.json(
        {
          success: false,
          message: 'Please sign in to access company data.',
        },
        { status: 401 },
      ),
    };
  }

  if (authContext.company.status !== CompanyStatus.ACTIVE || authContext.company.deletedAt || authContext.membership.status !== MembershipStatus.ACTIVE) {
    return {
      success: false as const,
      response: NextResponse.json(
        {
          success: false,
          message: 'This company workspace is not available.',
        },
        { status: 403 },
      ),
    };
  }

  return {
    success: true as const,
    company: authContext.company,
    membership: authContext.membership,
  };
}

export function createOwnerRequiredResponse() {
  return NextResponse.json(
    {
      success: false,
      message: 'Only the company owner can manage organization master data.',
    },
    { status: 403 },
  );
}
