"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { RouteFeedbackPanel } from "../_components/route-feedback";
import { RouteRetryButton } from "../_components/route-retry-button";
import { getRouteFeedbackCopy } from "@/i18n/route-feedback";

type ErrorPageProps = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

export default function Error({ error, unstable_retry }: ErrorPageProps) {
  const params = useParams<{ lang?: string }>();
  const copy = getRouteFeedbackCopy(params.lang);

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <RouteFeedbackPanel
      eyebrow={copy.error.eyebrow}
      title={copy.error.title}
      description={copy.error.description}
      statusCode={error.digest ? `Error ${error.digest}` : "Error"}
      tone="danger"
    >
      <RouteRetryButton onClick={() => unstable_retry()}>
        {copy.error.retry}
      </RouteRetryButton>
    </RouteFeedbackPanel>
  );
}
