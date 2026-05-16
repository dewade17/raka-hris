"use client";

import { App } from "antd";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import type { CompanyProfileFormValues } from "../components_company_profile/CompanyProfileForm";

type CompanyProfileApiResponse = {
  success?: boolean;
  message?: string;
};

export function useUpdateCompanyProfile() {
  const router = useRouter();
  const { message } = App.useApp();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearErrorMessage = useCallback(() => {
    setErrorMessage(undefined);
  }, []);

  const updateCompanyProfile = useCallback(
    async (values: CompanyProfileFormValues) => {
      setErrorMessage(undefined);
      setIsSubmitting(true);

      try {
        const response = await fetch("/api/company/profile", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(normalizeCompanyProfileFormValues(values)),
        });
        const payload = (await response.json().catch(() => ({}))) as CompanyProfileApiResponse;

        if (!response.ok) {
          setErrorMessage(getCompanyProfileErrorMessage(payload));
          return;
        }

        message.success(payload.message ?? "Company profile updated successfully.");
        router.refresh();
      } catch {
        setErrorMessage(
          "Company profile could not be updated. Please check your connection and try again.",
        );
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
    updateCompanyProfile,
  };
}

function normalizeCompanyProfileFormValues(
  values: CompanyProfileFormValues,
): CompanyProfileFormValues {
  return {
    name: values.name.trim(),
    email: normalizeOptionalText(values.email)?.toLowerCase() ?? null,
    phone: normalizeOptionalText(values.phone)?.replace(/\s+/g, "") ?? null,
    logoUrl: normalizeOptionalText(values.logoUrl),
    addressLine1: normalizeOptionalText(values.addressLine1),
    city: normalizeOptionalText(values.city),
    province: normalizeOptionalText(values.province),
    timezone: normalizeOptionalText(values.timezone),
  };
}

function normalizeOptionalText(value: string | null | undefined) {
  const normalized = typeof value === "string" ? value.trim() : "";

  return normalized || null;
}

function getCompanyProfileErrorMessage(payload: CompanyProfileApiResponse) {
  return payload.message ?? "Company profile could not be updated. Please review the form and try again.";
}
