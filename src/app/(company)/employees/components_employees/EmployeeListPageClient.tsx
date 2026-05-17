'use client';

import { Alert, Button, Card, Col, Flex, Input, Row, Select, Space, Statistic, Typography, theme } from 'antd';
import { Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useCreateEmployee } from '../hooks/useCreateEmployee';
import type { EmployeeCreateAssignmentOption, EmployeeListSummaryViewModel, EmployeeListViewModel } from '../types';
import { EmployeeCreateDrawer, type EmployeeCreateFormValues } from './EmployeeCreateDrawer';
import { EmployeeTable } from './EmployeeTable';

type EmployeeListPageClientProps = {
  canManage: boolean;
  departmentOptions: EmployeeCreateAssignmentOption[];
  employees: EmployeeListViewModel[];
  positionOptions: EmployeeCreateAssignmentOption[];
  summary: EmployeeListSummaryViewModel;
};

type StatusFilter = 'all' | 'active' | 'suspended' | 'terminated' | 'incomplete';

const statusOptions: Array<{ label: string; value: StatusFilter }> = [
  { label: 'All employees', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Suspended', value: 'suspended' },
  { label: 'Terminated', value: 'terminated' },
  { label: 'Incomplete profile', value: 'incomplete' },
];

export function EmployeeListPageClient({ canManage, departmentOptions, employees, positionOptions, summary }: EmployeeListPageClientProps) {
  const { token } = theme.useToken();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { clearErrorMessage, createEmployee, errorMessage, isSubmitting } = useCreateEmployee();

  const filteredEmployees = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return employees.filter((employee) => {
      const searchableText = [
        employee.user.name,
        employee.user.email,
        employee.employeeNumber,
        employee.primaryDepartment?.name,
        employee.primaryPosition?.name,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      const matchesQuery = !normalizedQuery || searchableText.includes(normalizedQuery);
      const matchesStatus =
        status === 'all' ||
        (status === 'active' && employee.status === 'ACTIVE') ||
        (status === 'suspended' && employee.status === 'SUSPENDED') ||
        (status === 'terminated' && employee.status === 'TERMINATED') ||
        (status === 'incomplete' && !employee.hasCompleteProfile);

      return matchesQuery && matchesStatus;
    });
  }, [employees, query, status]);

  const handleOpenCreate = () => {
    clearErrorMessage();
    setDrawerOpen(true);
  };

  const handleSubmit = async (values: EmployeeCreateFormValues) => {
    const success = await createEmployee(values);

    if (success) {
      setDrawerOpen(false);
    }
  };

  return (
    <section aria-labelledby='employees-page-title'>
      <Flex
        justify='space-between'
        align='flex-start'
        gap={16}
        wrap='wrap'
        style={{ marginBottom: 18 }}
      >
        <Space
          direction='vertical'
          size={4}
        >
          <Typography.Title
            id='employees-page-title'
            level={2}
            style={{ margin: 0 }}
          >
            Employees
          </Typography.Title>
          <Typography.Text type='secondary'>Review employee records and open a profile to prepare department or position assignments.</Typography.Text>
        </Space>

        {canManage ? (
          <Button
            type='primary'
            icon={
              <Plus
                size={16}
                aria-hidden='true'
                focusable='false'
              />
            }
            onClick={handleOpenCreate}
          >
            New employee
          </Button>
        ) : null}
      </Flex>

      {!canManage ? (
        <Alert
          showIcon
          type='info'
          message='You can review employees, but only the company owner can create employee accounts.'
          style={{ marginBottom: 16 }}
        />
      ) : null}

      <Row
        gutter={[12, 12]}
        style={{ marginBottom: 16 }}
      >
        <SummaryCard
          label='Total'
          value={summary.total}
        />
        <SummaryCard
          label='Active'
          value={summary.active}
        />
        <SummaryCard
          label='Incomplete'
          value={summary.incompleteProfiles}
        />
        <SummaryCard
          label='Without department'
          value={summary.withoutDepartment}
        />
      </Row>

      <Card
        variant='borderless'
        style={{
          border: `1px solid ${token.colorBorderSecondary}`,
          borderRadius: token.borderRadiusLG,
        }}
      >
        <Flex
          gap={12}
          wrap='wrap'
          style={{ marginBottom: 16 }}
        >
          <Input
            allowClear
            placeholder='Search employees'
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            prefix={
              <Search
                size={16}
                aria-hidden='true'
                focusable='false'
              />
            }
            style={{ maxWidth: 320 }}
          />
          <Select<StatusFilter>
            value={status}
            options={statusOptions}
            onChange={setStatus}
            style={{ width: 210 }}
          />
        </Flex>

        <EmployeeTable employees={filteredEmployees} />
      </Card>

      <EmployeeCreateDrawer
        open={drawerOpen}
        departmentOptions={departmentOptions}
        positionOptions={positionOptions}
        isSubmitting={isSubmitting}
        errorMessage={errorMessage}
        onClearError={clearErrorMessage}
        onClose={() => {
          setDrawerOpen(false);
          clearErrorMessage();
        }}
        onSubmit={handleSubmit}
      />
    </section>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  const { token } = theme.useToken();

  return (
    <Col
      xs={12}
      md={6}
    >
      <Card
        variant='borderless'
        style={{
          height: '100%',
          border: `1px solid ${token.colorBorderSecondary}`,
          borderRadius: token.borderRadiusLG,
        }}
      >
        <Statistic
          title={label}
          value={value}
        />
      </Card>
    </Col>
  );
}
