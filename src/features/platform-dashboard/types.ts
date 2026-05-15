export type DashboardTone = "success" | "warning" | "danger" | "info" | "default";

export type DashboardStatusMetric = {
  label: string;
  value: number;
  tone: DashboardTone;
};

export type DashboardNamedCount = {
  name: string;
  count: number;
  description?: string;
};

export type PlatformCompanyRow = {
  key: string;
  name: string;
  slug: string;
  status: string;
  members: number;
  departments: number;
  subscriptionStatus: string;
  planName: string;
};

export type PlatformDashboardData = {
  summary: {
    totalCompanies: number;
    activeCompanies: number;
    totalUsers: number;
    activeUsers: number;
    totalMemberships: number;
    activeSubscriptions: number;
  };
  companies: {
    statusMetrics: DashboardStatusMetric[];
    deletedCompanies: number;
    recentCompanies: PlatformCompanyRow[];
  };
  userAccess: {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    superAdmins: number;
    activeSessions: number;
    revokedSessions: number;
    googleAccounts: number;
    verifiedGoogleAccounts: number;
  };
  subscriptions: {
    totalPlans: number;
    activePlans: number;
    monthlyPlans: number;
    yearlyPlans: number;
    statusMetrics: DashboardStatusMetric[];
    planMix: DashboardNamedCount[];
  };
  rolePermissions: {
    totalPermissions: number;
    totalRoles: number;
    systemRoles: number;
    defaultRoles: number;
    rolePermissionLinks: number;
    roleAssignments: number;
    rolesWithoutPermissions: number;
    membersWithoutRole: number;
    permissionModules: DashboardNamedCount[];
  };
  organization: {
    departments: number;
    activeDepartments: number;
    positions: number;
    activePositions: number;
    locations: number;
    activeLocations: number;
    companiesWithLocations: number;
  };
};
