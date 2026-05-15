export type RegisterRequestInput = {
  fullName: string;
  companyName: string;
  email: string;
  phoneNumber: string | null;
  password: string;
  seatLimit: number;
};

export type GoogleWorkspaceSetupRequestInput = {
  companyName: string;
  phoneNumber: string | null;
  seatLimit: number;
};

export type RegisterServiceResult =
  | {
      success: true;
      status: 200 | 201;
      message: string;
      redirectUrl: string;
    }
  | {
      success: false;
      status: 400 | 401 | 403 | 409 | 500;
      message: string;
    };

export type CreateCompanyOwnerAccountInput = RegisterRequestInput & {
  passwordHash: string;
};

export type CreateWorkspaceForExistingUserInput =
  GoogleWorkspaceSetupRequestInput & {
    userId: string;
    email: string | null;
  };
