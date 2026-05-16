export type PositionListItem = {
  positionId: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  assignedEmployees: number;
};

export type PositionListData = {
  positions: PositionListItem[];
  summary: {
    total: number;
    active: number;
    inactive: number;
    archived: number;
  };
};

export type UpsertPositionInput = {
  name: string;
  isActive: boolean;
};

export type PositionMutationResult =
  | {
      success: true;
      status: 200 | 201;
      message: string;
      position: PositionListItem;
    }
  | {
      success: false;
      status: 400 | 403 | 404 | 409 | 500;
      message: string;
    };

export type PositionArchiveResult =
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
