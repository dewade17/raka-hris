import {
  RouteFeedbackLink,
  RouteFeedbackPanel,
  RouteSecondaryLink,
} from "./_components/route-feedback";
import { getRouteFeedbackCopy } from "@/i18n/route-feedback";

export default function Unauthorized() {
  const copy = getRouteFeedbackCopy("en");

  return (
    <RouteFeedbackPanel
      eyebrow={copy.unauthorized.eyebrow}
      title={copy.unauthorized.title}
      description={copy.unauthorized.description}
      statusCode="401"
      tone="warning"
    >
      <RouteFeedbackLink href="/en/login">
        {copy.unauthorized.login}
      </RouteFeedbackLink>
      <RouteSecondaryLink href="/">{copy.unauthorized.home}</RouteSecondaryLink>
    </RouteFeedbackPanel>
  );
}
