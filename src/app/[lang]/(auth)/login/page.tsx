import {
  RouteFeedbackPanel,
  RouteSecondaryLink,
} from "@/app/_components/route-feedback";
import { getSupportedLocale, type SupportedLocale } from "@/i18n/config";
import { getRouteFeedbackCopy } from "@/i18n/route-feedback";

type LoginPageProps = {
  params: Promise<{
    lang: string;
  }>;
};

const loginPageCopyByLocale: Record<
  SupportedLocale,
  {
    eyebrow: string;
    title: string;
    description: string;
  }
> = {
  en: {
    eyebrow: "Raka HRIS",
    title: "Sign-in is being prepared",
    description:
      "Authentication endpoints are present, but the account service has not been connected yet.",
  },
  id: {
    eyebrow: "Raka HRIS",
    title: "Halaman masuk sedang disiapkan",
    description:
      "Endpoint autentikasi sudah tersedia, tetapi layanan akun belum terhubung.",
  },
};

export default async function LoginPage({ params }: LoginPageProps) {
  const { lang } = await params;
  const locale = getSupportedLocale(lang);
  const loginCopy = loginPageCopyByLocale[locale];
  const feedbackCopy = getRouteFeedbackCopy(locale);

  return (
    <RouteFeedbackPanel
      eyebrow={loginCopy.eyebrow}
      title={loginCopy.title}
      description={loginCopy.description}
      statusCode="Auth"
      tone="neutral"
    >
      <RouteSecondaryLink href="/">
        {feedbackCopy.unauthorized.home}
      </RouteSecondaryLink>
    </RouteFeedbackPanel>
  );
}
