export type DepartmentListItem = {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  assignedEmployees: number;
};

export type DepartmentListStatus = 'all' | 'active' | 'inactive' | 'deleted';

export type DepartmentListQuery = {
  page: number;
  pageSize: number;
  query: string;
  status: DepartmentListStatus;
};

export type DepartmentListData = {
  departments: DepartmentListItem[];
  summary: {
    total: number;
    active: number;
    inactive: number;
    deleted: number;
  };
  pagination?: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
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

export type DepartmentDeleteResult =
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
