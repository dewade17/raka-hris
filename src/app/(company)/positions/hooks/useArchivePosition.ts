'use client';

import { App } from 'antd';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

type PositionApiResponse = {
  success?: boolean;
  message?: string;
};

export function useArchivePosition() {
  const router = useRouter();
  const { message } = App.useApp();
  const [archivingPositionId, setArchivingPositionId] = useState<string>();

  const archivePosition = useCallback(
    async (positionId: string) => {
      setArchivingPositionId(positionId);

      try {
        const response = await fetch(`/api/company/positions/${encodeURIComponent(positionId)}`, {
          method: 'DELETE',
        });
        const payload = (await response.json().catch(() => ({}))) as PositionApiResponse;

        if (!response.ok) {
          message.error(payload.message ?? 'Position could not be archived. Please try again.');
          return false;
        }

        message.success(payload.message ?? 'Position archived successfully.');
        router.refresh();
        return true;
      } catch {
        message.error('Position could not be archived. Please check your connection and try again.');
        return false;
      } finally {
        setArchivingPositionId(undefined);
      }
    },
    [message, router],
  );

  return {
    archivePosition,
    archivingPositionId,
  };
}
