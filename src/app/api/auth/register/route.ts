import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      message:
        "Registration is not available yet. Please connect the account provisioning service before enabling this endpoint.",
    },
    { status: 501 },
  );
}
