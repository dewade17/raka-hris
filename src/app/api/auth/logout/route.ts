import { NextResponse } from "next/server";
import { revokeCurrentSession } from "@/server/session";

export async function POST() {
  await revokeCurrentSession();

  return NextResponse.json({
    success: true,
    message: "Signed out successfully.",
    redirectUrl: "/login",
  });
}
