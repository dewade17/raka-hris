"use client";

import { Alert, Avatar, Button, Col, Form, Input, Row, Select, Space, Typography, Upload } from "antd";
import { Building2, Image as ImageIcon, Mail, MapPinned, Phone, Save, TimerReset, Trash2, UploadCloud } from "lucide-react";
import type { FormProps } from "antd";
import { useCallback, type ReactNode } from "react";
import { useUploadCompanyLogo } from "../hooks/useUploadCompanyLogo";

export type CompanyProfileFormValues = {
  name: string;
  email?: string | null;
  phone?: string | null;
  logoUrl?: string | null;
  addressLine1?: string | null;
  city?: string | null;
  province?: string | null;
  timezone?: string | null;
};

type CompanyProfileFormProps = {
  initialValues: CompanyProfileFormValues;
  canUpdate: boolean;
  isSubmitting: boolean;
  errorMessage?: string;
  onSubmit: (values: CompanyProfileFormValues) => void | Promise<void>;
  onClearError: () => void;
};

const { Text } = Typography;

const timezoneOptions = [
  {
    label: "Western Indonesia Time - Asia/Jakarta",
    value: "Asia/Jakarta",
  },
  {
    label: "Central Indonesia Time - Asia/Makassar",
    value: "Asia/Makassar",
  },
  {
    label: "Eastern Indonesia Time - Asia/Jayapura",
    value: "Asia/Jayapura",
  },
  {
    label: "UTC",
    value: "UTC",
  },
];

