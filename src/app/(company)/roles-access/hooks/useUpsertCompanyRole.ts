'use client';

import { App } from 'antd';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import type { RoleFormValues } from '../components_roles_access/RoleFormDrawer';

type RoleMutationApiResponse = {
  success?: boolean;
  message?: string;
};

export function useUpsertCompanyRole() {
  const router = useRouter();
  const { message } = App.useApp();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearErrorMessage = useCallback(() => {
    setErrorMessage(undefined);
  }, []);

  const upsertCompanyRole = useCallback(
    async (values: RoleFormValues, roleId?: string) => {
      setErrorMessage(undefined);
      setIsSubmitting(true);
      const isUpdate = Boolean(roleId);

      try {
        const response = await fetch(isUpdate ? `/api/company/access/roles/${encodeURIComponent(roleId ?? '')}` : '/api/company/access/roles', {
          method: isUpdate ? 'PATCH' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: values.name.trim(),
            description: values.description?.trim() || null,
          }),
        });
        const payload = (await response.json().catch(() => ({}))) as RoleMutationApiResponse;

        if (!response.ok) {
          setErrorMessage(payload.message ?? 'Role could not be saved. Please review the form and try again.');
          return false;
        }

        message.success(payload.message ?? (isUpdate ? 'Role updated successfully.' : 'Role created successfully.'));
        router.refresh();
        return true;
      } catch {
        setErrorMessage('Role could not be saved. Please check your connection and try again.');
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
    upsertCompanyRole,
  };
}
