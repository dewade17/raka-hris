'use client';

import { Card, Space, Typography, theme } from 'antd';
import type { ReactNode } from 'react';

const { Text, Title } = Typography;

type EmployeeProfileSummaryCardProps = {
  icon: ReactNode;
  label: string;
  value: string;
  detail?: string;
};

export function EmployeeProfileSummaryCard({ icon, label, value, detail }: EmployeeProfileSummaryCardProps) {
  const { token } = theme.useToken();

  return (
    <Card
      variant='borderless'
      style={{
        height: '100%',
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
      }}
      styles={{ body: { padding: 18 } }}
    >
      <Space
        orientation='vertical'
        size={8}
        style={{ width: '100%' }}
      >
        <Space
          size={8}
          align='center'
        >
          <span
            aria-hidden='true'
            style={{ color: token.colorPrimary, display: 'inline-flex' }}
          >
            {icon}
          </span>
          <Text type='secondary'>{label}</Text>
        </Space>
        <Title
          level={4}
          style={{ margin: 0, fontSize: 18, lineHeight: 1.3 }}
        >
          {value}
        </Title>
        {detail ? (
          <Text
            type='secondary'
            style={{ fontSize: 12 }}
          >
            {detail}
          </Text>
        ) : null}
      </Space>
    </Card>
  );
}
