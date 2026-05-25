import db from "@/lib/db";
import { type Prisma } from "@/generated/prisma/client";
import {
  createPermissionKey,
  ownerRoleName,
  permissionCatalog,
} from "./catalog";

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
  companyId?: string,
) {
  return db.membershipRole.findFirst({
    where: {
      membershipId,
      role: {
        ...(companyId ? { companyId } : {}),
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
      id: true,
    },
  });
}

export async function syncPermissionCatalogRecords() {
  return db.$transaction(
    permissionCatalog.map((permission) =>
      db.permission.upsert({
        where: {
          module_action: {
            module: permission.module,
            action: permission.action,
          },
        },
        update: {
          name: permission.name,
          description: permission.description,
        },
        create: {
          module: permission.module,
          action: permission.action,
          name: permission.name,
          description: permission.description,
        },
      }),
    ),
  );
}

export async function findCatalogPermissionRecords() {
  return db.permission.findMany({
    where: {
      OR: permissionCatalog.map((permission) => ({
        module: permission.module,
        action: permission.action,
      })),
    },
    select: {
      id: true,
      module: true,
      action: true,
    },
  });
}

export async function findCompanyRoleByName(companyId: string, name: string) {
  return db.companyRole.findUnique({
    where: {
      companyId_name: {
        companyId,
        name,
      },
    },
    include: {
      rolePermissions: {
        include: {
          permission: true,
        },
      },
    },
  });
}

export async function createCompanyRoleTemplateRecord(input: {
  companyId: string;
  name: string;
  description: string;
  isSystem: boolean;
  permissionIds: string[];
}) {
  return db.$transaction(async (tx) => {
    const role = await tx.companyRole.create({
      data: {
        companyId: input.companyId,
        name: input.name,
        description: input.description,
        isSystem: input.isSystem,
        isDefault: false,
      },
    });

    await createRolePermissionLinks(tx, role.id, input.permissionIds);

    return role;
  });
}

export async function updateCompanyRoleTemplateRecord(input: {
  companyId: string;
  roleId: string;
  description: string;
  isSystem: boolean;
  permissionIds: string[];
}) {
  return db.$transaction(async (tx) => {
    const role = await tx.companyRole.update({
      where: {
        id: input.roleId,
        companyId: input.companyId,
      },
      data: {
        description: input.description,
        isSystem: input.isSystem,
        isDefault: false,
      },
    });

    await replaceRolePermissionLinks(tx, role.id, input.permissionIds);

    return role;
  });
}

export async function findCompanyRolesForAccess(companyId: string) {
  return db.companyRole.findMany({
    where: {
      companyId,
    },
    orderBy: [
      {
        isSystem: 'desc',
      },
      {
        name: 'asc',
      },
    ],
    include: {
      rolePermissions: {
        include: {
          permission: true,
        },
      },
      _count: {
        select: {
          membershipRoles: true,
        },
      },
    },
  });
}

export async function findCompanyMembersForRoleAccess(companyId: string) {
  return db.membership.findMany({
    where: {
      companyId,
    },
    orderBy: [
      {
        isOwner: 'desc',
      },
      {
        joinedAt: 'asc',
      },
    ],
    select: {
      id: true,
      status: true,
      isOwner: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      roles: {
        include: {
          role: {
            select: {
              id: true,
              name: true,
              isSystem: true,
            },
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  });
}

export async function createCompanyRoleRecord(input: {
  companyId: string;
  name: string;
  description: string | null;
}) {
  return db.companyRole.create({
    data: {
      companyId: input.companyId,
      name: input.name,
      description: input.description,
      isSystem: false,
      isDefault: false,
    },
  });
}

export async function updateCompanyRoleRecord(input: {
  companyId: string;
  roleId: string;
  name: string;
  description: string | null;
}) {
  return db.companyRole.update({
    where: {
      id: input.roleId,
      companyId: input.companyId,
    },
    data: {
      name: input.name,
      description: input.description,
    },
  });
}

export async function findCompanyRoleForMutation(companyId: string, roleId: string) {
  return db.companyRole.findFirst({
    where: {
      companyId,
      id: roleId,
    },
    include: {
      _count: {
        select: {
          membershipRoles: true,
        },
      },
    },
  });
}

export async function deleteCompanyRoleRecord(companyId: string, roleId: string) {
  return db.companyRole.delete({
    where: {
      id: roleId,
      companyId,
    },
  });
}

export async function replaceCompanyRolePermissionRecords(roleId: string, permissionIds: string[]) {
  return db.$transaction(async (tx) => {
    await replaceRolePermissionLinks(tx, roleId, permissionIds);
  });
}

export async function findCompanyMembershipForRoleMutation(companyId: string, membershipId: string) {
  return db.membership.findFirst({
    where: {
      companyId,
      id: membershipId,
    },
    select: {
      id: true,
      isOwner: true,
    },
  });
}

export async function findCompanyAssignableRoleIds(companyId: string, roleIds: string[]) {
  if (roleIds.length === 0) {
    return [];
  }

  return db.companyRole.findMany({
    where: {
      companyId,
      id: {
        in: roleIds,
      },
      isSystem: false,
    },
    select: {
      id: true,
    },
  });
}

export async function replaceMembershipRoleRecords(membershipId: string, roleIds: string[]) {
  return db.$transaction(async (tx) => {
    await tx.membershipRole.deleteMany({
      where: {
        membershipId,
      },
    });

    if (roleIds.length === 0) {
      return;
    }

    await tx.membershipRole.createMany({
      data: roleIds.map((roleId) => ({
        membershipId,
        roleId,
      })),
      skipDuplicates: true,
    });
  });
}

export async function ensureOwnerMembershipRole(companyId: string, membershipId: string) {
  const ownerRole = await db.companyRole.findUnique({
    where: {
      companyId_name: {
        companyId,
        name: ownerRoleName,
      },
    },
    select: {
      id: true,
    },
  });

  if (!ownerRole) {
    return;
  }

  await db.membershipRole.upsert({
    where: {
      membershipId_roleId: {
        membershipId,
        roleId: ownerRole.id,
      },
    },
    update: {},
    create: {
      membershipId,
      roleId: ownerRole.id,
    },
  });
}

export function mapPermissionIdsByKey(
  permissionRecords: Array<{
    id: string;
    module: string;
    action: string;
  }>,
) {
  return new Map(permissionRecords.map((permission) => [createPermissionKey(permission.module, permission.action), permission.id]));
}

async function createRolePermissionLinks(tx: Prisma.TransactionClient, roleId: string, permissionIds: string[]) {
  if (permissionIds.length === 0) {
    return;
  }

  await tx.companyRolePermission.createMany({
    data: permissionIds.map((permissionId) => ({
      roleId,
      permissionId,
    })),
    skipDuplicates: true,
  });
}

async function replaceRolePermissionLinks(tx: Prisma.TransactionClient, roleId: string, permissionIds: string[]) {
  await tx.companyRolePermission.deleteMany({
    where: {
      roleId,
    },
  });

  await createRolePermissionLinks(tx, roleId, permissionIds);
}
