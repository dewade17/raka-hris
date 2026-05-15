import type { NextRequest } from "next/server";
import { startGoogleAuth } from "@/features/auth/google/service";

export async function GET(request: NextRequest) {
  return startGoogleAuth(request);
}
