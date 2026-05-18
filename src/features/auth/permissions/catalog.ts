export type PermissionCatalogAction = {
  action: string;
  name: string;
  description: string;
};

export type PermissionCatalogModule = {
  module: string;
  label: string;
  description: string;
  permissions: PermissionCatalogAction[];
};

export type PermissionCatalogItem = PermissionCatalogAction & {
  module: string;
  moduleLabel: string;
};

export type CompanyRoleTemplate = {
  name: string;
  description: string;
  isSystem: boolean;
  permissionKeys: string[];
};

export const ownerRoleName = 'Owner';

export const permissionModuleCatalog: PermissionCatalogModule[] = [
  {
    module: 'dashboard',
    label: 'Dashboard',
    description: 'Company workspace overview and operational summaries.',
    permissions: [
      {
        action: 'view',
        name: 'View dashboard',
        description: 'Open the company dashboard and review workspace summaries.',
      },
    ],
  },
  {
    module: 'companyProfile',
    label: 'Company Profile',
    description: 'Company identity, contact details, logo, and timezone.',
    permissions: [
      {
        action: 'view',
        name: 'View company profile',
        description: 'Open and review the company profile.',
      },
      {
        action: 'update',
        name: 'Update company profile',
        description: 'Edit company identity, contact, address, and timezone details.',
      },
      {
        action: 'uploadLogo',
        name: 'Upload company logo',
        description: 'Upload or replace the company logo.',
      },
    ],
  },
  {
    module: 'employees',
    label: 'Employees',
    description: 'Employee accounts, profiles, employment status, and assignments.',
    permissions: [
      {
        action: 'view',
        name: 'View employees',
        description: 'Open employee lists and employee profile pages.',
      },
      {
        action: 'create',
        name: 'Create employees',
        description: 'Create employee accounts within the company seat limit.',
      },
      {
        action: 'update',
        name: 'Update employees',
        description: 'Edit employee account and profile details.',
      },
      {
        action: 'terminate',
        name: 'Terminate employees',
        description: 'Terminate employee access while keeping historical records.',
      },
      {
        action: 'assign',
        name: 'Update employee assignments',
        description: 'Change employee department and position assignments.',
      },
      {
        action: 'uploadPhoto',
        name: 'Upload employee photos',
        description: 'Upload or replace employee profile photos.',
      },
    ],
  },
  {
    module: 'departments',
    label: 'Departments',
    description: 'Department master data used for employee assignments.',
    permissions: [
      {
        action: 'view',
        name: 'View departments',
        description: 'Open and review company departments.',
      },
      {
        action: 'create',
        name: 'Create departments',
        description: 'Create new departments.',
      },
      {
        action: 'update',
        name: 'Update departments',
        description: 'Edit department names and active status.',
      },
      {
        action: 'delete',
        name: 'Delete departments',
        description: 'Delete departments that should no longer be used.',
      },
    ],
  },
  {
    module: 'positions',
    label: 'Positions',
    description: 'Position master data used for employee assignments.',
    permissions: [
      {
        action: 'view',
        name: 'View positions',
        description: 'Open and review company positions.',
      },
      {
        action: 'create',
        name: 'Create positions',
        description: 'Create new positions.',
      },
      {
        action: 'update',
        name: 'Update positions',
        description: 'Edit position names and active status.',
      },
      {
        action: 'delete',
        name: 'Delete positions',
        description: 'Delete positions that should no longer be used.',
      },
    ],
  },
  {
    module: 'locations',
    label: 'Locations',
    description: 'Work location master data and coordinate records.',
    permissions: [
      {
        action: 'view',
        name: 'View locations',
        description: 'Open and review company locations.',
      },
      {
        action: 'create',
        name: 'Create locations',
        description: 'Create new locations.',
      },
      {
        action: 'update',
        name: 'Update locations',
        description: 'Edit location names, active status, and coordinates.',
      },
      {
        action: 'delete',
        name: 'Delete locations',
        description: 'Delete locations that should no longer be used.',
      },
    ],
  },
  {
    module: 'access',
    label: 'Roles & Access',
    description: 'Company role permissions and employee role assignments.',
    permissions: [
      {
        action: 'view',
        name: 'View roles and access',
        description: 'Open the roles and access management page.',
      },
      {
        action: 'manageRoles',
        name: 'Manage roles',
        description: 'Create, rename, delete, and update role permissions.',
      },
      {
        action: 'assignRoles',
        name: 'Assign roles',
        description: 'Assign or remove employee roles.',
      },
    ],
  },
  {
    module: 'sessions',
    label: 'Sessions',
    description: 'User session summaries and sign-in activity.',
    permissions: [
      {
        action: 'view',
        name: 'View sessions',
        description: 'Review company session summaries and recent session activity.',
      },
    ],
  },
  {
    module: 'subscription',
    label: 'Subscription',
    description: 'Subscription, plan, and seat usage information.',
    permissions: [
      {
        action: 'view',
        name: 'View subscription',
        description: 'Review subscription and seat usage information.',
      },
    ],
  },
];

export const permissionCatalog: PermissionCatalogItem[] = permissionModuleCatalog.flatMap((moduleItem) =>
  moduleItem.permissions.map((permission) => ({
    ...permission,
    module: moduleItem.module,
    moduleLabel: moduleItem.label,
  })),
);

export const allPermissionKeys = permissionCatalog.map((permission) => createPermissionKey(permission.module, permission.action));

const hrAdminPermissionKeys = [
  'dashboard:view',
  'companyProfile:view',
  'companyProfile:update',
  'companyProfile:uploadLogo',
  'employees:view',
  'employees:create',
  'employees:update',
  'employees:terminate',
  'employees:assign',
  'employees:uploadPhoto',
  'departments:view',
  'departments:create',
  'departments:update',
  'departments:delete',
  'positions:view',
  'positions:create',
  'positions:update',
  'positions:delete',
  'locations:view',
  'locations:create',
  'locations:update',
  'locations:delete',
  'access:view',
  'access:assignRoles',
  'sessions:view',
  'subscription:view',
];

const managerPermissionKeys = [
  'dashboard:view',
  'employees:view',
  'departments:view',
  'positions:view',
  'locations:view',
];

export const companyRoleTemplates: CompanyRoleTemplate[] = [
  {
    name: ownerRoleName,
    description: 'Full company access for the workspace owner.',
    isSystem: true,
    permissionKeys: allPermissionKeys,
  },
  {
    name: 'HR Admin',
    description: 'Manages employees, company profile, and organization master data.',
    isSystem: false,
    permissionKeys: hrAdminPermissionKeys,
  },
  {
    name: 'Manager',
    description: 'Reviews employee and organization data without making changes.',
    isSystem: false,
    permissionKeys: managerPermissionKeys,
  },
  {
    name: 'Employee',
    description: 'Starter role template. Add permissions before assigning it to employees.',
    isSystem: false,
    permissionKeys: [],
  },
];

export function createPermissionKey(module: string, action: string) {
  return `${module}:${action}`;
}

export function parsePermissionKey(permissionKey: string) {
  const [module, action, ...extraParts] = permissionKey.split(':');

  if (!module || !action || extraParts.length > 0) {
    return null;
  }

  return {
    module,
    action,
  };
}

export function isKnownPermissionKey(permissionKey: string) {
  return allPermissionKeys.includes(permissionKey);
}
