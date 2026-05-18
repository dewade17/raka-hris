'use client';

import { App } from 'antd';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

type PositionApiResponse = {
  success?: boolean;
  message?: string;
};

export function useDeletePosition() {
  const router = useRouter();
  const { message } = App.useApp();
  const [deletingPositionId, setDeletingPositionId] = useState<string>();

  const deletePosition = useCallback(
    async (positionId: string) => {
      setDeletingPositionId(positionId);

      try {
        const response = await fetch(`/api/company/positions/${encodeURIComponent(positionId)}`, {
          method: 'DELETE',
        });
        const payload = (await response.json().catch(() => ({}))) as PositionApiResponse;

        if (!response.ok) {
          message.error(payload.message ?? 'Position could not be deleted. Please try again.');
          return false;
        }

        message.success(payload.message ?? 'Position deleted successfully.');
        router.refresh();
        return true;
      } catch {
        message.error('Position could not be deleted. Please check your connection and try again.');
        return false;
      } finally {
        setDeletingPositionId(undefined);
      }
    },
    [message, router],
  );

  return {
    deletePosition,
    deletingPositionId,
  };
}
