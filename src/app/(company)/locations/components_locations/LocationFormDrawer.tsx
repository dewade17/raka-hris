'use client';

import { Alert, Button, Drawer, Form, Input, InputNumber, Space, Switch, Typography } from 'antd';
import { RotateCcw, Save } from 'lucide-react';
import { useEffect } from 'react';
import type { FormProps } from 'antd';
import { LocationCoordinatePicker } from './LocationCoordinatePicker';
import type { LocationViewModel } from './LocationPageClient';

export type LocationFormValues = {
  name: string;
  latitude?: number | string | null;
  longitude?: number | string | null;
  isActive: boolean;
};

type LocationFormDrawerProps = {
  open: boolean;
  location?: LocationViewModel;
  isSubmitting: boolean;
  errorMessage?: string;
  onClose: () => void;
  onClearError: () => void;
  onSubmit: (values: LocationFormValues) => void | Promise<void>;
};

export function LocationFormDrawer({ open, location, isSubmitting, errorMessage, onClose, onClearError, onSubmit }: LocationFormDrawerProps) {
  const [form] = Form.useForm<LocationFormValues>();
  const isUpdate = Boolean(location);
  const watchedLatitude = normalizeCoordinate(Form.useWatch('latitude', form));
  const watchedLongitude = normalizeCoordinate(Form.useWatch('longitude', form));

  useEffect(() => {
    if (!open) {
      return;
    }

    form.setFieldsValue({
      name: location?.name ?? '',
      latitude: normalizeCoordinate(location?.latitude),
      longitude: normalizeCoordinate(location?.longitude),
      isActive: location?.isActive ?? true,
    });
  }, [form, location, open]);

  const handleFinish: FormProps<LocationFormValues>['onFinish'] = (values) => {
    onSubmit(values);
  };

  const handleCoordinateChange = ({ latitude, longitude }: { latitude: number; longitude: number }) => {
    form.setFieldsValue({ latitude, longitude });
    onClearError();
    void form.validateFields(['latitude', 'longitude']).catch(() => undefined);
  };

  return (
    <Drawer
      title={isUpdate ? 'Edit location' : 'New location'}
      open={open}
      size={480}
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
            {isUpdate ? 'Update location' : 'Create location'}
          </Button>
        </Space>
      }
    >
      <Space
        orientation='vertical'
        size={16}
        style={{ width: '100%' }}
      >
        <Typography.Text type='secondary'>Set the work site name and choose a point on the map when coordinates are needed.</Typography.Text>

        {errorMessage ? (
          <Alert
            showIcon
            type='error'
            message={errorMessage}
          />
        ) : null}

        <Form<LocationFormValues>
          form={form}
          layout='vertical'
          requiredMark={false}
          disabled={isSubmitting}
          initialValues={{ name: '', latitude: null, longitude: null, isActive: true }}
          onFinish={handleFinish}
          onValuesChange={onClearError}
        >
          <Form.Item<LocationFormValues>
            name='name'
            label='Location name'
            rules={[
              { required: true, message: 'Location name is required.' },
              { min: 2, message: 'Location name must be at least 2 characters.' },
              { max: 191, message: 'Location name must be 191 characters or fewer.' },
            ]}
          >
            <Input
              size='large'
              placeholder='Head Office'
            />
          </Form.Item>

          <Form.Item<LocationFormValues>
            name='latitude'
            label='Latitude'
            rules={[
              {
                type: 'number',
                min: -90,
                max: 90,
                message: 'Latitude must be between -90 and 90.',
              },
            ]}
          >
            <InputNumber
              size='large'
              placeholder='-8.650000'
              precision={6}
              step='0.000001'
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item<LocationFormValues>
            name='longitude'
            label='Longitude'
            rules={[
              {
                type: 'number',
                min: -180,
                max: 180,
                message: 'Longitude must be between -180 and 180.',
              },
            ]}
          >
            <InputNumber
              size='large'
              placeholder='115.216667'
              precision={6}
              step='0.000001'
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item label='Map location'>
            <LocationCoordinatePicker
              latitude={watchedLatitude}
              longitude={watchedLongitude}
              disabled={isSubmitting}
              onChange={handleCoordinateChange}
            />
          </Form.Item>

          <Form.Item<LocationFormValues>
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

function normalizeCoordinate(value: LocationFormValues['latitude']) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const numericValue = typeof value === 'number' ? value : Number(value);

  return Number.isFinite(numericValue) ? numericValue : null;
}
