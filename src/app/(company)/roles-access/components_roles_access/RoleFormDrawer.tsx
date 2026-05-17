'use client';

import { Alert, Button, Drawer, Form, Input, Space, Typography } from 'antd';
import { RotateCcw, Save } from 'lucide-react';
import { useEffect } from 'react';
import type { FormProps } from 'antd';
import type { CompanyRoleAccessItem } from '@/features/auth/permissions/types';

export type RoleFormValues = {
  name: string;
  description?: string;
};

type RoleFormDrawerProps = {
  open: boolean;
  role?: CompanyRoleAccessItem;
  isSubmitting: boolean;
  errorMessage?: string;
  onClose: () => void;
  onClearError: () => void;
  onSubmit: (values: RoleFormValues) => void | Promise<void>;
};

export function RoleFormDrawer({ open, role, isSubmitting, errorMessage, onClose, onClearError, onSubmit }: RoleFormDrawerProps) {
  const [form] = Form.useForm<RoleFormValues>();
  const isUpdate = Boolean(role);

  useEffect(() => {
    if (!open) {
      return;
    }

    form.setFieldsValue({
      name: role?.name ?? '',
      description: role?.description ?? '',
    });
  }, [form, open, role]);

  const handleFinish: FormProps<RoleFormValues>['onFinish'] = (values) => {
    onSubmit(values);
  };

  return (
    <Drawer
      title={isUpdate ? 'Edit role' : 'New role'}
      open={open}
      size={440}
      onClose={onClose}
      footer={
        <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            onClick={() => {
              form.resetFields();
              onClearError();
            }}
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
            {isUpdate ? 'Update role' : 'Create role'}
          </Button>
        </Space>
      }
    >
      <Space
        orientation='vertical'
        size={16}
        style={{ width: '100%' }}
      >
        <Typography.Text type='secondary'>Create role names that match how this company manages employee access.</Typography.Text>

        {errorMessage ? (
          <Alert
            showIcon
            type='error'
            message={errorMessage}
          />
        ) : null}

        <Form<RoleFormValues>
          form={form}
          layout='vertical'
          requiredMark={false}
          disabled={isSubmitting}
          initialValues={{ name: '', description: '' }}
          onFinish={handleFinish}
          onValuesChange={onClearError}
        >
          <Form.Item<RoleFormValues>
            name='name'
            label='Role name'
            rules={[
              { required: true, message: 'Role name is required.' },
              { min: 2, message: 'Role name must be at least 2 characters.' },
              { max: 191, message: 'Role name must be 191 characters or fewer.' },
            ]}
          >
            <Input
              size='large'
              placeholder='Payroll Admin'
            />
          </Form.Item>

          <Form.Item<RoleFormValues>
            name='description'
            label='Description'
            rules={[{ max: 500, message: 'Role description must be 500 characters or fewer.' }]}
          >
            <Input.TextArea
              rows={4}
              placeholder='Describe what this role is responsible for.'
            />
          </Form.Item>
        </Form>
      </Space>
    </Drawer>
  );
}
