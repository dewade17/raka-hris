"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  Building2,
  CreditCard,
  Gauge,
  KeyRound,
  MapPinned,
  MonitorCheck,
  UsersRound,
} from "lucide-react";
import type { MenuProps } from "antd";

export type CompanySidebarItem = {
  key: string;
  href: string;
  label: string;
  title: string;
  icon: ReactNode;
};

export const companySidebarItems: CompanySidebarItem[] = [
  {
    key: "/dashboard-company",
    href: "/dashboard-company",
    label: "Dashboard",
    title: "Dashboard",
    icon: <Gauge size={18} aria-hidden="true" focusable="false" />,
  },
  {
    key: "/profile",
    href: "/profile",
    label: "Company Profile",
    title: "Company Profile",
    icon: <Building2 size={18} aria-hidden="true" focusable="false" />,
  },
  {
    key: "/dashboard-company#employees",
    href: "/dashboard-company#employees",
    label: "Employees",
    title: "Employees",
    icon: <UsersRound size={18} aria-hidden="true" focusable="false" />,
  },
  {
    key: "/dashboard-company#organization",
    href: "/dashboard-company#organization",
    label: "Organization",
    title: "Organization",
    icon: <MapPinned size={18} aria-hidden="true" focusable="false" />,
  },
  {
    key: "/dashboard-company#roles-access",
    href: "/dashboard-company#roles-access",
    label: "Roles & Access",
    title: "Roles & Access",
    icon: <KeyRound size={18} aria-hidden="true" focusable="false" />,
  },
  {
    key: "/dashboard-company#sessions",
    href: "/dashboard-company#sessions",
    label: "Sessions",
    title: "Sessions",
    icon: <MonitorCheck size={18} aria-hidden="true" focusable="false" />,
  },
  {
    key: "/dashboard-company#subscription",
    href: "/dashboard-company#subscription",
    label: "Subscription",
    title: "Subscription",
    icon: <CreditCard size={18} aria-hidden="true" focusable="false" />,
  },
];

export function getCompanyMenuItems(): MenuProps["items"] {
  return companySidebarItems.map((item) => ({
    key: item.key,
    title: item.title,
    icon: item.icon,
    label: <Link href={item.href}>{item.label}</Link>,
  }));
}
