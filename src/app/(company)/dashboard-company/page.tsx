import type { Metadata } from 'next';
import { CompanyAccessOverview } from './components_dashboard_company/CompanyAccessOverview';
import { CompanyEmployeeOverview } from './components_dashboard_company/CompanyEmployeeOverview';
import { CompanyOrganizationOverview } from './components_dashboard_company/CompanyOrganizationOverview';
import { CompanySessionOverview } from './components_dashboard_company/CompanySessionOverview';
import { CompanySubscriptionOverview } from './components_dashboard_company/CompanySubscriptionOverview';
import { CompanySummaryCards } from './components_dashboard_company/CompanySummaryCards';
import { hasResolvedPermission, resolveMembershipPermissionKeys } from '@/features/auth/permissions/service';
import { getCompanyDashboardData } from '@/features/company/company-dashboard/service';
import { requirePermission } from '@/server/auth';

export const metadata: Metadata = {
  title: 'Company Dashboard | RAKA HRIS',
};

export default async function CompanyDashboardPage() {
  const { company, membership } = await requirePermission('dashboard', 'view');
  const [dashboardData, permissionKeys] = await Promise.all([
    getCompanyDashboardData(company.companyId),
    resolveMembershipPermissionKeys({
      companyId: company.companyId,
      membershipId: membership.membershipId,
      isOwner: membership.isOwner,
    }),
  ]);
  const canViewOrganization =
    hasResolvedPermission(permissionKeys, 'departments', 'view') ||
    hasResolvedPermission(permissionKeys, 'positions', 'view') ||
    hasResolvedPermission(permissionKeys, 'locations', 'view');

  return (
    <>
      <CompanySummaryCards data={dashboardData} />
      {hasResolvedPermission(permissionKeys, 'employees', 'view') ? <CompanyEmployeeOverview data={dashboardData.employees} /> : null}
      {canViewOrganization ? <CompanyOrganizationOverview data={dashboardData.organization} /> : null}
      {hasResolvedPermission(permissionKeys, 'access', 'view') ? <CompanyAccessOverview data={dashboardData.access} /> : null}
      {hasResolvedPermission(permissionKeys, 'sessions', 'view') ? <CompanySessionOverview data={dashboardData.sessions} /> : null}
      {hasResolvedPermission(permissionKeys, 'subscription', 'view') ? <CompanySubscriptionOverview data={dashboardData.subscription} /> : null}
    </>
  );
}
