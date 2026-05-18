'use client';

import { App } from 'antd';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

type DepartmentApiResponse = {
  success?: boolean;
  message?: string;
};

export function useDeleteDepartment() {
  const router = useRouter();
  const { message } = App.useApp();
  const [deletingDepartmentId, setDeletingDepartmentId] = useState<string>();

  const deleteDepartment = useCallback(
    async (departmentId: string) => {
      setDeletingDepartmentId(departmentId);

      try {
        const response = await fetch(`/api/company/departments/${encodeURIComponent(departmentId)}`, {
          method: 'DELETE',
        });
        const payload = (await response.json().catch(() => ({}))) as DepartmentApiResponse;

        if (!response.ok) {
          message.error(payload.message ?? 'Department could not be deleted. Please try again.');
          return false;
        }

        message.success(payload.message ?? 'Department deleted successfully.');
        router.refresh();
        return true;
      } catch {
        message.error('Department could not be deleted. Please check your connection and try again.');
        return false;
      } finally {
        setDeletingDepartmentId(undefined);
      }
    },
    [message, router],
  );

  return {
    deleteDepartment,
    deletingDepartmentId,
  };
}
