"use client";

import { Card, Col, Row, Statistic, Table, Tag, Typography, theme } from "antd";
import type { ColumnsType } from "antd/es/table";
import type {
  DashboardTone,
  PlatformCompanyRow,
  PlatformDashboardData,
} from "@/features/platform-dashboard/types";

type PlatformCompanyOverviewProps = {
  data: PlatformDashboardData["companies"];
};

export function PlatformCompanyOverview({ data }: PlatformCompanyOverviewProps) {
  const { token } = theme.useToken();
  const columns: ColumnsType<PlatformCompanyRow> = [
    {
      title: "Company",
      dataIndex: "name",
      key: "name",
      render: (_, row) => (
        <div>
          <Typography.Text strong>{row.name}</Typography.Text>
          <Typography.Text type="secondary" style={{ display: "block", fontSize: 12 }}>
            {row.slug}
          </Typography.Text>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => <Tag color={statusColor(status)}>{status}</Tag>,
    },
    {
      title: "Members",
      dataIndex: "members",
      key: "members",
      align: "right",
    },
    {
      title: "Departments",
      dataIndex: "departments",
      key: "departments",
      align: "right",
    },
    {
      title: "Plan",
      dataIndex: "planName",
      key: "planName",
    },
    {
      title: "Subscription",
      dataIndex: "subscriptionStatus",
      key: "subscriptionStatus",
    },
  ];

  return (
    <section id="companies" style={{ marginTop: 28, scrollMarginTop: 96 }}>
      <SectionHeading
        title="Companies"
        description="Tenant status and latest company records from company and subscription data."
      />
      <Row gutter={[16, 16]}>
        {data.statusMetrics.map((metric) => (
          <Col xs={24} md={8} key={metric.label}>
            <Card variant="borderless" style={{ border: `1px solid ${token.colorBorderSecondary}` }}>
              <Statistic title={metric.label} value={metric.value} />
              <Tag color={toneColor(metric.tone)} style={{ marginTop: 12 }}>
                Company status
              </Tag>
            </Card>
          </Col>
        ))}
      </Row>
      <Card
        title="Recent companies"
        variant="borderless"
        style={{ marginTop: 16, border: `1px solid ${token.colorBorderSecondary}` }}
      >
        <Table
          rowKey="key"
          columns={columns}
          dataSource={data.recentCompanies}
          pagination={false}
          scroll={{ x: 760 }}
        />
      </Card>
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

function statusColor(status: string) {
  if (status === "Active") {
    return "success";
  }

  if (status === "Suspended") {
    return "warning";
  }

  return "error";
}
