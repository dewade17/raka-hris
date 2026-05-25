import db from '@/lib/db';
import type { UpdateCompanyProfileInput } from './types';

export async function findCompanyProfileById(companyId: string) {
  return db.company.findFirst({
    where: {
      id: companyId,
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      logoUrl: true,
      addressLine1: true,
      city: true,
      province: true,
      timezone: true,
      updatedAt: true,
    },
  });
}

export async function updateCompanyProfileRecord(companyId: string, data: UpdateCompanyProfileInput) {
  return db.company.update({
    where: {
      id: companyId,
    },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      logoUrl: true,
      addressLine1: true,
      city: true,
      province: true,
      timezone: true,
      updatedAt: true,
    },
  });
}
