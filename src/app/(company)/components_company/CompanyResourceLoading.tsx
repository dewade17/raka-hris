"use client";

import { Card, Col, Flex, Row, Skeleton, Space, theme } from "antd";

export function CompanyResourceLoading() {
  const { token } = theme.useToken();

  return (
    <Space
      direction="vertical"
      size={16}
      style={{ width: "100%" }}
      aria-busy="true"
      aria-live="polite"
    >
      <Flex justify="space-between" align="flex-start" gap={16} wrap="wrap">
        <Space direction="vertical" size={8}>
          <Skeleton.Input active size="large" style={{ width: 220 }} />
          <Skeleton.Input active style={{ width: 360, maxWidth: "100%" }} />
        </Space>
        <Skeleton.Button active size="large" style={{ width: 150 }} />
      </Flex>

      <Row gutter={[12, 12]}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Col xs={12} md={6} key={index}>
            <Card
              variant="borderless"
              style={{
                height: "100%",
                border: `1px solid ${token.colorBorderSecondary}`,
                borderRadius: token.borderRadiusLG,
              }}
            >
              <Skeleton active paragraph={{ rows: 1 }} />
            </Card>
          </Col>
        ))}
      </Row>

      <Card
        variant="borderless"
        style={{
          border: `1px solid ${token.colorBorderSecondary}`,
          borderRadius: token.borderRadiusLG,
        }}
      >
        <Flex gap={12} wrap="wrap" style={{ marginBottom: 16 }}>
          <Skeleton.Input active style={{ width: 320, maxWidth: "100%" }} />
          <Skeleton.Input active style={{ width: 190 }} />
        </Flex>
        <Skeleton active paragraph={{ rows: 6 }} />
      </Card>
    </Space>
  );
}
