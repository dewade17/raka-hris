'use client';

import { App } from 'antd';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

type EmployeeTerminateApiResponse = {
  success?: boolean;
  message?: string;
};

export function useTerminateEmployee(membershipId: string) {
  const router = useRouter();
  const { message } = App.useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const terminateEmployee = useCallback(
    async () => {
      setIsSubmitting(true);

      try {
        const response = await fetch(`/api/company/employees/${encodeURIComponent(membershipId)}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            terminationReason: 'Terminated from employee profile.',
          }),
        });
        const payload = (await response.json().catch(() => ({}))) as EmployeeTerminateApiResponse;

        if (!response.ok) {
          message.error(payload.message ?? 'Employee could not be terminated. Please try again.');
          return false;
        }

        message.success(payload.message ?? 'Employee terminated successfully.');
        router.push('/employees');
        router.refresh();
        return true;
      } catch {
        message.error('Employee could not be terminated. Please check your connection and try again.');
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [membershipId, message, router],
  );

  return {
    isSubmitting,
    terminateEmployee,
  };
}
