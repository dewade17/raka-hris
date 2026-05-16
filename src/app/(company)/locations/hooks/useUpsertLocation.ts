'use client';

import { App } from 'antd';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import type { LocationFormValues } from '../components_locations/LocationFormDrawer';

type LocationApiResponse = {
  success?: boolean;
  message?: string;
};

export function useUpsertLocation() {
  const router = useRouter();
  const { message } = App.useApp();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearErrorMessage = useCallback(() => {
    setErrorMessage(undefined);
  }, []);

  const upsertLocation = useCallback(
    async (values: LocationFormValues, locationId?: string) => {
      setErrorMessage(undefined);
      setIsSubmitting(true);

      const isUpdate = Boolean(locationId);

      try {
        const response = await fetch(isUpdate ? `/api/company/locations/${encodeURIComponent(locationId ?? '')}` : '/api/company/locations', {
          method: isUpdate ? 'PATCH' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(normalizeLocationFormValues(values)),
        });
        const payload = (await response.json().catch(() => ({}))) as LocationApiResponse;

        if (!response.ok) {
          setErrorMessage(payload.message ?? 'Location could not be saved. Please review the form and try again.');
          return false;
        }

        message.success(payload.message ?? (isUpdate ? 'Location updated successfully.' : 'Location created successfully.'));
        router.refresh();
        return true;
      } catch {
        setErrorMessage('Location could not be saved. Please check your connection and try again.');
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
    upsertLocation,
  };
}

function normalizeLocationFormValues(values: LocationFormValues) {
  return {
    name: values.name.trim(),
    latitude: normalizeOptionalNumber(values.latitude),
    longitude: normalizeOptionalNumber(values.longitude),
    isActive: values.isActive,
  };
}

function normalizeOptionalNumber(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const numericValue = typeof value === 'number' ? value : Number(value);

  return Number.isFinite(numericValue) ? numericValue : null;
}
