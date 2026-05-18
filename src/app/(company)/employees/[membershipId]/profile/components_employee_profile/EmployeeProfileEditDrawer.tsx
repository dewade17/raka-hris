'use client';

import { Alert, Avatar, Button, Col, Drawer, Form, Input, Row, Select, Space, Typography, Upload, theme } from 'antd';
import { BriefcaseBusiness, CalendarDays, Contact, Hash, HeartHandshake, Image as ImageIcon, Mail, MapPinned, Phone, RotateCcw, Save, Trash2, UploadCloud, UserRound } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import type { FormProps } from 'antd';
import type { ReactNode } from 'react';
import { useUploadEmployeePhoto } from '../hooks/useUploadEmployeePhoto';
import type { EmployeeProfileEditFormValues, EmployeeProfileViewModel } from '../types';

type EmployeeProfileEditDrawerProps = {
  open: boolean;
  employee: EmployeeProfileViewModel;
  isSubmitting: boolean;
  errorMessage?: string;
  onClose: () => void;
  onClearError: () => void;
  onSubmit: (values: EmployeeProfileEditFormValues) => void | Promise<void>;
};

const statusOptions: Array<{ label: string; value: EmployeeProfileEditFormValues['status'] }> = [
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Suspended', value: 'SUSPENDED' },
];

const genderOptions = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
  { label: 'Other', value: 'Other' },
];

const maritalStatusOptions = [
  { label: 'Single', value: 'Single' },
  { label: 'Married', value: 'Married' },
  { label: 'Divorced', value: 'Divorced' },
  { label: 'Widowed', value: 'Widowed' },
];

