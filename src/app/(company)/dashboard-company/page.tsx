import type { Metadata } from "next";
import { CompanyAccessOverview } from "./components_dashboard_company/CompanyAccessOverview";
import { CompanyEmployeeOverview } from "./components_dashboard_company/CompanyEmployeeOverview";
import { CompanyOrganizationOverview } from "./components_dashboard_company/CompanyOrganizationOverview";
import { CompanySessionOverview } from "./components_dashboard_company/CompanySessionOverview";
import { CompanySubscriptionOverview } from "./components_dashboard_company/CompanySubscriptionOverview";
import { CompanySummaryCards } from "./components_dashboard_company/CompanySummaryCards";
import { getCompanyDashboardData } from "@/features/company-dashboard/service";
import { requireActiveCompanyMembership } from "@/server/auth";

export const metadata: Metadata = {
  title: "Company Dashboard | RAKA HRIS",
};

export default async function CompanyDashboardPage() {
  const { company } = await requireActiveCompanyMembership();
  const dashboardData = await getCompanyDashboardData(company.companyId);

  return (
    <>
      <CompanySummaryCards data={dashboardData} />
      <CompanyEmployeeOverview data={dashboardData.employees} />
      <CompanyOrganizationOverview data={dashboardData.organization} />
      <CompanyAccessOverview data={dashboardData.access} />
      <CompanySessionOverview data={dashboardData.sessions} />
      <CompanySubscriptionOverview data={dashboardData.subscription} />
    </>
  );
}
