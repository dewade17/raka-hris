export type CompanyProfile = {
  companyId: string;
  name: string;
  email: string | null;
  phone: string | null;
  logoUrl: string | null;
  addressLine1: string | null;
  city: string | null;
  province: string | null;
  timezone: string | null;
  updatedAt: Date;
};

export type UpdateCompanyProfileInput = {
  name: string;
  email: string | null;
  phone: string | null;
  logoUrl: string | null;
  addressLine1: string | null;
  city: string | null;
  province: string | null;
  timezone: string | null;
};

export type CompanyProfileServiceResult =
  | {
      success: true;
      status: 200;
      message: string;
      company: CompanyProfile;
    }
  | {
      success: false;
      status: 400 | 403 | 404 | 500;
      message: string;
    };
