import { forbidden, unauthorized } from "next/navigation";
import db from "@/lib/db";
import {
  CompanyStatus,
  MembershipStatus,
  PlatformRole,
} from "@/generated/prisma/client";
import { getCurrentSession } from "./session";

export async function getCurrentAuthContext() {
  const session = await getCurrentSession();

  if (!session) {
    return null;
  }

  return {
    session,
    user: session.user,
    membership: session.membership,
    company: session.membership?.company ?? null,
  };
}

export async function requireUser() {
  const context = await getCurrentAuthContext();

  if (!context) {
    unauthorized();
  }

  return context;
}

export async function requireActiveCompanyMembership(companyId?: string) {
  const context = await requireUser();
  const { company, membership } = context;

  if (!membership || !company) {
    forbidden();
  }

  if (companyId && membership.companyId !== companyId) {
    forbidden();
  }

  if (
    membership.status !== MembershipStatus.ACTIVE ||
    company.status !== CompanyStatus.ACTIVE ||
    company.deletedAt
  ) {
    forbidden();
  }

  return {
    ...context,
    company,
    membership,
  };
}

export async function requirePlatformAdmin() {
  const context = await requireUser();

  if (context.user.platformRole !== PlatformRole.SUPERADMIN) {
    forbidden();
  }

  return context;
}

export async function requirePermission(
  module: string,
  action: string,
  companyId?: string,
) {
  const context = await requireActiveCompanyMembership(companyId);

  if (
    context.user.platformRole === PlatformRole.SUPERADMIN ||
    context.membership.isOwner
  ) {
    return context;
  }

  const membershipRole = await db.membershipRole.findFirst({
    where: {
      membershipId: context.membership.membershipId,
      role: {
        companyId: context.company.companyId,
        rolePermissions: {
          some: {
            permission: {
              module,
              action,
            },
          },
        },
      },
    },
    select: {
      membershipRoleId: true,
    },
  });

  if (!membershipRole) {
    forbidden();
  }

  return context;
}
