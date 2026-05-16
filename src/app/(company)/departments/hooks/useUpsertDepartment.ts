'use client';

import { App } from 'antd';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import type { DepartmentFormValues } from '../components_departments/DepartmentFormDrawer';

type DepartmentApiResponse = {
  success?: boolean;
  message?: string;
};

export function useUpsertDepartment() {
  const router = useRouter();
  const { message } = App.useApp();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearErrorMessage = useCallback(() => {
    setErrorMessage(undefined);
  }, []);

  const upsertDepartment = useCallback(
    async (values: DepartmentFormValues, departmentId?: string) => {
      setErrorMessage(undefined);
      setIsSubmitting(true);

      const isUpdate = Boolean(departmentId);

      try {
        const response = await fetch(isUpdate ? `/api/company/departments/${encodeURIComponent(departmentId ?? '')}` : '/api/company/departments', {
          method: isUpdate ? 'PATCH' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(normalizeDepartmentFormValues(values)),
        });
        const payload = (await response.json().catch(() => ({}))) as DepartmentApiResponse;

        if (!response.ok) {
          setErrorMessage(payload.message ?? 'Department could not be saved. Please review the form and try again.');
          return false;
        }

        message.success(payload.message ?? (isUpdate ? 'Department updated successfully.' : 'Department created successfully.'));
        router.refresh();
        return true;
      } catch {
        setErrorMessage('Department could not be saved. Please check your connection and try again.');
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [message, router],
  );

  return {
    clearErrorMessage,
    errorMessage,
    isSubmitting,
    upsertDepartment,
  };
}

function normalizeDepartmentFormValues(values: DepartmentFormValues) {
  return {
    name: values.name.trim(),
    isActive: values.isActive,
  };
}
