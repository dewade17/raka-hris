import {
  RouteFeedbackLink,
  RouteFeedbackPanel,
} from "./_components/route-feedback";
import { getRouteFeedbackCopy } from "@/i18n/route-feedback";

export default function NotFound() {
  const copy = getRouteFeedbackCopy("en");

  return (
    <RouteFeedbackPanel
      eyebrow={copy.notFound.eyebrow}
      title={copy.notFound.title}
      description={copy.notFound.description}
      statusCode="404"
      tone="neutral"
    >
      <RouteFeedbackLink href="/">{copy.notFound.home}</RouteFeedbackLink>
    </RouteFeedbackPanel>
  );
}
