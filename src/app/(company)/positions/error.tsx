"use client";

import { useEffect } from "react";
import { Alert, Button, Result } from "antd";

export default function PositionsError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Result
      status="error"
      title="Positions could not be loaded"
      subTitle="Please refresh the page or try again in a moment."
      extra={
        <Button type="primary" onClick={() => unstable_retry()}>
          Try again
        </Button>
      }
    >
      <Alert
        showIcon
        type="error"
        message="The position list is unavailable right now."
      />
    </Result>
  );
}
