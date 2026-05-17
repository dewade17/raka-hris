'use client';

import { Card, Col, Progress, Row, Space, Statistic, Typography, theme } from 'antd';
import { Building2, CheckCircle2, CreditCard, UsersRound } from 'lucide-react';
import type { ReactNode } from 'react';
import type { CompanyDashboardData } from '@/features/company/company-dashboard/types';
import { DashboardToneTag, getCompletionStatusText, getDashboardStatisticStyles } from './dashboardAccessibility';

type CompanySummaryCardsProps = {
  data: CompanyDashboardData;
};

export function CompanySummaryCards({ data }: CompanySummaryCardsProps) {
  const { token } = theme.useToken();

  return (
    <section
      id='company-profile'
      aria-labelledby='company-dashboard-title'
      style={{ scrollMarginTop: 96 }}
    >
      <Space
        orientation='vertical'
        size={4}
        style={{ width: '100%', marginBottom: 18 }}
      >
        <Typography.Text type='secondary'>Company dashboard</Typography.Text>
        <Typography.Title
          id='company-dashboard-title'
          level={1}
          style={{ margin: 0, fontSize: 30, lineHeight: 1.2 }}
        >
          {data.company.name}
        </Typography.Title>
        <Typography.Text type='secondary'>Live operational view from company, employee, access, session, and subscription data.</Typography.Text>
      </Space>

      <Row gutter={[16, 16]}>
        <Col
          xs={24}
          md={12}
          xl={6}
        >
          <MetricCard
            title='Active members'
            value={data.summary.activeMembers}
            suffix={`/ ${data.summary.totalMembers}`}
            icon={
              <UsersRound
                size={20}
                aria-hidden='true'
                focusable='false'
              />
            }
          />
        </Col>
        <Col
          xs={24}
          md={12}
          xl={6}
        >
          <MetricCard
            title='Employee profiles'
            value={data.summary.employeeProfiles}
            icon={
              <Building2
                size={20}
                aria-hidden='true'
                focusable='false'
              />
            }
          />
        </Col>
        <Col
          xs={24}
          md={12}
          xl={6}
        >
          <MetricCard
            title='Subscription'
            value={data.summary.subscriptionStatus}
            icon={
              <CreditCard
                size={20}
                aria-hidden='true'
                focusable='false'
              />
            }
          />
        </Col>
        <Col
          xs={24}
          md={12}
          xl={6}
        >
          <MetricCard
            title='Seat usage'
            value={data.summary.seatUsed}
            suffix={data.summary.seatLimit > 0 ? `/ ${data.summary.seatLimit}` : ''}
            icon={
              <CheckCircle2
                size={20}
                aria-hidden='true'
                focusable='false'
              />
            }
          />
        </Col>
      </Row>

      <Card
        aria-labelledby='company-profile-heading'
        variant='borderless'
        style={{ marginTop: 16, border: `1px solid ${token.colorBorderSecondary}` }}
      >
        <Row
          gutter={[18, 18]}
          align='middle'
        >
          <Col
            xs={24}
            lg={8}
          >
            <Typography.Title
              id='company-profile-heading'
              level={4}
              style={{ marginTop: 0 }}
            >
              Company profile
            </Typography.Title>
            <Typography.Paragraph
              type='secondary'
              style={{ marginBottom: 0 }}
            >
              {data.company.locationLabel} - {data.company.timezoneLabel}
            </Typography.Paragraph>
          </Col>
          <Col
            xs={24}
            lg={8}
          >
            <Progress
              aria-label={`Company profile completeness is ${data.company.profileCompleteness} percent`}
              type='dashboard'
              percent={data.company.profileCompleteness}
              strokeColor={token.colorPrimary}
              railColor={token.colorBorderSecondary}
            />
          </Col>
          <Col
            xs={24}
            lg={8}
          >
            <Space
              size={[8, 8]}
              wrap
            >
              {data.company.contactCompleteness.map((item) => (
                <DashboardToneTag
                  key={item.label}
                  tone={item.tone}
                  label={item.label}
                  statusText={getCompletionStatusText(item.value)}
                />
              ))}
            </Space>
          </Col>
        </Row>
      </Card>
    </section>
  );
}

type MetricCardProps = {
  title: string;
  value: string | number;
  suffix?: string;
  icon: ReactNode;
};

function MetricCard({ title, value, suffix, icon }: MetricCardProps) {
  const { token } = theme.useToken();
  const accessibleValue = `${value}${suffix ? ` ${suffix}` : ''}`;

  return (
    <Card
      variant='borderless'
      style={{
        height: '100%',
        border: `1px solid ${token.colorBorderSecondary}`,
      }}
    >
      <Space
        orientation='vertical'
        size={12}
        style={{ width: '100%' }}
      >
        <span
          aria-hidden='true'
          style={{
            display: 'inline-flex',
            width: 38,
            height: 38,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: token.borderRadiusLG,
            background: token.colorBgLayout,
            color: token.colorPrimary,
          }}
        >
          {icon}
        </span>
        <Statistic
          aria-label={`${title}: ${accessibleValue}`}
          title={title}
          value={value}
          suffix={suffix}
          styles={getDashboardStatisticStyles()}
        />
      </Space>
    </Card>
  );
}
