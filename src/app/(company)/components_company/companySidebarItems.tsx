'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { Briefcase, Building2, CreditCard, Gauge, KeyRound, MapPinned, MonitorCheck, UsersRound } from 'lucide-react';
import type { MenuProps } from 'antd';

export type CompanySidebarItem = {
  key: string;
  href: string;
  label: string;
  title: string;
  icon: ReactNode;
  permissionKey: string;
  additionalPermissionKeys?: string[];
};

type CompanySidebarGroup = {
  groupLabel: string;
  items: CompanySidebarItem[];
};

export const companySidebarGroups: CompanySidebarGroup[] = [
  {
    groupLabel: 'Main',
    items: [
      {
        key: '/dashboard-company',
        href: '/dashboard-company',
        label: 'Dashboard',
        title: 'Dashboard',
        permissionKey: 'dashboard:view',
        icon: (
          <Gauge
            size={18}
            aria-hidden='true'
            focusable='false'
          />
        ),
      },
      {
        key: '/profile',
        href: '/profile',
        label: 'Company Profile',
        title: 'Company Profile',
        permissionKey: 'companyProfile:view',
        icon: (
          <Building2
            size={18}
            aria-hidden='true'
            focusable='false'
          />
        ),
      },
    ],
  },
  {
    groupLabel: 'Workforce',
    items: [
      {
        key: '/employees',
        href: '/employees',
        label: 'Employees',
        title: 'Employees',
        permissionKey: 'employees:view',
        icon: (
          <UsersRound
            size={18}
            aria-hidden='true'
            focusable='false'
          />
        ),
      },
      {
        key: '/departments',
        href: '/departments',
        label: 'Departments',
        title: 'Departments',
        permissionKey: 'departments:view',
        icon: (
          <Building2
            size={18}
            aria-hidden='true'
            focusable='false'
          />
        ),
      },
      {
        key: '/positions',
        href: '/positions',
        label: 'Positions',
        title: 'Positions',
        permissionKey: 'positions:view',
        icon: (
          <Briefcase
            size={18}
            aria-hidden='true'
            focusable='false'
          />
        ),
      },
      {
        key: '/locations',
        href: '/locations',
        label: 'Locations',
        title: 'Locations',
        permissionKey: 'locations:view',
        icon: (
          <MapPinned
            size={18}
            aria-hidden='true'
            focusable='false'
          />
        ),
      },
      {
        key: '/roles-access',
        href: '/roles-access',
        label: 'Roles & Access',
        title: 'Roles & Access',
        permissionKey: 'access:view',
        icon: (
          <KeyRound
            size={18}
            aria-hidden='true'
            focusable='false'
          />
        ),
      },
    ],
  },
  {
    groupLabel: 'System',
    items: [
      {
        key: '/dashboard-company#sessions',
        href: '/dashboard-company#sessions',
        label: 'Sessions',
        title: 'Sessions',
        permissionKey: 'dashboard:view',
        additionalPermissionKeys: ['sessions:view'],
        icon: (
          <MonitorCheck
            size={18}
            aria-hidden='true'
            focusable='false'
          />
        ),
      },
      {
        key: '/dashboard-company#subscription',
        href: '/dashboard-company#subscription',
        label: 'Subscription',
        title: 'Subscription',
        permissionKey: 'dashboard:view',
        additionalPermissionKeys: ['subscription:view'],
        icon: (
          <CreditCard
            size={18}
            aria-hidden='true'
            focusable='false'
          />
        ),
      },
    ],
  },
];

export const companySidebarItems: CompanySidebarItem[] = companySidebarGroups.flatMap((g) => g.items);

export function getCompanyMenuItems(permissionKeys: string[]): MenuProps['items'] {
  const permissionSet = new Set(permissionKeys);

  return companySidebarGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => permissionSet.has(item.permissionKey) && (item.additionalPermissionKeys ?? []).every((permissionKey) => permissionSet.has(permissionKey))),
    }))
    .filter((group) => group.items.length > 0)
    .flatMap((group) => [
      {
        key: `group-${group.groupLabel}`,
        type: 'group' as const,
        label: group.groupLabel,
        children: group.items.map((item) => ({
          key: item.key,
          title: item.title,
          icon: item.icon,
          label: <Link href={item.href}>{item.label}</Link>,
        })),
      },
    ]);
}
