"use client";

import { App as AntdApp, ConfigProvider, theme, type ThemeConfig } from "antd";
import idID from "antd/locale/id_ID";
import type { ReactNode } from "react";

const themeConfig: ThemeConfig = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: "#0f766e",
    colorInfo: "#2563eb",
    colorSuccess: "#16a34a",
    colorWarning: "#d97706",
    colorError: "#dc2626",
    colorBgLayout: "#f6f8fb",
    borderRadius: 8,
    controlHeight: 38,
    fontFamily:
      "var(--font-geist-sans), Arial, Helvetica, system-ui, sans-serif",
  },
  components: {
    Button: {
      borderRadius: 8,
      fontWeight: 600,
      primaryShadow: "none",
    },
    Card: {
      borderRadiusLG: 8,
    },
    Table: {
      headerBg: "#f8fafc",
      headerColor: "#334155",
      rowHoverBg: "#f8fafc",
    },
  },
};

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider locale={idID} theme={themeConfig}>
      <AntdApp>{children}</AntdApp>
    </ConfigProvider>
  );
}
