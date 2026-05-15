import {
  findMembershipPermission,
  findPermissionsForMembership,
} from "./repository";
import type { ResolvedPermission } from "./types";

export async function resolveMembershipPermissions(membershipId: string) {
  const membershipRoles = await findPermissionsForMembership(membershipId);
  const permissions = new Map<string, ResolvedPermission>();

  for (const membershipRole of membershipRoles) {
    for (const rolePermission of membershipRole.role.rolePermissions) {
      const { permission } = rolePermission;
      const key = `${permission.module}:${permission.action}`;

      permissions.set(key, {
        permissionId: permission.permissionId,
        module: permission.module,
        action: permission.action,
        name: permission.name,
      });
    }
  }

  return Array.from(permissions.values()).sort((first, second) => {
    const firstKey = `${first.module}:${first.action}`;
    const secondKey = `${second.module}:${second.action}`;

    return firstKey.localeCompare(secondKey);
  });
}

export async function membershipHasPermission(
  membershipId: string,
  module: string,
  action: string,
) {
  const membershipRole = await findMembershipPermission(
    membershipId,
    module,
    action,
  );

  return Boolean(membershipRole);
}
