import { NextResponse } from 'next/server';
import { CompanyStatus, MembershipStatus } from '@/generated/prisma/client';
import { membershipHasPermission } from '@/features/auth/permissions/service';
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
      message: 'You do not have permission to manage organization master data.',
    },
    { status: 403 },
  );
}

export async function getCompanyApiPermissionContext(module: string, action: string, forbiddenMessage?: string) {
  const context = await getActiveCompanyApiContext();

  if (!context.success) {
    return context;
  }

  if (context.membership.isOwner) {
    return context;
  }

  const canAccess = await membershipHasPermission(
    context.membership.membershipId,
    module,
    action,
    context.company.companyId,
  );

  if (!canAccess) {
    return {
      success: false as const,
      response: NextResponse.json(
        {
          success: false,
          message: forbiddenMessage ?? 'You do not have permission to perform this action.',
        },
        { status: 403 },
      ),
    };
  }

  return context;
}
