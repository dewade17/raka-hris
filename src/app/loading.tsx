import { RouteLoadingSkeleton } from "./_components/route-feedback";
import { getRouteFeedbackCopy } from "@/i18n/route-feedback";

export default function Loading() {
  const copy = getRouteFeedbackCopy("en");

  return <RouteLoadingSkeleton label={copy.loading.label} />;
}
