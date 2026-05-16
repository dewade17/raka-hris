"use client";

import { Avatar, Button, Flex, Tag, Typography, theme } from "antd";
import { Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";

const ownerTagStyle = {
  margin: 0,
  backgroundColor: "#fef3c7",
  borderColor: "#facc15",
  color: "#713f12",
  fontWeight: 600,
};

type CompanyHeaderProps = {
  companyName: string;
  loginId: string;
  isOwner: boolean;
  collapsed: boolean;
  onToggleCollapsed: () => void;
};

export function CompanyHeader({
  companyName,
  loginId,
  isOwner,
  collapsed,
  onToggleCollapsed,
}: CompanyHeaderProps) {
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
        flexWrap: "wrap",
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
          aria-controls="company-navigation"
          aria-expanded={!collapsed}
          icon={
            collapsed ? (
              <PanelLeftOpen size={20} aria-hidden="true" focusable="false" />
            ) : (
              <PanelLeftClose size={20} aria-hidden="true" focusable="false" />
            )
          }
          onClick={onToggleCollapsed}
        />
        <div style={{ minWidth: 0 }}>
          <Typography.Text type="secondary" style={{ display: "block", fontSize: 12 }}>
            Company workspace
          </Typography.Text>
          <Typography.Title
            level={4}
            style={{ margin: 0, overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {companyName}
          </Typography.Title>
        </div>
      </Flex>

      <Flex
        align="center"
        gap={12}
        wrap
        style={{ minWidth: 0, justifyContent: "flex-end" }}
      >
        {isOwner ? (
          <Tag aria-label="Current user role Owner" style={ownerTagStyle}>
            Owner
          </Tag>
        ) : null}
        <Avatar aria-hidden="true" style={{ background: token.colorPrimary }}>
          <Menu size={16} aria-hidden="true" focusable="false" />
        </Avatar>
        <Typography.Text
          strong
          style={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis" }}
        >
          {loginId}
        </Typography.Text>
      </Flex>
    </header>
  );
}
