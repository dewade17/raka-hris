"use client";

import { App as AntdApp, ConfigProvider, theme, type ThemeConfig } from "antd";
import type { ReactNode } from "react";

// Keep these values in sync with the RAKA tokens in globals.css.
const rakaThemeColors = {
  primary: "#051c50",
  dark: "#050b27",
  blue: "#2257b3",
  blueBright: "#105bbc",
  blueSoft: "#6299d2",
  blueLight: "#d9e9f8",
  blueLighter: "#eef5ff",
  white: "#ffffff",
  offWhite: "#eef0ef",
  surface: "#ffffff",
  surfaceSoft: "#f6f8fb",
  accent: "#b85d12",
  accentHover: "#9a4d0f",
  accentSoft: "#f8dcc3",
  accentLighter: "#fff4ea",
  textPrimary: "#050b27",
  textSecondary: "#334155",
  textMuted: "#64748b",
  textInverse: "#ffffff",
  border: "#d9e1ea",
  borderSoft: "#e8edf3",
  success: "#15803d",
  successSoft: "#dcfce7",
  warning: "#92400e",
  warningSoft: "#fef3c7",
  danger: "#b91c1c",
  dangerSoft: "#fee2e2",
} as const;

const themeConfig: ThemeConfig = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: rakaThemeColors.primary,
    colorInfo: rakaThemeColors.blue,
    colorSuccess: rakaThemeColors.success,
    colorWarning: rakaThemeColors.warning,
    colorError: rakaThemeColors.danger,
    colorBgBase: rakaThemeColors.white,
    colorBgContainer: rakaThemeColors.surface,
    colorBgElevated: rakaThemeColors.surface,
    colorBgLayout: rakaThemeColors.offWhite,
    colorBorder: rakaThemeColors.border,
    colorBorderSecondary: rakaThemeColors.borderSoft,
    colorFillAlter: rakaThemeColors.surfaceSoft,
    colorLink: rakaThemeColors.blue,
    colorLinkHover: rakaThemeColors.blueBright,
    colorLinkActive: rakaThemeColors.primary,
    colorText: rakaThemeColors.textPrimary,
    colorTextBase: rakaThemeColors.textPrimary,
    colorTextHeading: rakaThemeColors.textPrimary,
    colorTextLabel: rakaThemeColors.textSecondary,
    colorTextDescription: rakaThemeColors.textSecondary,
    colorTextTertiary: rakaThemeColors.textMuted,
    colorTextQuaternary: rakaThemeColors.textMuted,
    colorTextDisabled: "#475569",
    colorTextLightSolid: rakaThemeColors.textInverse,
    colorIcon: rakaThemeColors.textSecondary,
    colorIconHover: rakaThemeColors.primary,
    controlOutline: rakaThemeColors.accent,
    controlOutlineWidth: 3,
    controlItemBgHover: rakaThemeColors.surfaceSoft,
    controlItemBgActive: rakaThemeColors.blueLighter,
    controlItemBgActiveHover: rakaThemeColors.blueLight,
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
    Menu: {
      itemColor: rakaThemeColors.textSecondary,
      itemHoverBg: rakaThemeColors.surfaceSoft,
      itemHoverColor: rakaThemeColors.primary,
      itemSelectedBg: rakaThemeColors.blueLighter,
      itemSelectedColor: rakaThemeColors.primary,
      itemHeight: 44,
    },
    Tag: {
      defaultBg: rakaThemeColors.surfaceSoft,
      defaultColor: rakaThemeColors.textSecondary,
      solidTextColor: rakaThemeColors.textInverse,
    },
    Table: {
      headerBg: rakaThemeColors.offWhite,
      headerColor: rakaThemeColors.textPrimary,
      borderColor: rakaThemeColors.borderSoft,
      rowHoverBg: rakaThemeColors.surfaceSoft,
      rowSelectedBg: rakaThemeColors.blueLighter,
      rowSelectedHoverBg: rakaThemeColors.blueLight,
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
