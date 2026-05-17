'use client';

import { Alert, Button, Card, Col, Flex, Input, Row, Select, Space, Statistic, Typography, theme } from 'antd';
import { Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { PositionListData } from '@/features/company/positions/types';
import { useArchivePosition } from '../hooks/useArchivePosition';
import { useUpsertPosition } from '../hooks/useUpsertPosition';
import { PositionFormDrawer, type PositionFormValues } from './PositionFormDrawer';
import { PositionTable } from './PositionTable';

export type PositionViewModel = {
  positionId: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  assignedEmployees: number;
};

type PositionPageClientProps = {
  canArchive: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  positions: PositionViewModel[];
  summary: PositionListData['summary'];
};

type StatusFilter = 'all' | 'active' | 'inactive' | 'archived';

const statusOptions: Array<{ label: string; value: StatusFilter }> = [
  { label: 'Current records', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Archived', value: 'archived' },
];

export function PositionPageClient({ canArchive, canCreate, canUpdate, positions, summary }: PositionPageClientProps) {
  const { token } = theme.useToken();
  const canMutate = canArchive || canCreate || canUpdate;
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState<PositionViewModel>();
  const { archivePosition, archivingPositionId } = useArchivePosition();
  const { clearErrorMessage, errorMessage, isSubmitting, upsertPosition } = useUpsertPosition();

  const filteredPositions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return positions.filter((position) => {
      const matchesQuery = !normalizedQuery || position.name.toLowerCase().includes(normalizedQuery);
      const matchesStatus = status === 'archived' ? Boolean(position.deletedAt) : !position.deletedAt && (status === 'all' || (status === 'active' && position.isActive) || (status === 'inactive' && !position.isActive));

      return matchesQuery && matchesStatus;
    });
  }, [positions, query, status]);

  const handleOpenCreate = () => {
    setEditingPosition(undefined);
    clearErrorMessage();
    setDrawerOpen(true);
  };

  const handleSubmit = async (values: PositionFormValues) => {
    const success = await upsertPosition(values, editingPosition?.positionId);

    if (success) {
      setDrawerOpen(false);
      setEditingPosition(undefined);
    }
  };

  return (
    <section aria-labelledby='positions-page-title'>
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
            id='positions-page-title'
            level={2}
            style={{ margin: 0 }}
          >
            Positions
          </Typography.Title>
          <Typography.Text type='secondary'>Create and manage job positions used in employee profiles and reports.</Typography.Text>
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
            New position
          </Button>
        ) : null}
      </Flex>

      {!canMutate ? (
        <Alert
          showIcon
          type='info'
          title='You can review positions, but you do not have permission to make changes.'
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
          label='Archived'
          value={summary.archived}
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
            placeholder='Search positions'
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

        <PositionTable
          positions={filteredPositions}
          canArchive={canArchive}
          canUpdate={canUpdate}
          archivingPositionId={archivingPositionId}
          onEdit={(position) => {
            setEditingPosition(position);
            clearErrorMessage();
            setDrawerOpen(true);
          }}
          onArchive={(positionId) => {
            void archivePosition(positionId);
          }}
        />
      </Card>

      <PositionFormDrawer
        open={drawerOpen}
        position={editingPosition}
        isSubmitting={isSubmitting}
        errorMessage={errorMessage}
        onClearError={clearErrorMessage}
        onClose={() => {
          setDrawerOpen(false);
          setEditingPosition(undefined);
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
