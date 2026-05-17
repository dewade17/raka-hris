'use client';

import { App } from 'antd';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

type RoleMutationApiResponse = {
  success?: boolean;
  message?: string;
};

export function useUpdateMemberRoles() {
  const router = useRouter();
  const { message } = App.useApp();
  const [updatingMembershipId, setUpdatingMembershipId] = useState<string>();

  const updateMemberRoles = useCallback(
    async (membershipId: string, roleIds: string[]) => {
      setUpdatingMembershipId(membershipId);

      try {
        const response = await fetch(`/api/company/access/members/${encodeURIComponent(membershipId)}/roles`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ roleIds }),
        });
        const payload = (await response.json().catch(() => ({}))) as RoleMutationApiResponse;

        if (!response.ok) {
          message.error(payload.message ?? 'Employee roles could not be updated. Please try again.');
          return false;
        }

        message.success(payload.message ?? 'Employee roles updated successfully.');
        router.refresh();
        return true;
      } catch {
        message.error('Employee roles could not be updated. Please check your connection and try again.');
        return false;
      } finally {
        setUpdatingMembershipId(undefined);
      }
    },
    [message, router],
  );

  return {
    updateMemberRoles,
    updatingMembershipId,
  };
}
