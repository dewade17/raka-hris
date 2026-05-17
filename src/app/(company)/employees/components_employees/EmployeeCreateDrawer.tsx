'use client';

import { Alert, Button, Drawer, Form, Input, Select, Space, Typography } from 'antd';
import { BriefcaseBusiness, Building2, Lock, Mail, RotateCcw, Save, UserRoundPlus } from 'lucide-react';
import { useEffect } from 'react';
import type { FormProps } from 'antd';
import type { EmployeeCreateAssignmentOption } from '../types';

export type EmployeeCreateFormValues = {
  fullName: string;
  email: string;
  password: string;
  departmentId: string;
  positionId: string;
};

type EmployeeCreateDrawerProps = {
  open: boolean;
  departmentOptions: EmployeeCreateAssignmentOption[];
  positionOptions: EmployeeCreateAssignmentOption[];
  isSubmitting: boolean;
  errorMessage?: string;
  onClose: () => void;
  onClearError: () => void;
  onSubmit: (values: EmployeeCreateFormValues) => void | Promise<void>;
};

const emptyEmployeeCreateFormValues: EmployeeCreateFormValues = {
  fullName: '',
  email: '',
  password: '',
  departmentId: '',
  positionId: '',
};

export function EmployeeCreateDrawer({
  open,
  departmentOptions,
  positionOptions,
  isSubmitting,
  errorMessage,
  onClose,
  onClearError,
  onSubmit,
}: EmployeeCreateDrawerProps) {
  const [form] = Form.useForm<EmployeeCreateFormValues>();

  useEffect(() => {
    if (!open) {
      return;
    }

    form.setFieldsValue(emptyEmployeeCreateFormValues);
  }, [form, open]);

  const handleFinish: FormProps<EmployeeCreateFormValues>['onFinish'] = (values) => {
    onSubmit(values);
  };

  const resetForm = () => {
    form.setFieldsValue(emptyEmployeeCreateFormValues);
    onClearError();
  };

  return (
    <Drawer
      title='New employee'
      open={open}
      size={520}
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
            Create employee
          </Button>
        </Space>
      }
    >
      <Space
        direction='vertical'
        size={16}
        style={{ width: '100%' }}
      >
        <Typography.Text type='secondary'>Create login access and assign the employee to their starting department and position.</Typography.Text>

        {errorMessage ? (
          <Alert
            showIcon
            type='error'
            message={errorMessage}
          />
        ) : null}

        <Form<EmployeeCreateFormValues>
          form={form}
          layout='vertical'
          requiredMark={false}
          disabled={isSubmitting}
          initialValues={emptyEmployeeCreateFormValues}
          onFinish={handleFinish}
          onValuesChange={onClearError}
        >
          <Form.Item<EmployeeCreateFormValues>
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
                <UserRoundPlus
                  size={16}
                  aria-hidden='true'
                  focusable='false'
                />
              }
            />
          </Form.Item>

          <Form.Item<EmployeeCreateFormValues>
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

          <Form.Item<EmployeeCreateFormValues>
            name='password'
            label='Temporary password'
            rules={[
              { required: true, message: 'Temporary password is required.' },
              { min: 8, message: 'Password must be at least 8 characters.' },
              { max: 128, message: 'Password must be 128 characters or fewer.' },
              {
                pattern: /^(?=.*[A-Za-z])(?=.*\d).+$/,
                message: 'Password must include at least one letter and one number.',
              },
            ]}
          >
            <Input.Password
              size='large'
              placeholder='Temporary password'
              autoComplete='new-password'
              prefix={
                <Lock
                  size={16}
                  aria-hidden='true'
                  focusable='false'
                />
              }
            />
          </Form.Item>

          <Form.Item<EmployeeCreateFormValues>
            name='departmentId'
            label='Department'
            rules={[{ required: true, message: 'Please choose a department.' }]}
          >
            <Select
              showSearch
              size='large'
              optionFilterProp='label'
              placeholder='Select department'
              options={departmentOptions}
              notFoundContent='No active departments found'
              suffixIcon={
                <Building2
                  size={16}
                  aria-hidden='true'
                  focusable='false'
                />
              }
            />
          </Form.Item>

          <Form.Item<EmployeeCreateFormValues>
            name='positionId'
            label='Position'
            rules={[{ required: true, message: 'Please choose a position.' }]}
            style={{ marginBottom: 0 }}
          >
            <Select
              showSearch
              size='large'
              optionFilterProp='label'
              placeholder='Select position'
              options={positionOptions}
              notFoundContent='No active positions found'
              suffixIcon={
                <BriefcaseBusiness
                  size={16}
                  aria-hidden='true'
                  focusable='false'
                />
              }
            />
          </Form.Item>
        </Form>
      </Space>
    </Drawer>
  );
}
