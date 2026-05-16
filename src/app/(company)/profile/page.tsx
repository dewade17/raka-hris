import type { Metadata } from 'next';
import { getCompanyProfileData } from '@/features/company/profile/service';
import { requireActiveCompanyMembership } from '@/server/auth';
import { CompanyProfileEditor } from './components_company_profile/CompanyProfileEditor';

export const metadata: Metadata = {
  title: 'Company Profile | RAKA HRIS',
};

export default async function CompanyProfilePage() {
  const { company, membership } = await requireActiveCompanyMembership();
  const profile = await getCompanyProfileData(company.companyId);

  return (
    <CompanyProfileEditor
      canUpdate={membership.isOwner}
      profile={{
        companyId: profile.companyId,
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
