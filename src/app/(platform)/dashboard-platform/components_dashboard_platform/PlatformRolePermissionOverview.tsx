'use client';

import { Card, Col, List, Row, Space, Statistic, Typography, theme } from 'antd';
import { KeyRound, ShieldCheck, UsersRound } from 'lucide-react';
import type { ReactNode } from 'react';
import type { PlatformDashboardData } from '@/features/platform-dashboard/types';

type PlatformRolePermissionOverviewProps = {
  data: PlatformDashboardData['rolePermissions'];
};

export function PlatformRolePermissionOverview({ data }: PlatformRolePermissionOverviewProps) {
  const { token } = theme.useToken();

  return (
    <section
      id='roles-access'
      style={{ marginTop: 28, scrollMarginTop: 96 }}
    >
      <SectionHeading
        title='Roles & Access'
        description='Platform-wide role assignment and permission coverage across companies.'
      />
      <Row gutter={[16, 16]}>
        <Col
          xs={24}
          md={8}
        >
          <Metric
            title='Roles'
            value={data.totalRoles}
            icon={<KeyRound size={18} />}
          />
        </Col>
        <Col
          xs={24}
          md={8}
        >
          <Metric
            title='Permissions'
            value={data.totalPermissions}
            icon={<ShieldCheck size={18} />}
          />
        </Col>
        <Col
          xs={24}
          md={8}
        >
          <Metric
            title='Role assignments'
            value={data.roleAssignments}
            icon={<UsersRound size={18} />}
          />
        </Col>
      </Row>
      <Row
        gutter={[16, 16]}
        style={{ marginTop: 16 }}
      >
        <Col
          xs={24}
          lg={10}
        >
          <Card
            variant='borderless'
            style={{ border: `1px solid ${token.colorBorderSecondary}` }}
          >
            <Space
              orientation='vertical'
              size={16}
              style={{ width: '100%' }}
            >
              <InlineMetric
                label='System roles'
                value={data.systemRoles}
              />
              <InlineMetric
                label='Default roles'
                value={data.defaultRoles}
              />
              <InlineMetric
                label='Role-permission links'
                value={data.rolePermissionLinks}
              />
              <InlineMetric
                label='Roles without permissions'
                value={data.rolesWithoutPermissions}
              />
              <InlineMetric
                label='Members without role'
                value={data.membersWithoutRole}
              />
            </Space>
          </Card>
        </Col>
        <Col
          xs={24}
          lg={14}
        >
          <Card
            id='permissions'
            title='Permission modules'
            variant='borderless'
            style={{
              border: `1px solid ${token.colorBorderSecondary}`,
              scrollMarginTop: 96,
            }}
          >
            <List
              dataSource={data.permissionModules}
              locale={{ emptyText: 'No permission modules yet.' }}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.name}
                    description={item.description}
                  />
                  <Typography.Text strong>{item.count}</Typography.Text>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </section>
  );

  function Metric({ title, value, icon }: { title: string; value: number; icon: ReactNode }) {
    return (
      <Card
        variant='borderless'
        style={{ border: `1px solid ${token.colorBorderSecondary}` }}
      >
        <Statistic
          title={title}
          value={value}
          prefix={icon}
        />
      </Card>
    );
  }
}

function InlineMetric({ label, value }: { label: string; value: number }) {
  return (
    <Space
      align='center'
      style={{ justifyContent: 'space-between', width: '100%' }}
    >
      <Typography.Text>{label}</Typography.Text>
      <Typography.Text strong>{value}</Typography.Text>
    </Space>
  );
}

function SectionHeading({ title, description }: { title: string; description: string }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <Typography.Title
        level={3}
        style={{ margin: 0 }}
      >
        {title}
      </Typography.Title>
      <Typography.Text type='secondary'>{description}</Typography.Text>
    </div>
  );
}
