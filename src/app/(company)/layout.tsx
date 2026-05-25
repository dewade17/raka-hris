import type { ReactNode } from "react";
import { resolveMembershipPermissionKeys } from "@/features/auth/permissions/service";
import { requireActiveCompanyMembership } from "@/server/auth";
import { CompanyAppLayout } from "./components_company/CompanyAppLayout";

export default async function CompanyLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const { company, membership, user } = await requireActiveCompanyMembership();
  const permissionKeys = await resolveMembershipPermissionKeys({
    companyId: company.id,
    membershipId: membership.id,
    isOwner: membership.isOwner,
  });

  return (
    <CompanyAppLayout
      companyName={company.name}
      userName={user.name}
      userEmail={user.email}
      isOwner={membership.isOwner}
      permissionKeys={permissionKeys}
    >
      {children}
    </CompanyAppLayout>
  );
}
