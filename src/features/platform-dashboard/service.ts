import { CompanyStatus, SubscriptionStatus } from "@/generated/prisma/client";
import {
  countPlatformCompaniesByStatus,
  findPlatformOrganizationMetrics,
  findPlatformRolePermissionMetrics,
  findPlatformSubscriptionMetrics,
  findPlatformSummaryMetrics,
  findPlatformUserAccessMetrics,
  findRecentPlatformCompanies,
} from "./repository";
import type {
  DashboardStatusMetric,
  PlatformDashboardData,
} from "./types";

export async function getPlatformDashboardData(): Promise<PlatformDashboardData> {
  const now = new Date();

  const [
    companyStatuses,
    recentCompanies,
    summary,
    userAccess,
    subscriptions,
    rolePermissions,
    organization,
  ] = await Promise.all([
    countPlatformCompaniesByStatus(),
    findRecentPlatformCompanies(),
    findPlatformSummaryMetrics(now),
    findPlatformUserAccessMetrics(now),
    findPlatformSubscriptionMetrics(),
    findPlatformRolePermissionMetrics(),
    findPlatformOrganizationMetrics(),
  ]);

  const activeCompanies = readStatusCount(companyStatuses, CompanyStatus.ACTIVE);

  return {
    summary: {
      totalCompanies: summary.totalCompanies,
      activeCompanies,
      totalUsers: summary.totalUsers,
      activeUsers: summary.activeUsers,
      totalMemberships: summary.totalMemberships,
      activeSubscriptions: summary.activeSubscriptions,
    },
    companies: {
      statusMetrics: [
        {
          label: "Active",
          value: activeCompanies,
          tone: "success",
        },
        {
          label: "Suspended",
          value: readStatusCount(companyStatuses, CompanyStatus.SUSPENDED),
          tone: "warning",
        },
        {
          label: "Canceled",
          value: readStatusCount(companyStatuses, CompanyStatus.CANCELED),
          tone: "danger",
        },
      ],
      deletedCompanies: summary.deletedCompanies,
      recentCompanies: recentCompanies.map((company) => {
        const subscription = company.subscriptions[0] ?? null;

        return {
          key: company.companyId,
          name: company.name,
          status: formatEnum(company.status),
          members: company._count.memberships,
          departments: company._count.departments,
          subscriptionStatus: subscription ? formatEnum(subscription.status) : "No subscription",
          planName: subscription?.plan.name ?? "No plan",
        };
      }),
    },
    userAccess: {
      totalUsers: summary.totalUsers,
      activeUsers: summary.activeUsers,
      inactiveUsers: userAccess.inactiveUsers,
      superAdmins: userAccess.superAdmins,
      activeSessions: userAccess.activeSessions,
      revokedSessions: userAccess.revokedSessions,
      googleAccounts: userAccess.googleAccounts,
      verifiedGoogleAccounts: userAccess.verifiedGoogleAccounts,
    },
    subscriptions: {
      totalPlans: subscriptions.totalPlans,
      activePlans: subscriptions.activePlans,
      monthlyPlans: subscriptions.monthlyPlans,
      yearlyPlans: subscriptions.yearlyPlans,
      statusMetrics: buildSubscriptionStatusMetrics(subscriptions.subscriptionStatuses),
      planMix: [
        {
          name: "Monthly plans",
          count: subscriptions.monthlyPlans,
          description: "Plans billed every month",
        },
        {
          name: "Yearly plans",
          count: subscriptions.yearlyPlans,
          description: "Plans billed every year",
        },
      ],
    },
    rolePermissions: {
      totalPermissions: rolePermissions.totalPermissions,
      totalRoles: rolePermissions.totalRoles,
      systemRoles: rolePermissions.systemRoles,
      defaultRoles: rolePermissions.defaultRoles,
      rolePermissionLinks: rolePermissions.rolePermissionLinks,
      roleAssignments: rolePermissions.roleAssignments,
      rolesWithoutPermissions: rolePermissions.rolesWithoutPermissions,
      membersWithoutRole: rolePermissions.membersWithoutRole,
      permissionModules: rolePermissions.permissionModules.map((module) => ({
        name: module.module,
        count: module._count._all,
        description: "Permission module",
      })),
    },
    organization: {
      departments: organization.departments,
      activeDepartments: organization.activeDepartments,
      positions: organization.positions,
      activePositions: organization.activePositions,
      locations: organization.locations,
      activeLocations: organization.activeLocations,
      companiesWithLocations: organization.companiesWithLocations,
    },
  };
}

function buildSubscriptionStatusMetrics(
  rows: Array<{ status: SubscriptionStatus; _count: { _all: number } }>,
): DashboardStatusMetric[] {
  return [
    {
      label: "Trialing",
      value: readStatusCount(rows, SubscriptionStatus.TRIALING),
      tone: "info",
    },
    {
      label: "Active",
      value: readStatusCount(rows, SubscriptionStatus.ACTIVE),
      tone: "success",
    },
    {
      label: "Past due",
      value: readStatusCount(rows, SubscriptionStatus.PAST_DUE),
      tone: "warning",
    },
    {
      label: "Canceled",
      value: readStatusCount(rows, SubscriptionStatus.CANCELED),
      tone: "danger",
    },
    {
      label: "Expired",
      value: readStatusCount(rows, SubscriptionStatus.EXPIRED),
      tone: "default",
    },
  ];
}

function readStatusCount<TStatus extends string>(
  rows: Array<{ status: TStatus; _count: { _all: number } }>,
  status: TStatus,
) {
  return rows.find((row) => row.status === status)?._count._all ?? 0;
}

function formatEnum(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
