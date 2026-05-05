"use client";

import { useEffect } from "react";
import { RouteFeedbackPanel } from "./_components/route-feedback";
import { RouteRetryButton } from "./_components/route-retry-button";
import { getRouteFeedbackCopy } from "@/i18n/route-feedback";
import "./globals.css";

type GlobalErrorPageProps = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

export default function GlobalError({
  error,
  unstable_retry,
}: GlobalErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const copy = getRouteFeedbackCopy("en");

  return (
    <html lang="en">
      <body>
        <RouteFeedbackPanel
          eyebrow={copy.globalError.eyebrow}
          title={copy.globalError.title}
          description={copy.globalError.description}
          statusCode={error.digest ? `Error ${error.digest}` : "Error"}
          tone="danger"
        >
          <RouteRetryButton onClick={() => unstable_retry()}>
            {copy.globalError.retry}
          </RouteRetryButton>
        </RouteFeedbackPanel>
      </body>
    </html>
  );
}
