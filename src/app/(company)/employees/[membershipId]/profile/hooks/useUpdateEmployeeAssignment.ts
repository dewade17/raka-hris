'use client';

import { App } from 'antd';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import type { UpdateEmployeeAssignmentInput } from '@/features/company/employees/types';

type EmployeeAssignmentApiResponse = {
  success?: boolean;
  message?: string;
};

export function useUpdateEmployeeAssignment(membershipId: string) {
  const router = useRouter();
  const { message } = App.useApp();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearErrorMessage = useCallback(() => {
    setErrorMessage(undefined);
  }, []);

  const updateEmployeeAssignment = useCallback(
    async (values: UpdateEmployeeAssignmentInput) => {
      setErrorMessage(undefined);
      setIsSubmitting(true);

      try {
        const response = await fetch(`/api/company/employees/${encodeURIComponent(membershipId)}/assignments`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
        const payload = (await response.json().catch(() => ({}))) as EmployeeAssignmentApiResponse;

        if (!response.ok) {
          setErrorMessage(payload.message ?? 'Employee assignment could not be saved. Please review the form and try again.');
          return false;
        }

        message.success(payload.message ?? 'Employee assignment updated successfully.');
        router.refresh();
        return true;
      } catch {
        setErrorMessage('Employee assignment could not be saved. Please check your connection and try again.');
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
    updateEmployeeAssignment,
  };
}
