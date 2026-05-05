import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      message:
        "Sign-in is not available yet. Please connect the authentication service before enabling this endpoint.",
    },
    { status: 501 },
  );
}
