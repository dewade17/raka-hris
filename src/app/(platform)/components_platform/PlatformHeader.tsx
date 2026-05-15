"use client";

import { Avatar, Button, Flex, Tag, Typography, theme } from "antd";
import { Crown, PanelLeftClose, PanelLeftOpen } from "lucide-react";

type PlatformHeaderProps = {
  userName: string;
  userEmail: string;
  collapsed: boolean;
  onToggleCollapsed: () => void;
};

export function PlatformHeader({
  userName,
  userEmail,
  collapsed,
  onToggleCollapsed,
}: PlatformHeaderProps) {
  const { token } = theme.useToken();

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        display: "flex",
        minHeight: 72,
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
        background: token.colorBgContainer,
        padding: "14px 24px",
      }}
    >
      <Flex align="center" gap={14} style={{ minWidth: 0 }}>
        <Button
          type="text"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          icon={
            collapsed ? (
              <PanelLeftOpen size={20} aria-hidden="true" />
            ) : (
              <PanelLeftClose size={20} aria-hidden="true" />
            )
          }
          onClick={onToggleCollapsed}
        />
        <div style={{ minWidth: 0 }}>
          <Typography.Text type="secondary" style={{ display: "block", fontSize: 12 }}>
            Platform workspace
          </Typography.Text>
          <Typography.Title level={4} style={{ margin: 0 }}>
            Platform Dashboard
          </Typography.Title>
        </div>
      </Flex>

      <Flex align="center" gap={12}>
        <Tag color="purple" style={{ margin: 0 }}>
          Superadmin
        </Tag>
        <Avatar style={{ background: token.colorPrimary }}>
          <Crown size={16} aria-hidden="true" />
        </Avatar>
        <div style={{ minWidth: 0, textAlign: "right" }}>
          <Typography.Text strong style={{ display: "block" }}>
            {userName}
          </Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {userEmail || "No email"}
          </Typography.Text>
        </div>
      </Flex>
    </header>
  );
}
