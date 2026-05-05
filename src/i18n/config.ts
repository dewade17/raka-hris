export const supportedLocales = ["en", "id"] as const;

export type SupportedLocale = (typeof supportedLocales)[number];

export const defaultLocale: SupportedLocale = "en";
export const localeRequestHeaderName = "x-request-locale";

export function isSupportedLocale(
  locale: string | null | undefined,
): locale is SupportedLocale {
  return supportedLocales.includes(locale as SupportedLocale);
}

export function getSupportedLocale(
  locale: string | string[] | null | undefined,
): SupportedLocale {
  const normalizedLocale = Array.isArray(locale) ? locale[0] : locale;
  const baseLocale = normalizedLocale?.toLowerCase().split("-")[0];

  return isSupportedLocale(baseLocale) ? baseLocale : defaultLocale;
}

export function getLocaleFromPathname(pathname: string): SupportedLocale {
  const firstPathSegment = pathname.split("/").find(Boolean);

  return getSupportedLocale(firstPathSegment);
}
