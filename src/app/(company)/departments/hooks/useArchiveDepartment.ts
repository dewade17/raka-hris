'use client';

import { App } from 'antd';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

type DepartmentApiResponse = {
  success?: boolean;
  message?: string;
};

export function useArchiveDepartment() {
  const router = useRouter();
  const { message } = App.useApp();
  const [archivingDepartmentId, setArchivingDepartmentId] = useState<string>();

  const archiveDepartment = useCallback(
    async (departmentId: string) => {
      setArchivingDepartmentId(departmentId);

      try {
        const response = await fetch(`/api/company/departments/${encodeURIComponent(departmentId)}`, {
          method: 'DELETE',
        });
        const payload = (await response.json().catch(() => ({}))) as DepartmentApiResponse;

        if (!response.ok) {
          message.error(payload.message ?? 'Department could not be archived. Please try again.');
          return false;
        }

        message.success(payload.message ?? 'Department archived successfully.');
        router.refresh();
        return true;
      } catch {
        message.error('Department could not be archived. Please check your connection and try again.');
        return false;
      } finally {
        setArchivingDepartmentId(undefined);
      }
    },
    [message, router],
  );

  return {
    archiveDepartment,
    archivingDepartmentId,
  };
}
