import {
  createCompanyRoleRecord,
  createCompanyRoleTemplateRecord,
  deleteCompanyRoleRecord,
  ensureOwnerMembershipRole,
  findCatalogPermissionRecords,
  findCompanyAssignableRoleIds,
  findCompanyMembersForRoleAccess,
  findCompanyMembershipForRoleMutation,
  findCompanyRoleByName,
  findCompanyRoleForMutation,
  findCompanyRolesForAccess,
  findMembershipPermission,
  findPermissionsForMembership,
  mapPermissionIdsByKey,
  replaceCompanyRolePermissionRecords,
  replaceMembershipRoleRecords,
  syncPermissionCatalogRecords,
  updateCompanyRoleRecord,
  updateCompanyRoleTemplateRecord,
} from "./repository";
import {
  allPermissionKeys,
  companyRoleTemplates,
  createPermissionKey,
  isKnownPermissionKey,
  ownerRoleName,
  parsePermissionKey,
  permissionModuleCatalog,
} from "./catalog";
import type {
  CompanyAccessManagementData,
  CompanyPermissionModule,
  ResolvedPermission,
  RoleMutationInput,
} from "./types";

export type PermissionMutationResult =
  | {
      success: true;
      status: number;
      message: string;
    }
  | {
      success: false;
      status: number;
      message: string;
    };

type RoleValidationResult =
  | {
      success: true;
      data: {
        name: string;
        description: string | null;
      };
    }
  | {
      success: false;
      status: number;
      message: string;
    };

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
  companyId?: string,
) {
  const membershipRole = await findMembershipPermission(
    membershipId,
    module,
    action,
    companyId,
  );

  return Boolean(membershipRole);
}

export async function resolveMembershipPermissionKeys(input: {
  membershipId: string;
  companyId: string;
  isOwner: boolean;
}) {
  if (input.isOwner) {
    return allPermissionKeys;
  }

  const permissions = await resolveMembershipPermissions(input.membershipId);

  return permissions.map((permission) => createPermissionKey(permission.module, permission.action));
}

export function hasResolvedPermission(permissionKeys: string[], module: string, action: string) {
  return permissionKeys.includes(createPermissionKey(module, action));
}

export async function ensureCompanyAccessDefaults(companyId: string, ownerMembershipId?: string) {
  await syncPermissionCatalogRecords();
  const permissionIdByKey = mapPermissionIdsByKey(await findCatalogPermissionRecords());

  for (const roleTemplate of companyRoleTemplates) {
    const permissionIds = roleTemplate.permissionKeys
      .map((permissionKey) => permissionIdByKey.get(permissionKey))
      .filter((permissionId): permissionId is string => Boolean(permissionId));
    const existingRole = await findCompanyRoleByName(companyId, roleTemplate.name);

    if (!existingRole) {
      await createCompanyRoleTemplateRecord({
        companyId,
        name: roleTemplate.name,
        description: roleTemplate.description,
        isSystem: roleTemplate.isSystem,
        permissionIds,
      });
      continue;
    }

    if (roleTemplate.name === ownerRoleName) {
      await updateCompanyRoleTemplateRecord({
        companyId,
        roleId: existingRole.companyRoleId,
        description: roleTemplate.description,
        isSystem: true,
        permissionIds,
      });
    }
  }

  if (ownerMembershipId) {
    await ensureOwnerMembershipRole(companyId, ownerMembershipId);
  }
}

export async function getCompanyAccessManagementData(companyId: string): Promise<CompanyAccessManagementData> {
  await ensureCompanyAccessDefaults(companyId);

  const [roles, members] = await Promise.all([
    findCompanyRolesForAccess(companyId),
    findCompanyMembersForRoleAccess(companyId),
  ]);

  const permissionModules = mapPermissionModules();
  const roleItems = roles.map((role) => ({
    companyRoleId: role.companyRoleId,
    name: role.name,
    description: role.description,
    isSystem: role.isSystem,
    isDefault: role.isDefault,
    permissionKeys: role.rolePermissions
      .map((rolePermission) => createPermissionKey(rolePermission.permission.module, rolePermission.permission.action))
      .sort(),
    assignedMembers: role._count.membershipRoles,
  }));
  const memberItems = members.map((member) => {
    const rolesForMember = member.roles.map((membershipRole) => membershipRole.role);

    return {
      membershipId: member.membershipId,
      name: member.user.name,
      email: member.user.email,
      status: member.status,
      isOwner: member.isOwner,
      roleIds: rolesForMember.map((role) => role.companyRoleId),
      roleNames: rolesForMember.map((role) => role.name),
    };
  });

  return {
    permissionModules,
    roles: roleItems,
    members: memberItems,
    summary: {
      totalRoles: roleItems.length,
      editableRoles: roleItems.filter((role) => !role.isSystem).length,
      membersWithoutRole: memberItems.filter((member) => !member.isOwner && member.roleIds.length === 0).length,
      availablePermissions: permissionModules.reduce((total, moduleItem) => total + moduleItem.permissions.length, 0),
    },
  };
}

export async function createCompanyRole(companyId: string, input: RoleMutationInput): Promise<PermissionMutationResult> {
  const validation = validateRoleMutationInput(input);

  if (!validation.success) {
    return validation;
  }

  try {
    await createCompanyRoleRecord({
      companyId,
      name: validation.data.name,
      description: validation.data.description,
    });

    return {
      success: true,
      status: 201,
      message: 'Role created successfully.',
    };
  } catch {
    return {
      success: false,
      status: 409,
      message: 'A role with this name already exists in this company.',
    };
  }
}

