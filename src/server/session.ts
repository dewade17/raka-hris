import { cookies } from "next/headers";
import db from "@/lib/db";
import { SessionStatus } from "@/generated/prisma/client";
import {
  SESSION_COOKIE_NAME,
  SESSION_DURATION_DAYS,
  createSessionExpiresAt,
  generateSessionToken,
  hashSessionToken,
  shouldRenewSession,
} from "./session-core";

type SessionDeviceContext = {
  membershipId?: string | null;
  deviceId?: string | null;
  deviceName?: string | null;
  platform?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
};

export type CreateUserSessionInput = SessionDeviceContext & {
  userId: string;
};

const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  secure: process.env.NODE_ENV === "production",
};

export function getSessionTokenSecret() {
  const secret = process.env.SESSION_TOKEN_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_TOKEN_SECRET must be set to at least 32 characters.",
    );
  }

  return secret;
}

export async function createUserSession(input: CreateUserSessionInput) {
  const token = generateSessionToken();
  const expiresAt = createSessionExpiresAt();
  const refreshTokenHash = hashSessionToken(token, getSessionTokenSecret());

  const session = await db.userSession.create({
    data: {
      userId: input.userId,
      membershipId: input.membershipId ?? null,
      refreshTokenHash,
      deviceId: input.deviceId ?? null,
      deviceName: input.deviceName ?? null,
      platform: input.platform ?? null,
      ipAddress: input.ipAddress ?? null,
      userAgent: input.userAgent ?? null,
      status: SessionStatus.ACTIVE,
      lastUsedAt: new Date(),
      expiresAt,
    },
  });

  await setSessionCookie(token, expiresAt);

  return session;
}

export async function getCurrentSession() {
  const token = await getSessionCookieValue();

  if (!token) {
    return null;
  }

  const now = new Date();
  const refreshTokenHash = hashSessionToken(token, getSessionTokenSecret());
  const session = await db.userSession.findFirst({
    where: {
      refreshTokenHash,
      status: SessionStatus.ACTIVE,
      expiresAt: {
        gt: now,
      },
    },
    include: {
      user: true,
      membership: {
        include: {
          company: {
            select: {
              companyId: true,
              name: true,
              status: true,
              deletedAt: true,
            },
          },
        },
      },
    },
  });

  if (!session || !session.user.isActive) {
    return null;
  }

  return session;
}

export async function renewCurrentSessionIfNeeded() {
  const token = await getSessionCookieValue();

  if (!token) {
    return null;
  }

  const now = new Date();
  const refreshTokenHash = hashSessionToken(token, getSessionTokenSecret());
  const session = await db.userSession.findFirst({
    where: {
      refreshTokenHash,
      status: SessionStatus.ACTIVE,
      expiresAt: {
        gt: now,
      },
    },
  });

  if (!session) {
    return null;
  }

  if (!shouldRenewSession(session.expiresAt, now)) {
    await db.userSession.update({
      where: {
        userSessionId: session.userSessionId,
      },
      data: {
        lastUsedAt: now,
      },
    });

    return session;
  }

  return renewUserSession(session.userSessionId);
}

export async function renewUserSession(userSessionId: string) {
  const token = generateSessionToken();
  const expiresAt = createSessionExpiresAt();
  const refreshTokenHash = hashSessionToken(token, getSessionTokenSecret());
  const now = new Date();

  const session = await db.userSession.update({
    where: {
      userSessionId,
    },
    data: {
      refreshTokenHash,
      renewedAt: now,
      lastUsedAt: now,
      expiresAt,
    },
  });

  await setSessionCookie(token, expiresAt);

  return session;
}

export async function revokeCurrentSession(reason = "User signed out") {
  const token = await getSessionCookieValue();

  if (token) {
    const refreshTokenHash = hashSessionToken(token, getSessionTokenSecret());

    await db.userSession.updateMany({
      where: {
        refreshTokenHash,
        status: SessionStatus.ACTIVE,
      },
      data: {
        status: SessionStatus.REVOKED,
        revokedAt: new Date(),
        revokedReason: reason,
      },
    });
  }

  await clearSessionCookie();
}

async function getSessionCookieValue() {
  const cookieStore = await cookies();

  return cookieStore.get(SESSION_COOKIE_NAME)?.value;
}

async function setSessionCookie(token: string, expiresAt: Date) {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    ...sessionCookieOptions,
    expires: expiresAt,
    maxAge: SESSION_DURATION_DAYS * 24 * 60 * 60,
  });
}

async function clearSessionCookie() {
  const cookieStore = await cookies();

  cookieStore.delete(SESSION_COOKIE_NAME);
}
