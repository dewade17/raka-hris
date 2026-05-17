'use client';

import { Avatar, Button, Card, Popconfirm, Space, Tag, Typography, theme } from 'antd';
import { CalendarDays, Clock3, Edit3, IdCard, LockKeyhole, ShieldCheck, Trash2, UserRound } from 'lucide-react';
import type { ReactNode } from 'react';
import type { EmployeeProfileViewModel } from '../types';

const { Text, Title } = Typography;

type EmployeeProfileHeaderProps = {
  employee: EmployeeProfileViewModel;
  canManage: boolean;
  isTerminating?: boolean;
  onEdit: () => void;
  onTerminate: () => void;
};

export function EmployeeProfileHeader({ employee, canManage, isTerminating, onEdit, onTerminate }: EmployeeProfileHeaderProps) {
  const { token } = theme.useToken();
  const employeeNumber = employee.profile?.employeeNumber ?? 'Employee number not set';
  const canEditEmployee = canManage && employee.status !== 'TERMINATED';
  const canTerminateEmployee = canManage && !employee.isOwner && employee.status !== 'TERMINATED';

  return (
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
        size={20}
        align='start'
        style={{ width: '100%' }}
      >
        <Avatar
          size={76}
          src={employee.profile?.photoUrl ?? undefined}
          icon={
            <UserRound
              size={32}
              aria-hidden='true'
              focusable='false'
            />
          }
          style={{
            background: employee.profile?.photoUrl ? token.colorBgContainer : token.colorPrimary,
            color: token.colorTextLightSolid,
            flexShrink: 0,
          }}
        >
          {getInitials(employee.user.name)}
        </Avatar>

        <Space
          orientation='vertical'
          size={9}
          style={{ minWidth: 0, width: '100%' }}
        >
          <Space
            size={8}
            wrap
          >
            <Tag color={getMembershipStatusColor(employee.status)}>{formatMembershipStatus(employee.status)}</Tag>
            {employee.isOwner ? <Tag color='gold'>Company owner</Tag> : null}
          </Space>

          <Title
            id='employee-profile-page-title'
            level={2}
            style={{ margin: 0, fontSize: 26, lineHeight: 1.2 }}
          >
            {employee.user.name}
          </Title>

          <Text
            type='secondary'
            style={{ fontSize: 13, lineHeight: 1.6 }}
          >
            Review this employee identity, employment details, and primary department or position assignment.
          </Text>

          <Space
            size={8}
            wrap
            style={{ marginTop: 4 }}
          >
            <InfoPill
              icon={
                <IdCard
                  size={13}
                  aria-hidden='true'
                  focusable='false'
                />
              }
              label={employeeNumber}
            />
            <InfoPill
              icon={
                <CalendarDays
                  size={13}
                  aria-hidden='true'
                  focusable='false'
                />
              }
              label={`Joined ${formatDate(employee.joinedAt)}`}
            />
            <InfoPill
              icon={
                <Clock3
                  size={13}
                  aria-hidden='true'
                  focusable='false'
                />
              }
              label={employee.lastLoginAt ? `Last login ${formatDate(employee.lastLoginAt)}` : 'No login recorded'}
            />
            <InfoPill
              icon={
                canManage ? (
                  <ShieldCheck
                    size={13}
                    aria-hidden='true'
                    focusable='false'
                  />
                ) : (
                  <LockKeyhole
                    size={13}
                    aria-hidden='true'
                    focusable='false'
                  />
                )
              }
              label={canManage ? 'Owner access' : 'View only'}
            />
          </Space>
        </Space>

        {canManage ? (
          <Space
            size={8}
            wrap
            style={{ marginLeft: 'auto', justifyContent: 'flex-end' }}
          >
            <Button
              icon={
                <Edit3
                  size={15}
                  aria-hidden='true'
                  focusable='false'
                />
              }
              disabled={!canEditEmployee}
              onClick={onEdit}
            >
              Edit
            </Button>
            <Popconfirm
              title='Terminate employee?'
              description='This revokes access and keeps the employee record for history.'
              okText='Terminate'
              okType='danger'
              cancelText='Cancel'
              disabled={!canTerminateEmployee}
              onConfirm={onTerminate}
            >
              <Button
                danger
                disabled={!canTerminateEmployee}
                loading={isTerminating}
                icon={
                  <Trash2
                    size={15}
                    aria-hidden='true'
                    focusable='false'
                  />
                }
              >
                Terminate
              </Button>
            </Popconfirm>
          </Space>
        ) : null}
      </Space>
    </Card>
  );
}

function InfoPill({ icon, label }: { icon: ReactNode; label: string }) {
  const { token } = theme.useToken();

  return (
    <Text
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 12,
        color: token.colorTextSecondary,
        background: token.colorFillTertiary,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: 999,
        padding: '4px 10px',
      }}
    >
      {icon}
      {label}
    </Text>
  );
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function formatMembershipStatus(status: EmployeeProfileViewModel['status']) {
  return status
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function getMembershipStatusColor(status: EmployeeProfileViewModel['status']) {
  if (status === 'ACTIVE') {
    return 'green';
  }

  if (status === 'SUSPENDED') {
    return 'orange';
  }

  return 'red';
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}