export function CompanyProfileForm({
  initialValues,
  canUpdate,
  isSubmitting,
  errorMessage,
  onSubmit,
  onClearError,
}: CompanyProfileFormProps) {
  const [form] = Form.useForm<CompanyProfileFormValues>();
  const logoUrl = Form.useWatch("logoUrl", form);

  const handleFinish: FormProps<CompanyProfileFormValues>["onFinish"] = (values) => {
    onSubmit(values);
  };

  const handleLogoUploaded = useCallback(
    (uploadedLogoUrl: string) => {
      form.setFieldValue("logoUrl", uploadedLogoUrl);
      void form.validateFields(["logoUrl"]).catch(() => undefined);
    },
    [form],
  );

  const {
    companyLogoAccept,
    isLogoUploading,
    uploadCompanyLogo,
    validateLogoBeforeUpload,
  } = useUploadCompanyLogo({
    onClearError,
    onLogoUploaded: handleLogoUploaded,
  });

  return (
    <Space direction="vertical" size={18} style={{ width: "100%" }}>
      {errorMessage ? (
        <Alert showIcon type="error" message={errorMessage} />
      ) : null}

      {!canUpdate ? (
        <Alert
          showIcon
          type="info"
          message="You can review the company profile, but only the company owner can update it."
        />
      ) : null}

      <Form<CompanyProfileFormValues>
        form={form}
        layout="vertical"
        requiredMark={false}
        initialValues={{
          name: initialValues.name,
          email: initialValues.email,
          phone: initialValues.phone,
          logoUrl: initialValues.logoUrl,
          addressLine1: initialValues.addressLine1,
          city: initialValues.city,
          province: initialValues.province,
          timezone: initialValues.timezone,
        }}
        disabled={!canUpdate || isSubmitting}
        onFinish={handleFinish}
        onValuesChange={onClearError}
      >
        <Row gutter={[16, 0]}>
          <Col xs={24} lg={12}>
            <Form.Item<CompanyProfileFormValues>
              name="name"
              label={<FieldLabel icon={<Building2 size={15} />} label="Company name" />}
              rules={[
                {
                  required: true,
                  message: "Company name is required.",
                },
                {
                  min: 2,
                  message: "Company name must be at least 2 characters.",
                },
                {
                  max: 191,
                  message: "Company name must be 191 characters or fewer.",
                },
              ]}
            >
              <Input placeholder="RAKA HRIS Indonesia" size="large" />
            </Form.Item>
          </Col>

          <Col xs={24} lg={12}>
            <Form.Item<CompanyProfileFormValues>
              name="email"
              label={<FieldLabel icon={<Mail size={15} />} label="Company email" />}
              rules={[
                {
                  type: "email",
                  message: "Please enter a valid email address.",
                },
                {
                  max: 191,
                  message: "Company email must be 191 characters or fewer.",
                },
              ]}
            >
              <Input placeholder="company@example.com" size="large" />
            </Form.Item>
          </Col>

          <Col xs={24} lg={12}>
            <Form.Item<CompanyProfileFormValues>
              name="phone"
              label={<FieldLabel icon={<Phone size={15} />} label="Phone number" />}
              rules={[
                {
                  pattern: /^\+?[0-9-\s]{8,24}$/,
                  message: "Use numbers, spaces, hyphens, and an optional + prefix.",
                },
              ]}
            >
              <Input placeholder="+628123456789" size="large" />
            </Form.Item>
          </Col>

          <Col xs={24} lg={12}>
            <Form.Item<CompanyProfileFormValues>
              name="timezone"
              label={<FieldLabel icon={<TimerReset size={15} />} label="Timezone" />}
            >
              <Select
                allowClear
                size="large"
                placeholder="Select company timezone"
                options={timezoneOptions}
              />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item<CompanyProfileFormValues>
              name="logoUrl"
              rules={[
                {
                  type: "url",
                  message: "Logo URL must be a valid URL.",
                },
                {
                  max: 500,
                  message: "Logo URL must be 500 characters or fewer.",
                },
              ]}
              hidden
            >
              <Input />
            </Form.Item>

            <Form.Item label={<FieldLabel icon={<ImageIcon size={15} />} label="Company logo" />}>
              <Space direction="vertical" size={12} style={{ width: "100%" }}>
                <Space size={10} wrap>
                  <Upload
                    accept={companyLogoAccept}
                    beforeUpload={validateLogoBeforeUpload}
                    customRequest={uploadCompanyLogo}
                    disabled={!canUpdate || isSubmitting || isLogoUploading}
                    maxCount={1}
                    showUploadList={false}
                  >
                    <Button
                      icon={<UploadCloud size={16} aria-hidden="true" focusable="false" />}
                      loading={isLogoUploading}
                      disabled={!canUpdate || isSubmitting}
                    >
                      Upload logo
                    </Button>
                  </Upload>

                  {logoUrl ? (
                    <Button
                      htmlType="button"
                      icon={<Trash2 size={16} aria-hidden="true" focusable="false" />}
                      disabled={!canUpdate || isSubmitting || isLogoUploading}
                      onClick={() => {
                        form.setFieldValue("logoUrl", null);
                        onClearError();
                      }}
                    >
                      Remove logo
                    </Button>
                  ) : null}
                </Space>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    border: "1px solid var(--raka-border-soft)",
                    borderRadius: 8,
                    padding: 12,
                    background: "var(--raka-surface-soft)",
                  }}
                >
                  <Avatar
                    shape="square"
                    size={52}
                    src={logoUrl || undefined}
                    icon={<ImageIcon size={22} aria-hidden="true" focusable="false" />}
                  />
                  <Space direction="vertical" size={2} style={{ minWidth: 0 }}>
                    <Text strong>{logoUrl ? "Logo uploaded" : "No logo uploaded"}</Text>
                    <Text type="secondary" style={{ wordBreak: "break-word" }}>
                      {logoUrl || "PNG, JPG, WebP, or SVG up to 2 MB."}
                    </Text>
                  </Space>
                </div>
              </Space>
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item<CompanyProfileFormValues>
              name="addressLine1"
              label={<FieldLabel icon={<MapPinned size={15} />} label="Address" />}
              rules={[
                {
                  max: 255,
                  message: "Address must be 255 characters or fewer.",
                },
              ]}
            >
              <Input.TextArea
                placeholder="Street, building, suite, or office address"
                autoSize={{ minRows: 3, maxRows: 5 }}
                size="large"
              />
            </Form.Item>
          </Col>

          <Col xs={24} lg={12}>
            <Form.Item<CompanyProfileFormValues>
              name="city"
              label="City"
              rules={[
                {
                  max: 100,
                  message: "City must be 100 characters or fewer.",
                },
              ]}
            >
              <Input placeholder="Denpasar" size="large" />
            </Form.Item>
          </Col>

          <Col xs={24} lg={12}>
            <Form.Item<CompanyProfileFormValues>
              name="province"
              label="Province"
              rules={[
                {
                  max: 100,
                  message: "Province must be 100 characters or fewer.",
                },
              ]}
            >
              <Input placeholder="Bali" size="large" />
            </Form.Item>
          </Col>
        </Row>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "flex-end",
            gap: 12,
            borderTop: "1px solid var(--raka-border-soft)",
            paddingTop: 18,
          }}
        >
          <Space>
            <Button
              htmlType="button"
              disabled={!canUpdate || isSubmitting}
              onClick={() => {
                form.resetFields();
                onClearError();
              }}
            >
              Reset
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<Save size={16} aria-hidden="true" focusable="false" />}
              loading={isSubmitting}
              disabled={!canUpdate}
            >
              Save profile
            </Button>
          </Space>
        </div>
      </Form>
    </Space>
  );
}

function FieldLabel({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      {icon}
      {label}
    </span>
  );
}
