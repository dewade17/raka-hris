'use client';

import { Card, Col, Row, Space, Typography, theme } from 'antd';
import { BriefcaseBusiness, CalendarClock, CalendarDays, CircleCheck, CircleX } from 'lucide-react';
import type { ReactNode } from 'react';
import type { EmployeeProfileViewModel } from '../types';

const { Text } = Typography;

type EmployeeEmploymentCardProps = {
  employee: EmployeeProfileViewModel;
};

export function EmployeeEmploymentCard({ employee }: EmployeeEmploymentCardProps) {
  const { token } = theme.useToken();
  const profile = employee.profile;

  return (
    <Card
      title={
        <SectionTitle
          icon={
            <BriefcaseBusiness
              size={16}
              aria-hidden='true'
              focusable='false'
            />
          }
          label='Employment'
        />
      }
      variant='borderless'
      style={{
        height: '100%',
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
      }}
    >
      <Row gutter={[18, 14]}>
        <InfoItem
          icon={
            <BriefcaseBusiness
              size={16}
              aria-hidden='true'
              focusable='false'
            />
          }
          label='Employment type'
          value={profile?.employmentType}
        />
        <InfoItem
          icon={
            <CalendarDays
              size={16}
              aria-hidden='true'
              focusable='false'
            />
          }
          label='Hire date'
          value={profile?.hireDate ? formatDate(profile.hireDate) : null}
        />
        <InfoItem
          icon={
            <CalendarClock
              size={16}
              aria-hidden='true'
              focusable='false'
            />
          }
          label='Probation end'
          value={profile?.probationEndDate ? formatDate(profile.probationEndDate) : null}
        />
        <InfoItem
          icon={
            employee.employmentEndedAt ? (
              <CircleX
                size={16}
                aria-hidden='true'
                focusable='false'
              />
            ) : (
              <CircleCheck
                size={16}
                aria-hidden='true'
                focusable='false'
              />
            )
          }
          label='Employment status'
          value={employee.employmentEndedAt ? `Ended ${formatDate(employee.employmentEndedAt)}` : 'Active employee'}
        />
      </Row>
    </Card>
  );
}

function SectionTitle({ icon, label }: { icon: ReactNode; label: string }) {
  const { token } = theme.useToken();

  return (
    <Space size={8}>
      <span style={{ color: token.colorPrimary, display: 'inline-flex' }}>{icon}</span>
      <Text strong>{label}</Text>
    </Space>
  );
}

function InfoItem({ icon, label, value }: { icon: ReactNode; label: string; value?: string | null }) {
  const { token } = theme.useToken();

  return (
    <Col xs={24}>
      <Space
        align='start'
        size={10}
        style={{ width: '100%' }}
      >
        <span
          aria-hidden='true'
          style={{ color: token.colorTextTertiary, display: 'inline-flex', marginTop: 2 }}
        >
          {icon}
        </span>
        <Space
          orientation='vertical'
          size={2}
          style={{ minWidth: 0 }}
        >
          <Text type='secondary'>{label}</Text>
          <Text>{value || 'Not set'}</Text>
        </Space>
      </Space>
    </Col>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}
