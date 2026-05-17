import type { ReactNode } from "react";
import { requireActiveCompanyMembership } from "@/server/auth";
import { CompanyAppLayout } from "./components_company/CompanyAppLayout";

export default async function CompanyLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const { company, membership, user } = await requireActiveCompanyMembership();

  return (
    <CompanyAppLayout
      companyName={company.name}
      userName={user.name}
      userEmail={user.email}
      isOwner={membership.isOwner}
    >
      {children}
    </CompanyAppLayout>
  );
}
