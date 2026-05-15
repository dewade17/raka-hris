import type { ReactNode } from "react";
import { requirePlatformAdmin } from "@/server/auth";
import { PlatformAppLayout } from "./components_platform/PlatformAppLayout";

export default async function PlatformLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const { user } = await requirePlatformAdmin();

  return (
    <PlatformAppLayout userName={user.name} userEmail={user.email ?? ""}>
      {children}
    </PlatformAppLayout>
  );
}
