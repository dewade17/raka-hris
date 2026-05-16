export type DepartmentListItem = {
  departmentId: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  assignedEmployees: number;
};

export type DepartmentListData = {
  departments: DepartmentListItem[];
  summary: {
    total: number;
    active: number;
    inactive: number;
    archived: number;
  };
};

export type UpsertDepartmentInput = {
  name: string;
  isActive: boolean;
};

export type DepartmentMutationResult =
  | {
      success: true;
      status: 200 | 201;
      message: string;
      department: DepartmentListItem;
    }
  | {
      success: false;
      status: 400 | 403 | 404 | 409 | 500;
      message: string;
    };

export type DepartmentArchiveResult =
  | {
      success: true;
      status: 200;
      message: string;
    }
  | {
      success: false;
      status: 403 | 404 | 500;
      message: string;
    };
