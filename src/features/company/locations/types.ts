export type LocationListItem = {
  locationId: string;
  name: string;
  latitude: string | null;
  longitude: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type LocationListData = {
  locations: LocationListItem[];
  summary: {
    total: number;
    active: number;
    inactive: number;
    deleted: number;
  };
};

export type UpsertLocationInput = {
  name: string;
  latitude: number | null;
  longitude: number | null;
  isActive: boolean;
};

export type LocationMutationResult =
  | {
      success: true;
      status: 200 | 201;
      message: string;
      location: LocationListItem;
    }
  | {
      success: false;
      status: 400 | 403 | 404 | 409 | 500;
      message: string;
    };

export type LocationDeleteResult =
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
