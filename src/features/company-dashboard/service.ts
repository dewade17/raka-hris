import { MembershipStatus } from "@/generated/prisma/client";
import {
  countCompanyEmployeeProfiles,
  countCompanyMembers,
  countCompanyMembersWithoutRole,
  countCompanyMembershipsByStatus,
  countCompanyNewMembersSince,
  countCompanyProbationEndingBetween,
  countIncompleteCompanyEmployeeProfiles,
  findCompanyAccessMetrics,
  findCompanyDashboardRecord,
  findCompanyOrganizationMetrics,
  findCompanySessionMetrics,
  findRecentCompanyMembers,
} from "./repository";
import type {
  CompanyDashboardData,
  DashboardActivityItem,
  DashboardStatusMetric,
} from "./types";

const dateFormatter = new Intl.DateTimeFormat("en", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export async function getCompanyDashboardData(
  companyId: string,
): Promise<CompanyDashboardData> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const thirtyDaysFromNow = new Date(now);
  thirtyDaysFromNow.setDate(now.getDate() + 30);
  const sevenDaysFromNow = new Date(now);
  sevenDaysFromNow.setDate(now.getDate() + 7);

  const [
    company,
    membershipStatusCounts,
    totalMembers,
    employeeProfiles,
    incompleteProfiles,
    newMembersThisMonth,
    probationEndingSoon,
    recentMembers,
    organization,
    access,
    membersWithoutRole,
    sessions,
  ] = await Promise.all([
    findCompanyDashboardRecord(companyId),
    countCompanyMembershipsByStatus(companyId),
    countCompanyMembers(companyId),
    countCompanyEmployeeProfiles(companyId),
    countIncompleteCompanyEmployeeProfiles(companyId),
    countCompanyNewMembersSince(companyId, startOfMonth),
    countCompanyProbationEndingBetween(companyId, now, thirtyDaysFromNow),
    findRecentCompanyMembers(companyId),
    findCompanyOrganizationMetrics(companyId),
    findCompanyAccessMetrics(companyId),
    countCompanyMembersWithoutRole(companyId),
    findCompanySessionMetrics(companyId, now, sevenDaysFromNow),
  ]);

  if (!company) {
    throw new Error("Company dashboard data could not be loaded.");
  }

  const activeMembers = readStatusCount(
    membershipStatusCounts,
    MembershipStatus.ACTIVE,
  );
  const subscription = company.subscriptions[0] ?? null;
  const seatLimit = subscription?.seatLimit ?? 0;
  const seatUsed = activeMembers;

  return {
    company: {
      name: company.name,
      status: formatEnum(company.status),
      locationLabel: formatLocation(company.city, company.province),
      timezoneLabel: company.timezone ?? "Timezone not set",
      profileCompleteness: calculateCompanyCompleteness(company),
      contactCompleteness: [
        buildCompletionMetric("Email", Boolean(company.email)),
        buildCompletionMetric("Phone", Boolean(company.phone)),
        buildCompletionMetric("Address", Boolean(company.addressLine1)),
        buildCompletionMetric("Logo", Boolean(company.logoUrl)),
        buildCompletionMetric("Timezone", Boolean(company.timezone)),
      ],
    },
    summary: {
      totalMembers,
      activeMembers,
      employeeProfiles,
      seatLimit,
      seatUsed,
      subscriptionStatus: subscription ? formatEnum(subscription.status) : "No subscription",
    },
    employees: {
      statusMetrics: [
        {
          label: "Active",
          value: activeMembers,
          tone: "success",
        },
        {
          label: "Suspended",
          value: readStatusCount(membershipStatusCounts, MembershipStatus.SUSPENDED),
          tone: "warning",
        },
        {
          label: "Terminated",
          value: readStatusCount(membershipStatusCounts, MembershipStatus.TERMINATED),
          tone: "danger",
        },
      ],
      incompleteProfiles,
      newMembersThisMonth,
      probationEndingSoon,
      recentMembers: recentMembers.map((member): DashboardActivityItem => {
        const employeeNumber = member.employeeProfile?.employeeNumber ?? member.loginId;
        const employmentType = member.employeeProfile?.employmentType ?? "Employment type not set";

        return {
          title: member.user.name,
          description: `${employeeNumber} · ${employmentType} · ${formatEnum(member.status)}`,
          meta: `Joined ${formatDate(member.joinedAt)}`,
        };
      }),
    },
    organization: {
      totalDepartments: organization.totalDepartments,
      activeDepartments: organization.activeDepartments,
      totalPositions: organization.totalPositions,
      activePositions: organization.activePositions,
      totalLocations: organization.totalLocations,
      activeLocations: organization.activeLocations,
      topDepartments: organization.topDepartments.map((department) => ({
        name: department.name,
        count: department._count.employeeLinks,
        description: department.isActive ? "Active" : "Inactive",
      })),
      topPositions: organization.topPositions.map((position) => ({
        name: position.name,
        count: position._count.employeeLinks,
        description: position.isActive ? "Active" : "Inactive",
      })),
      locations: organization.locations.map((location) => ({
        name: location.name,
        count: location.isActive ? 1 : 0,
        description: formatLocation(location.city, location.province),
      })),
    },
    access: {
      totalRoles: access.totalRoles,
      systemRoles: access.systemRoles,
      defaultRoles: access.defaultRoles,
      permissions: access.permissions,
      rolePermissionLinks: access.rolePermissionLinks,
      memberRoleAssignments: access.memberRoleAssignments,
      membersWithoutRole,
      rolesWithoutPermissions: access.rolesWithoutPermissions,
      topRoles: access.topRoles.map((role) => ({
        name: role.name,
        count: role._count.membershipRoles,
        description: `${role._count.rolePermissions} permissions${
          role.isDefault ? " · default" : ""
        }${role.isSystem ? " · system" : ""}`,
      })),
    },
    sessions: {
      activeSessions: sessions.activeSessions,
      revokedSessions: sessions.revokedSessions,
      expiringSoon: sessions.expiringSoon,
      googleAccounts: sessions.googleAccounts,
      verifiedGoogleAccounts: sessions.verifiedGoogleAccounts,
      recentSessions: sessions.recentSessions.map((session): DashboardActivityItem => ({
        title: session.user.name,
        description: `${session.deviceName ?? "Unknown device"} · ${
          session.platform ?? "Unknown platform"
        } · ${formatEnum(session.status)}`,
        meta: session.lastUsedAt
          ? `Last used ${formatDate(session.lastUsedAt)}`
          : `Created ${formatDate(session.createdAt)}`,
      })),
    },
    subscription: {
      planName: subscription?.plan.name ?? "No active plan",
      status: subscription ? formatEnum(subscription.status) : "No subscription",
      interval: subscription ? formatEnum(subscription.plan.interval) : "Not set",
      pricePerUser: subscription?.pricePerUserSnapshot.toString() ?? "0",
      currency: subscription?.currencySnapshot ?? "IDR",
      seatLimit,
      seatUsed,
      seatUsagePercent: calculatePercent(seatUsed, seatLimit),
      trialEndsAt: formatDate(subscription?.trialEndsAt),
      currentPeriodEnd: formatDate(subscription?.currentPeriodEnd),
    },
  };
}

