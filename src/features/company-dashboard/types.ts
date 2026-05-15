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

export type DashboardActivityItem = {
  title: string;
  description: string;
  meta: string;
};

export type CompanyDashboardData = {
  company: {
    name: string;
    slug: string;
    status: string;
    locationLabel: string;
    timezoneLabel: string;
    profileCompleteness: number;
    contactCompleteness: DashboardStatusMetric[];
  };
  summary: {
    totalMembers: number;
    activeMembers: number;
    employeeProfiles: number;
    seatLimit: number;
    seatUsed: number;
    subscriptionStatus: string;
  };
  employees: {
    statusMetrics: DashboardStatusMetric[];
    incompleteProfiles: number;
    newMembersThisMonth: number;
    probationEndingSoon: number;
    recentMembers: DashboardActivityItem[];
  };
  organization: {
    totalDepartments: number;
    activeDepartments: number;
    totalPositions: number;
    activePositions: number;
    totalLocations: number;
    activeLocations: number;
    topDepartments: DashboardNamedCount[];
    topPositions: DashboardNamedCount[];
    locations: DashboardNamedCount[];
  };
  access: {
    totalRoles: number;
    systemRoles: number;
    defaultRoles: number;
    permissions: number;
    rolePermissionLinks: number;
    memberRoleAssignments: number;
    membersWithoutRole: number;
    rolesWithoutPermissions: number;
    topRoles: DashboardNamedCount[];
  };
  sessions: {
    activeSessions: number;
    revokedSessions: number;
    expiringSoon: number;
    googleAccounts: number;
    verifiedGoogleAccounts: number;
    recentSessions: DashboardActivityItem[];
  };
  subscription: {
    planName: string;
    status: string;
    interval: string;
    pricePerUser: string;
    currency: string;
    seatLimit: number;
    seatUsed: number;
    seatUsagePercent: number;
    trialEndsAt: string;
    currentPeriodEnd: string;
  };
};