export function EmployeeProfileEditDrawer({
  open,
  employee,
  isSubmitting,
  errorMessage,
  onClose,
  onClearError,
  onSubmit,
}: EmployeeProfileEditDrawerProps) {
  const { token } = theme.useToken();
  const [form] = Form.useForm<EmployeeProfileEditFormValues>();
  const photoUrl = Form.useWatch('photoUrl', form);

  const handlePhotoUploaded = useCallback(
    (uploadedPhotoUrl: string) => {
      form.setFieldValue('photoUrl', uploadedPhotoUrl);
      void form.validateFields(['photoUrl']).catch(() => undefined);
    },
    [form],
  );

  const { employeePhotoAccept, isPhotoUploading, uploadEmployeePhoto, validatePhotoBeforeUpload } = useUploadEmployeePhoto({
    membershipId: employee.membershipId,
    onClearError,
    onPhotoUploaded: handlePhotoUploaded,
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    form.setFieldsValue(getInitialValues(employee));
  }, [employee, form, open]);

  const handleFinish: FormProps<EmployeeProfileEditFormValues>['onFinish'] = (values) => {
    onSubmit(values);
  };

  const resetForm = () => {
    form.setFieldsValue(getInitialValues(employee));
    onClearError();
  };

  return (
    <Drawer
      title='Edit employee'
      open={open}
      size={620}
      onClose={onClose}
      footer={
        <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            onClick={resetForm}
            disabled={isSubmitting}
            icon={
              <RotateCcw
                size={15}
                aria-hidden='true'
                focusable='false'
              />
            }
          >
            Reset
          </Button>
          <Button
            type='primary'
            loading={isSubmitting}
            onClick={() => form.submit()}
            icon={
              <Save
                size={15}
                aria-hidden='true'
                focusable='false'
              />
            }
          >
            Update employee
          </Button>
        </Space>
      }
    >
      <Space
        direction='vertical'
        size={16}
        style={{ width: '100%' }}
      >
        <Typography.Text type='secondary'>Update login identity, employment status, and the core profile fields used in employee records.</Typography.Text>

        {errorMessage ? (
          <Alert
            showIcon
            type='error'
            message={errorMessage}
          />
        ) : null}

        <Form<EmployeeProfileEditFormValues>
          form={form}
          layout='vertical'
          requiredMark={false}
          disabled={isSubmitting}
          initialValues={getInitialValues(employee)}
          onFinish={handleFinish}
          onValuesChange={onClearError}
        >
          <Row gutter={14}>
            <Col xs={24}>
              <Form.Item<EmployeeProfileEditFormValues>
                name='fullName'
                label='Full name'
                rules={[
                  { required: true, message: 'Full name is required.' },
                  { min: 3, message: 'Full name must be at least 3 characters.' },
                  { max: 191, message: 'Full name must be 191 characters or fewer.' },
                ]}
              >
                <Input
                  size='large'
                  placeholder='Employee full name'
                  autoComplete='name'
                  prefix={
                    <UserRound
                      size={16}
                      aria-hidden='true'
                      focusable='false'
                    />
                  }
                />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item<EmployeeProfileEditFormValues>
                name='email'
                label='Email address'
                rules={[
                  { required: true, message: 'Email address is required.' },
                  { type: 'email', message: 'Please enter a valid email address.' },
                  { max: 191, message: 'Email address must be 191 characters or fewer.' },
                ]}
              >
                <Input
                  size='large'
                  type='email'
                  placeholder='employee@company.com'
                  autoComplete='email'
                  prefix={
                    <Mail
                      size={16}
                      aria-hidden='true'
                      focusable='false'
                    />
                  }
                />
              </Form.Item>
            </Col>

            <Col
              xs={24}
              md={12}
            >
              <Form.Item<EmployeeProfileEditFormValues>
                name='status'
                label='Status'
                rules={[{ required: true, message: 'Please choose a status.' }]}
              >
                <Select
                  size='large'
                  options={statusOptions}
                  disabled={employee.isOwner}
                />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item<EmployeeProfileEditFormValues>
                name='photoUrl'
                rules={[{ max: 500, message: 'Profile photo reference must be 500 characters or fewer.' }]}
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
                    label='Profile photo'
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
                    size={56}
                    src={photoUrl || undefined}
                    icon={
                      <UserRound
                        size={22}
                        aria-hidden='true'
                        focusable='false'
                      />
                    }
                    style={{
                      background: photoUrl ? token.colorBgContainer : token.colorPrimary,
                      color: token.colorTextLightSolid,
                      flexShrink: 0,
                    }}
                  />
                  <Space
                    direction='vertical'
                    size={2}
                    style={{ flex: 1, minWidth: 0 }}
                  >
                    <Typography.Text
                      strong
                      style={{ fontSize: 13 }}
                    >
                      {photoUrl ? 'Profile photo uploaded' : 'No profile photo uploaded'}
                    </Typography.Text>
                    {!photoUrl ? (
                      <Typography.Text
                        type='secondary'
                        style={{ fontSize: 12 }}
                      >
                        PNG, JPG, or WebP - max 2 MB
                      </Typography.Text>
                    ) : null}
                  </Space>
                  <Space
                    size={8}
                    style={{ flexShrink: 0 }}
                  >
                    <Upload
                      accept={employeePhotoAccept}
                      beforeUpload={validatePhotoBeforeUpload}
                      customRequest={uploadEmployeePhoto}
                      disabled={isSubmitting || isPhotoUploading}
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
                        loading={isPhotoUploading}
                        disabled={isSubmitting}
                        size='small'
                      >
                        {photoUrl ? 'Replace' : 'Upload'}
                      </Button>
                    </Upload>

                    {photoUrl ? (
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
                        disabled={isSubmitting || isPhotoUploading}
                        danger
                        onClick={() => {
                          form.setFieldValue('photoUrl', null);
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

            <Col
              xs={24}
              md={12}
            >
              <Form.Item<EmployeeProfileEditFormValues>
                name='employeeNumber'
                label='Employee number'
                rules={[{ max: 100, message: 'Employee number must be 100 characters or fewer.' }]}
              >
                <Input
                  size='large'
                  placeholder='EMP-001'
                  prefix={
                    <Hash
                      size={16}
                      aria-hidden='true'
                      focusable='false'
                    />
                  }
                />
              </Form.Item>
            </Col>

            <Col
              xs={24}
              md={12}
            >
              <Form.Item<EmployeeProfileEditFormValues>
                name='phone'
                label='Phone'
                rules={[{ max: 50, message: 'Phone number must be 50 characters or fewer.' }]}
              >
                <Input
                  size='large'
                  placeholder='+6281234567890'
                  autoComplete='tel'
                  prefix={
                    <Phone
                      size={16}
                      aria-hidden='true'
                      focusable='false'
                    />
                  }
                />
              </Form.Item>
            </Col>

            <Col
              xs={24}
              md={12}
            >
              <Form.Item<EmployeeProfileEditFormValues>
                name='emergencyContactName'
                label='Emergency contact name'
                rules={[{ max: 191, message: 'Emergency contact name must be 191 characters or fewer.' }]}
              >
                <Input
                  size='large'
                  placeholder='Emergency contact name'
                  prefix={
                    <HeartHandshake
                      size={16}
                      aria-hidden='true'
                      focusable='false'
                    />
                  }
                />
              </Form.Item>
            </Col>

            <Col
              xs={24}
              md={12}
            >
              <Form.Item<EmployeeProfileEditFormValues>
                name='emergencyContactPhone'
                label='Emergency contact phone'
                rules={[{ max: 50, message: 'Emergency contact phone must be 50 characters or fewer.' }]}
              >
                <Input
                  size='large'
                  placeholder='+6281234567890'
                  autoComplete='tel'
                  prefix={
                    <Phone
                      size={16}
                      aria-hidden='true'
                      focusable='false'
                    />
                  }
                />
              </Form.Item>
            </Col>

            <Col
              xs={24}
              md={12}
            >
              <Form.Item<EmployeeProfileEditFormValues>
                name='birthDate'
                label='Birth date'
              >
                <Input
                  size='large'
                  type='date'
                  prefix={
                    <CalendarDays
                      size={16}
                      aria-hidden='true'
                      focusable='false'
                    />
                  }
                />
              </Form.Item>
            </Col>

            <Col
              xs={24}
              md={12}
            >
              <Form.Item<EmployeeProfileEditFormValues>
                name='birthPlace'
                label='Birth place'
                rules={[{ max: 191, message: 'Birth place must be 191 characters or fewer.' }]}
              >
                <Input
                  size='large'
                  placeholder='Birth place'
                  prefix={
                    <Contact
                      size={16}
                      aria-hidden='true'
                      focusable='false'
                    />
                  }
                />
              </Form.Item>
            </Col>

            <Col
              xs={24}
              md={12}
            >
              <Form.Item<EmployeeProfileEditFormValues>
                name='gender'
                label='Gender'
              >
                <Select
                  allowClear
                  size='large'
                  options={genderOptions}
                  placeholder='Select gender'
                />
              </Form.Item>
            </Col>

            <Col
              xs={24}
              md={12}
            >
              <Form.Item<EmployeeProfileEditFormValues>
                name='maritalStatus'
                label='Marital status'
              >
                <Select
                  allowClear
                  size='large'
                  options={maritalStatusOptions}
                  placeholder='Select marital status'
                />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item<EmployeeProfileEditFormValues>
                name='addressLine1'
                label='Address'
                rules={[{ max: 255, message: 'Address must be 255 characters or fewer.' }]}
              >
                <Input
                  size='large'
                  placeholder='Street address'
                  prefix={
                    <MapPinned
                      size={16}
                      aria-hidden='true'
                      focusable='false'
                    />
                  }
                />
              </Form.Item>
            </Col>

            <Col
              xs={24}
              md={12}
            >
              <Form.Item<EmployeeProfileEditFormValues>
                name='city'
                label='City'
                rules={[{ max: 100, message: 'City must be 100 characters or fewer.' }]}
              >
                <Input
                  size='large'
                  placeholder='City'
                />
              </Form.Item>
            </Col>

            <Col
              xs={24}
              md={12}
            >
              <Form.Item<EmployeeProfileEditFormValues>
                name='province'
                label='Province'
                rules={[{ max: 100, message: 'Province must be 100 characters or fewer.' }]}
              >
                <Input
                  size='large'
                  placeholder='Province'
                />
              </Form.Item>
            </Col>

            <Col
              xs={24}
              md={12}
            >
              <Form.Item<EmployeeProfileEditFormValues>
                name='employmentType'
                label='Employment type'
                rules={[{ max: 50, message: 'Employment type must be 50 characters or fewer.' }]}
              >
                <Input
                  size='large'
                  placeholder='Full-time'
                  prefix={
                    <BriefcaseBusiness
                      size={16}
                      aria-hidden='true'
                      focusable='false'
                    />
                  }
                />
              </Form.Item>
            </Col>

            <Col
              xs={24}
              md={12}
            >
              <Form.Item<EmployeeProfileEditFormValues>
                name='hireDate'
                label='Hire date'
              >
                <Input
                  size='large'
                  type='date'
                  prefix={
                    <CalendarDays
                      size={16}
                      aria-hidden='true'
                      focusable='false'
                    />
                  }
                />
              </Form.Item>
            </Col>

            <Col
              xs={24}
              md={12}
            >
              <Form.Item<EmployeeProfileEditFormValues>
                name='probationEndDate'
                label='Probation end date'
              >
                <Input
                  size='large'
                  type='date'
                  prefix={
                    <CalendarDays
                      size={16}
                      aria-hidden='true'
                      focusable='false'
                    />
                  }
                />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item<EmployeeProfileEditFormValues>
                name='notes'
                label='Notes'
                rules={[{ max: 2000, message: 'Notes must be 2000 characters or fewer.' }]}
                style={{ marginBottom: 0 }}
              >
                <Input.TextArea
                  rows={4}
                  placeholder='Employee notes'
                  showCount
                  maxLength={2000}
                  autoSize={{ minRows: 4, maxRows: 8 }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Space>
    </Drawer>
  );
}

function FieldLabel({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <Space size={6}>
      {icon}
      <span>{label}</span>
    </Space>
  );
}

function getInitialValues(employee: EmployeeProfileViewModel): EmployeeProfileEditFormValues {
  return {
    fullName: employee.user.name,
    email: employee.user.email ?? '',
    status: employee.status === 'SUSPENDED' ? 'SUSPENDED' : 'ACTIVE',
    employeeNumber: employee.profile?.employeeNumber ?? '',
    phone: employee.profile?.phone ?? '',
    emergencyContactName: employee.profile?.emergencyContactName ?? '',
    emergencyContactPhone: employee.profile?.emergencyContactPhone ?? '',
    birthDate: employee.profile?.birthDate ? employee.profile.birthDate.slice(0, 10) : '',
    birthPlace: employee.profile?.birthPlace ?? '',
    gender: employee.profile?.gender ?? '',
    maritalStatus: employee.profile?.maritalStatus ?? '',
    addressLine1: employee.profile?.addressLine1 ?? '',
    city: employee.profile?.city ?? '',
    province: employee.profile?.province ?? '',
    employmentType: employee.profile?.employmentType ?? '',
    hireDate: employee.profile?.hireDate ? employee.profile.hireDate.slice(0, 10) : '',
    probationEndDate: employee.profile?.probationEndDate ? employee.profile.probationEndDate.slice(0, 10) : '',
    photoUrl: employee.profile?.photoUrl ?? '',
    notes: employee.profile?.notes ?? '',
  };
}
