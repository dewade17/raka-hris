'use client';

import { App } from 'antd';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

type RoleMutationApiResponse = {
  success?: boolean;
  message?: string;
};

export function useUpdateRolePermissions() {
  const router = useRouter();
  const { message } = App.useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateRolePermissions = useCallback(
    async (roleId: string, permissionKeys: string[]) => {
      setIsSubmitting(true);

      try {
        const response = await fetch(`/api/company/access/roles/${encodeURIComponent(roleId)}/permissions`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ permissionKeys }),
        });
        const payload = (await response.json().catch(() => ({}))) as RoleMutationApiResponse;

        if (!response.ok) {
          message.error(payload.message ?? 'Role permissions could not be updated. Please try again.');
          return false;
        }

        message.success(payload.message ?? 'Role permissions updated successfully.');
        router.refresh();
        return true;
      } catch {
        message.error('Role permissions could not be updated. Please check your connection and try again.');
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [message, router],
  );

  return {
    isSubmitting,
    updateRolePermissions,
  };
}
