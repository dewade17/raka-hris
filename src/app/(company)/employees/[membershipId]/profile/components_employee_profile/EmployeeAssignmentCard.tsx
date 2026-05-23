'use client';

import { Alert, Button, Card, Col, Form, Row, Select, Space, Tag, Typography, theme } from 'antd';
import { Building2, RotateCcw } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import type { UpdateEmployeeAssignmentInput } from '@/features/company/employees/types';
import { useUpdateEmployeeAssignment } from '../hooks/useUpdateEmployeeAssignment';
import type { EmployeeAssignmentFormValues, EmployeeAssignmentOption, EmployeeAssignmentViewModel, EmployeeProfileViewModel } from '../types';

const { Text } = Typography;

type EmployeeAssignmentCardProps = {
  employee: EmployeeProfileViewModel;
  canManage: boolean;
  departmentOptions: EmployeeAssignmentOption[];
  positionOptions: EmployeeAssignmentOption[];
};

export function EmployeeAssignmentCard({ employee, canManage, departmentOptions, positionOptions }: EmployeeAssignmentCardProps) {
  const { token } = theme.useToken();
  const [form] = Form.useForm<EmployeeAssignmentFormValues>();
  const { clearErrorMessage, errorMessage, isSubmitting, updateEmployeeAssignment } = useUpdateEmployeeAssignment(employee.membershipId);
  const selectedDepartmentId = Form.useWatch('departmentId', form);
  const selectedPositionId = Form.useWatch('positionId', form);
  const selectedDepartment = findOptionLabel(departmentOptions, selectedDepartmentId ?? form.getFieldValue('departmentId'));
  const selectedPosition = findOptionLabel(positionOptions, selectedPositionId ?? form.getFieldValue('positionId'));
  const initialDepartmentId = employee.primaryDepartment?.sourceId;
  const initialPositionId = employee.primaryPosition?.sourceId;
  const hasChanges = normalizeFormId(selectedDepartmentId ?? form.getFieldValue('departmentId')) !== normalizeFormId(initialDepartmentId) || normalizeFormId(selectedPositionId ?? form.getFieldValue('positionId')) !== normalizeFormId(initialPositionId);

  useEffect(() => {
    form.setFieldsValue({
      departmentId: initialDepartmentId,
      positionId: initialPositionId,
    });
    clearErrorMessage();
  }, [clearErrorMessage, form, initialDepartmentId, initialPositionId]);

  const resetAssignmentForm = () => {
    form.setFieldsValue({
      departmentId: initialDepartmentId,
      positionId: initialPositionId,
    });
    clearErrorMessage();
  };

  const handleSubmit = async (values: EmployeeAssignmentFormValues) => {
    const payload = buildChangedAssignmentPayload(values, {
      departmentId: initialDepartmentId,
      positionId: initialPositionId,
    });

    if (Object.keys(payload).length === 0) {
      return;
    }

    await updateEmployeeAssignment(payload);
  };

  return (
    <Card
      title={
        <SectionTitle
          icon={
            <Building2
              size={16}
              aria-hidden='true'
              focusable='false'
            />
          }
          label='Assignment'
        />
      }
      variant='borderless'
      style={{
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
      }}
      extra={
        canManage ? (
          <Space size={8}>
            <Button
              icon={
                <RotateCcw
                  size={15}
                  aria-hidden='true'
                  focusable='false'
                />
              }
              disabled={isSubmitting || !hasChanges}
              onClick={resetAssignmentForm}
            >
              Reset
            </Button>
            <Button
              type='primary'
              loading={isSubmitting}
              disabled={!hasChanges}
              onClick={() => form.submit()}
            >
              Save assignment
            </Button>
          </Space>
        ) : null
      }
    >
      <Space
        orientation='vertical'
        size={16}
        style={{ width: '100%' }}
      >
        <Space
          size={8}
          wrap
        >
          <AssignmentTag
            label='Primary department'
            assignment={employee.primaryDepartment}
          />
          <AssignmentTag
            label='Primary position'
            assignment={employee.primaryPosition}
          />
        </Space>

        <Alert
          showIcon
          type={canManage ? 'info' : 'warning'}
          message={canManage ? 'Save changes to update this employee primary department or position.' : 'You can review assignments, but you do not have permission to update them.'}
        />

        {errorMessage ? (
          <Alert
            showIcon
            type='error'
            title={errorMessage}
            closable
            onClose={clearErrorMessage}
          />
        ) : null}

        <Form<EmployeeAssignmentFormValues>
          form={form}
          layout='vertical'
          initialValues={{
            departmentId: employee.primaryDepartment?.sourceId,
            positionId: employee.primaryPosition?.sourceId,
          }}
          disabled={!canManage}
          onFinish={handleSubmit}
        >
          <Row gutter={[16, 0]}>
            <Col
              xs={24}
              md={12}
            >
              <Form.Item<EmployeeAssignmentFormValues>
                label='Department'
                name='departmentId'
                style={{ marginBottom: 0 }}
              >
                <Select
                  allowClear
                  showSearch
                  optionFilterProp='label'
                  placeholder='Select department'
                  options={departmentOptions}
                  notFoundContent='No active departments found'
                />
              </Form.Item>
            </Col>

            <Col
              xs={24}
              md={12}
            >
              <Form.Item<EmployeeAssignmentFormValues>
                label='Position'
                name='positionId'
                style={{ marginBottom: 0 }}
              >
                <Select
                  allowClear
                  showSearch
                  optionFilterProp='label'
                  placeholder='Select position'
                  options={positionOptions}
                  notFoundContent='No active positions found'
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <Space
          orientation='vertical'
          size={4}
        >
          <Text type='secondary'>Selected assignment</Text>
          <Text>
            {selectedDepartment || 'No department selected'} - {selectedPosition || 'No position selected'}
          </Text>
        </Space>
      </Space>
    </Card>
  );
}

