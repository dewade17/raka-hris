'use client';

import { useEffect, useMemo, useState } from 'react';
import { Menu, theme } from 'antd';
import { usePathname } from 'next/navigation';
import { getCompanyMenuItems } from './companySidebarItems';

type CompanySidebarProps = {
  collapsed: boolean;
  permissionKeys: string[];
};

export function CompanySidebar({ collapsed, permissionKeys }: CompanySidebarProps) {
  const pathname = usePathname();
  const { token } = theme.useToken();
  const [hash, setHash] = useState('');
  const menuItems = useMemo(() => getCompanyMenuItems(permissionKeys), [permissionKeys]);

  useEffect(() => {
    const updateHash = () => setHash(window.location.hash);

    updateHash();
    window.addEventListener('hashchange', updateHash);

    return () => window.removeEventListener('hashchange', updateHash);
  }, []);

  const selectedKey = pathname.startsWith('/employees') ? '/employees' : hash && pathname === '/dashboard-company' ? `${pathname}${hash}` : pathname;

  return (
    <nav
      id='company-navigation'
      aria-label='Company navigation'
    >
      <Menu
        mode='inline'
        inlineCollapsed={collapsed}
        selectedKeys={[selectedKey]}
        items={menuItems}
        style={{
          borderInlineEnd: 0,
          background: token.colorBgContainer,
          paddingInline: 8,
        }}
      />
    </nav>
  );
}
