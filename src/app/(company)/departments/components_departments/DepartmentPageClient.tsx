'use client';

import { Alert, Button, Card, Col, Flex, Input, Row, Select, Space, Statistic, Typography, theme } from 'antd';
import { Plus, Search } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState, useTransition } from 'react';
import type { DepartmentListData, DepartmentListQuery, DepartmentListStatus } from '@/features/company/departments/types';
import { useDeleteDepartment } from '../hooks/useDeleteDepartment';
import { useUpsertDepartment } from '../hooks/useUpsertDepartment';
import { DepartmentFormDrawer, type DepartmentFormValues } from './DepartmentFormDrawer';
import { DepartmentTable } from './DepartmentTable';

export type DepartmentViewModel = {
  id: string;
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
  listQuery: DepartmentListQuery;
  pagination: NonNullable<DepartmentListData['pagination']>;
  summary: DepartmentListData['summary'];
};

const statusOptions: Array<{ label: string; value: DepartmentListStatus }> = [
  { label: 'Current records', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Deleted', value: 'deleted' },
];

export function DepartmentPageClient({ canCreate, canDelete, canUpdate, departments, listQuery, pagination, summary }: DepartmentPageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { token } = theme.useToken();
  const canMutate = canCreate || canDelete || canUpdate;
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(listQuery.query);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<DepartmentViewModel>();
  const { deleteDepartment, deletingDepartmentId } = useDeleteDepartment();
  const { clearErrorMessage, errorMessage, isSubmitting, upsertDepartment } = useUpsertDepartment();

  const updateListQuery = useCallback(
    (updates: Partial<DepartmentListQuery>) => {
      const nextListQuery: DepartmentListQuery = {
        ...listQuery,
        ...updates,
      };
      const params = new URLSearchParams();
      const normalizedQuery = nextListQuery.query.trim().replace(/\s+/g, ' ');

      if (nextListQuery.page > 1) {
        params.set('page', String(nextListQuery.page));
      }

      if (nextListQuery.pageSize !== 10) {
        params.set('pageSize', String(nextListQuery.pageSize));
      }

      if (normalizedQuery) {
        params.set('query', normalizedQuery);
      }

      if (nextListQuery.status !== 'all') {
        params.set('status', nextListQuery.status);
      }

      const search = params.toString();

      startTransition(() => {
        router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false });
      });
    },
    [listQuery, pathname, router, startTransition],
  );

  useEffect(() => {
    const normalizedQuery = query.trim().replace(/\s+/g, ' ');

    if (normalizedQuery === listQuery.query) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      updateListQuery({
        page: 1,
        query: normalizedQuery,
      });
    }, 350);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [listQuery.query, query, updateListQuery]);

  const handleOpenCreate = () => {
    setEditingDepartment(undefined);
    clearErrorMessage();
    setDrawerOpen(true);
  };

  const handleSubmit = async (values: DepartmentFormValues) => {
    const success = await upsertDepartment(values, editingDepartment?.id);

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
          title='You can review departments, but you do not have permission to make changes.'
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
          <Select<DepartmentListStatus>
            value={listQuery.status}
            options={statusOptions}
            onChange={(nextStatus) => {
              updateListQuery({
                page: 1,
                status: nextStatus,
              });
            }}
            style={{ width: 190 }}
          />
        </Flex>

        <DepartmentTable
          departments={departments}
          loading={isPending}
          pagination={pagination}
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
          onPaginationChange={(page, pageSize) => {
            updateListQuery({
              page,
              pageSize,
            });
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
