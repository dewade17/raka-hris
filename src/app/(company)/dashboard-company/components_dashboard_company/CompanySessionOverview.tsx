'use client';

import { Card, Col, List, Row, Space, Statistic, Typography, theme } from 'antd';
import { Clock3, MonitorCheck, ShieldX } from 'lucide-react';
import type { ReactNode } from 'react';
import type { CompanyDashboardData } from '@/features/company/company-dashboard/types';
import { DashboardEmptyText, DashboardSectionHeading, getDashboardStatisticStyles, normalizeDashboardText } from './dashboardAccessibility';

type CompanySessionOverviewProps = {
  data: CompanyDashboardData['sessions'];
};

export function CompanySessionOverview({ data }: CompanySessionOverviewProps) {
  const { token } = theme.useToken();

  return (
    <section
      id='sessions'
      aria-labelledby='sessions-heading'
      style={{ marginTop: 28, scrollMarginTop: 96 }}
    >
      <DashboardSectionHeading
        id='sessions-heading'
        title='Sessions'
        description='Current access activity from user session and Google provider data.'
      />
      <Row gutter={[16, 16]}>
        <Col
          xs={24}
          md={8}
        >
          <Metric
            title='Active sessions'
            value={data.activeSessions}
            icon={
              <MonitorCheck
                size={18}
                aria-hidden='true'
                focusable='false'
              />
            }
          />
        </Col>
        <Col
          xs={24}
          md={8}
        >
          <Metric
            title='Revoked sessions'
            value={data.revokedSessions}
            icon={
              <ShieldX
                size={18}
                aria-hidden='true'
                focusable='false'
              />
            }
          />
        </Col>
        <Col
          xs={24}
          md={8}
        >
          <Metric
            title='Expiring soon'
            value={data.expiringSoon}
            icon={
              <Clock3
                size={18}
                aria-hidden='true'
                focusable='false'
              />
            }
          />
        </Col>
      </Row>
      <Row
        gutter={[16, 16]}
        style={{ marginTop: 16 }}
      >
        <Col
          xs={24}
          lg={9}
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
                label='Google accounts'
                value={data.googleAccounts}
              />
              <InlineMetric
                label='Verified Google accounts'
                value={data.verifiedGoogleAccounts}
              />
            </Space>
          </Card>
        </Col>
        <Col
          xs={24}
          lg={15}
        >
          <Card
            title='Recent session activity'
            variant='borderless'
            style={{ border: `1px solid ${token.colorBorderSecondary}` }}
          >
            <List
              dataSource={data.recentSessions}
              locale={{ emptyText: <DashboardEmptyText>No session activity yet.</DashboardEmptyText> }}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.title}
                    description={
                      <Typography.Text type='secondary'>
                        {normalizeDashboardText(item.description)} - {item.meta}
                      </Typography.Text>
                    }
                  />
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
          aria-label={`${title}: ${value}`}
          title={title}
          value={value}
          prefix={icon}
          styles={getDashboardStatisticStyles()}
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
