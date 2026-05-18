'use client';

import { App } from 'antd';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

type LocationApiResponse = {
  success?: boolean;
  message?: string;
};

export function useDeleteLocation() {
  const router = useRouter();
  const { message } = App.useApp();
  const [deletingLocationId, setDeletingLocationId] = useState<string>();

  const deleteLocation = useCallback(
    async (locationId: string) => {
      setDeletingLocationId(locationId);

      try {
        const response = await fetch(`/api/company/locations/${encodeURIComponent(locationId)}`, {
          method: 'DELETE',
        });
        const payload = (await response.json().catch(() => ({}))) as LocationApiResponse;

        if (!response.ok) {
          message.error(payload.message ?? 'Location could not be deleted. Please try again.');
          return false;
        }

        message.success(payload.message ?? 'Location deleted successfully.');
        router.refresh();
        return true;
      } catch {
        message.error('Location could not be deleted. Please check your connection and try again.');
        return false;
      } finally {
        setDeletingLocationId(undefined);
      }
    },
    [message, router],
  );

  return {
    deleteLocation,
    deletingLocationId,
  };
}
