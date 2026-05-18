'use client';

import { Button, Popconfirm, Space, Table, Tag, Typography } from 'antd';
import { Edit3, Trash2 } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import type { PositionViewModel } from './PositionPageClient';

type PositionTableProps = {
  positions: PositionViewModel[];
  canDelete: boolean;
  canUpdate: boolean;
  deletingPositionId?: string;
  onEdit: (position: PositionViewModel) => void;
  onDelete: (positionId: string) => void;
};

export function PositionTable({ positions, canDelete, canUpdate, deletingPositionId, onEdit, onDelete }: PositionTableProps) {
  const columns: ColumnsType<PositionViewModel> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, position) => (
        <Space
          orientation='vertical'
          size={0}
        >
          <Typography.Text strong>{name}</Typography.Text>
          {position.deletedAt ? <Typography.Text type='secondary'>Deleted</Typography.Text> : null}
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
      render: (_, position) => renderStatus(position),
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
      render: (_, position) => {
        const deleted = Boolean(position.deletedAt);

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
                onClick={() => onEdit(position)}
              >
                Edit
              </Button>
            ) : null}
            {canDelete ? (
              <Popconfirm
                title='Delete position?'
                description='This position will no longer be available for use.'
                okText='Delete'
                okType='danger'
                cancelText='Cancel'
                disabled={deleted}
                onConfirm={() => onDelete(position.positionId)}
              >
                <Button
                  size='small'
                  danger
                  disabled={deleted}
                  loading={deletingPositionId === position.positionId}
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
    <Table<PositionViewModel>
      rowKey='positionId'
      columns={columns}
      dataSource={positions}
      pagination={{ pageSize: 10, showSizeChanger: true }}
      locale={{ emptyText: 'No positions match your filters.' }}
      scroll={{ x: 760 }}
    />
  );
}

function renderStatus(position: PositionViewModel) {
  if (position.deletedAt) {
    return <Tag>Deleted</Tag>;
  }

  return position.isActive ? <Tag color='success'>Active</Tag> : <Tag color='warning'>Inactive</Tag>;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}
