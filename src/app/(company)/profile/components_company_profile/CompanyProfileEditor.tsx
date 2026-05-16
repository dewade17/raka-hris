"use client";

import { Avatar, Card, Col, Progress, Row, Space, Typography, theme } from "antd";
import { Building2, CheckCircle2, Clock3, Edit3, LockKeyhole, Mail, MapPinned, Phone } from "lucide-react";
import { useMemo, type ReactNode } from "react";
import { useUpdateCompanyProfile } from "../hooks/useUpdateCompanyProfile";
import { CompanyProfileForm } from "./CompanyProfileForm";

type CompanyProfileViewModel = {
  companyId: string;
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

const { Text, Title, Paragraph } = Typography;

export function CompanyProfileEditor({ profile, canUpdate }: CompanyProfileEditorProps) {
  const { token } = theme.useToken();
  const {
    errorMessage,
    isSubmitting,
    updateCompanyProfile,
    clearErrorMessage,
  } = useUpdateCompanyProfile();
  const profileCompleteness = useMemo(() => calculateProfileCompleteness(profile), [profile]);
  const updatedAtLabel = new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(profile.updatedAt));

  return (
    <section aria-labelledby="company-profile-page-title">
      <Card
        variant="borderless"
        style={{
          overflow: "hidden",
          border: `1px solid ${token.colorBorderSecondary}`,
          background: "var(--raka-soft-gradient)",
        }}
        styles={{ body: { padding: 0 } }}
      >
        <div style={{ padding: "28px 28px 26px" }}>
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} lg={15}>
              <Space direction="vertical" size={14} style={{ width: "100%" }}>
                <Space size={12} align="center">
                  <Avatar
                    size={64}
                    src={profile.logoUrl || undefined}
                    icon={<Building2 size={28} aria-hidden="true" focusable="false" />}
                    style={{
                      background: profile.logoUrl ? token.colorBgContainer : token.colorPrimary,
                      color: token.colorTextLightSolid,
                      boxShadow: "0 18px 40px rgba(5, 28, 80, 0.16)",
                    }}
                  />
                  <div>
                    <Text
                      strong
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        borderRadius: 999,
                        padding: "6px 12px",
                        background: "rgba(255, 255, 255, 0.7)",
                        color: token.colorPrimary,
                      }}
                    >
                      <CheckCircle2 size={15} aria-hidden="true" focusable="false" />
                      Company workspace
                    </Text>
                    <Title
                      id="company-profile-page-title"
                      level={1}
                      style={{ margin: "12px 0 0", fontSize: 34, lineHeight: 1.15 }}
                    >
                      {profile.name}
                    </Title>
                  </div>
                </Space>
                <Paragraph style={{ maxWidth: 720, marginBottom: 0, color: token.colorTextSecondary }}>
                  Keep your company identity, contact details, logo, and operating timezone accurate for HR workflows across RAKA HRIS.
                </Paragraph>
                <Space size={[8, 8]} wrap>
                  <InfoPill icon={<Clock3 size={15} />} label={`Updated ${updatedAtLabel}`} />
                  {canUpdate ? (
                    <InfoPill icon={<Edit3 size={15} />} label="Owner access" />
                  ) : (
                    <InfoPill icon={<LockKeyhole size={15} />} label="View only" />
                  )}
                </Space>
              </Space>
            </Col>
            <Col xs={24} lg={9}>
              <Card
                variant="borderless"
                style={{
                  background: "rgba(255, 255, 255, 0.82)",
                  boxShadow: "0 18px 48px rgba(5, 28, 80, 0.08)",
                }}
              >
                <Space direction="vertical" size={14} style={{ width: "100%" }}>
                  <Space align="center" style={{ justifyContent: "space-between", width: "100%" }}>
                    <Text strong>Profile completeness</Text>
                    <Text strong style={{ color: token.colorPrimary }}>
                      {profileCompleteness}%
                    </Text>
                  </Space>
                  <Progress
                    percent={profileCompleteness}
                    strokeColor={token.colorPrimary}
                    railColor={token.colorBorderSecondary}
                    aria-label={`Company profile completeness is ${profileCompleteness} percent`}
                  />
                  <Text type="secondary">
                    Complete contact, location, logo, and timezone fields to make company data easier to trust.
                  </Text>
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
      </Card>

      <Row gutter={[16, 16]} style={{ marginTop: 18 }}>
        <Col xs={24} md={8}>
          <ProfileDetailCard icon={<Mail size={18} />} label="Email" value={profile.email} />
        </Col>
        <Col xs={24} md={8}>
          <ProfileDetailCard icon={<Phone size={18} />} label="Phone" value={profile.phone} />
        </Col>
        <Col xs={24} md={8}>
          <ProfileDetailCard icon={<MapPinned size={18} />} label="Location" value={formatLocation(profile)} />
        </Col>
      </Row>

      <Card
        title="Edit company profile"
        extra={
          canUpdate ? null : (
            <Text type="secondary">
              Only the company owner can make changes.
            </Text>
          )
        }
        variant="borderless"
        style={{ marginTop: 18, border: `1px solid ${token.colorBorderSecondary}` }}
      >
        <CompanyProfileForm
          canUpdate={canUpdate}
          initialValues={profile}
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
          onSubmit={updateCompanyProfile}
          onClearError={clearErrorMessage}
        />
      </Card>
    </section>
  );
}

function ProfileDetailCard({ icon, label, value }: { icon: ReactNode; label: string; value?: string | null }) {
  const { token } = theme.useToken();

  return (
    <Card variant="borderless" style={{ height: "100%", border: `1px solid ${token.colorBorderSecondary}` }}>
      <Space align="start" size={12}>
        <span
          aria-hidden="true"
          style={{
            display: "inline-flex",
            width: 38,
            height: 38,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: token.borderRadiusLG,
            background: token.colorBgLayout,
            color: token.colorPrimary,
          }}
        >
          {icon}
        </span>
        <Space direction="vertical" size={2}>
          <Text type="secondary">{label}</Text>
          <Text strong>{value || "Not set"}</Text>
        </Space>
      </Space>
    </Card>
  );
}

function InfoPill({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        border: "1px solid rgba(5, 28, 80, 0.12)",
        borderRadius: 999,
        background: "rgba(255, 255, 255, 0.72)",
        padding: "7px 12px",
        color: "var(--raka-text-secondary)",
        fontSize: 13,
        fontWeight: 600,
      }}
    >
      {icon}
      {label}
    </span>
  );
}

function calculateProfileCompleteness(profile: CompanyProfileViewModel) {
  const completedFields = [
    profile.email,
    profile.phone,
    profile.logoUrl,
    profile.addressLine1,
    profile.city,
    profile.province,
    profile.timezone,
  ].filter(Boolean).length;

  return Math.round((completedFields / 7) * 100);
}

function formatLocation(profile: CompanyProfileViewModel) {
  const cityProvince = [profile.city, profile.province].filter(Boolean).join(", ");
  const address = [profile.addressLine1, cityProvince].filter(Boolean).join(" - ");

  return address || "Not set";
}
