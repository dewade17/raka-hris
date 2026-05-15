import type { Metadata } from "next";
import { PlatformCompanyOverview } from "./components_dashboard_platform/PlatformCompanyOverview";
import { PlatformOrganizationOverview } from "./components_dashboard_platform/PlatformOrganizationOverview";
import { PlatformRolePermissionOverview } from "./components_dashboard_platform/PlatformRolePermissionOverview";
import { PlatformSubscriptionOverview } from "./components_dashboard_platform/PlatformSubscriptionOverview";
import { PlatformSummaryCards } from "./components_dashboard_platform/PlatformSummaryCards";
import { PlatformUserAccessOverview } from "./components_dashboard_platform/PlatformUserAccessOverview";
import { getPlatformDashboardData } from "@/features/platform-dashboard/service";
import { requirePlatformAdmin } from "@/server/auth";

export const metadata: Metadata = {
  title: "Platform Dashboard | RAKA HRIS",
};

export default async function PlatformDashboardPage() {
  await requirePlatformAdmin();
  const dashboardData = await getPlatformDashboardData();

  return (
    <>
      <PlatformSummaryCards data={dashboardData.summary} />
      <PlatformCompanyOverview data={dashboardData.companies} />
      <PlatformUserAccessOverview data={dashboardData.userAccess} />
      <PlatformSubscriptionOverview data={dashboardData.subscriptions} />
      <PlatformRolePermissionOverview data={dashboardData.rolePermissions} />
      <PlatformOrganizationOverview data={dashboardData.organization} />
    </>
  );
}
