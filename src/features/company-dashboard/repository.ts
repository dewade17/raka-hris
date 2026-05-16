import {
  AuthProvider,
  MembershipStatus,
  SessionStatus,
} from "@/generated/prisma/client";
import db from "@/lib/db";

export async function findCompanyDashboardRecord(companyId: string) {
  return db.company.findUnique({
    where: {
      companyId,
    },
    select: {
      companyId: true,
      name: true,
      email: true,
      phone: true,
      logoUrl: true,
      addressLine1: true,
      city: true,
      province: true,
      timezone: true,
      status: true,
      subscriptions: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
        select: {
          status: true,
          seatLimit: true,
          pricePerUserSnapshot: true,
          currencySnapshot: true,
          trialEndsAt: true,
          currentPeriodEnd: true,
          plan: {
            select: {
              name: true,
              interval: true,
            },
          },
        },
      },
    },
  });
}

export async function countCompanyMembershipsByStatus(companyId: string) {
  return db.membership.groupBy({
    by: ["status"],
    where: {
      companyId,
    },
    _count: {
      _all: true,
    },
  });
}

export async function countCompanyMembers(companyId: string) {
  return db.membership.count({
    where: {
      companyId,
    },
  });
}

export async function countCompanyMembersWithoutRole(companyId: string) {
  return db.membership.count({
    where: {
      companyId,
      roles: {
        none: {},
      },
    },
  });
}

export async function countCompanyEmployeeProfiles(companyId: string) {
  return db.employeeProfile.count({
    where: {
      deletedAt: null,
      membership: {
        companyId,
      },
    },
  });
}

export async function countIncompleteCompanyEmployeeProfiles(companyId: string) {
  return db.employeeProfile.count({
    where: {
      deletedAt: null,
      membership: {
        companyId,
      },
      OR: [
        { employeeNumber: null },
        { phone: null },
        { birthDate: null },
        { gender: null },
        { employmentType: null },
        { hireDate: null },
        { addressLine1: null },
      ],
    },
  });
}

export async function countCompanyNewMembersSince(companyId: string, since: Date) {
  return db.membership.count({
    where: {
      companyId,
      joinedAt: {
        gte: since,
      },
    },
  });
}

export async function countCompanyProbationEndingBetween(
  companyId: string,
  startsAt: Date,
  endsAt: Date,
) {
  return db.employeeProfile.count({
    where: {
      deletedAt: null,
      probationEndDate: {
        gte: startsAt,
        lte: endsAt,
      },
      membership: {
        companyId,
        status: MembershipStatus.ACTIVE,
      },
    },
  });
}

export async function findRecentCompanyMembers(companyId: string) {
  return db.membership.findMany({
    where: {
      companyId,
    },
    orderBy: {
      joinedAt: "desc",
    },
    take: 5,
    select: {
      loginId: true,
      status: true,
      joinedAt: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      employeeProfile: {
        select: {
          employeeNumber: true,
          employmentType: true,
        },
      },
    },
  });
}

export async function findCompanyOrganizationMetrics(companyId: string) {
  const [
    totalDepartments,
    activeDepartments,
    totalPositions,
    activePositions,
    totalLocations,
    activeLocations,
    topDepartments,
    topPositions,
    locations,
  ] = await Promise.all([
    db.department.count({
      where: {
        companyId,
        deletedAt: null,
      },
    }),
    db.department.count({
      where: {
        companyId,
        deletedAt: null,
        isActive: true,
      },
    }),
    db.position.count({
      where: {
        companyId,
        deletedAt: null,
      },
    }),
    db.position.count({
      where: {
        companyId,
        deletedAt: null,
        isActive: true,
      },
    }),
    db.location.count({
      where: {
        companyId,
        deletedAt: null,
      },
    }),
    db.location.count({
      where: {
        companyId,
        deletedAt: null,
        isActive: true,
      },
    }),
    db.department.findMany({
      where: {
        companyId,
        deletedAt: null,
      },
      orderBy: {
        name: "asc",
      },
      take: 5,
      select: {
        name: true,
        isActive: true,
        _count: {
          select: {
            employeeLinks: true,
          },
        },
      },
    }),
    db.position.findMany({
      where: {
        companyId,
        deletedAt: null,
      },
      orderBy: {
        name: "asc",
      },
      take: 5,
      select: {
        name: true,
        isActive: true,
        _count: {
          select: {
            employeeLinks: true,
          },
        },
      },
    }),
    db.location.findMany({
      where: {
        companyId,
        deletedAt: null,
      },
      orderBy: {
        name: "asc",
      },
      take: 5,
      select: {
        name: true,
        city: true,
        province: true,
        isActive: true,
      },
    }),
  ]);

  return {
    totalDepartments,
    activeDepartments,
    totalPositions,
    activePositions,
    totalLocations,
    activeLocations,
    topDepartments,
    topPositions,
    locations,
  };
}

