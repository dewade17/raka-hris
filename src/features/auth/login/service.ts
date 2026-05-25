import { createUserSession } from "@/server/session";
import { verifyPassword } from "@/server/password";
import { resolvePostAuthRedirect } from "../post-auth-redirect";
import { findUserForPasswordLogin, markMembershipLoggedIn } from "./repository";
import type {
  LoginDeviceContext,
  LoginRequestInput,
  LoginServiceResult,
} from "./types";

const invalidCredentialsMessage = "Invalid email or password.";

export async function signInWithPassword(
  input: LoginRequestInput,
  context: LoginDeviceContext,
): Promise<LoginServiceResult> {
  const user = await findUserForPasswordLogin(input.email);

  if (!user || !user.isActive || !user.passwordLoginEnabled) {
    return {
      success: false,
      status: 401,
      message: invalidCredentialsMessage,
    };
  }

  const passwordMatches = await safelyVerifyPassword(
    user.passwordHash,
    input.password,
  );

  if (!passwordMatches) {
    return {
      success: false,
      status: 401,
      message: invalidCredentialsMessage,
    };
  }

  const membership = user.memberships[0];
  const redirectUrl = resolvePostAuthRedirect({
    platformRole: user.platformRole,
    hasActiveCompanyMembership: Boolean(membership),
  });

  await createUserSession({
    userId: user.id,
    membershipId: membership?.id ?? null,
    ipAddress: context.ipAddress ?? null,
    userAgent: context.userAgent ?? null,
  });

  if (membership) {
    await markMembershipLoggedIn(membership.id);
  }

  return {
    success: true,
    status: 200,
    message: "Signed in successfully.",
    redirectUrl,
  };
}

async function safelyVerifyPassword(passwordHash: string, password: string) {
  try {
    return await verifyPassword(passwordHash, password);
  } catch {
    return false;
  }
}