function readStatusCount<TStatus extends string>(
  rows: Array<{ status: TStatus; _count: { _all: number } }>,
  status: TStatus,
) {
  return rows.find((row) => row.status === status)?._count._all ?? 0;
}

function buildCompletionMetric(label: string, isComplete: boolean): DashboardStatusMetric {
  return {
    label,
    value: isComplete ? 1 : 0,
    tone: isComplete ? "success" : "warning",
  };
}

function calculateCompanyCompleteness(company: {
  email: string | null;
  phone: string | null;
  logoUrl: string | null;
  addressLine1: string | null;
  timezone: string | null;
}) {
  const completedFields = [
    company.email,
    company.phone,
    company.logoUrl,
    company.addressLine1,
    company.timezone,
  ].filter(Boolean).length;

  return calculatePercent(completedFields, 5);
}

function calculatePercent(value: number, total: number) {
  if (total <= 0) {
    return 0;
  }

  return Math.round((value / total) * 100);
}

function formatDate(value?: Date | null) {
  if (!value) {
    return "Not set";
  }

  return dateFormatter.format(value);
}

function formatEnum(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatLocation(city?: string | null, province?: string | null) {
  const parts = [city, province].filter(Boolean);

  return parts.length > 0 ? parts.join(", ") : "Location not set";
}
