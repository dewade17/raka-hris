'use client';

import { Alert, Button, Drawer, Form, Input, Space, Switch, Typography } from 'antd';
import { RotateCcw, Save } from 'lucide-react';
import { useEffect } from 'react';
import type { FormProps } from 'antd';
import type { DepartmentViewModel } from './DepartmentPageClient';

export type DepartmentFormValues = {
  name: string;
  isActive: boolean;
};

type DepartmentFormDrawerProps = {
  open: boolean;
  department?: DepartmentViewModel;
  isSubmitting: boolean;
  errorMessage?: string;
  onClose: () => void;
  onClearError: () => void;
  onSubmit: (values: DepartmentFormValues) => void | Promise<void>;
};

export function DepartmentFormDrawer({ open, department, isSubmitting, errorMessage, onClose, onClearError, onSubmit }: DepartmentFormDrawerProps) {
  const [form] = Form.useForm<DepartmentFormValues>();
  const isUpdate = Boolean(department);

  useEffect(() => {
    if (!open) {
      return;
    }

    form.setFieldsValue({
      name: department?.name ?? '',
      isActive: department?.isActive ?? true,
    });
  }, [department, form, open]);

  const handleFinish: FormProps<DepartmentFormValues>['onFinish'] = (values) => {
    onSubmit(values);
  };

  return (
    <Drawer
      title={isUpdate ? 'Edit department' : 'New department'}
      open={open}
      width={440}
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
            {isUpdate ? 'Update department' : 'Create department'}
          </Button>
        </Space>
      }
    >
      <Space
        direction='vertical'
        size={16}
        style={{ width: '100%' }}
      >
        <Typography.Text type='secondary'>
          Use departments to group employees by team, function, or business unit.
        </Typography.Text>

        {errorMessage ? (
          <Alert
            showIcon
            type='error'
            message={errorMessage}
          />
        ) : null}

        <Form<DepartmentFormValues>
          form={form}
          layout='vertical'
          requiredMark={false}
          disabled={isSubmitting}
          initialValues={{ name: '', isActive: true }}
          onFinish={handleFinish}
          onValuesChange={onClearError}
        >
          <Form.Item<DepartmentFormValues>
            name='name'
            label='Department name'
            rules={[
              { required: true, message: 'Department name is required.' },
              { min: 2, message: 'Department name must be at least 2 characters.' },
              { max: 191, message: 'Department name must be 191 characters or fewer.' },
            ]}
          >
            <Input
              size='large'
              placeholder='Human Resources'
            />
          </Form.Item>

          <Form.Item<DepartmentFormValues>
            name='isActive'
            label='Status'
            valuePropName='checked'
          >
            <Switch
              checkedChildren='Active'
              unCheckedChildren='Inactive'
            />
          </Form.Item>
        </Form>
      </Space>
    </Drawer>
  );
}