export async function findCompanyAccessMetrics(companyId: string) {
  const [
    totalRoles,
    systemRoles,
    defaultRoles,
    permissions,
    rolePermissionLinks,
    memberRoleAssignments,
    rolesWithoutPermissions,
    topRoles,
  ] = await Promise.all([
    db.companyRole.count({
      where: {
        companyId,
      },
    }),
    db.companyRole.count({
      where: {
        companyId,
        isSystem: true,
      },
    }),
    db.companyRole.count({
      where: {
        companyId,
        isDefault: true,
      },
    }),
    db.permission.count(),
    db.companyRolePermission.count({
      where: {
        role: {
          companyId,
        },
      },
    }),
    db.membershipRole.count({
      where: {
        role: {
          companyId,
        },
      },
    }),
    db.companyRole.count({
      where: {
        companyId,
        rolePermissions: {
          none: {},
        },
      },
    }),
    db.companyRole.findMany({
      where: {
        companyId,
      },
      orderBy: {
        name: "asc",
      },
      take: 5,
      select: {
        name: true,
        isDefault: true,
        isSystem: true,
        _count: {
          select: {
            membershipRoles: true,
            rolePermissions: true,
          },
        },
      },
    }),
  ]);

  return {
    totalRoles,
    systemRoles,
    defaultRoles,
    permissions,
    rolePermissionLinks,
    memberRoleAssignments,
    rolesWithoutPermissions,
    topRoles,
  };
}

export async function findCompanySessionMetrics(companyId: string, now: Date, soon: Date) {
  const [
    activeSessions,
    revokedSessions,
    expiringSoon,
    googleAccounts,
    verifiedGoogleAccounts,
    recentSessions,
  ] = await Promise.all([
    db.userSession.count({
      where: {
        status: SessionStatus.ACTIVE,
        expiresAt: {
          gt: now,
        },
        membership: {
          companyId,
        },
      },
    }),
    db.userSession.count({
      where: {
        status: SessionStatus.REVOKED,
        membership: {
          companyId,
        },
      },
    }),
    db.userSession.count({
      where: {
        status: SessionStatus.ACTIVE,
        expiresAt: {
          gt: now,
          lte: soon,
        },
        membership: {
          companyId,
        },
      },
    }),
    db.userAuthProvider.count({
      where: {
        provider: AuthProvider.GOOGLE,
        user: {
          memberships: {
            some: {
              companyId,
            },
          },
        },
      },
    }),
    db.userAuthProvider.count({
      where: {
        provider: AuthProvider.GOOGLE,
        emailVerified: true,
        user: {
          memberships: {
            some: {
              companyId,
            },
          },
        },
      },
    }),
    db.userSession.findMany({
      where: {
        membership: {
          companyId,
        },
      },
      orderBy: [
        {
          lastUsedAt: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
      take: 5,
      select: {
        status: true,
        deviceName: true,
        platform: true,
        ipAddress: true,
        lastUsedAt: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    }),
  ]);

  return {
    activeSessions,
    revokedSessions,
    expiringSoon,
    googleAccounts,
    verifiedGoogleAccounts,
    recentSessions,
  };
}
