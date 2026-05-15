"use client";

import { Card, Col, List, Row, Statistic, Tag, Typography, theme } from "antd";
import type { DashboardTone, PlatformDashboardData } from "@/features/platform-dashboard/types";

type PlatformSubscriptionOverviewProps = {
  data: PlatformDashboardData["subscriptions"];
};

export function PlatformSubscriptionOverview({ data }: PlatformSubscriptionOverviewProps) {
  const { token } = theme.useToken();

  return (
    <section id="subscriptions" style={{ marginTop: 28, scrollMarginTop: 96 }}>
      <SectionHeading
        title="Subscriptions"
        description="Subscription plans and tenant subscription statuses currently available in billing data."
      />
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card variant="borderless" style={{ border: `1px solid ${token.colorBorderSecondary}` }}>
            <Statistic title="Active plans" value={data.activePlans} suffix={`/ ${data.totalPlans}`} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card variant="borderless" style={{ border: `1px solid ${token.colorBorderSecondary}` }}>
            <Statistic title="Monthly plans" value={data.monthlyPlans} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card variant="borderless" style={{ border: `1px solid ${token.colorBorderSecondary}` }}>
            <Statistic title="Yearly plans" value={data.yearlyPlans} />
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card
            title="Subscription statuses"
            variant="borderless"
            style={{ border: `1px solid ${token.colorBorderSecondary}` }}
          >
            <List
              dataSource={data.statusMetrics}
              renderItem={(item) => (
                <List.Item>
                  <Typography.Text>{item.label}</Typography.Text>
                  <Tag color={toneColor(item.tone)} style={{ margin: 0 }}>
                    {item.value}
                  </Tag>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title="Plan intervals"
            variant="borderless"
            style={{ border: `1px solid ${token.colorBorderSecondary}` }}
          >
            <List
              dataSource={data.planMix}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta title={item.name} description={item.description} />
                  <Typography.Text strong>{item.count}</Typography.Text>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </section>
  );
}

function SectionHeading({ title, description }: { title: string; description: string }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <Typography.Title level={3} style={{ margin: 0 }}>
        {title}
      </Typography.Title>
      <Typography.Text type="secondary">{description}</Typography.Text>
    </div>
  );
}

function toneColor(tone: DashboardTone) {
  const colors: Record<DashboardTone, string> = {
    success: "success",
    warning: "warning",
    danger: "error",
    info: "processing",
    default: "default",
  };

  return colors[tone];
}
