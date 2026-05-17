export type PermissionKey = {
  module: string;
  action: string;
};

export type ResolvedPermission = PermissionKey & {
  permissionId: string;
  name: string;
};

export type CompanyPermissionModule = {
  module: string;
  label: string;
  description: string;
  permissions: Array<{
    module: string;
    action: string;
    key: string;
    name: string;
    description: string;
  }>;
};

export type CompanyRoleAccessItem = {
  companyRoleId: string;
  name: string;
  description: string | null;
  isSystem: boolean;
  isDefault: boolean;
  permissionKeys: string[];
  assignedMembers: number;
};

export type CompanyMemberRoleAccessItem = {
  membershipId: string;
  name: string;
  email: string | null;
  status: string;
  isOwner: boolean;
  roleIds: string[];
  roleNames: string[];
};

export type CompanyAccessManagementData = {
  permissionModules: CompanyPermissionModule[];
  roles: CompanyRoleAccessItem[];
  members: CompanyMemberRoleAccessItem[];
  summary: {
    totalRoles: number;
    editableRoles: number;
    membersWithoutRole: number;
    availablePermissions: number;
  };
};

export type RoleMutationInput = {
  name: string;
  description?: string | null;
};
