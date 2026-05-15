import db from "@/lib/db";

export async function findPermissionsForMembership(membershipId: string) {
  return db.membershipRole.findMany({
    where: {
      membershipId,
    },
    include: {
      role: {
        include: {
          rolePermissions: {
            include: {
              permission: true,
            },
          },
        },
      },
    },
  });
}

export async function findMembershipPermission(
  membershipId: string,
  module: string,
  action: string,
) {
  return db.membershipRole.findFirst({
    where: {
      membershipId,
      role: {
        rolePermissions: {
          some: {
            permission: {
              module,
              action,
            },
          },
        },
      },
    },
    select: {
      membershipRoleId: true,
    },
  });
}
