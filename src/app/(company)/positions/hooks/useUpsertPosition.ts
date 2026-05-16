'use client';

import { App } from 'antd';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import type { PositionFormValues } from '../components_positions/PositionFormDrawer';

type PositionApiResponse = {
  success?: boolean;
  message?: string;
};

export function useUpsertPosition() {
  const router = useRouter();
  const { message } = App.useApp();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearErrorMessage = useCallback(() => {
    setErrorMessage(undefined);
  }, []);

  const upsertPosition = useCallback(
    async (values: PositionFormValues, positionId?: string) => {
      setErrorMessage(undefined);
      setIsSubmitting(true);

      const isUpdate = Boolean(positionId);

      try {
        const response = await fetch(isUpdate ? `/api/company/positions/${encodeURIComponent(positionId ?? '')}` : '/api/company/positions', {
          method: isUpdate ? 'PATCH' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(normalizePositionFormValues(values)),
        });
        const payload = (await response.json().catch(() => ({}))) as PositionApiResponse;

        if (!response.ok) {
          setErrorMessage(payload.message ?? 'Position could not be saved. Please review the form and try again.');
          return false;
        }

        message.success(payload.message ?? (isUpdate ? 'Position updated successfully.' : 'Position created successfully.'));
        router.refresh();
        return true;
      } catch {
        setErrorMessage('Position could not be saved. Please check your connection and try again.');
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
    upsertPosition,
  };
}

function normalizePositionFormValues(values: PositionFormValues) {
  return {
    name: values.name.trim(),
    isActive: values.isActive,
  };
}
