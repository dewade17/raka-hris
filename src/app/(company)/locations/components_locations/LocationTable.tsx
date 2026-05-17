'use client';

import { Button, Popconfirm, Space, Table, Tag, Typography } from 'antd';
import { Archive, Edit3, ExternalLink } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import type { LocationViewModel } from './LocationPageClient';

type LocationTableProps = {
  locations: LocationViewModel[];
  canManage: boolean;
  archivingLocationId?: string;
  onEdit: (location: LocationViewModel) => void;
  onArchive: (locationId: string) => void;
};

export function LocationTable({ locations, canManage, archivingLocationId, onEdit, onArchive }: LocationTableProps) {
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
          {location.deletedAt ? <Typography.Text type='secondary'>Archived</Typography.Text> : null}
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

  if (canManage) {
    columns.push({
      title: 'Actions',
      key: 'actions',
      width: 180,
      render: (_, location) => {
        const archived = Boolean(location.deletedAt);

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
              onClick={() => onEdit(location)}
            >
              Edit
            </Button>
            <Popconfirm
              title='Archive location?'
              description='This hides the location from active use but keeps existing records intact.'
              okText='Archive'
              okType='danger'
              cancelText='Cancel'
              disabled={archived}
              onConfirm={() => onArchive(location.locationId)}
            >
              <Button
                size='small'
                danger
                disabled={archived}
                loading={archivingLocationId === location.locationId}
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
    <Table<LocationViewModel>
      rowKey='locationId'
      columns={columns}
      dataSource={locations}
      pagination={{ pageSize: 10, showSizeChanger: true }}
      locale={{ emptyText: 'No locations match your filters.' }}
      scroll={{ x: 780 }}
    />
  );
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
    return <Tag>Archived</Tag>;
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
