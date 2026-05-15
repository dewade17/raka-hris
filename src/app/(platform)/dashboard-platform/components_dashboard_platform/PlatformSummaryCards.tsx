"use client";

import { Card, Col, Row, Space, Statistic, Typography, theme } from "antd";
import { Building2, CreditCard, UsersRound, UserRoundCheck } from "lucide-react";
import type { ReactNode } from "react";
import type { PlatformDashboardData } from "@/features/platform-dashboard/types";

type PlatformSummaryCardsProps = {
  data: PlatformDashboardData["summary"];
};

export function PlatformSummaryCards({ data }: PlatformSummaryCardsProps) {
  return (
    <section style={{ scrollMarginTop: 96 }}>
      <Space direction="vertical" size={4} style={{ width: "100%", marginBottom: 18 }}>
        <Typography.Text type="secondary">Platform dashboard</Typography.Text>
        <Typography.Title level={2} style={{ margin: 0 }}>
          Platform operations
        </Typography.Title>
        <Typography.Text type="secondary">
          Tenant, user, access, subscription, and organization visibility from available Prisma data.
        </Typography.Text>
      </Space>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} xl={6}>
          <Metric title="Active companies" value={data.activeCompanies} suffix={`/ ${data.totalCompanies}`} icon={<Building2 size={20} />} />
        </Col>
        <Col xs={24} md={12} xl={6}>
          <Metric title="Active users" value={data.activeUsers} suffix={`/ ${data.totalUsers}`} icon={<UserRoundCheck size={20} />} />
        </Col>
        <Col xs={24} md={12} xl={6}>
          <Metric title="Memberships" value={data.totalMemberships} icon={<UsersRound size={20} />} />
        </Col>
        <Col xs={24} md={12} xl={6}>
          <Metric title="Active subscriptions" value={data.activeSubscriptions} icon={<CreditCard size={20} />} />
        </Col>
      </Row>
    </section>
  );
}

function Metric({
  title,
  value,
  suffix,
  icon,
}: {
  title: string;
  value: number;
  suffix?: string;
  icon: ReactNode;
}) {
  const { token } = theme.useToken();

  return (
    <Card
      variant="borderless"
      style={{
        height: "100%",
        border: `1px solid ${token.colorBorderSecondary}`,
      }}
    >
      <Space direction="vertical" size={12} style={{ width: "100%" }}>
        <span
          style={{
            display: "inline-flex",
            width: 38,
            height: 38,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: token.borderRadiusLG,
            background: token.colorBgLayout,
            color: token.colorPrimary,
          }}
        >
          {icon}
        </span>
        <Statistic title={title} value={value} suffix={suffix} />
      </Space>
    </Card>
  );
}
