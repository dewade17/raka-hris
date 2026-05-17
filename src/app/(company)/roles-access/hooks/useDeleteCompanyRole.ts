'use client';

import { App } from 'antd';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

type RoleMutationApiResponse = {
  success?: boolean;
  message?: string;
};

export function useDeleteCompanyRole() {
  const router = useRouter();
  const { message } = App.useApp();
  const [deletingRoleId, setDeletingRoleId] = useState<string>();

  const deleteCompanyRole = useCallback(
    async (roleId: string) => {
      setDeletingRoleId(roleId);

      try {
        const response = await fetch(`/api/company/access/roles/${encodeURIComponent(roleId)}`, {
          method: 'DELETE',
        });
        const payload = (await response.json().catch(() => ({}))) as RoleMutationApiResponse;

        if (!response.ok) {
          message.error(payload.message ?? 'Role could not be deleted. Please try again.');
          return false;
        }

        message.success(payload.message ?? 'Role deleted successfully.');
        router.refresh();
        return true;
      } catch {
        message.error('Role could not be deleted. Please check your connection and try again.');
        return false;
      } finally {
        setDeletingRoleId(undefined);
      }
    },
    [message, router],
  );

  return {
    deleteCompanyRole,
    deletingRoleId,
  };
}
