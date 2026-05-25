'use client';

import { App } from 'antd';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import type { EmployeeCreateFormValues } from '../components_employees/EmployeeCreateDrawer';

type EmployeeCreateApiResponse = {
  success?: boolean;
  message?: string;
  id?: string;
};

export function useCreateEmployee() {
  const router = useRouter();
  const { message } = App.useApp();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearErrorMessage = useCallback(() => {
    setErrorMessage(undefined);
  }, []);

  const createEmployee = useCallback(
    async (values: EmployeeCreateFormValues) => {
      setErrorMessage(undefined);
      setIsSubmitting(true);

      try {
        const response = await fetch('/api/company/employees', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(normalizeEmployeeCreateFormValues(values)),
        });
        const payload = (await response.json().catch(() => ({}))) as EmployeeCreateApiResponse;

        if (!response.ok) {
          setErrorMessage(payload.message ?? 'Employee could not be created. Please review the form and try again.');
          return false;
        }

        message.success(payload.message ?? 'Employee created successfully.');

        if (payload.id) {
          router.push(`/employees/${encodeURIComponent(payload.id)}/profile`);
        } else {
          router.refresh();
        }

        return true;
      } catch {
        setErrorMessage('Employee could not be created. Please check your connection and try again.');
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [message, router],
  );

  return {
    clearErrorMessage,
    createEmployee,
    errorMessage,
    isSubmitting,
  };
}

function normalizeEmployeeCreateFormValues(values: EmployeeCreateFormValues) {
  return {
    fullName: values.fullName.trim(),
    email: values.email.trim().toLowerCase(),
    password: values.password,
    departmentId: values.departmentId,
    positionId: values.positionId,
  };
}
