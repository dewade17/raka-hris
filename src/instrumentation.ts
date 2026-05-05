import { registerOTel } from "@vercel/otel";
import type { Instrumentation } from "next";

const serviceName = process.env.OTEL_SERVICE_NAME ?? "raka-hris";

export function register() {
  registerOTel({ serviceName });
}

export const onRequestError: Instrumentation.onRequestError = async (
  error,
  request,
  context,
) => {
  console.error(
    "[observability] request error",
    JSON.stringify({
      serviceName,
      message: getRequestErrorMessage(error),
      digest: getRequestErrorDigest(error),
      method: request.method,
      path: request.path,
      routerKind: context.routerKind,
      routePath: context.routePath,
      routeType: context.routeType,
      renderSource: context.renderSource,
      revalidateReason: context.revalidateReason,
      renderType: getRequestErrorRenderType(context),
    }),
  );
};

function getRequestErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown request error";
}

function getRequestErrorDigest(error: unknown) {
  if (typeof error !== "object" || error === null || !("digest" in error)) {
    return undefined;
  }

  const digest = error.digest;

  return typeof digest === "string" ? digest : undefined;
}

function getRequestErrorRenderType(context: object) {
  if (!("renderType" in context)) {
    return undefined;
  }

  return typeof context.renderType === "string" ? context.renderType : undefined;
}
