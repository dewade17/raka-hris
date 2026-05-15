"use client";

import { Button, Result } from "antd";

export default function PlatformDashboardError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Result
      status="warning"
      title="Platform dashboard could not be loaded"
      subTitle="The platform data is unavailable right now. Check your access and try again."
      extra={
        <Button type="primary" onClick={reset}>
          Try again
        </Button>
      }
    />
  );
}
