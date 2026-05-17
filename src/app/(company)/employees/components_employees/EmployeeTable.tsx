'use client';

import Link from 'next/link';
import { Button, Space, Table, Tag, Typography } from 'antd';
import { UserRound } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import type { EmployeeListViewModel } from '../types';

type EmployeeTableProps = {
  employees: EmployeeListViewModel[];
};

export function EmployeeTable({ employees }: EmployeeTableProps) {
  const columns: ColumnsType<EmployeeListViewModel> = [
    {
      title: 'Employee',
      dataIndex: ['user', 'name'],
      key: 'employee',
      render: (_value, employee) => (
        <Space
          direction='vertical'
          size={0}
        >
          <Typography.Text strong>{employee.user.name}</Typography.Text>
          <Typography.Text type='secondary'>{employee.employeeNumber ?? employee.user.email ?? 'Employee number not set'}</Typography.Text>
        </Space>
      ),
    },
    {
      title: 'Department',
      key: 'department',
      width: 190,
      render: (_, employee) => renderAssignment(employee.primaryDepartment?.name, employee.primaryDepartment?.isActive, employee.primaryDepartment?.deletedAt),
    },
    {
      title: 'Position',
      key: 'position',
      width: 190,
      render: (_, employee) => renderAssignment(employee.primaryPosition?.name, employee.primaryPosition?.isActive, employee.primaryPosition?.deletedAt),
    },
    {
      title: 'Employment',
      key: 'employment',
      width: 180,
      render: (_, employee) => (
        <Space
          direction='vertical'
          size={0}
        >
          <Typography.Text>{employee.employmentType ?? 'Not set'}</Typography.Text>
          <Typography.Text type='secondary'>{employee.hireDate ? `Hired ${formatDate(employee.hireDate)}` : 'Hire date not set'}</Typography.Text>
        </Space>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      width: 150,
      render: (_, employee) => renderStatus(employee),
    },
    {
      title: 'Joined',
      dataIndex: 'joinedAt',
      key: 'joinedAt',
      width: 150,
      render: (value: string) => formatDate(value),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, employee) => (
        <Link
          href={`/employees/${employee.membershipId}/profile`}
          prefetch={false}
        >
          <Button
            size='small'
            icon={
              <UserRound
                size={14}
                aria-hidden='true'
                focusable='false'
              />
            }
          >
            View profile
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <Table<EmployeeListViewModel>
      rowKey='membershipId'
      columns={columns}
      dataSource={employees}
      pagination={{ pageSize: 10, showSizeChanger: true }}
      locale={{ emptyText: 'No employees match your filters.' }}
      scroll={{ x: 1040 }}
    />
  );
}

function renderAssignment(name?: string, isActive?: boolean, deletedAt?: string | null) {
  if (!name) {
    return <Typography.Text type='secondary'>Not assigned</Typography.Text>;
  }

  const archived = Boolean(deletedAt);

  return (
    <Space
      direction='vertical'
      size={0}
    >
      <Typography.Text>{name}</Typography.Text>
      <Typography.Text type='secondary'>{archived ? 'Archived' : isActive ? 'Active' : 'Inactive'}</Typography.Text>
    </Space>
  );
}

function renderStatus(employee: EmployeeListViewModel) {
  const statusColor = employee.status === 'ACTIVE' ? 'success' : employee.status === 'SUSPENDED' ? 'warning' : 'error';

  return (
    <Space
      direction='vertical'
      size={4}
    >
      <Tag color={statusColor}>{formatEnum(employee.status)}</Tag>
      {employee.hasCompleteProfile ? <Tag color='blue'>Complete</Tag> : <Tag>Incomplete</Tag>}
    </Space>
  );
}

function formatEnum(value: string) {
  return value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}