function SectionTitle({ icon, label }: { icon: ReactNode; label: string }) {
  const { token } = theme.useToken();

  return (
    <Space size={8}>
      <span style={{ color: token.colorPrimary, display: 'inline-flex' }}>{icon}</span>
      <Text strong>{label}</Text>
    </Space>
  );
}

function AssignmentTag({ label, assignment }: { label: string; assignment: EmployeeAssignmentViewModel | null }) {
  if (!assignment) {
    return <Tag>{label}: Not assigned</Tag>;
  }

  const deleted = Boolean(assignment.deletedAt);
  const color = deleted ? 'red' : assignment.isActive ? 'blue' : 'orange';
  const suffix = deleted ? 'deleted' : assignment.isActive ? 'active' : 'inactive';

  return (
    <Tag color={color}>
      {label}: {assignment.name} ({suffix})
    </Tag>
  );
}

function findOptionLabel(options: EmployeeAssignmentOption[], value?: string) {
  if (!value) {
    return null;
  }

  return options.find((option) => option.value === value)?.label ?? null;
}

function buildChangedAssignmentPayload(
  values: EmployeeAssignmentFormValues,
  currentValues: {
    departmentId?: string;
    positionId?: string;
  },
): UpdateEmployeeAssignmentInput {
  const payload: UpdateEmployeeAssignmentInput = {};
  const nextDepartmentId = normalizeFormId(values.departmentId);
  const currentDepartmentId = normalizeFormId(currentValues.departmentId);
  const nextPositionId = normalizeFormId(values.positionId);
  const currentPositionId = normalizeFormId(currentValues.positionId);

  if (nextDepartmentId !== currentDepartmentId) {
    payload.departmentId = nextDepartmentId;
  }

  if (nextPositionId !== currentPositionId) {
    payload.positionId = nextPositionId;
  }

  return payload;
}

function normalizeFormId(value?: string) {
  return value || null;
}
