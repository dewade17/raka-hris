import type { PlatformRole } from "@/generated/prisma/client";

export type GoogleUserProfile = {
  providerAccountId: string;
  email: string;
  emailVerified: boolean;
  displayName: string;
  avatarUrl: string | null;
};

export type GoogleAuthResolution = {
  userId: string;
  platformRole: PlatformRole;
  membershipId: string | null;
  hasActiveWorkspace: boolean;
};
