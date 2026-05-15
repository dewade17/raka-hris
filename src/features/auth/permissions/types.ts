export type PermissionKey = {
  module: string;
  action: string;
};

export type ResolvedPermission = PermissionKey & {
  permissionId: string;
  name: string;
};
