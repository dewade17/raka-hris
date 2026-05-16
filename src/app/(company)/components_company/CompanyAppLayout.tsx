'use client';

import Image from 'next/image';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { Layout, Typography, theme } from 'antd';
import { CompanyHeader } from './CompanyHeader';
import { CompanySidebar } from './CompanySidebar';

type CompanyAppLayoutProps = {
  children: ReactNode;
  companyName: string;
  loginId: string;
  isOwner: boolean;
};

const { Content, Sider } = Layout;

export function CompanyAppLayout({ children, companyName, loginId, isOwner }: CompanyAppLayoutProps) {
  const { token } = theme.useToken();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout
      hasSider
      style={{ minHeight: '100vh', background: token.colorBgLayout }}
    >
      <Sider
        aria-label='Company sidebar'
        width={272}
        collapsedWidth={80}
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint='lg'
        trigger={null}
        theme='light'
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'auto',
          borderInlineEnd: `1px solid ${token.colorBorderSecondary}`,
          background: token.colorBgContainer,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            minHeight: 72,
            padding: collapsed ? '16px 18px' : '16px 20px',
          }}
        >
          <span
            style={{
              display: 'flex',
              width: 40,
              height: 40,
              flex: '0 0 auto',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: token.borderRadiusLG,
              background: token.colorBgLayout,
              overflow: 'hidden',
            }}
          >
            <Image
              src='/RAKA HRIS solutions logo.png'
              alt='RAKA HRIS logo'
              width={32}
              height={32}
              style={{ width: 32, height: 32, objectFit: 'contain' }}
              priority
            />
          </span>
          {collapsed ? null : (
            <div style={{ minWidth: 0 }}>
              <Typography.Text
                strong
                style={{ display: 'block' }}
              >
                RAKA HRIS
              </Typography.Text>
              <Typography.Text
                type='secondary'
                style={{ fontSize: 12 }}
              >
                Company
              </Typography.Text>
            </div>
          )}
        </div>
        <CompanySidebar />
      </Sider>

      <Layout style={{ minWidth: 0, background: token.colorBgLayout }}>
        <CompanyHeader
          companyName={companyName}
          loginId={loginId}
          isOwner={isOwner}
          collapsed={collapsed}
          onToggleCollapsed={() => setCollapsed((value) => !value)}
        />
        <Content
          id='company-main-content'
          role='main'
          style={{
            width: '100%',
            maxWidth: 1440,
            marginInline: 'auto',
            padding: '28px 24px 40px',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
