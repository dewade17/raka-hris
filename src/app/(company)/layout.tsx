import type { ReactNode } from "react";
import { requireActiveCompanyMembership } from "@/server/auth";
import { CompanyAppLayout } from "./components_company/CompanyAppLayout";

export default async function CompanyLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const { company, membership } = await requireActiveCompanyMembership();

  return (
    <CompanyAppLayout
      companyName={company.name}
      companySlug={company.slug}
      loginId={membership.loginId}
      isOwner={membership.isOwner}
    >
      {children}
    </CompanyAppLayout>
  );
}
