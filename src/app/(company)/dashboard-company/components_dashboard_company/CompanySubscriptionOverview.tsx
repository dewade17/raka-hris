'use client';

import { Card, Col, Progress, Row, Space, Statistic, Typography, theme } from 'antd';
import { CreditCard, UsersRound } from 'lucide-react';
import type { CompanyDashboardData } from '@/features/company/company-dashboard/types';
import { DashboardSectionHeading, DashboardToneTag, getDashboardStatisticStyles } from './dashboardAccessibility';

type CompanySubscriptionOverviewProps = {
  data: CompanyDashboardData['subscription'];
};

export function CompanySubscriptionOverview({ data }: CompanySubscriptionOverviewProps) {
  const { token } = theme.useToken();

  return (
    <section
      id='subscription'
      aria-labelledby='subscription-heading'
      style={{ marginTop: 28, scrollMarginTop: 96 }}
    >
      <DashboardSectionHeading
        id='subscription-heading'
        title='Subscription'
        description='Plan, seat capacity, and subscription period from billing data currently available.'
      />
      <Card
        variant='borderless'
        style={{ border: `1px solid ${token.colorBorderSecondary}` }}
      >
        <Row
          gutter={[18, 18]}
          align='middle'
        >
          <Col
            xs={24}
            lg={8}
          >
            <Space
              direction='vertical'
              size={10}
            >
              <DashboardToneTag
                tone='info'
                label='Plan status'
                statusText={data.status}
              />
              <Typography.Title
                level={3}
                style={{ margin: 0 }}
              >
                {data.planName}
              </Typography.Title>
              <Typography.Text type='secondary'>
                {data.currency} {data.pricePerUser} per user - {data.interval}
              </Typography.Text>
            </Space>
          </Col>
          <Col
            xs={24}
            md={12}
            lg={8}
          >
            <Progress
              aria-label={`Seat usage is ${data.seatUsed} of ${data.seatLimit || 0}`}
              percent={data.seatUsagePercent}
              strokeColor={token.colorPrimary}
              railColor={token.colorBorderSecondary}
              format={() => `${data.seatUsed}/${data.seatLimit || 0}`}
            />
          </Col>
          <Col
            xs={24}
            md={12}
            lg={8}
          >
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic
                  aria-label={`Seat limit: ${data.seatLimit}`}
                  title='Seat limit'
                  value={data.seatLimit}
                  prefix={
                    <UsersRound
                      size={18}
                      aria-hidden='true'
                      focusable='false'
                    />
                  }
                  styles={getDashboardStatisticStyles()}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  aria-label={`Current period end: ${data.currentPeriodEnd}`}
                  title='Current period end'
                  value={data.currentPeriodEnd}
                  prefix={
                    <CreditCard
                      size={18}
                      aria-hidden='true'
                      focusable='false'
                    />
                  }
                  styles={getDashboardStatisticStyles()}
                />
              </Col>
            </Row>
            <Typography.Text type='secondary'>Trial ends: {data.trialEndsAt}</Typography.Text>
          </Col>
        </Row>
      </Card>
    </section>
  );
}
