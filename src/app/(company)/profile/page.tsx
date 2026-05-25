import type { Metadata } from 'next';
import { hasResolvedPermission, resolveMembershipPermissionKeys } from '@/features/auth/permissions/service';
import { getCompanyProfileData } from '@/features/company/profile/service';
import { requirePermission } from '@/server/auth';
import { CompanyProfileEditor } from './components_company_profile/CompanyProfileEditor';

export const metadata: Metadata = {
  title: 'Company Profile | RAKA HRIS',
};

export default async function CompanyProfilePage() {
  const { company, membership } = await requirePermission('companyProfile', 'view');
  const [profile, permissionKeys] = await Promise.all([
    getCompanyProfileData(company.id),
    resolveMembershipPermissionKeys({
      companyId: company.id,
      membershipId: membership.id,
      isOwner: membership.isOwner,
    }),
  ]);

  return (
    <CompanyProfileEditor
      canUpdate={hasResolvedPermission(permissionKeys, 'companyProfile', 'update')}
      profile={{
        id: profile.id,
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        logoUrl: profile.logoUrl,
        addressLine1: profile.addressLine1,
        city: profile.city,
        province: profile.province,
        timezone: profile.timezone,
        updatedAt: profile.updatedAt.toISOString(),
      }}
    />
  );
}
