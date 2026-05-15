import { NextResponse, type NextRequest } from "next/server";
import { signInWithPassword } from "@/features/auth/login/service";
import { validateLoginRequest } from "@/features/auth/login/validation";

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);
  const validation = validateLoginRequest(payload);

  if (!validation.success) {
    return NextResponse.json(
      {
        success: false,
        message: validation.message,
      },
      { status: 400 },
    );
  }

  const result = await signInWithPassword(validation.data, {
    ipAddress: getRequestIpAddress(request),
    userAgent: request.headers.get("user-agent"),
  });

  return NextResponse.json(
    {
      success: result.success,
      message: result.message,
      ...(result.success ? { redirectUrl: result.redirectUrl } : {}),
    },
    { status: result.status },
  );
}

function getRequestIpAddress(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    null
  );
}
