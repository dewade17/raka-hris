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
        icon: (
          <MapPinned
            size={18}
            aria-hidden='true'
            focusable='false'
          />
        ),
      },
      {
        key: '/dashboard-company#roles-access',
        href: '/dashboard-company#roles-access',
        label: 'Roles & Access',
        title: 'Roles & Access',
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

export function getCompanyMenuItems(): MenuProps['items'] {
  return companySidebarGroups.flatMap((group) => [
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
