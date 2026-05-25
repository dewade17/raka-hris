import db from "@/lib/db";
import {
  AuthProvider,
  CompanyStatus,
  MembershipStatus,
} from "@/generated/prisma/client";
import { createUnusablePasswordHash } from "@/server/password";
import type { GoogleUserProfile } from "./types";

const activeMembershipFilter = {
  status: MembershipStatus.ACTIVE,
  accessRevokedAt: null,
  company: {
    status: CompanyStatus.ACTIVE,
    deletedAt: null,
  },
} as const;

const activeMembershipInclude = {
  where: activeMembershipFilter,
  include: {
    company: true,
  },
  orderBy: [
    {
      isOwner: "desc" as const,
    },
    {
      joinedAt: "asc" as const,
    },
  ],
};

export async function findGoogleProviderAccount(providerAccountId: string) {
  return db.userAuthProvider.findUnique({
    where: {
      provider_providerAccountId: {
        provider: AuthProvider.GOOGLE,
        providerAccountId,
      },
    },
    include: {
      user: {
        include: {
          memberships: activeMembershipInclude,
        },
      },
    },
  });
}

export async function findGoogleLinkableUserByEmail(email: string) {
  return db.user.findUnique({
    where: {
      email,
    },
    include: {
      memberships: activeMembershipInclude,
    },
  });
}

export async function createGoogleOnlyUser(profile: GoogleUserProfile) {
  return db.user.create({
    data: {
      email: profile.email,
      name: profile.displayName,
      passwordHash: createUnusablePasswordHash(),
      passwordLoginEnabled: false,
      mustChangePassword: false,
      authProviders: {
        create: {
          provider: AuthProvider.GOOGLE,
          providerAccountId: profile.providerAccountId,
          email: profile.email,
          emailVerified: profile.emailVerified,
          displayName: profile.displayName,
          avatarUrl: profile.avatarUrl,
          lastLoginAt: new Date(),
        },
      },
    },
    include: {
      memberships: activeMembershipInclude,
    },
  });
}

export async function linkGoogleProviderToUser(
  userId: string,
  profile: GoogleUserProfile,
) {
  return db.userAuthProvider.create({
    data: {
      userId,
      provider: AuthProvider.GOOGLE,
      providerAccountId: profile.providerAccountId,
      email: profile.email,
      emailVerified: profile.emailVerified,
      displayName: profile.displayName,
      avatarUrl: profile.avatarUrl,
      lastLoginAt: new Date(),
    },
  });
}

export async function markGoogleProviderLoggedIn(
  userAuthProviderId: string,
  profile: GoogleUserProfile,
) {
  return db.userAuthProvider.update({
    where: {
      id: userAuthProviderId,
    },
    data: {
      email: profile.email,
      emailVerified: profile.emailVerified,
      displayName: profile.displayName,
      avatarUrl: profile.avatarUrl,
      lastLoginAt: new Date(),
    },
  });
}
