'use client';

import type { CSSProperties, ReactNode } from 'react';
import { Tag, Typography } from 'antd';
import type { DashboardTone } from '@/features/company/company-dashboard/types';

const toneTagStyles: Record<DashboardTone, CSSProperties> = {
  success: {
    backgroundColor: '#dcfce7',
    borderColor: '#86efac',
    color: '#14532d',
  },
  warning: {
    backgroundColor: '#fef3c7',
    borderColor: '#facc15',
    color: '#713f12',
  },
  danger: {
    backgroundColor: '#fee2e2',
    borderColor: '#fca5a5',
    color: '#7f1d1d',
  },
  info: {
    backgroundColor: '#dbeafe',
    borderColor: '#93c5fd',
    color: '#1e3a8a',
  },
  default: {
    backgroundColor: '#f8fafc',
    borderColor: '#cbd5e1',
    color: '#334155',
  },
};

export function DashboardToneTag({ tone, label, statusText, style }: { tone: DashboardTone; label: string; statusText?: string; style?: CSSProperties }) {
  return (
    <Tag
      bordered
      style={{
        margin: 0,
        fontWeight: 600,
        ...toneTagStyles[tone],
        ...style,
      }}
    >
      {statusText ? `${label}: ${statusText}` : label}
    </Tag>
  );
}

export function DashboardSectionHeading({ id, title, description }: { id?: string; title: string; description: string }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <Typography.Title
        id={id}
        level={3}
        style={{ margin: 0 }}
      >
        {title}
      </Typography.Title>
      <Typography.Text type='secondary'>{description}</Typography.Text>
    </div>
  );
}

export function DashboardEmptyText({ children }: { children: ReactNode }) {
  return <Typography.Text style={{ color: 'var(--raka-text-secondary)' }}>{children}</Typography.Text>;
}

export function getDashboardStatisticStyles() {
  return {
    title: {
      color: 'var(--raka-text-secondary)',
      fontWeight: 500,
    },
    content: {
      color: 'var(--raka-text-primary)',
    },
  };
}

export function getCompletionStatusText(value: number) {
  return value > 0 ? 'Complete' : 'Missing';
}

export function normalizeDashboardText(value: string) {
  return value.replaceAll(String.fromCharCode(194, 183), '-').replaceAll(String.fromCharCode(183), '-');
}
