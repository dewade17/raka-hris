'use client';

import { Alert, Card, Col, Row, Space, Typography, theme } from 'antd';
import { Contact, HeartHandshake, Mail, MapPinned, Phone, UserRound } from 'lucide-react';
import type { ReactNode } from 'react';
import type { EmployeeProfileViewModel } from '../types';

const { Text } = Typography;

type EmployeeIdentityCardProps = {
  employee: EmployeeProfileViewModel;
};

export function EmployeeIdentityCard({ employee }: EmployeeIdentityCardProps) {
  const { token } = theme.useToken();
  const profile = employee.profile;

  return (
    <Card
      title={
        <SectionTitle
          icon={
            <UserRound
              size={16}
              aria-hidden='true'
              focusable='false'
            />
          }
          label='Identity'
        />
      }
      variant='borderless'
      style={{
        height: '100%',
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
      }}
    >
      {!profile ? (
        <Alert
          showIcon
          type='warning'
          message='Employee profile details have not been completed yet.'
        />
      ) : null}

      <Row gutter={[18, 14]}>
        <InfoItem
          icon={
            <Mail
              size={16}
              aria-hidden='true'
              focusable='false'
            />
          }
          label='Email'
          value={employee.user.email}
        />
        <InfoItem
          icon={
            <Phone
              size={16}
              aria-hidden='true'
              focusable='false'
            />
          }
          label='Phone'
          value={profile?.phone}
        />
        <InfoItem
          icon={
            <Contact
              size={16}
              aria-hidden='true'
              focusable='false'
            />
          }
          label='Personal details'
          value={formatPersonalDetails(profile)}
        />
        <InfoItem
          icon={
            <MapPinned
              size={16}
              aria-hidden='true'
              focusable='false'
            />
          }
          label='Address'
          value={formatAddress(profile)}
        />
        <InfoItem
          icon={
            <HeartHandshake
              size={16}
              aria-hidden='true'
              focusable='false'
            />
          }
          label='Emergency contact'
          value={formatEmergencyContact(profile)}
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

function formatPersonalDetails(profile: EmployeeProfileViewModel['profile']) {
  if (!profile) {
    return null;
  }

  const details = [profile.gender, profile.maritalStatus, profile.birthPlace, profile.birthDate ? formatDate(profile.birthDate) : null].filter(Boolean);

  return details.length > 0 ? details.join(' - ') : null;
}

function formatAddress(profile: EmployeeProfileViewModel['profile']) {
  if (!profile) {
    return null;
  }

  const address = [profile.addressLine1, profile.city, profile.province].filter(Boolean);

  return address.length > 0 ? address.join(', ') : null;
}

function formatEmergencyContact(profile: EmployeeProfileViewModel['profile']) {
  if (!profile) {
    return null;
  }

  const contact = [profile.emergencyContactName, profile.emergencyContactPhone].filter(Boolean);

  return contact.length > 0 ? contact.join(' - ') : null;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}
