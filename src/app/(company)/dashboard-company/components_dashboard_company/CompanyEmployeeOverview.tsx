"use client";

import { Card, Col, List, Row, Space, Statistic, Typography, theme } from "antd";
import { AlertTriangle, Clock3, UserRoundCheck } from "lucide-react";
import type { ReactNode } from "react";
import type { CompanyDashboardData } from "@/features/company-dashboard/types";
import {
  DashboardEmptyText,
  DashboardSectionHeading,
  DashboardToneTag,
  getDashboardStatisticStyles,
  normalizeDashboardText,
} from "./dashboardAccessibility";

type CompanyEmployeeOverviewProps = {
  data: CompanyDashboardData["employees"];
};

export function CompanyEmployeeOverview({ data }: CompanyEmployeeOverviewProps) {
  const { token } = theme.useToken();

  return (
    <section
      id="employees"
      aria-labelledby="employees-heading"
      style={{ marginTop: 28, scrollMarginTop: 96 }}
    >
      <DashboardSectionHeading
        id="employees-heading"
        title="Employees"
        description="Membership and employee profile health based on available employee data."
      />
      <Row gutter={[16, 16]}>
        {data.statusMetrics.map((metric) => (
          <Col xs={24} md={8} key={metric.label}>
            <Card variant="borderless" style={{ border: `1px solid ${token.colorBorderSecondary}` }}>
              <Statistic
                aria-label={`${metric.label} members: ${metric.value}`}
                title={metric.label}
                value={metric.value}
                prefix={<UserRoundCheck size={18} aria-hidden="true" focusable="false" />}
                styles={getDashboardStatisticStyles()}
              />
              <DashboardToneTag
                tone={metric.tone}
                label="Membership"
                statusText={metric.label}
                style={{ marginTop: 12 }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={10}>
          <Card variant="borderless" style={{ border: `1px solid ${token.colorBorderSecondary}` }}>
            <Space direction="vertical" size={16} style={{ width: "100%" }}>
              <StatusLine
                icon={<AlertTriangle size={18} aria-hidden="true" focusable="false" />}
                label="Incomplete profiles"
                value={data.incompleteProfiles}
              />
              <StatusLine
                icon={<Clock3 size={18} aria-hidden="true" focusable="false" />}
                label="New members this month"
                value={data.newMembersThisMonth}
              />
              <StatusLine
                icon={<Clock3 size={18} aria-hidden="true" focusable="false" />}
                label="Probation ending in 30 days"
                value={data.probationEndingSoon}
              />
            </Space>
          </Card>
        </Col>
        <Col xs={24} lg={14}>
          <Card
            title="Recent members"
            variant="borderless"
            style={{ border: `1px solid ${token.colorBorderSecondary}` }}
          >
            <List
              dataSource={data.recentMembers}
              locale={{ emptyText: <DashboardEmptyText>No member activity yet.</DashboardEmptyText> }}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.title}
                    description={
                      <Typography.Text type="secondary">
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
}

type StatusLineProps = {
  icon: ReactNode;
  label: string;
  value: number;
};

function StatusLine({ icon, label, value }: StatusLineProps) {
  return (
    <Space align="center" style={{ justifyContent: "space-between", width: "100%" }}>
      <Space>
        {icon}
        <Typography.Text>{label}</Typography.Text>
      </Space>
      <Typography.Title level={4} style={{ margin: 0 }}>
        {value}
      </Typography.Title>
    </Space>
  );
}
