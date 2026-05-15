export type LoginRequestInput = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type LoginDeviceContext = {
  ipAddress?: string | null;
  userAgent?: string | null;
};

export type LoginServiceResult =
  | {
      success: true;
      status: 200;
      message: string;
      redirectUrl: string;
    }
  | {
      success: false;
      status: 400 | 401 | 403 | 500;
      message: string;
    };
