"use client";

import { Button, Result } from "antd";

export default function CompanyDashboardError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Result
      status="warning"
      title="Company dashboard could not be loaded"
      subTitle="The dashboard data is unavailable right now. Check your access and try again."
      extra={
        <Button type="primary" onClick={reset}>
          Try again
        </Button>
      }
    />
  );
}
