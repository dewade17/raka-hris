"use client";

import { Card, Col, List, Row, Space, Statistic, Typography, theme } from "antd";
import { KeyRound, ShieldCheck, UserRoundCog } from "lucide-react";
import type { ReactNode } from "react";
import type { CompanyDashboardData } from "@/features/company-dashboard/types";
import {
  DashboardEmptyText,
  DashboardSectionHeading,
  getDashboardStatisticStyles,
  normalizeDashboardText,
} from "./dashboardAccessibility";

type CompanyAccessOverviewProps = {
  data: CompanyDashboardData["access"];
};

export function CompanyAccessOverview({ data }: CompanyAccessOverviewProps) {
  const { token } = theme.useToken();

  return (
    <section
      id="roles-access"
      aria-labelledby="roles-access-heading"
      style={{ marginTop: 28, scrollMarginTop: 96 }}
    >
      <DashboardSectionHeading
        id="roles-access-heading"
        title="Roles & Access"
        description="Role assignments and permission coverage available for this company."
      />
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Metric
            title="Roles"
            value={data.totalRoles}
            icon={<KeyRound size={18} aria-hidden="true" focusable="false" />}
          />
        </Col>
        <Col xs={24} md={8}>
          <Metric
            title="Permissions"
            value={data.permissions}
            icon={<ShieldCheck size={18} aria-hidden="true" focusable="false" />}
          />
        </Col>
        <Col xs={24} md={8}>
          <Metric
            title="Assignments"
            value={data.memberRoleAssignments}
            icon={<UserRoundCog size={18} aria-hidden="true" focusable="false" />}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={10}>
          <Card variant="borderless" style={{ border: `1px solid ${token.colorBorderSecondary}` }}>
            <Space direction="vertical" size={16} style={{ width: "100%" }}>
              <InlineMetric label="System roles" value={data.systemRoles} />
              <InlineMetric label="Default roles" value={data.defaultRoles} />
              <InlineMetric label="Role-permission links" value={data.rolePermissionLinks} />
              <InlineMetric label="Roles without permissions" value={data.rolesWithoutPermissions} />
              <InlineMetric label="Members without role" value={data.membersWithoutRole} />
            </Space>
          </Card>
        </Col>
        <Col xs={24} lg={14}>
          <Card
            title="Role distribution"
            variant="borderless"
            style={{ border: `1px solid ${token.colorBorderSecondary}` }}
          >
            <List
              dataSource={data.topRoles}
              locale={{ emptyText: <DashboardEmptyText>No roles have been created.</DashboardEmptyText> }}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.name}
                    description={
                      item.description ? (
                        <Typography.Text type="secondary">
                          {normalizeDashboardText(item.description)}
                        </Typography.Text>
                      ) : null
                    }
                  />
                  <Typography.Text strong>{item.count} members</Typography.Text>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </section>
  );

  function Metric({
    title,
    value,
    icon,
  }: {
    title: string;
    value: number;
    icon: ReactNode;
  }) {
    return (
      <Card variant="borderless" style={{ border: `1px solid ${token.colorBorderSecondary}` }}>
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
    <Space align="center" style={{ justifyContent: "space-between", width: "100%" }}>
      <Typography.Text>{label}</Typography.Text>
      <Typography.Text strong>{value}</Typography.Text>
    </Space>
  );
}
