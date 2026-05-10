"use client";

import { App as AntdApp, ConfigProvider, theme, type ThemeConfig } from "antd";
import type { ReactNode } from "react";

const rakaThemeColors = {
  primary: "#051C50",
  dark: "#050B27",
  blue: "#2257B3",
  blueBright: "#105BBC",
  blueSoft: "#6299D2",
  blueLight: "#A4C1DF",
  white: "#FDFEFF",
  offWhite: "#EEF0EF",
  accent: "#DE8E46",
  accentSoft: "#F5B37F",
} as const;

const themeConfig: ThemeConfig = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: rakaThemeColors.primary,
    colorInfo: rakaThemeColors.blue,
    colorSuccess: "#16a34a",
    colorWarning: rakaThemeColors.accent,
    colorError: "#dc2626",
    colorBgBase: rakaThemeColors.white,
    colorBgContainer: rakaThemeColors.white,
    colorBgLayout: rakaThemeColors.offWhite,
    colorBorder: rakaThemeColors.blueLight,
    colorLink: rakaThemeColors.blueBright,
    colorText: rakaThemeColors.dark,
    colorTextBase: rakaThemeColors.dark,
    borderRadius: 8,
    controlHeight: 38,
    fontFamily: "var(--font-poppins), sans-serif",
    fontFamilyCode: "var(--font-poppins), sans-serif",
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
      headerBg: rakaThemeColors.offWhite,
      headerColor: rakaThemeColors.dark,
      rowHoverBg: rakaThemeColors.offWhite,
    },
  },
};

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider theme={themeConfig}>
      <AntdApp>{children}</AntdApp>
    </ConfigProvider>
  );
}
