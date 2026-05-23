'use client';

import { Button, Popconfirm, Space, Table, Tag, Typography } from 'antd';
import { Edit3, Trash2 } from 'lucide-react';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { DepartmentListData } from '@/features/company/departments/types';
import type { DepartmentViewModel } from './DepartmentPageClient';

type DepartmentTableProps = {
  departments: DepartmentViewModel[];
  loading?: boolean;
  pagination: NonNullable<DepartmentListData['pagination']>;
  canDelete: boolean;
  canUpdate: boolean;
  deletingDepartmentId?: string;
  onEdit: (department: DepartmentViewModel) => void;
  onDelete: (departmentId: string) => void;
  onPaginationChange: (page: number, pageSize: number) => void;
};

const pageSizeOptions = [10, 20, 50];

export function DepartmentTable({ departments, loading, pagination, canDelete, canUpdate, deletingDepartmentId, onEdit, onDelete, onPaginationChange }: DepartmentTableProps) {
  const columns: ColumnsType<DepartmentViewModel> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, department) => (
        <Space
          orientation='vertical'
          size={0}
        >
          <Typography.Text strong>{name}</Typography.Text>
          {department.deletedAt ? <Typography.Text type='secondary'>Deleted</Typography.Text> : null}
        </Space>
      ),
    },
    {
      title: 'Assigned employees',
      dataIndex: 'assignedEmployees',
      key: 'assignedEmployees',
      width: 170,
      render: (count: number) => `${count} ${count === 1 ? 'employee' : 'employees'}`,
    },
    {
      title: 'Status',
      key: 'status',
      width: 130,
      render: (_, department) => renderStatus(department),
    },
    {
      title: 'Updated',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 160,
      render: (value: string) => formatDate(value),
    },
  ];

  if (canDelete || canUpdate) {
    columns.push({
      title: 'Actions',
      key: 'actions',
      width: 180,
      render: (_, department) => {
        const deleted = Boolean(department.deletedAt);

        return (
          <Space size={6}>
            {canUpdate ? (
              <Button
                size='small'
                disabled={deleted}
                icon={
                  <Edit3
                    size={14}
                    aria-hidden='true'
                    focusable='false'
                  />
                }
                onClick={() => onEdit(department)}
              >
                Edit
              </Button>
            ) : null}
            {canDelete ? (
              <Popconfirm
                title='Delete department?'
                description='This department will no longer be available for use.'
                okText='Delete'
                okType='danger'
                cancelText='Cancel'
                disabled={deleted}
                onConfirm={() => onDelete(department.departmentId)}
              >
                <Button
                  size='small'
                  danger
                  disabled={deleted}
                  loading={deletingDepartmentId === department.departmentId}
                  icon={
                    <Trash2
                      size={14}
                      aria-hidden='true'
                      focusable='false'
                    />
                  }
                >
                  Delete
                </Button>
              </Popconfirm>
            ) : null}
          </Space>
        );
      },
    });
  }

  return (
    <Table<DepartmentViewModel>
      rowKey='departmentId'
      columns={columns}
      dataSource={departments}
      loading={loading}
      pagination={{
        current: pagination.page,
        pageSize: pagination.pageSize,
        pageSizeOptions,
        showSizeChanger: true,
        showTotal: (total, range) => (total === 0 ? 'No departments' : `${range[0]}-${range[1]} of ${total} departments`),
        total: pagination.totalItems,
      }}
      locale={{ emptyText: 'No departments match your filters.' }}
      onChange={(nextPagination) => {
        handlePaginationChange(nextPagination, pagination, onPaginationChange);
      }}
      scroll={{ x: 760 }}
    />
  );
}

function handlePaginationChange(currentPagination: TablePaginationConfig, previousPagination: NonNullable<DepartmentListData['pagination']>, onPaginationChange: (page: number, pageSize: number) => void) {
  const nextPageSize = currentPagination.pageSize ?? previousPagination.pageSize;
  const nextPage = nextPageSize === previousPagination.pageSize ? currentPagination.current ?? previousPagination.page : 1;

  if (nextPage !== previousPagination.page || nextPageSize !== previousPagination.pageSize) {
    onPaginationChange(nextPage, nextPageSize);
  }
}

function renderStatus(department: DepartmentViewModel) {
  if (department.deletedAt) {
    return <Tag>Deleted</Tag>;
  }

  return department.isActive ? <Tag color='success'>Active</Tag> : <Tag color='warning'>Inactive</Tag>;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}
