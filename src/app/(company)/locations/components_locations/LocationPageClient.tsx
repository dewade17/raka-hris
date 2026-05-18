'use client';

import { Alert, Button, Card, Col, Flex, Input, Row, Select, Space, Statistic, Typography, theme } from 'antd';
import { Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { LocationListData } from '@/features/company/locations/types';
import { useDeleteLocation } from '../hooks/useDeleteLocation';
import { useUpsertLocation } from '../hooks/useUpsertLocation';
import { LocationFormDrawer, type LocationFormValues } from './LocationFormDrawer';
import { LocationTable } from './LocationTable';

export type LocationViewModel = {
  locationId: string;
  name: string;
  latitude: string | null;
  longitude: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

type LocationPageClientProps = {
  canCreate: boolean;
  canDelete: boolean;
  canUpdate: boolean;
  locations: LocationViewModel[];
  summary: LocationListData['summary'];
};

type StatusFilter = 'all' | 'active' | 'inactive' | 'deleted';

const statusOptions: Array<{ label: string; value: StatusFilter }> = [
  { label: 'Current records', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Deleted', value: 'deleted' },
];

export function LocationPageClient({ canCreate, canDelete, canUpdate, locations, summary }: LocationPageClientProps) {
  const { token } = theme.useToken();
  const canMutate = canCreate || canDelete || canUpdate;
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<LocationViewModel>();
  const { deleteLocation, deletingLocationId } = useDeleteLocation();
  const { clearErrorMessage, errorMessage, isSubmitting, upsertLocation } = useUpsertLocation();

  const filteredLocations = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return locations.filter((location) => {
      const matchesQuery = !normalizedQuery || location.name.toLowerCase().includes(normalizedQuery);
      const matchesStatus = status === 'deleted' ? Boolean(location.deletedAt) : !location.deletedAt && (status === 'all' || (status === 'active' && location.isActive) || (status === 'inactive' && !location.isActive));

      return matchesQuery && matchesStatus;
    });
  }, [locations, query, status]);

  const handleOpenCreate = () => {
    setEditingLocation(undefined);
    clearErrorMessage();
    setDrawerOpen(true);
  };

  const handleSubmit = async (values: LocationFormValues) => {
    const success = await upsertLocation(values, editingLocation?.locationId);

    if (success) {
      setDrawerOpen(false);
      setEditingLocation(undefined);
    }
  };

  return (
    <section aria-labelledby='locations-page-title'>
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
            id='locations-page-title'
            level={2}
            style={{ margin: 0 }}
          >
            Locations
          </Typography.Title>
          <Typography.Text type='secondary'>Manage company work sites for attendance and operational records.</Typography.Text>
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
            New location
          </Button>
        ) : null}
      </Flex>

      {!canMutate ? (
        <Alert
          showIcon
          type='info'
          message='You can review locations, but you do not have permission to make changes.'
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
            placeholder='Search locations'
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

        <LocationTable
          locations={filteredLocations}
          canDelete={canDelete}
          canUpdate={canUpdate}
          deletingLocationId={deletingLocationId}
          onEdit={(location) => {
            setEditingLocation(location);
            clearErrorMessage();
            setDrawerOpen(true);
          }}
          onDelete={(locationId) => {
            void deleteLocation(locationId);
          }}
        />
      </Card>

      <LocationFormDrawer
        open={drawerOpen}
        location={editingLocation}
        isSubmitting={isSubmitting}
        errorMessage={errorMessage}
        onClearError={clearErrorMessage}
        onClose={() => {
          setDrawerOpen(false);
          setEditingLocation(undefined);
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
