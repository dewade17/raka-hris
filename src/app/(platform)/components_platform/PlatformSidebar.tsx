"use client";

import { useEffect, useMemo, useState } from "react";
import { Menu, theme } from "antd";
import { usePathname } from "next/navigation";
import { getPlatformMenuItems } from "./platformSidebarItems";

export function PlatformSidebar() {
  const pathname = usePathname();
  const { token } = theme.useToken();
  const [hash, setHash] = useState("");
  const menuItems = useMemo(() => getPlatformMenuItems(), []);

  useEffect(() => {
    const updateHash = () => setHash(window.location.hash);

    updateHash();
    window.addEventListener("hashchange", updateHash);

    return () => window.removeEventListener("hashchange", updateHash);
  }, []);

  const selectedKey =
    hash && pathname === "/dashboard-platform"
      ? `${pathname}${hash}`
      : pathname;

  return (
    <Menu
      mode="inline"
      selectedKeys={[selectedKey]}
      items={menuItems}
      style={{
        borderInlineEnd: 0,
        background: token.colorBgContainer,
        paddingInline: 8,
      }}
    />
  );
}
