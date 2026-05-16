import { findCompanyProfileById, updateCompanyProfileRecord } from './repository';
import type { CompanyProfile, CompanyProfileServiceResult, UpdateCompanyProfileInput } from './types';

export async function getCompanyProfileData(companyId: string): Promise<CompanyProfile> {
  const company = await findCompanyProfileById(companyId);

  if (!company) {
    throw new Error('Company profile data could not be loaded.');
  }

  return company;
}

export async function updateCompanyProfile(companyId: string, input: UpdateCompanyProfileInput): Promise<CompanyProfileServiceResult> {
  try {
    const currentCompany = await findCompanyProfileById(companyId);

    if (!currentCompany) {
      return {
        success: false,
        status: 404,
        message: 'Company profile could not be found.',
      };
    }

    const company = await updateCompanyProfileRecord(companyId, input);

    return {
      success: true,
      status: 200,
      message: 'Company profile updated successfully.',
      company,
    };
  } catch {
    return {
      success: false,
      status: 500,
      message: 'Company profile could not be updated right now. Please try again.',
    };
  }
}
