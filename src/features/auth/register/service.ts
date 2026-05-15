import { Prisma } from "@/generated/prisma/client";
import { getCurrentAuthContext } from "@/server/auth";
import { hashPassword } from "@/server/password";
import { createUserSession } from "@/server/session";
import {
  dashboardCompanyUrl,
  dashboardPlatformUrl,
  resolvePostAuthRedirect,
} from "../post-auth-redirect";
import {
  createCompanyOwnerAccount,
  createWorkspaceForExistingUser,
  findUserByEmail,
} from "./repository";
import type {
  GoogleWorkspaceSetupRequestInput,
  RegisterRequestInput,
  RegisterServiceResult,
} from "./types";

export async function registerCompanyOwner(
  input: RegisterRequestInput,
): Promise<RegisterServiceResult> {
  const existingUser = await findUserByEmail(input.email);

  if (existingUser) {
    return {
      success: false,
      status: 409,
      message:
        "An account already exists for this email address. Sign in or use another work email.",
    };
  }

  try {
    const passwordHash = await hashPassword(input.password);

    await createCompanyOwnerAccount({
      ...input,
      passwordHash,
    });

    return {
      success: true,
      status: 201,
      message: "Account created successfully. You can now sign in.",
      redirectUrl: "/login",
    };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        success: false,
        status: 409,
        message:
          "An account or company workspace with the same details already exists.",
      };
    }

    return {
      success: false,
      status: 500,
      message:
        "Registration could not be completed right now. Please try again later.",
    };
  }
}

export async function completeGoogleWorkspaceSetup(
  input: GoogleWorkspaceSetupRequestInput,
): Promise<RegisterServiceResult> {
  const context = await getCurrentAuthContext();

  if (!context) {
    return {
      success: false,
      status: 401,
      message: "Sign in with Google before completing workspace setup.",
    };
  }

  if (context.membership) {
    return {
      success: true,
      status: 200,
      message: "Workspace is already available.",
      redirectUrl: resolvePostAuthRedirect({
        platformRole: context.user.platformRole,
        hasActiveCompanyMembership: true,
      }),
    };
  }

  const redirectUrl = resolvePostAuthRedirect({
    platformRole: context.user.platformRole,
    hasActiveCompanyMembership: false,
  });

  if (redirectUrl === dashboardPlatformUrl) {
    return {
      success: true,
      status: 200,
      message: "Platform access is already available.",
      redirectUrl: dashboardPlatformUrl,
    };
  }

  try {
    const workspace = await createWorkspaceForExistingUser({
      ...input,
      userId: context.user.userId,
      email: context.user.email,
    });

    await createUserSession({
      userId: context.user.userId,
      membershipId: workspace.membership.membershipId,
    });

    return {
      success: true,
      status: 201,
      message: "Workspace created successfully.",
      redirectUrl: dashboardCompanyUrl,
    };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        success: false,
        status: 409,
        message:
          "A company workspace with the same details already exists.",
      };
    }

    return {
      success: false,
      status: 500,
      message:
        "Workspace setup could not be completed right now. Please try again later.",
    };
  }
}

function isUniqueConstraintError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}
