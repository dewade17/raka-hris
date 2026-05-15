"use client";

import { Card, Col, Row, Skeleton, Space, theme } from "antd";

export default function CompanyDashboardLoading() {
  const { token } = theme.useToken();

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <Skeleton.Input active size="large" style={{ width: 280 }} />
      <Row gutter={[16, 16]}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Col xs={24} md={12} xl={6} key={index}>
            <Card variant="borderless" style={{ border: `1px solid ${token.colorBorderSecondary}` }}>
              <Skeleton active paragraph={{ rows: 2 }} />
            </Card>
          </Col>
        ))}
      </Row>
      <Card variant="borderless" style={{ border: `1px solid ${token.colorBorderSecondary}` }}>
        <Skeleton active paragraph={{ rows: 6 }} />
      </Card>
    </Space>
  );
}
