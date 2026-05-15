"use client";

import { Card, Col, Row, Space, Statistic, Typography, theme } from "antd";
import { MonitorCheck, ShieldCheck, UserRoundCheck, UsersRound } from "lucide-react";
import type { ReactNode } from "react";
import type { PlatformDashboardData } from "@/features/platform-dashboard/types";

type PlatformUserAccessOverviewProps = {
  data: PlatformDashboardData["userAccess"];
};

export function PlatformUserAccessOverview({ data }: PlatformUserAccessOverviewProps) {
  const { token } = theme.useToken();

  return (
    <section id="platform-users" style={{ marginTop: 28, scrollMarginTop: 96 }}>
      <SectionHeading
        title="Platform Users"
        description="User activity, admin access, sessions, and Google authentication coverage."
      />
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} xl={6}>
          <Metric title="Active users" value={data.activeUsers} suffix={`/ ${data.totalUsers}`} icon={<UserRoundCheck size={18} />} />
        </Col>
        <Col xs={24} md={12} xl={6}>
          <Metric title="Inactive users" value={data.inactiveUsers} icon={<UsersRound size={18} />} />
        </Col>
        <Col xs={24} md={12} xl={6}>
          <Metric title="Superadmins" value={data.superAdmins} icon={<ShieldCheck size={18} />} />
        </Col>
        <Col xs={24} md={12} xl={6}>
          <Metric title="Active sessions" value={data.activeSessions} icon={<MonitorCheck size={18} />} />
        </Col>
      </Row>
      <Card
        variant="borderless"
        style={{ marginTop: 16, border: `1px solid ${token.colorBorderSecondary}` }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <InlineMetric label="Revoked sessions" value={data.revokedSessions} />
          </Col>
          <Col xs={24} md={8}>
            <InlineMetric label="Google accounts" value={data.googleAccounts} />
          </Col>
          <Col xs={24} md={8}>
            <InlineMetric label="Verified Google accounts" value={data.verifiedGoogleAccounts} />
          </Col>
        </Row>
      </Card>
    </section>
  );

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
    return (
      <Card variant="borderless" style={{ border: `1px solid ${token.colorBorderSecondary}` }}>
        <Statistic title={title} value={value} suffix={suffix} prefix={icon} />
      </Card>
    );
  }
}

function InlineMetric({ label, value }: { label: string; value: number }) {
  return (
    <Space align="center" style={{ justifyContent: "space-between", width: "100%" }}>
      <Typography.Text>{label}</Typography.Text>
      <Typography.Text strong>{value}</Typography.Text>
    </Space>
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
