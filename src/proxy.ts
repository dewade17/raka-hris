import { NextResponse, type NextRequest } from "next/server";
import {
  getLocaleFromPathname,
  localeRequestHeaderName,
} from "./i18n/config";

const requestIdHeaderName = "x-request-id";
const requestPathnameHeaderName = "x-request-pathname";

export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const requestId = getOrCreateRequestId(request);
  const requestLocale = getLocaleFromPathname(request.nextUrl.pathname);

  requestHeaders.set(requestIdHeaderName, requestId);
  requestHeaders.set(localeRequestHeaderName, requestLocale);
  requestHeaders.set(requestPathnameHeaderName, request.nextUrl.pathname);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set(requestIdHeaderName, requestId);

  return response;
}

function getOrCreateRequestId(request: NextRequest) {
  const forwardedRequestId = request.headers.get(requestIdHeaderName);

  if (isUsableRequestId(forwardedRequestId)) {
    return forwardedRequestId;
  }

  return crypto.randomUUID();
}

function isUsableRequestId(requestId: string | null): requestId is string {
  return Boolean(requestId && requestId.length <= 128);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)",
  ],
};
