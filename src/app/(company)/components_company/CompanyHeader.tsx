'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { App, Avatar, Badge, Button, Dropdown, Flex, Tag, Typography, theme } from 'antd';
import type { MenuProps } from 'antd';
import { Bell, LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

const ownerTagStyle = {
  margin: 0,
  backgroundColor: '#fef3c7',
  borderColor: '#facc15',
  color: '#713f12',
  fontWeight: 600,
};

type NotificationItem = {
  id: string;
  message: string;
  read: boolean;
};

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  { id: '1', message: 'New employee joined the workspace.', read: false },
  { id: '2', message: 'Subscription renews in 7 days.', read: false },
  { id: '3', message: 'Role "HR Manager" was updated successfully.', read: true },
];

type CompanyHeaderProps = {
  companyName: string;
  userName: string;
  userEmail: string | null;
  isOwner: boolean;
  collapsed: boolean;
  onToggleCollapsed: () => void;
};

export function CompanyHeader({ companyName, userName, userEmail, isOwner, collapsed, onToggleCollapsed }: CompanyHeaderProps) {
  const { token } = theme.useToken();
  const { message } = App.useApp();
  const router = useRouter();

  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [loggingOut, setLoggingOut] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const handleLogout = useCallback(async () => {
    setLoggingOut(true);
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      const data = await res.json();

      if (data.success) {
        router.push(data.redirectUrl ?? '/login');
      } else {
        message.error('Logout failed. Please try again.');
      }
    } catch {
      message.error('An error occurred while logging out.');
    } finally {
      setLoggingOut(false);
    }
  }, [message, router]);

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'user-info',
      label: (
        <Flex
          vertical
          gap={2}
          style={{ padding: '4px 0' }}
        >
          <Typography.Text
            strong
            style={{ fontSize: 13 }}
          >
            {userName}
          </Typography.Text>
          {userEmail ? (
            <Typography.Text
              type='secondary'
              style={{ fontSize: 12 }}
            >
              {userEmail}
            </Typography.Text>
          ) : null}
          {isOwner && (
            <Tag
              aria-label='Current user role: Owner'
              style={ownerTagStyle}
            >
              Owner
            </Tag>
          )}
        </Flex>
      ),
      disabled: true,
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: (
        <LogOut
          size={15}
          aria-hidden='true'
          focusable='false'
        />
      ),
      label: 'Logout',
      danger: true,
      onClick: handleLogout,
    },
  ];

  const notificationMenuItems: MenuProps['items'] = [
    {
      key: 'notif-header',
      label: (
        <Flex
          justify='space-between'
          align='center'
          style={{ width: '100%' }}
        >
          <Typography.Text
            strong
            style={{ fontSize: 13 }}
          >
            Notifications
          </Typography.Text>
          {unreadCount > 0 && (
            <Button
              type='link'
              size='small'
              style={{ padding: 0, fontSize: 12 }}
              onClick={(e) => {
                e.stopPropagation();
                handleMarkAllRead();
              }}
            >
              Mark all read
            </Button>
          )}
        </Flex>
      ),
      disabled: true,
    },
    { type: 'divider' },
    ...notifications.map((notif) => ({
      key: notif.id,
      label: (
        <Flex
          gap={10}
          align='flex-start'
        >
          <span
            style={{
              marginTop: 5,
              flexShrink: 0,
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: notif.read ? token.colorBorderSecondary : token.colorWarning,
              display: 'inline-block',
            }}
            aria-hidden='true'
          />
          <Typography.Text
            style={{
              fontSize: 13,
              color: notif.read ? token.colorTextTertiary : token.colorText,
              whiteSpace: 'normal',
              maxWidth: 220,
            }}
          >
            {notif.message}
          </Typography.Text>
        </Flex>
      ),
      onClick: () => {
        setNotifications((prev) => prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n)));
      },
    })),
    ...(notifications.length === 0
      ? [
          {
            key: 'empty',
            label: (
              <Typography.Text
                type='secondary'
                style={{ fontSize: 13, display: 'block', textAlign: 'center' as const, padding: '8px 0' }}
              >
                No notifications
              </Typography.Text>
            ),
            disabled: true,
          },
        ]
      : []),
  ];

  const avatarInitials = userName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        display: 'flex',
        minHeight: 64,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
        background: token.colorBgContainer,
        padding: '0 24px',
      }}
    >
      <Flex
        align='center'
        gap={14}
        style={{ minWidth: 0 }}
      >
        <Button
          type='text'
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-controls='company-navigation'
          aria-expanded={!collapsed}
          icon={
            collapsed ? (
              <PanelLeftOpen
                size={20}
                aria-hidden='true'
                focusable='false'
              />
            ) : (
              <PanelLeftClose
                size={20}
                aria-hidden='true'
                focusable='false'
              />
            )
          }
          onClick={onToggleCollapsed}
        />
        <div style={{ minWidth: 0 }}>
          <Typography.Text
            type='secondary'
            style={{ display: 'block', fontSize: 11 }}
          >
            Company workspace
          </Typography.Text>
          <Typography.Title
            level={5}
            style={{
              margin: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {companyName}
          </Typography.Title>
        </div>
      </Flex>

      <Flex
        align='center'
        gap={8}
      >
        <Dropdown
          menu={{ items: notificationMenuItems }}
          trigger={['click']}
          placement='bottomRight'
          styles={{ root: { width: 280 } }}
          arrow
        >
          <Badge
            count={unreadCount}
            size='small'
            offset={[-2, 2]}
          >
            <Button
              type='text'
              shape='default'
              aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
              icon={
                <Bell
                  size={18}
                  aria-hidden='true'
                  focusable='false'
                />
              }
            />
          </Badge>
        </Dropdown>

        <Dropdown
          menu={{ items: userMenuItems }}
          trigger={['click']}
          placement='bottomRight'
          arrow
          disabled={loggingOut}
        >
          <Button
            type='text'
            loading={loggingOut}
            aria-label='User menu'
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              height: 'auto',
              padding: '4px 8px',
            }}
          >
            <Avatar
              size={32}
              style={{
                background: token.colorPrimary,
                fontSize: 12,
                fontWeight: 600,
                flexShrink: 0,
                borderRadius: token.borderRadius,
              }}
              shape='square'
              aria-hidden='true'
            >
              {avatarInitials || 'U'}
            </Avatar>
            <Flex
              vertical
              style={{ minWidth: 0, textAlign: 'left' }}
              gap={0}
            >
              <Typography.Text
                strong
                style={{
                  fontSize: 12,
                  maxWidth: 140,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  lineHeight: 1.4,
                }}
              >
                {userName}
              </Typography.Text>
              {isOwner && (
                <Typography.Text
                  type='secondary'
                  style={{ fontSize: 11, lineHeight: 1.4 }}
                >
                  Owner
                </Typography.Text>
              )}
            </Flex>
          </Button>
        </Dropdown>
      </Flex>
    </header>
  );
}
