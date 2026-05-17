'use client';

import { App, Upload } from 'antd';
import type { UploadProps } from 'antd';
import { useCallback, useState } from 'react';

type UseUploadEmployeePhotoOptions = {
  membershipId: string;
  onClearError: () => void;
  onPhotoUploaded: (photoUrl: string) => void;
};

type EmployeePhotoUploadResponse = {
  success?: boolean;
  message?: string;
  photoUrl?: string;
};

type BeforeUploadFile = Parameters<NonNullable<UploadProps['beforeUpload']>>[0];
type CustomRequestOptions = Parameters<NonNullable<UploadProps['customRequest']>>[0];

const employeePhotoAccept = 'image/png,image/jpeg,image/webp';
const maxEmployeePhotoSizeBytes = 2 * 1024 * 1024;
const allowedEmployeePhotoTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

export function useUploadEmployeePhoto({
  membershipId,
  onClearError,
  onPhotoUploaded,
}: UseUploadEmployeePhotoOptions) {
  const { message } = App.useApp();
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);

  const validatePhotoBeforeUpload: UploadProps['beforeUpload'] = useCallback(
    (file: BeforeUploadFile) => {
      if (!allowedEmployeePhotoTypes.has(file.type)) {
        message.error('Profile photo must be a PNG, JPG, or WebP file.');
        return Upload.LIST_IGNORE;
      }

      if (file.size > maxEmployeePhotoSizeBytes) {
        message.error('Profile photo must be 2 MB or smaller.');
        return Upload.LIST_IGNORE;
      }

      return true;
    },
    [message],
  );

  const uploadPhotoFile = useCallback(
    async ({ file, onError, onSuccess }: CustomRequestOptions) => {
      if (!(file instanceof File)) {
        const uploadError = new Error('Please choose a valid profile photo.');
        message.error(uploadError.message);
        onError?.(uploadError);
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      setIsPhotoUploading(true);
      onClearError();

      try {
        const response = await fetch(`/api/company/employees/${encodeURIComponent(membershipId)}/photo`, {
          method: 'POST',
          body: formData,
        });
        const payload = (await response.json().catch(() => ({}))) as EmployeePhotoUploadResponse;

        if (!response.ok || !payload.photoUrl) {
          throw new Error(payload.message ?? 'Profile photo could not be uploaded.');
        }

        onPhotoUploaded(payload.photoUrl);
        message.success(payload.message ?? 'Profile photo uploaded successfully.');
        onSuccess?.(payload);
      } catch (error) {
        const uploadError =
          error instanceof Error
            ? error
            : new Error('Profile photo could not be uploaded. Please try again.');

        message.error(uploadError.message);
        onError?.(uploadError);
      } finally {
        setIsPhotoUploading(false);
      }
    },
    [membershipId, message, onClearError, onPhotoUploaded],
  );

  const uploadEmployeePhoto: UploadProps['customRequest'] = useCallback(
    (options: CustomRequestOptions) => {
      void uploadPhotoFile(options);
    },
    [uploadPhotoFile],
  );

  return {
    employeePhotoAccept,
    isPhotoUploading,
    uploadEmployeePhoto,
    validatePhotoBeforeUpload,
  };
}
