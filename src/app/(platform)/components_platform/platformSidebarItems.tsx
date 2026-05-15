"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  Building2,
  CreditCard,
  Gauge,
  KeyRound,
  Layers3,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import type { MenuProps } from "antd";

export type PlatformSidebarItem = {
  key: string;
  href: string;
  label: string;
  title: string;
  icon: ReactNode;
};

export const platformSidebarItems: PlatformSidebarItem[] = [
  {
    key: "/dashboard-platform",
    href: "/dashboard-platform",
    label: "Dashboard",
    title: "Dashboard",
    icon: <Gauge size={18} aria-hidden="true" />,
  },
  {
    key: "/dashboard-platform#companies",
    href: "/dashboard-platform#companies",
    label: "Companies",
    title: "Companies",
    icon: <Building2 size={18} aria-hidden="true" />,
  },
  {
    key: "/dashboard-platform#platform-users",
    href: "/dashboard-platform#platform-users",
    label: "Platform Users",
    title: "Platform Users",
    icon: <UsersRound size={18} aria-hidden="true" />,
  },
  {
    key: "/dashboard-platform#subscriptions",
    href: "/dashboard-platform#subscriptions",
    label: "Subscriptions",
    title: "Subscriptions",
    icon: <CreditCard size={18} aria-hidden="true" />,
  },
  {
    key: "/dashboard-platform#roles-access",
    href: "/dashboard-platform#roles-access",
    label: "Roles & Access",
    title: "Roles & Access",
    icon: <KeyRound size={18} aria-hidden="true" />,
  },
  {
    key: "/dashboard-platform#permissions",
    href: "/dashboard-platform#permissions",
    label: "Permissions",
    title: "Permissions",
    icon: <ShieldCheck size={18} aria-hidden="true" />,
  },
  {
    key: "/dashboard-platform#organization",
    href: "/dashboard-platform#organization",
    label: "Organization Data",
    title: "Organization Data",
    icon: <Layers3 size={18} aria-hidden="true" />,
  },
];

export function getPlatformMenuItems(): MenuProps["items"] {
  return platformSidebarItems.map((item) => ({
    key: item.key,
    title: item.title,
    icon: item.icon,
    label: <Link href={item.href}>{item.label}</Link>,
  }));
}