export async function updateCompanyRole(
  companyId: string,
  roleId: string,
  input: RoleMutationInput,
): Promise<PermissionMutationResult> {
  const role = await findCompanyRoleForMutation(companyId, roleId);

  if (!role) {
    return {
      success: false,
      status: 404,
      message: 'Role could not be found.',
    };
  }

  if (role.isSystem) {
    return {
      success: false,
      status: 400,
      message: 'System roles cannot be renamed.',
    };
  }

  const validation = validateRoleMutationInput(input);

  if (!validation.success) {
    return validation;
  }

  try {
    await updateCompanyRoleRecord({
      companyId,
      roleId,
      name: validation.data.name,
      description: validation.data.description,
    });

    return {
      success: true,
      status: 200,
      message: 'Role updated successfully.',
    };
  } catch {
    return {
      success: false,
      status: 409,
      message: 'A role with this name already exists in this company.',
    };
  }
}

export async function deleteCompanyRole(companyId: string, roleId: string): Promise<PermissionMutationResult> {
  const role = await findCompanyRoleForMutation(companyId, roleId);

  if (!role) {
    return {
      success: false,
      status: 404,
      message: 'Role could not be found.',
    };
  }

  if (role.isSystem) {
    return {
      success: false,
      status: 400,
      message: 'System roles cannot be deleted.',
    };
  }

  if (role._count.membershipRoles > 0) {
    return {
      success: false,
      status: 400,
      message: 'This role is assigned to employees and cannot be deleted.',
    };
  }

  await deleteCompanyRoleRecord(companyId, roleId);

  return {
    success: true,
    status: 200,
    message: 'Role deleted successfully.',
  };
}

export async function updateCompanyRolePermissions(
  companyId: string,
  roleId: string,
  permissionKeys: string[],
): Promise<PermissionMutationResult> {
  const role = await findCompanyRoleForMutation(companyId, roleId);

  if (!role) {
    return {
      success: false,
      status: 404,
      message: 'Role could not be found.',
    };
  }

  if (role.name === ownerRoleName || role.isSystem) {
    return {
      success: false,
      status: 400,
      message: 'System role permissions are managed automatically.',
    };
  }

  const normalizedPermissionKeys = normalizePermissionKeys(permissionKeys);
  const unknownPermissionKey = normalizedPermissionKeys.find((permissionKey) => !isKnownPermissionKey(permissionKey));

  if (unknownPermissionKey) {
    return {
      success: false,
      status: 400,
      message: 'One or more selected permissions are not available.',
    };
  }

  await syncPermissionCatalogRecords();
  const permissionIdByKey = mapPermissionIdsByKey(await findCatalogPermissionRecords());
  const permissionIds = normalizedPermissionKeys
    .map((permissionKey) => permissionIdByKey.get(permissionKey))
    .filter((permissionId): permissionId is string => Boolean(permissionId));

  await replaceCompanyRolePermissionRecords(roleId, permissionIds);

  return {
    success: true,
    status: 200,
    message: 'Role permissions updated successfully.',
  };
}

export async function updateCompanyMemberRoles(
  companyId: string,
  membershipId: string,
  roleIds: string[],
): Promise<PermissionMutationResult> {
  const membership = await findCompanyMembershipForRoleMutation(companyId, membershipId);

  if (!membership) {
    return {
      success: false,
      status: 404,
      message: 'Employee could not be found.',
    };
  }

  if (membership.isOwner) {
    return {
      success: false,
      status: 400,
      message: 'The workspace owner role cannot be changed here.',
    };
  }

  const normalizedRoleIds = Array.from(new Set(roleIds.filter((roleId) => typeof roleId === 'string' && roleId.trim()).map((roleId) => roleId.trim())));
  const assignableRoles = await findCompanyAssignableRoleIds(companyId, normalizedRoleIds);

  if (assignableRoles.length !== normalizedRoleIds.length) {
    return {
      success: false,
      status: 400,
      message: 'One or more selected roles are not available for assignment.',
    };
  }

  await replaceMembershipRoleRecords(membership.membershipId, normalizedRoleIds);

  return {
    success: true,
    status: 200,
    message: normalizedRoleIds.length > 0 ? 'Employee roles updated successfully.' : 'Employee roles cleared successfully.',
  };
}

function mapPermissionModules(): CompanyPermissionModule[] {
  return permissionModuleCatalog.map((moduleItem) => ({
    module: moduleItem.module,
    label: moduleItem.label,
    description: moduleItem.description,
    permissions: moduleItem.permissions.map((permission) => ({
      module: moduleItem.module,
      action: permission.action,
      key: createPermissionKey(moduleItem.module, permission.action),
      name: permission.name,
      description: permission.description,
    })),
  }));
}

function normalizePermissionKeys(permissionKeys: string[]) {
  return Array.from(
    new Set(
      permissionKeys
        .filter((permissionKey) => typeof permissionKey === 'string')
        .map((permissionKey) => permissionKey.trim())
        .filter((permissionKey) => Boolean(parsePermissionKey(permissionKey))),
    ),
  );
}

function validateRoleMutationInput(input: RoleMutationInput): RoleValidationResult {
  const name = input.name.trim();
  const description = input.description?.trim() || null;

  if (name.length < 2) {
    return {
      success: false,
      status: 400,
      message: 'Role name must be at least 2 characters.',
    };
  }

  if (name.length > 191) {
    return {
      success: false,
      status: 400,
      message: 'Role name must be 191 characters or fewer.',
    };
  }

  if (description && description.length > 500) {
    return {
      success: false,
      status: 400,
      message: 'Role description must be 500 characters or fewer.',
    };
  }

  if (name.toLowerCase() === ownerRoleName.toLowerCase()) {
    return {
      success: false,
      status: 400,
      message: 'Owner is a protected system role name.',
    };
  }

  return {
    success: true,
    data: {
      name,
      description,
    },
  };
}
