"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useState } from "react";
import { Layout, Typography, theme } from "antd";
import { PlatformHeader } from "./PlatformHeader";
import { PlatformSidebar } from "./PlatformSidebar";

type PlatformAppLayoutProps = {
  children: ReactNode;
  userName: string;
  userEmail: string;
};

const { Content, Sider } = Layout;

export function PlatformAppLayout({
  children,
  userName,
  userEmail,
}: PlatformAppLayoutProps) {
  const { token } = theme.useToken();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout hasSider style={{ minHeight: "100vh", background: token.colorBgLayout }}>
      <Sider
        width={272}
        collapsedWidth={80}
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="lg"
        trigger={null}
        theme="light"
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "auto",
          borderInlineEnd: `1px solid ${token.colorBorderSecondary}`,
          background: token.colorBgContainer,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            minHeight: 72,
            padding: collapsed ? "16px 18px" : "16px 20px",
          }}
        >
          <span
            style={{
              display: "flex",
              width: 40,
              height: 40,
              flex: "0 0 auto",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: token.borderRadiusLG,
              background: token.colorBgLayout,
              overflow: "hidden",
            }}
          >
            <Image
              src="/RAKA HRIS solutions logo.png"
              alt="RAKA HRIS logo"
              width={32}
              height={32}
              style={{ width: 32, height: 32, objectFit: "contain" }}
              priority
            />
          </span>
          {collapsed ? null : (
            <div style={{ minWidth: 0 }}>
              <Typography.Text strong style={{ display: "block" }}>
                RAKA HRIS
              </Typography.Text>
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                Platform
              </Typography.Text>
            </div>
          )}
        </div>
        <PlatformSidebar />
      </Sider>

      <Layout style={{ minWidth: 0, background: token.colorBgLayout }}>
        <PlatformHeader
          userName={userName}
          userEmail={userEmail}
          collapsed={collapsed}
          onToggleCollapsed={() => setCollapsed((value) => !value)}
        />
        <Content
          style={{
            width: "100%",
            maxWidth: 1440,
            marginInline: "auto",
            padding: "28px 24px 40px",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
