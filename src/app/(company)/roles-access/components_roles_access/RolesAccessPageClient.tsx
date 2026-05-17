'use client';

import { Alert, Button, Card, Checkbox, Col, Flex, Popconfirm, Row, Select, Space, Statistic, Table, Tag, Typography, theme } from 'antd';
import { Edit3, KeyRound, Plus, Save, ShieldCheck, Trash2, UserRoundCog, UsersRound } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { ColumnsType } from 'antd/es/table';
import type {
  CompanyAccessManagementData,
  CompanyMemberRoleAccessItem,
  CompanyPermissionModule,
  CompanyRoleAccessItem,
} from '@/features/auth/permissions/types';
import { useDeleteCompanyRole } from '../hooks/useDeleteCompanyRole';
import { useUpdateMemberRoles } from '../hooks/useUpdateMemberRoles';
import { useUpdateRolePermissions } from '../hooks/useUpdateRolePermissions';
import { useUpsertCompanyRole } from '../hooks/useUpsertCompanyRole';
import { RoleFormDrawer, type RoleFormValues } from './RoleFormDrawer';

type RolesAccessPageClientProps = {
  data: CompanyAccessManagementData;
  canManageRoles: boolean;
  canAssignRoles: boolean;
};

export function RolesAccessPageClient({ data, canManageRoles, canAssignRoles }: RolesAccessPageClientProps) {
  const { token } = theme.useToken();
  const [roleDrawerOpen, setRoleDrawerOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<CompanyRoleAccessItem>();
  const [selectedRoleId, setSelectedRoleId] = useState(data.roles[0]?.companyRoleId);
  const selectedRole = useMemo(
    () => data.roles.find((role) => role.companyRoleId === selectedRoleId) ?? data.roles[0],
    [data.roles, selectedRoleId],
  );
  const { clearErrorMessage, errorMessage, isSubmitting, upsertCompanyRole } = useUpsertCompanyRole();
  const { deleteCompanyRole, deletingRoleId } = useDeleteCompanyRole();
  const { isSubmitting: isSavingPermissions, updateRolePermissions } = useUpdateRolePermissions();
  const { updateMemberRoles, updatingMembershipId } = useUpdateMemberRoles();

  const assignableRoleOptions = data.roles
    .filter((role) => !role.isSystem)
    .map((role) => ({
      label: role.name,
      value: role.companyRoleId,
    }));

  const handleOpenCreate = () => {
    setEditingRole(undefined);
    clearErrorMessage();
    setRoleDrawerOpen(true);
  };

  const handleSubmitRole = async (values: RoleFormValues) => {
    const success = await upsertCompanyRole(values, editingRole?.companyRoleId);

    if (success) {
      setRoleDrawerOpen(false);
      setEditingRole(undefined);
    }
  };

  const roleColumns: ColumnsType<CompanyRoleAccessItem> = [
    {
      title: 'Role',
      key: 'role',
      render: (_, role) => (
        <Space
          direction='vertical'
          size={2}
        >
          <Space
            size={6}
            wrap
          >
            <Typography.Text strong>{role.name}</Typography.Text>
            {role.isSystem ? <Tag color='gold'>System</Tag> : null}
          </Space>
          <Typography.Text type='secondary'>{role.description ?? 'No description'}</Typography.Text>
        </Space>
      ),
    },
    {
      title: 'Access',
      key: 'access',
      width: 170,
      render: (_, role) => `${role.permissionKeys.length} permissions`,
    },
    {
      title: 'Members',
      dataIndex: 'assignedMembers',
      key: 'assignedMembers',
      width: 120,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 260,
      render: (_, role) => (
        <Space size={6}>
          <Button
            size='small'
            onClick={() => setSelectedRoleId(role.companyRoleId)}
            icon={
              <ShieldCheck
                size={14}
                aria-hidden='true'
                focusable='false'
              />
            }
          >
            Permissions
          </Button>
          {canManageRoles && !role.isSystem ? (
            <>
              <Button
                size='small'
                onClick={() => {
                  setEditingRole(role);
                  clearErrorMessage();
                  setRoleDrawerOpen(true);
                }}
                icon={
                  <Edit3
                    size={14}
                    aria-hidden='true'
                    focusable='false'
                  />
                }
              >
                Edit
              </Button>
              <Popconfirm
                title='Delete role?'
                description='Only unused custom roles can be deleted.'
                okText='Delete'
                okType='danger'
                cancelText='Cancel'
                disabled={role.assignedMembers > 0}
                onConfirm={() => {
                  void deleteCompanyRole(role.companyRoleId);
                }}
              >
                <Button
                  size='small'
                  danger
                  disabled={role.assignedMembers > 0}
                  loading={deletingRoleId === role.companyRoleId}
                  icon={
                    <Trash2
                      size={14}
                      aria-hidden='true'
                      focusable='false'
                    />
                  }
                >
                  Delete
                </Button>
              </Popconfirm>
            </>
          ) : null}
        </Space>
      ),
    },
  ];

  const memberColumns: ColumnsType<CompanyMemberRoleAccessItem> = [
    {
      title: 'Employee',
      key: 'employee',
      render: (_, member) => (
        <Space
          direction='vertical'
          size={0}
        >
          <Space
            size={6}
            wrap
          >
            <Typography.Text strong>{member.name}</Typography.Text>
            {member.isOwner ? <Tag color='gold'>Owner</Tag> : null}
          </Space>
          <Typography.Text type='secondary'>{member.email ?? 'Email not set'}</Typography.Text>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (status: string) => <Tag color={getStatusColor(status)}>{formatEnum(status)}</Tag>,
    },
    {
      title: 'Roles',
      key: 'roles',
      width: 380,
      render: (_, member) =>
        member.isOwner ? (
          <Tag color='gold'>Owner full access</Tag>
        ) : (
          <Select
            mode='multiple'
            allowClear
            placeholder='No role assigned'
            value={member.roleIds}
            options={assignableRoleOptions}
            disabled={!canAssignRoles}
            loading={updatingMembershipId === member.membershipId}
            maxTagCount='responsive'
            style={{ width: '100%' }}
            onChange={(roleIds) => {
              void updateMemberRoles(member.membershipId, roleIds);
            }}
          />
        ),
    },
  ];

  return (
    <section aria-labelledby='roles-access-page-title'>
      <Flex
        justify='space-between'
        align='flex-start'
        gap={16}
        wrap='wrap'
        style={{ marginBottom: 18 }}
      >
        <Space
          direction='vertical'
          size={4}
        >
          <Typography.Title
            id='roles-access-page-title'
            level={2}
            style={{ margin: 0 }}
          >
            Roles & Access
          </Typography.Title>
          <Typography.Text type='secondary'>Create company roles, assign permissions, and decide which employees can access each module.</Typography.Text>
        </Space>

        {canManageRoles ? (
          <Button
            type='primary'
            onClick={handleOpenCreate}
            icon={
              <Plus
                size={16}
                aria-hidden='true'
                focusable='false'
              />
            }
          >
            New role
          </Button>
        ) : null}
      </Flex>

      {!canManageRoles && !canAssignRoles ? (
        <Alert
          showIcon
          type='info'
          message='You can review roles and assignments, but you do not have permission to make changes.'
          style={{ marginBottom: 16 }}
        />
      ) : null}

      <Row
        gutter={[12, 12]}
        style={{ marginBottom: 16 }}
      >
        <SummaryCard
          label='Roles'
          value={data.summary.totalRoles}
          icon={<KeyRound size={17} />}
        />
        <SummaryCard
          label='Editable roles'
          value={data.summary.editableRoles}
          icon={<ShieldCheck size={17} />}
        />
        <SummaryCard
          label='Without role'
          value={data.summary.membersWithoutRole}
          icon={<UsersRound size={17} />}
        />
        <SummaryCard
          label='Permissions'
          value={data.summary.availablePermissions}
          icon={<UserRoundCog size={17} />}
        />
      </Row>

      <Row gutter={[16, 16]}>
        <Col
          xs={24}
          xl={13}
        >
          <Card
            title='Company roles'
            variant='borderless'
            style={{
              border: `1px solid ${token.colorBorderSecondary}`,
              borderRadius: token.borderRadiusLG,
            }}
          >
            <Table<CompanyRoleAccessItem>
              rowKey='companyRoleId'
              columns={roleColumns}
              dataSource={data.roles}
              pagination={false}
              rowClassName={(role) => (role.companyRoleId === selectedRole?.companyRoleId ? 'ant-table-row-selected' : '')}
              scroll={{ x: 820 }}
              locale={{ emptyText: 'No roles have been created.' }}
            />
          </Card>
        </Col>

        <Col
          xs={24}
          xl={11}
        >
          {selectedRole ? (
            <RolePermissionEditor
              key={selectedRole.companyRoleId}
              canManageRoles={canManageRoles}
              isSavingPermissions={isSavingPermissions}
              permissionModules={data.permissionModules}
              role={selectedRole}
              onSave={updateRolePermissions}
            />
          ) : (
            <Card
              title='Role permissions'
              variant='borderless'
              style={{
                border: `1px solid ${token.colorBorderSecondary}`,
                borderRadius: token.borderRadiusLG,
              }}
            >
              <Typography.Text type='secondary'>Select a role to review permissions.</Typography.Text>
            </Card>
          )}
        </Col>
      </Row>

      <Card
        title='Employee role assignments'
        variant='borderless'
        style={{
          marginTop: 16,
          border: `1px solid ${token.colorBorderSecondary}`,
          borderRadius: token.borderRadiusLG,
        }}
      >
        <Table<CompanyMemberRoleAccessItem>
          rowKey='membershipId'
          columns={memberColumns}
          dataSource={data.members}
          pagination={{ pageSize: 10, showSizeChanger: true }}
          scroll={{ x: 820 }}
          locale={{ emptyText: 'No employees are available for role assignment.' }}
        />
      </Card>

      <RoleFormDrawer
        open={roleDrawerOpen}
        role={editingRole}
        isSubmitting={isSubmitting}
        errorMessage={errorMessage}
        onClearError={clearErrorMessage}
        onClose={() => {
          setRoleDrawerOpen(false);
          setEditingRole(undefined);
          clearErrorMessage();
        }}
        onSubmit={handleSubmitRole}
      />
    </section>
  );
}

function RolePermissionEditor({
  canManageRoles,
  isSavingPermissions,
  permissionModules,
  role,
  onSave,
}: {
  canManageRoles: boolean;
  isSavingPermissions: boolean;
  permissionModules: CompanyPermissionModule[];
  role: CompanyRoleAccessItem;
  onSave: (roleId: string, permissionKeys: string[]) => Promise<boolean>;
}) {
  const { token } = theme.useToken();
  const [draftPermissionKeys, setDraftPermissionKeys] = useState<string[]>(role.permissionKeys);
  const permissionsChanged = !areStringSetsEqual(role.permissionKeys, draftPermissionKeys);

  return (
    <Card
      title={`${role.name} permissions`}
      variant='borderless'
      style={{
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
      }}
      extra={
        canManageRoles && !role.isSystem ? (
          <Button
            type='primary'
            disabled={!permissionsChanged}
            loading={isSavingPermissions}
            onClick={() => {
              void onSave(role.companyRoleId, draftPermissionKeys);
            }}
            icon={
              <Save
                size={15}
                aria-hidden='true'
                focusable='false'
              />
            }
          >
            Save permissions
          </Button>
        ) : null
      }
    >
      <Space
        direction='vertical'
        size={16}
        style={{ width: '100%' }}
      >
        {role.isSystem ? (
          <Alert
            showIcon
            type='info'
            message='System role permissions are managed automatically.'
          />
        ) : null}

        {permissionModules.map((moduleItem) => (
          <div key={moduleItem.module}>
            <Typography.Text strong>{moduleItem.label}</Typography.Text>
            <Typography.Paragraph
              type='secondary'
              style={{ marginBottom: 8 }}
            >
              {moduleItem.description}
            </Typography.Paragraph>
            <Checkbox.Group
              value={draftPermissionKeys}
              disabled={!canManageRoles || role.isSystem}
              onChange={(values) => {
                setDraftPermissionKeys(values.map(String));
              }}
              style={{ display: 'grid', gap: 8 }}
            >
              {moduleItem.permissions.map((permission) => (
                <Checkbox
                  key={permission.key}
                  value={permission.key}
                >
                  <Space
                    direction='vertical'
                    size={0}
                  >
                    <Typography.Text>{permission.name}</Typography.Text>
                    <Typography.Text type='secondary'>{permission.description}</Typography.Text>
                  </Space>
                </Checkbox>
              ))}
            </Checkbox.Group>
          </div>
        ))}
      </Space>
    </Card>
  );
}

function SummaryCard({ label, value, icon }: { label: string; value: number; icon: ReactNode }) {
  const { token } = theme.useToken();

  return (
    <Col
      xs={12}
      md={6}
    >
      <Card
        variant='borderless'
        style={{
          height: '100%',
          border: `1px solid ${token.colorBorderSecondary}`,
          borderRadius: token.borderRadiusLG,
        }}
      >
        <Statistic
          title={label}
          value={value}
          prefix={icon}
        />
      </Card>
    </Col>
  );
}

function areStringSetsEqual(first: string[], second: string[]) {
  if (first.length !== second.length) {
    return false;
  }

  const secondSet = new Set(second);

  return first.every((value) => secondSet.has(value));
}

function formatEnum(value: string) {
  return value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function getStatusColor(status: string) {
  if (status === 'ACTIVE') {
    return 'success';
  }

  if (status === 'SUSPENDED') {
    return 'warning';
  }

  return 'error';
}
