'use client';

import { Avatar, Card, Col, Row, Space, Typography, theme } from 'antd';
import { Building2, CheckCircle2, Clock3, Edit3, LockKeyhole, Mail, MapPinned, Phone } from 'lucide-react';
import type { ReactNode } from 'react';
import { useUpdateCompanyProfile } from '../hooks/useUpdateCompanyProfile';
import { CompanyProfileForm } from './CompanyProfileForm';

type CompanyProfileViewModel = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  logoUrl: string | null;
  addressLine1: string | null;
  city: string | null;
  province: string | null;
  timezone: string | null;
  updatedAt: string;
};

type CompanyProfileEditorProps = {
  profile: CompanyProfileViewModel;
  canUpdate: boolean;
};

const { Text, Title } = Typography;

export function CompanyProfileEditor({ profile, canUpdate }: CompanyProfileEditorProps) {
  const { token } = theme.useToken();
  const { errorMessage, isSubmitting, updateCompanyProfile, clearErrorMessage } = useUpdateCompanyProfile();

  const updatedAtLabel = new Intl.DateTimeFormat('en', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(profile.updatedAt));

  return (
    <section aria-labelledby='company-profile-page-title'>
      <Card
        variant='borderless'
        style={{
          border: `1px solid ${token.colorBorderSecondary}`,
          borderRadius: token.borderRadiusLG,
          marginBottom: 16,
          overflow: 'hidden',
        }}
        styles={{ body: { padding: '28px 28px 24px' } }}
      >
        <Space
          orientation='vertical'
          size={20}
          style={{ width: '100%' }}
        >
          <Space
            size={20}
            align='start'
          >
            <Avatar
              size={72}
              src={profile.logoUrl || undefined}
              icon={
                <Building2
                  size={30}
                  aria-hidden='true'
                  focusable='false'
                />
              }
              shape='square'
              style={{
                background: profile.logoUrl ? token.colorBgContainer : token.colorPrimary,
                color: token.colorTextLightSolid,
                borderRadius: token.borderRadiusLG,
                flexShrink: 0,
              }}
            />
            <Space
              orientation='vertical'
              size={8}
              style={{ minWidth: 0 }}
            >
              <Text
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 11,
                  fontWeight: 600,
                  color: token.colorPrimary,
                  background: token.controlItemBgActive,
                  border: `1px solid ${token.colorBorderSecondary}`,
                  borderRadius: 999,
                  padding: '3px 10px',
                }}
              >
                <CheckCircle2
                  size={13}
                  aria-hidden='true'
                  focusable='false'
                />
                Company workspace
              </Text>
              <Title
                id='company-profile-page-title'
                level={2}
                style={{ margin: 0, fontSize: 26, lineHeight: 1.2 }}
              >
                {profile.name}
              </Title>
              <Text
                type='secondary'
                style={{ fontSize: 13, lineHeight: 1.6 }}
              >
                Manage your company identity, contact details, logo, and timezone to keep HR data accurate across RAKA HRIS.
              </Text>
              <Space
                size={8}
                wrap
                style={{ marginTop: 4 }}
              >
                <InfoPill
                  icon={
                    <Clock3
                      size={13}
                      aria-hidden='true'
                      focusable='false'
                    />
                  }
                  label={`Updated ${updatedAtLabel}`}
                />
                {canUpdate ? (
                  <InfoPill
                    icon={
                      <Edit3
                        size={13}
                        aria-hidden='true'
                        focusable='false'
                      />
                    }
                    label='Edit access'
                  />
                ) : (
                  <InfoPill
                    icon={
                      <LockKeyhole
                        size={13}
                        aria-hidden='true'
                        focusable='false'
                      />
                    }
                    label='View only'
                  />
                )}
              </Space>
            </Space>
          </Space>
        </Space>
      </Card>

      <Row
        gutter={[12, 12]}
        style={{ marginBottom: 16 }}
      >
        <Col
          xs={24}
          md={8}
        >
          <QuickStatCard
            icon={
              <Mail
                size={17}
                aria-hidden='true'
                focusable='false'
              />
            }
            label='Email'
            value={profile.email}
          />
        </Col>
        <Col
          xs={24}
          md={8}
        >
          <QuickStatCard
            icon={
              <Phone
                size={17}
                aria-hidden='true'
                focusable='false'
              />
            }
            label='Phone'
            value={profile.phone}
          />
        </Col>
        <Col
          xs={24}
          md={8}
        >
          <QuickStatCard
            icon={
              <MapPinned
                size={17}
                aria-hidden='true'
                focusable='false'
              />
            }
            label='Location'
            value={formatLocation(profile)}
          />
        </Col>
      </Row>

      <Card
        variant='borderless'
        style={{
          border: `1px solid ${token.colorBorderSecondary}`,
          borderRadius: token.borderRadiusLG,
          overflow: 'hidden',
        }}
        styles={{ body: { padding: 0 } }}
        title={
          <Space
            size={8}
            align='center'
          >
            <Edit3
              size={15}
              aria-hidden='true'
              focusable='false'
              style={{ color: token.colorPrimary }}
            />
            <Text
              strong
              style={{ fontSize: 14 }}
            >
              Edit company profile
            </Text>
          </Space>
        }
        extra={
          !canUpdate ? (
            <Text
              type='secondary'
              style={{ fontSize: 12 }}
            >
              You do not have permission to make changes.
            </Text>
          ) : null
        }
      >
        <div style={{ padding: '20px 24px 24px' }}>
          <CompanyProfileForm
            canUpdate={canUpdate}
            initialValues={profile}
            isSubmitting={isSubmitting}
            errorMessage={errorMessage}
            onSubmit={updateCompanyProfile}
            onClearError={clearErrorMessage}
          />
        </div>
      </Card>
    </section>
  );
}

function QuickStatCard({ icon, label, value }: { icon: ReactNode; label: string; value?: string | null }) {
  const { token } = theme.useToken();

  return (
    <Card
      variant='borderless'
      style={{
        height: '100%',
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
      }}
      styles={{ body: { padding: '14px 16px' } }}
    >
      <Space
        size={12}
        align='center'
      >
        <span
          aria-hidden='true'
          style={{
            display: 'inline-flex',
            width: 36,
            height: 36,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: token.borderRadius,
            background: token.colorBgLayout,
            color: token.colorPrimary,
            flexShrink: 0,
          }}
        >
          {icon}
        </span>
        <Space
          orientation='vertical'
          size={1}
        >
          <Text
            type='secondary'
            style={{ fontSize: 11, fontWeight: 500 }}
          >
            {label}
          </Text>
          <Text
            strong
            style={{ fontSize: 13 }}
          >
            {value || 'Not set'}
          </Text>
        </Space>
      </Space>
    </Card>
  );
}

function InfoPill({ icon, label }: { icon: ReactNode; label: string }) {
  const { token } = theme.useToken();

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: 999,
        background: token.colorBgLayout,
        padding: '4px 12px',
        color: token.colorTextSecondary,
        fontSize: 12,
        fontWeight: 500,
      }}
    >
      {icon}
      {label}
    </span>
  );
}

function formatLocation(profile: CompanyProfileViewModel) {
  const cityProvince = [profile.city, profile.province].filter(Boolean).join(', ');
  const address = [profile.addressLine1, cityProvince].filter(Boolean).join(' — ');

  return address || null;
}
