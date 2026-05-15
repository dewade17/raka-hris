"use client";

import { Card, Col, Row, Statistic, Typography, theme } from "antd";
import type { PlatformDashboardData } from "@/features/platform-dashboard/types";

type PlatformOrganizationOverviewProps = {
  data: PlatformDashboardData["organization"];
};

export function PlatformOrganizationOverview({ data }: PlatformOrganizationOverviewProps) {
  const { token } = theme.useToken();

  return (
    <section id="organization" style={{ marginTop: 28, scrollMarginTop: 96 }}>
      <SectionHeading
        title="Organization Data"
        description="Company structure totals from department, position, and location records."
      />
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Metric title="Departments" value={data.activeDepartments} suffix={`/ ${data.departments}`} />
        </Col>
        <Col xs={24} md={8}>
          <Metric title="Positions" value={data.activePositions} suffix={`/ ${data.positions}`} />
        </Col>
        <Col xs={24} md={8}>
          <Metric title="Locations" value={data.activeLocations} suffix={`/ ${data.locations}`} />
        </Col>
      </Row>
      <Card
        variant="borderless"
        style={{ marginTop: 16, border: `1px solid ${token.colorBorderSecondary}` }}
      >
        <Statistic
          title="Companies with at least one location"
          value={data.companiesWithLocations}
        />
      </Card>
    </section>
  );

  function Metric({ title, value, suffix }: { title: string; value: number; suffix: string }) {
    return (
      <Card variant="borderless" style={{ border: `1px solid ${token.colorBorderSecondary}` }}>
        <Statistic title={title} value={value} suffix={suffix} />
      </Card>
    );
  }
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
