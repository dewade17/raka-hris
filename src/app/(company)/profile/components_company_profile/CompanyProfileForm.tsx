'use client';

import { Alert, Avatar, Button, Col, Form, Input, Row, Select, Space, Typography, Upload, theme } from 'antd';
import { Building2, Image as ImageIcon, Mail, MapPinned, Phone, RotateCcw, Save, TimerReset, Trash2, UploadCloud } from 'lucide-react';
import type { FormProps } from 'antd';
import { useCallback, type ReactNode } from 'react';
import { useUploadCompanyLogo } from '../hooks/useUploadCompanyLogo';

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
    label: 'Western Indonesia Time — Asia/Jakarta',
    value: 'Asia/Jakarta',
  },
  {
    label: 'Central Indonesia Time — Asia/Makassar',
    value: 'Asia/Makassar',
  },
  {
    label: 'Eastern Indonesia Time — Asia/Jayapura',
    value: 'Asia/Jayapura',
  },
  {
    label: 'UTC',
    value: 'UTC',
  },
];

export function CompanyProfileForm({ initialValues, canUpdate, isSubmitting, errorMessage, onSubmit, onClearError }: CompanyProfileFormProps) {
  const { token } = theme.useToken();
  const [form] = Form.useForm<CompanyProfileFormValues>();
  const logoUrl = Form.useWatch('logoUrl', form);

  const handleFinish: FormProps<CompanyProfileFormValues>['onFinish'] = (values) => {
    onSubmit(values);
  };

  const handleLogoUploaded = useCallback(
    (uploadedLogoUrl: string) => {
      form.setFieldValue('logoUrl', uploadedLogoUrl);
      void form.validateFields(['logoUrl']).catch(() => undefined);
    },
    [form],
  );

  const { companyLogoAccept, isLogoUploading, uploadCompanyLogo, validateLogoBeforeUpload } = useUploadCompanyLogo({
    onClearError,
    onLogoUploaded: handleLogoUploaded,
  });

  return (
    <Space
      orientation='vertical'
      size={0}
      style={{ width: '100%' }}
    >
      {errorMessage ? (
        <Alert
          showIcon
          type='error'
          title={errorMessage}
          style={{ marginBottom: 20 }}
        />
      ) : null}

      {!canUpdate ? (
        <Alert
          showIcon
          type='info'
          title='You can review the company profile, but you do not have permission to update it.'
          style={{ marginBottom: 20 }}
        />
      ) : null}

      <Form<CompanyProfileFormValues>
        form={form}
        layout='vertical'
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
        <SectionDivider label='Identity' />

        <Row gutter={[16, 0]}>
          <Col
            xs={24}
            lg={12}
          >
            <Form.Item<CompanyProfileFormValues>
              name='name'
              label={
                <FieldLabel
                  icon={
                    <Building2
                      size={14}
                      aria-hidden='true'
                      focusable='false'
                    />
                  }
                  label='Company name'
                />
              }
              rules={[
                { required: true, message: 'Company name is required.' },
                {
                  min: 2,
                  message: 'Company name must be at least 2 characters.',
                },
                {
                  max: 191,
                  message: 'Company name must be 191 characters or fewer.',
                },
              ]}
            >
              <Input
                placeholder='RAKA HRIS Indonesia'
                size='large'
              />
            </Form.Item>
          </Col>

          <Col
            xs={24}
            lg={12}
          >
            <Form.Item<CompanyProfileFormValues>
              name='timezone'
              label={
                <FieldLabel
                  icon={
                    <TimerReset
                      size={14}
                      aria-hidden='true'
                      focusable='false'
                    />
                  }
                  label='Timezone'
                />
              }
            >
              <Select
                allowClear
                size='large'
                placeholder='Select company timezone'
                options={timezoneOptions}
              />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item<CompanyProfileFormValues>
              name='logoUrl'
              rules={[
                { type: 'url', message: 'Logo URL must be a valid URL.' },
                {
                  max: 500,
                  message: 'Logo URL must be 500 characters or fewer.',
                },
              ]}
              hidden
            >
              <Input />
            </Form.Item>

            <Form.Item
              label={
                <FieldLabel
                  icon={
                    <ImageIcon
                      size={14}
                      aria-hidden='true'
                      focusable='false'
                    />
                  }
                  label='Company logo'
                />
              }
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  border: `1.5px dashed ${token.colorBorderSecondary}`,
                  borderRadius: token.borderRadiusLG,
                  padding: '16px 18px',
                  background: token.colorFillAlter,
                }}
              >
                <Avatar
                  shape='square'
                  size={52}
                  src={logoUrl || undefined}
                  icon={
                    <ImageIcon
                      size={22}
                      aria-hidden='true'
                      focusable='false'
                    />
                  }
                  style={{
                    borderRadius: token.borderRadius,
                    background: logoUrl ? token.colorBgContainer : token.colorPrimary,
                    color: token.colorTextLightSolid,
                    flexShrink: 0,
                  }}
                />
                <Space
                  orientation='vertical'
                  size={2}
                  style={{ flex: 1, minWidth: 0 }}
                >
                  <Text
                    strong
                    style={{ fontSize: 13 }}
                  >
                    {logoUrl ? 'Logo uploaded' : 'No logo uploaded'}
                  </Text>
                  {!logoUrl ? (
                    <Text
                      type='secondary'
                      style={{ fontSize: 12 }}
                    >
                      PNG, JPG, WebP, or SVG — max 2 MB
                    </Text>
                  ) : null}
                </Space>
                <Space
                  size={8}
                  style={{ flexShrink: 0 }}
                >
                  <Upload
                    accept={companyLogoAccept}
                    beforeUpload={validateLogoBeforeUpload}
                    customRequest={uploadCompanyLogo}
                    disabled={!canUpdate || isSubmitting || isLogoUploading}
                    maxCount={1}
                    showUploadList={false}
                  >
                    <Button
                      icon={
                        <UploadCloud
                          size={15}
                          aria-hidden='true'
                          focusable='false'
                        />
                      }
                      loading={isLogoUploading}
                      disabled={!canUpdate || isSubmitting}
                      size='small'
                    >
                      {logoUrl ? 'Replace' : 'Upload'}
                    </Button>
                  </Upload>

                  {logoUrl ? (
                    <Button
                      htmlType='button'
                      size='small'
                      icon={
                        <Trash2
                          size={15}
                          aria-hidden='true'
                          focusable='false'
                        />
                      }
                      disabled={!canUpdate || isSubmitting || isLogoUploading}
                      danger
                      onClick={() => {
                        form.setFieldValue('logoUrl', null);
                        onClearError();
                      }}
                    >
                      Delete
                    </Button>
                  ) : null}
                </Space>
              </div>
            </Form.Item>
          </Col>
        </Row>

        <SectionDivider label='Contact' />

        <Row gutter={[16, 0]}>
          <Col
            xs={24}
            lg={12}
          >
            <Form.Item<CompanyProfileFormValues>
              name='email'
              label={
                <FieldLabel
                  icon={
                    <Mail
                      size={14}
                      aria-hidden='true'
                      focusable='false'
                    />
                  }
                  label='Company email'
                />
              }
              rules={[
                {
                  type: 'email',
                  message: 'Please enter a valid email address.',
                },
                {
                  max: 191,
                  message: 'Company email must be 191 characters or fewer.',
                },
              ]}
            >
              <Input
                placeholder='company@example.com'
                size='large'
              />
            </Form.Item>
          </Col>

          <Col
            xs={24}
            lg={12}
          >
            <Form.Item<CompanyProfileFormValues>
              name='phone'
              label={
                <FieldLabel
                  icon={
                    <Phone
                      size={14}
                      aria-hidden='true'
                      focusable='false'
                    />
                  }
                  label='Phone number'
                />
              }
              rules={[
                {
                  pattern: /^\+?[0-9\-\s]{8,24}$/,
                  message: 'Use numbers, spaces, hyphens, and an optional + prefix.',
                },
              ]}
            >
              <Input
                placeholder='+628123456789'
                size='large'
              />
            </Form.Item>
          </Col>
        </Row>

        <SectionDivider label='Location' />

        <Row gutter={[16, 0]}>
          <Col xs={24}>
            <Form.Item<CompanyProfileFormValues>
              name='addressLine1'
              label={
                <FieldLabel
                  icon={
                    <MapPinned
                      size={14}
                      aria-hidden='true'
                      focusable='false'
                    />
                  }
                  label='Address'
                />
              }
              rules={[
                {
                  max: 255,
                  message: 'Address must be 255 characters or fewer.',
                },
              ]}
            >
              <Input.TextArea
                placeholder='Street, building, suite, or office address'
                autoSize={{ minRows: 3, maxRows: 5 }}
                size='large'
              />
            </Form.Item>
          </Col>

          <Col
            xs={24}
            lg={12}
          >
            <Form.Item<CompanyProfileFormValues>
              name='city'
              label='City'
              rules={[
                {
                  max: 100,
                  message: 'City must be 100 characters or fewer.',
                },
              ]}
            >
              <Input
                placeholder='Denpasar'
                size='large'
              />
            </Form.Item>
          </Col>

          <Col
            xs={24}
            lg={12}
          >
            <Form.Item<CompanyProfileFormValues>
              name='province'
              label='Province'
              rules={[
                {
                  max: 100,
                  message: 'Province must be 100 characters or fewer.',
                },
              ]}
            >
              <Input
                placeholder='Bali'
                size='large'
              />
            </Form.Item>
          </Col>
        </Row>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 10,
            borderTop: `1px solid ${token.colorBorderSecondary}`,
            paddingTop: 20,
            marginTop: 4,
          }}
        >
          <Button
            htmlType='button'
            icon={
              <RotateCcw
                size={15}
                aria-hidden='true'
                focusable='false'
              />
            }
            disabled={!canUpdate || isSubmitting}
            onClick={() => {
              form.resetFields();
              onClearError();
            }}
          >
            Reset
          </Button>
          <Button
            type='primary'
            htmlType='submit'
            icon={
              <Save
                size={15}
                aria-hidden='true'
                focusable='false'
              />
            }
            loading={isSubmitting}
            disabled={!canUpdate}
          >
            Save profile
          </Button>
        </div>
      </Form>
    </Space>
  );
}

function SectionDivider({ label }: { label: string }) {
  const { token } = theme.useToken();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16,
        marginTop: 4,
      }}
    >
      <Text
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: token.colorTextTertiary,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        {label}
      </Text>
      <div
        style={{
          flex: 1,
          height: 1,
          background: token.colorBorderSecondary,
        }}
        aria-hidden='true'
      />
    </div>
  );
}

function FieldLabel({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
      {icon}
      {label}
    </span>
  );
}
