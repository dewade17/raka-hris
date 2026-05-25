'use client';

import { Button, Popconfirm, Space, Table, Tag, Typography } from 'antd';
import { Edit3, ExternalLink, Trash2 } from 'lucide-react';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { LocationListData } from '@/features/company/locations/types';
import type { LocationViewModel } from './LocationPageClient';

type LocationTableProps = {
  locations: LocationViewModel[];
  loading?: boolean;
  pagination: NonNullable<LocationListData['pagination']>;
  canDelete: boolean;
  canUpdate: boolean;
  deletingLocationId?: string;
  onEdit: (location: LocationViewModel) => void;
  onDelete: (locationId: string) => void;
  onPaginationChange: (page: number, pageSize: number) => void;
};

const pageSizeOptions = [10, 20, 50];

export function LocationTable({ locations, loading, pagination, canDelete, canUpdate, deletingLocationId, onEdit, onDelete, onPaginationChange }: LocationTableProps) {
  const columns: ColumnsType<LocationViewModel> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, location) => (
        <Space
          orientation='vertical'
          size={0}
        >
          <Typography.Text strong>{name}</Typography.Text>
          {location.deletedAt ? <Typography.Text type='secondary'>Deleted</Typography.Text> : null}
        </Space>
      ),
    },
    {
      title: 'Coordinates',
      key: 'coordinates',
      render: (_, location) => renderCoordinates(location),
    },
    {
      title: 'Status',
      key: 'status',
      width: 130,
      render: (_, location) => renderStatus(location),
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
      render: (_, location) => {
        const deleted = Boolean(location.deletedAt);

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
                onClick={() => onEdit(location)}
              >
                Edit
              </Button>
            ) : null}
            {canDelete ? (
              <Popconfirm
                title='Delete location?'
                description='This location will no longer be available for use.'
                okText='Delete'
                okType='danger'
                cancelText='Cancel'
                disabled={deleted}
                onConfirm={() => onDelete(location.id)}
              >
                <Button
                  size='small'
                  danger
                  disabled={deleted}
                  loading={deletingLocationId === location.id}
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
    <Table<LocationViewModel>
      rowKey='id'
      columns={columns}
      dataSource={locations}
      loading={loading}
      pagination={{
        current: pagination.page,
        pageSize: pagination.pageSize,
        pageSizeOptions,
        showSizeChanger: true,
        showTotal: (total, range) => (total === 0 ? 'No locations' : `${range[0]}-${range[1]} of ${total} locations`),
        total: pagination.totalItems,
      }}
      locale={{ emptyText: 'No locations match your filters.' }}
      onChange={(nextPagination) => {
        handlePaginationChange(nextPagination, pagination, onPaginationChange);
      }}
      scroll={{ x: 780 }}
    />
  );
}

function handlePaginationChange(currentPagination: TablePaginationConfig, previousPagination: NonNullable<LocationListData['pagination']>, onPaginationChange: (page: number, pageSize: number) => void) {
  const nextPageSize = currentPagination.pageSize ?? previousPagination.pageSize;
  const nextPage = nextPageSize === previousPagination.pageSize ? currentPagination.current ?? previousPagination.page : 1;

  if (nextPage !== previousPagination.page || nextPageSize !== previousPagination.pageSize) {
    onPaginationChange(nextPage, nextPageSize);
  }
}

function renderCoordinates(location: LocationViewModel) {
  if (!location.latitude || !location.longitude) {
    return <Typography.Text type='secondary'>Not set</Typography.Text>;
  }

  const coordinateLabel = `${location.latitude}, ${location.longitude}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(coordinateLabel)}`;

  return (
    <Space size={8}>
      <Typography.Text>{coordinateLabel}</Typography.Text>
      <Typography.Link
        href={mapsUrl}
        target='_blank'
        rel='noreferrer'
        aria-label={`Open ${location.name} coordinates in maps`}
      >
        <ExternalLink
          size={14}
          aria-hidden='true'
          focusable='false'
        />
      </Typography.Link>
    </Space>
  );
}

function renderStatus(location: LocationViewModel) {
  if (location.deletedAt) {
    return <Tag>Deleted</Tag>;
  }

  return location.isActive ? <Tag color='success'>Active</Tag> : <Tag color='warning'>Inactive</Tag>;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}
