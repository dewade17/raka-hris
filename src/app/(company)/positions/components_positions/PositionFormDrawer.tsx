'use client';

import { Alert, Button, Drawer, Form, Input, Space, Switch, Typography } from 'antd';
import { RotateCcw, Save } from 'lucide-react';
import { useEffect } from 'react';
import type { FormProps } from 'antd';
import type { PositionViewModel } from './PositionPageClient';

export type PositionFormValues = {
  name: string;
  isActive: boolean;
};

type PositionFormDrawerProps = {
  open: boolean;
  position?: PositionViewModel;
  isSubmitting: boolean;
  errorMessage?: string;
  onClose: () => void;
  onClearError: () => void;
  onSubmit: (values: PositionFormValues) => void | Promise<void>;
};

export function PositionFormDrawer({ open, position, isSubmitting, errorMessage, onClose, onClearError, onSubmit }: PositionFormDrawerProps) {
  const [form] = Form.useForm<PositionFormValues>();
  const isUpdate = Boolean(position);

  useEffect(() => {
    if (!open) {
      return;
    }

    form.setFieldsValue({
      name: position?.name ?? '',
      isActive: position?.isActive ?? true,
    });
  }, [form, open, position]);

  const handleFinish: FormProps<PositionFormValues>['onFinish'] = (values) => {
    onSubmit(values);
  };

  return (
    <Drawer
      title={isUpdate ? 'Edit position' : 'New position'}
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
            {isUpdate ? 'Update position' : 'Create position'}
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
          Use positions to define employee roles in the company.
        </Typography.Text>

        {errorMessage ? (
          <Alert
            showIcon
            type='error'
            message={errorMessage}
          />
        ) : null}

        <Form<PositionFormValues>
          form={form}
          layout='vertical'
          requiredMark={false}
          disabled={isSubmitting}
          initialValues={{ name: '', isActive: true }}
          onFinish={handleFinish}
          onValuesChange={onClearError}
        >
          <Form.Item<PositionFormValues>
            name='name'
            label='Position name'
            rules={[
              { required: true, message: 'Position name is required.' },
              { min: 2, message: 'Position name must be at least 2 characters.' },
              { max: 191, message: 'Position name must be 191 characters or fewer.' },
            ]}
          >
            <Input
              size='large'
              placeholder='HR Manager'
            />
          </Form.Item>

          <Form.Item<PositionFormValues>
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
