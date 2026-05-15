import { PlatformRole } from "@/generated/prisma/client";

export const dashboardPlatformUrl = "/dashboard-platform";
export const dashboardCompanyUrl = "/dashboard-company";
export const googleWorkspaceRequiredUrl =
  "/register?auth=google-workspace-required";

type PostAuthRedirectInput = {
  platformRole: PlatformRole;
  hasActiveCompanyMembership: boolean;
};

export function resolvePostAuthRedirect(input: PostAuthRedirectInput) {
  if (input.platformRole === PlatformRole.SUPERADMIN) {
    return dashboardPlatformUrl;
  }

  if (input.hasActiveCompanyMembership) {
    return dashboardCompanyUrl;
  }

  return googleWorkspaceRequiredUrl;
}
