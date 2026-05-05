import { headers } from "next/headers";
import {
  RouteFeedbackLink,
  RouteFeedbackPanel,
} from "../_components/route-feedback";
import { localeRequestHeaderName } from "@/i18n/config";
import { getRouteFeedbackCopy } from "@/i18n/route-feedback";

export default async function NotFound() {
  const locale = (await headers()).get(localeRequestHeaderName);
  const copy = getRouteFeedbackCopy(locale);

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
