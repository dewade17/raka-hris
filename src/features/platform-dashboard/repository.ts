import {
  AuthProvider,
  BillingInterval,
  PlatformRole,
  SessionStatus,
  SubscriptionStatus,
} from "@/generated/prisma/client";
import db from "@/lib/db";

export async function countPlatformCompaniesByStatus() {
  return db.company.groupBy({
    by: ["status"],
    where: {
      deletedAt: null,
    },
    _count: {
      _all: true,
    },
  });
}

export async function findRecentPlatformCompanies() {
  return db.company.findMany({
    where: {
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 8,
    select: {
      id: true,
      name: true,
      status: true,
      _count: {
        select: {
          memberships: true,
          departments: true,
        },
      },
      subscriptions: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
        select: {
          status: true,
          plan: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
}

export async function findPlatformSummaryMetrics(now: Date) {
  const [
    totalCompanies,
    totalUsers,
    activeUsers,
    totalMemberships,
    activeSubscriptions,
    deletedCompanies,
  ] = await Promise.all([
    db.company.count({
      where: {
        deletedAt: null,
      },
    }),
    db.user.count(),
    db.user.count({
      where: {
        isActive: true,
      },
    }),
    db.membership.count(),
    db.subscription.count({
      where: {
        status: SubscriptionStatus.ACTIVE,
        OR: [
          {
            currentPeriodEnd: null,
          },
          {
            currentPeriodEnd: {
              gt: now,
            },
          },
        ],
      },
    }),
    db.company.count({
      where: {
        deletedAt: {
          not: null,
        },
      },
    }),
  ]);

  return {
    totalCompanies,
    totalUsers,
    activeUsers,
    totalMemberships,
    activeSubscriptions,
    deletedCompanies,
  };
}

export async function findPlatformUserAccessMetrics(now: Date) {
  const [
    inactiveUsers,
    superAdmins,
    activeSessions,
    revokedSessions,
    googleAccounts,
    verifiedGoogleAccounts,
  ] = await Promise.all([
    db.user.count({
      where: {
        isActive: false,
      },
    }),
    db.user.count({
      where: {
        platformRole: PlatformRole.SUPERADMIN,
      },
    }),
    db.userSession.count({
      where: {
        status: SessionStatus.ACTIVE,
        expiresAt: {
          gt: now,
        },
      },
    }),
    db.userSession.count({
      where: {
        status: SessionStatus.REVOKED,
      },
    }),
    db.userAuthProvider.count({
      where: {
        provider: AuthProvider.GOOGLE,
      },
    }),
    db.userAuthProvider.count({
      where: {
        provider: AuthProvider.GOOGLE,
        emailVerified: true,
      },
    }),
  ]);

  return {
    inactiveUsers,
    superAdmins,
    activeSessions,
    revokedSessions,
    googleAccounts,
    verifiedGoogleAccounts,
  };
}

export async function findPlatformSubscriptionMetrics() {
  const [
    totalPlans,
    activePlans,
    monthlyPlans,
    yearlyPlans,
    subscriptionStatuses,
  ] = await Promise.all([
    db.subscriptionPlan.count(),
    db.subscriptionPlan.count({
      where: {
        isActive: true,
      },
    }),
    db.subscriptionPlan.count({
      where: {
        interval: BillingInterval.MONTHLY,
      },
    }),
    db.subscriptionPlan.count({
      where: {
        interval: BillingInterval.YEARLY,
      },
    }),
    db.subscription.groupBy({
      by: ["status"],
      _count: {
        _all: true,
      },
    }),
  ]);

  return {
    totalPlans,
    activePlans,
    monthlyPlans,
    yearlyPlans,
    subscriptionStatuses,
  };
}

export async function findPlatformRolePermissionMetrics() {
  const [
    totalPermissions,
    totalRoles,
    systemRoles,
    defaultRoles,
    rolePermissionLinks,
    roleAssignments,
    rolesWithoutPermissions,
    membersWithoutRole,
    permissionModules,
  ] = await Promise.all([
    db.permission.count(),
    db.companyRole.count(),
    db.companyRole.count({
      where: {
        isSystem: true,
      },
    }),
    db.companyRole.count({
      where: {
        isDefault: true,
      },
    }),
    db.companyRolePermission.count(),
    db.membershipRole.count(),
    db.companyRole.count({
      where: {
        rolePermissions: {
          none: {},
        },
      },
    }),
    db.membership.count({
      where: {
        roles: {
          none: {},
        },
      },
    }),
    db.permission.groupBy({
      by: ["module"],
      _count: {
        _all: true,
      },
      orderBy: {
        module: "asc",
      },
    }),
  ]);

  return {
    totalPermissions,
    totalRoles,
    systemRoles,
    defaultRoles,
    rolePermissionLinks,
    roleAssignments,
    rolesWithoutPermissions,
    membersWithoutRole,
    permissionModules,
  };
}

export async function findPlatformOrganizationMetrics() {
  const [
    departments,
    activeDepartments,
    positions,
    activePositions,
    locations,
    activeLocations,
    companiesWithLocations,
  ] = await Promise.all([
    db.department.count({
      where: {
        deletedAt: null,
      },
    }),
    db.department.count({
      where: {
        deletedAt: null,
        isActive: true,
      },
    }),
    db.position.count({
      where: {
        deletedAt: null,
      },
    }),
    db.position.count({
      where: {
        deletedAt: null,
        isActive: true,
      },
    }),
    db.location.count({
      where: {
        deletedAt: null,
      },
    }),
    db.location.count({
      where: {
        deletedAt: null,
        isActive: true,
      },
    }),
    db.company.count({
      where: {
        deletedAt: null,
        locations: {
          some: {
            deletedAt: null,
          },
        },
      },
    }),
  ]);

  return {
    departments,
    activeDepartments,
    positions,
    activePositions,
    locations,
    activeLocations,
    companiesWithLocations,
  };
}
