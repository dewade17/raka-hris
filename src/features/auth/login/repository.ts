import db from "@/lib/db";
import { CompanyStatus, MembershipStatus } from "@/generated/prisma/client";

export async function findUserForPasswordLogin(email: string) {
  return db.user.findUnique({
    where: {
      email,
    },
    include: {
      memberships: {
        where: {
          status: MembershipStatus.ACTIVE,
          accessRevokedAt: null,
          company: {
            status: CompanyStatus.ACTIVE,
            deletedAt: null,
          },
        },
        include: {
          company: true,
        },
        orderBy: [
          {
            isOwner: "desc",
          },
          {
            joinedAt: "asc",
          },
        ],
      },
    },
  });
}

export async function markMembershipLoggedIn(membershipId: string) {
  return db.membership.update({
    where: {
      membershipId,
    },
    data: {
      lastLoginAt: new Date(),
    },
  });
}
