import { NextResponse } from "next/server";
import {
  completeGoogleWorkspaceSetup,
  registerCompanyOwner,
} from "@/features/auth/register/service";
import {
  validateGoogleWorkspaceSetupRequest,
  validateRegisterRequest,
} from "@/features/auth/register/validation";
import type { RegisterServiceResult } from "@/features/auth/register/types";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  if (isGoogleWorkspaceSetupPayload(payload)) {
    const validation = validateGoogleWorkspaceSetupRequest(payload);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: validation.message,
        },
        { status: 400 },
      );
    }

    const result = await completeGoogleWorkspaceSetup(validation.data);

    return createRegisterResponse(result);
  }

  const validation = validateRegisterRequest(payload);

  if (!validation.success) {
    return NextResponse.json(
      {
        success: false,
        message: validation.message,
      },
      { status: 400 },
    );
  }

  const result = await registerCompanyOwner(validation.data);

  return createRegisterResponse(result);
}

function createRegisterResponse(result: RegisterServiceResult) {
  return NextResponse.json(
    {
      success: result.success,
      message: result.message,
      ...(result.success ? { redirectUrl: result.redirectUrl } : {}),
    },
    { status: result.status },
  );
}

function isGoogleWorkspaceSetupPayload(
  payload: unknown,
): payload is Record<string, unknown> {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "registrationMode" in payload &&
    payload.registrationMode === "google-workspace"
  );
}
