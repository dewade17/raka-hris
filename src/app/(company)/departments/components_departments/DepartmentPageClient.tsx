'use client';

import { Alert, Button, Card, Col, Flex, Input, Row, Select, Space, Statistic, Typography, theme } from 'antd';
import { Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { DepartmentListData } from '@/features/company/departments/types';
import { useDeleteDepartment } from '../hooks/useDeleteDepartment';
import { useUpsertDepartment } from '../hooks/useUpsertDepartment';
import { DepartmentFormDrawer, type DepartmentFormValues } from './DepartmentFormDrawer';
import { DepartmentTable } from './DepartmentTable';

export type DepartmentViewModel = {
  departmentId: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  assignedEmployees: number;
};

type DepartmentPageClientProps = {
  canCreate: boolean;
  canDelete: boolean;
  canUpdate: boolean;
  departments: DepartmentViewModel[];
  summary: DepartmentListData['summary'];
};

type StatusFilter = 'all' | 'active' | 'inactive' | 'deleted';

const statusOptions: Array<{ label: string; value: StatusFilter }> = [
  { label: 'Current records', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Deleted', value: 'deleted' },
];

export function DepartmentPageClient({ canCreate, canDelete, canUpdate, departments, summary }: DepartmentPageClientProps) {
  const { token } = theme.useToken();
  const canMutate = canCreate || canDelete || canUpdate;
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<DepartmentViewModel>();
  const { deleteDepartment, deletingDepartmentId } = useDeleteDepartment();
  const { clearErrorMessage, errorMessage, isSubmitting, upsertDepartment } = useUpsertDepartment();

  const filteredDepartments = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return departments.filter((department) => {
      const matchesQuery = !normalizedQuery || department.name.toLowerCase().includes(normalizedQuery);
      const matchesStatus = status === 'deleted' ? Boolean(department.deletedAt) : !department.deletedAt && (status === 'all' || (status === 'active' && department.isActive) || (status === 'inactive' && !department.isActive));

      return matchesQuery && matchesStatus;
    });
  }, [departments, query, status]);

  const handleOpenCreate = () => {
    setEditingDepartment(undefined);
    clearErrorMessage();
    setDrawerOpen(true);
  };

  const handleSubmit = async (values: DepartmentFormValues) => {
    const success = await upsertDepartment(values, editingDepartment?.departmentId);

    if (success) {
      setDrawerOpen(false);
      setEditingDepartment(undefined);
    }
  };

  return (
    <section aria-labelledby='departments-page-title'>
      <Flex
        justify='space-between'
        align='flex-start'
        gap={16}
        wrap='wrap'
        style={{ marginBottom: 18 }}
      >
        <Space
          orientation='vertical'
          size={4}
        >
          <Typography.Title
            id='departments-page-title'
            level={2}
            style={{ margin: 0 }}
          >
            Departments
          </Typography.Title>
          <Typography.Text type='secondary'>Create and organize departments for employee assignments and reports.</Typography.Text>
        </Space>

        {canCreate ? (
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
            New department
          </Button>
        ) : null}
      </Flex>

      {!canMutate ? (
        <Alert
          showIcon
          type='info'
          message='You can review departments, but you do not have permission to make changes.'
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
          label='Inactive'
          value={summary.inactive}
        />
        <SummaryCard
          label='Deleted'
          value={summary.deleted}
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
            placeholder='Search departments'
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
            style={{ width: 190 }}
          />
        </Flex>

        <DepartmentTable
          departments={filteredDepartments}
          canDelete={canDelete}
          canUpdate={canUpdate}
          deletingDepartmentId={deletingDepartmentId}
          onEdit={(department) => {
            setEditingDepartment(department);
            clearErrorMessage();
            setDrawerOpen(true);
          }}
          onDelete={(departmentId) => {
            void deleteDepartment(departmentId);
          }}
        />
      </Card>

      <DepartmentFormDrawer
        open={drawerOpen}
        department={editingDepartment}
        isSubmitting={isSubmitting}
        errorMessage={errorMessage}
        onClearError={clearErrorMessage}
        onClose={() => {
          setDrawerOpen(false);
          setEditingDepartment(undefined);
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
