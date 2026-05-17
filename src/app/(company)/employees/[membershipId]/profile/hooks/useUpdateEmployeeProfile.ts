'use client';

import { App } from 'antd';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import type { EmployeeProfileEditFormValues } from '../types';

type EmployeeProfileApiResponse = {
  success?: boolean;
  message?: string;
};

export function useUpdateEmployeeProfile(membershipId: string) {
  const router = useRouter();
  const { message } = App.useApp();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearErrorMessage = useCallback(() => {
    setErrorMessage(undefined);
  }, []);

  const updateEmployeeProfile = useCallback(
    async (values: EmployeeProfileEditFormValues) => {
      setErrorMessage(undefined);
      setIsSubmitting(true);

      try {
        const response = await fetch(`/api/company/employees/${encodeURIComponent(membershipId)}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(normalizeEmployeeProfileEditFormValues(values)),
        });
        const payload = (await response.json().catch(() => ({}))) as EmployeeProfileApiResponse;

        if (!response.ok) {
          setErrorMessage(payload.message ?? 'Employee could not be updated. Please review the form and try again.');
          return false;
        }

        message.success(payload.message ?? 'Employee updated successfully.');
        router.refresh();
        return true;
      } catch {
        setErrorMessage('Employee could not be updated. Please check your connection and try again.');
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [membershipId, message, router],
  );

  return {
    clearErrorMessage,
    errorMessage,
    isSubmitting,
    updateEmployeeProfile,
  };
}

function normalizeEmployeeProfileEditFormValues(values: EmployeeProfileEditFormValues) {
  return {
    fullName: values.fullName.trim(),
    email: values.email.trim().toLowerCase(),
    status: values.status,
    employeeNumber: normalizeOptionalText(values.employeeNumber),
    phone: normalizeOptionalText(values.phone),
    emergencyContactName: normalizeOptionalText(values.emergencyContactName),
    emergencyContactPhone: normalizeOptionalText(values.emergencyContactPhone),
    birthDate: values.birthDate || null,
    birthPlace: normalizeOptionalText(values.birthPlace),
    gender: normalizeOptionalText(values.gender),
    maritalStatus: normalizeOptionalText(values.maritalStatus),
    addressLine1: normalizeOptionalText(values.addressLine1),
    city: normalizeOptionalText(values.city),
    province: normalizeOptionalText(values.province),
    employmentType: normalizeOptionalText(values.employmentType),
    hireDate: values.hireDate || null,
    probationEndDate: values.probationEndDate || null,
    photoUrl: normalizeOptionalText(values.photoUrl),
    notes: normalizeOptionalText(values.notes),
  };
}

function normalizeOptionalText(value?: string) {
  const normalized = value?.trim().replace(/\s+/g, ' ') ?? '';

  return normalized || null;
}
