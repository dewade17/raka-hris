"use client";

import { App, Upload } from "antd";
import type { UploadProps } from "antd";
import { useCallback, useState } from "react";

type UseUploadCompanyLogoOptions = {
  onClearError: () => void;
  onLogoUploaded: (logoUrl: string) => void;
};

type CompanyLogoUploadResponse = {
  success?: boolean;
  message?: string;
  logoUrl?: string;
};

type BeforeUploadFile = Parameters<NonNullable<UploadProps["beforeUpload"]>>[0];
type CustomRequestOptions = Parameters<NonNullable<UploadProps["customRequest"]>>[0];

const companyLogoAccept = "image/png,image/jpeg,image/webp,image/svg+xml";
const maxCompanyLogoSizeBytes = 2 * 1024 * 1024;
const allowedCompanyLogoTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/svg+xml"]);

export function useUploadCompanyLogo({
  onClearError,
  onLogoUploaded,
}: UseUploadCompanyLogoOptions) {
  const { message: messageApi } = App.useApp();
  const [isLogoUploading, setIsLogoUploading] = useState(false);

  const validateLogoBeforeUpload: UploadProps["beforeUpload"] = useCallback(
    (file: BeforeUploadFile) => {
      if (!allowedCompanyLogoTypes.has(file.type)) {
        messageApi.error("Company logo must be a PNG, JPG, WebP, or SVG file.");
        return Upload.LIST_IGNORE;
      }

      if (file.size > maxCompanyLogoSizeBytes) {
        messageApi.error("Company logo must be 2 MB or smaller.");
        return Upload.LIST_IGNORE;
      }

      return true;
    },
    [messageApi],
  );

  const uploadLogoFile = useCallback(
    async ({ file, onError, onSuccess }: CustomRequestOptions) => {
      if (!(file instanceof File)) {
        const uploadError = new Error("Please choose a valid logo file.");
        messageApi.error(uploadError.message);
        onError?.(uploadError);
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      setIsLogoUploading(true);
      onClearError();

      try {
        const response = await fetch("/api/company/profile/logo", {
          method: "POST",
          body: formData,
        });
        const payload = (await response.json().catch(() => ({}))) as CompanyLogoUploadResponse;

        if (!response.ok || !payload.logoUrl) {
          throw new Error(payload.message ?? "Company logo could not be uploaded.");
        }

        onLogoUploaded(payload.logoUrl);
        messageApi.success(payload.message ?? "Company logo uploaded successfully.");
        onSuccess?.(payload);
      } catch (error) {
        const uploadError =
          error instanceof Error
            ? error
            : new Error("Company logo could not be uploaded. Please try again.");

        messageApi.error(uploadError.message);
        onError?.(uploadError);
      } finally {
        setIsLogoUploading(false);
      }
    },
    [messageApi, onClearError, onLogoUploaded],
  );

  const uploadCompanyLogo: UploadProps["customRequest"] = useCallback(
    (options: CustomRequestOptions) => {
      void uploadLogoFile(options);
    },
    [uploadLogoFile],
  );

  return {
    companyLogoAccept,
    isLogoUploading,
    uploadCompanyLogo,
    validateLogoBeforeUpload,
  };
}
