'use client';

import { Button, Popconfirm, Space, Table, Tag, Typography } from 'antd';
import { Archive, Edit3 } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import type { PositionViewModel } from './PositionPageClient';

type PositionTableProps = {
  positions: PositionViewModel[];
  canManage: boolean;
  archivingPositionId?: string;
  onEdit: (position: PositionViewModel) => void;
  onArchive: (positionId: string) => void;
};

export function PositionTable({ positions, canManage, archivingPositionId, onEdit, onArchive }: PositionTableProps) {
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
          {position.deletedAt ? <Typography.Text type='secondary'>Archived</Typography.Text> : null}
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

  if (canManage) {
    columns.push({
      title: 'Actions',
      key: 'actions',
      width: 180,
      render: (_, position) => {
        const archived = Boolean(position.deletedAt);

        return (
          <Space size={6}>
            <Button
              size='small'
              disabled={archived}
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
            <Popconfirm
              title='Archive position?'
              description='This hides the position from active use but keeps employee history intact.'
              okText='Archive'
              okType='danger'
              cancelText='Cancel'
              disabled={archived}
              onConfirm={() => onArchive(position.positionId)}
            >
              <Button
                size='small'
                danger
                disabled={archived}
                loading={archivingPositionId === position.positionId}
                icon={
                  <Archive
                    size={14}
                    aria-hidden='true'
                    focusable='false'
                  />
                }
              >
                Archive
              </Button>
            </Popconfirm>
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
    return <Tag>Archived</Tag>;
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
