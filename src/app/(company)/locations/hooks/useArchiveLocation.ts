'use client';

import { App } from 'antd';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

type LocationApiResponse = {
  success?: boolean;
  message?: string;
};

export function useArchiveLocation() {
  const router = useRouter();
  const { message } = App.useApp();
  const [archivingLocationId, setArchivingLocationId] = useState<string>();

  const archiveLocation = useCallback(
    async (locationId: string) => {
      setArchivingLocationId(locationId);

      try {
        const response = await fetch(`/api/company/locations/${encodeURIComponent(locationId)}`, {
          method: 'DELETE',
        });
        const payload = (await response.json().catch(() => ({}))) as LocationApiResponse;

        if (!response.ok) {
          message.error(payload.message ?? 'Location could not be archived. Please try again.');
          return false;
        }

        message.success(payload.message ?? 'Location archived successfully.');
        router.refresh();
        return true;
      } catch {
        message.error('Location could not be archived. Please check your connection and try again.');
        return false;
      } finally {
        setArchivingLocationId(undefined);
      }
    },
    [message, router],
  );

  return {
    archiveLocation,
    archivingLocationId,
  };
}
