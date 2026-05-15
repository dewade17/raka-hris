"use client";

import { Card, Col, List, Row, Statistic, Typography, theme } from "antd";
import type { CompanyDashboardData } from "@/features/company-dashboard/types";
import {
  DashboardEmptyText,
  DashboardSectionHeading,
  getDashboardStatisticStyles,
} from "./dashboardAccessibility";

type CompanyOrganizationOverviewProps = {
  data: CompanyDashboardData["organization"];
};

export function CompanyOrganizationOverview({ data }: CompanyOrganizationOverviewProps) {
  const { token } = theme.useToken();

  return (
    <section
      id="organization"
      aria-labelledby="organization-heading"
      style={{ marginTop: 28, scrollMarginTop: 96 }}
    >
      <DashboardSectionHeading
        id="organization-heading"
        title="Organization"
        description="Departments, positions, and work locations currently available in this company."
      />
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Metric title="Departments" value={data.activeDepartments} suffix={`/ ${data.totalDepartments}`} />
        </Col>
        <Col xs={24} md={8}>
          <Metric title="Positions" value={data.activePositions} suffix={`/ ${data.totalPositions}`} />
        </Col>
        <Col xs={24} md={8}>
          <Metric title="Locations" value={data.activeLocations} suffix={`/ ${data.totalLocations}`} />
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={8}>
          <NamedCountCard title="Departments" items={data.topDepartments} />
        </Col>
        <Col xs={24} lg={8}>
          <NamedCountCard title="Positions" items={data.topPositions} />
        </Col>
        <Col xs={24} lg={8}>
          <NamedCountCard title="Locations" items={data.locations} countLabel="Active" />
        </Col>
      </Row>
    </section>
  );

  function Metric({ title, value, suffix }: { title: string; value: number; suffix: string }) {
    return (
      <Card variant="borderless" style={{ border: `1px solid ${token.colorBorderSecondary}` }}>
        <Statistic
          aria-label={`${title}: ${value} ${suffix}`}
          title={title}
          value={value}
          suffix={suffix}
          styles={getDashboardStatisticStyles()}
        />
      </Card>
    );
  }
}

function NamedCountCard({
  title,
  items,
  countLabel = "Members",
}: {
  title: string;
  items: CompanyDashboardData["organization"]["topDepartments"];
  countLabel?: string;
}) {
  const { token } = theme.useToken();

  return (
    <Card title={title} variant="borderless" style={{ border: `1px solid ${token.colorBorderSecondary}` }}>
      <List
        dataSource={items}
        locale={{ emptyText: <DashboardEmptyText>{`No ${title.toLowerCase()} yet.`}</DashboardEmptyText> }}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={item.name}
              description={
                item.description ? (
                  <Typography.Text type="secondary">{item.description}</Typography.Text>
                ) : null
              }
            />
            <Typography.Text strong>
              {item.count} {countLabel}
            </Typography.Text>
          </List.Item>
        )}
      />
    </Card>
  );
}
