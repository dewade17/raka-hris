import type { NextRequest } from "next/server";
import { completeGoogleAuth } from "@/features/auth/google/service";

export async function GET(request: NextRequest) {
  return completeGoogleAuth(request);
}
