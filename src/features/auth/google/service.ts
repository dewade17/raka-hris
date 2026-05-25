import { randomBytes } from 'node:crypto';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { createUserSession } from '@/server/session';
import { resolvePostAuthRedirect } from '../post-auth-redirect';
import { markMembershipLoggedIn } from '../login/repository';
import { createGoogleOnlyUser, findGoogleLinkableUserByEmail, findGoogleProviderAccount, linkGoogleProviderToUser, markGoogleProviderLoggedIn } from './repository';
import type { GoogleAuthResolution, GoogleUserProfile } from './types';

const GOOGLE_AUTHORIZATION_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_JWKS_URL = new URL('https://www.googleapis.com/oauth2/v3/certs');
const GOOGLE_OAUTH_STATE_COOKIE = 'raka_google_oauth_state';
const GOOGLE_OAUTH_STATE_MAX_AGE_SECONDS = 15 * 60;
const googleJwks = createRemoteJWKSet(GOOGLE_JWKS_URL);

type GoogleOAuthConfig = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
};

type GoogleTokenResponse = {
  id_token?: string;
  error?: string;
  error_description?: string;
};

export async function startGoogleAuth(request: NextRequest) {
  const config = getGoogleOAuthConfig(request);

  if (!config) {
    return redirectToLoginWithError(request, 'google_not_configured');
  }

  const state = randomBytes(24).toString('base64url');
  const cookieStore = await cookies();
  cookieStore.set(GOOGLE_OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: GOOGLE_OAUTH_STATE_MAX_AGE_SECONDS,
  });

  const authorizationUrl = new URL(GOOGLE_AUTHORIZATION_URL);
  authorizationUrl.searchParams.set('client_id', config.clientId);
  authorizationUrl.searchParams.set('redirect_uri', config.redirectUri);
  authorizationUrl.searchParams.set('response_type', 'code');
  authorizationUrl.searchParams.set('scope', 'openid email profile');
  authorizationUrl.searchParams.set('state', state);
  authorizationUrl.searchParams.set('prompt', 'select_account');

  return NextResponse.redirect(authorizationUrl);
}

export async function completeGoogleAuth(request: NextRequest) {
  const config = getGoogleOAuthConfig(request);

  if (!config) {
    return redirectToLoginWithError(request, 'google_not_configured');
  }

  const callbackUrl = request.nextUrl;
  const error = callbackUrl.searchParams.get('error');

  if (error) {
    await clearGoogleStateCookie();
    return redirectToLoginWithError(request, 'google_cancelled');
  }

  const code = callbackUrl.searchParams.get('code');
  const state = callbackUrl.searchParams.get('state');
  const expectedState = (await cookies()).get(GOOGLE_OAUTH_STATE_COOKIE)?.value;

  await clearGoogleStateCookie();

  if (!code || !state || !expectedState || state !== expectedState) {
    return redirectToLoginWithError(request, 'google_state_invalid');
  }

  try {
    const tokenResponse = await exchangeGoogleCodeForTokens(code, config);
    const idToken = tokenResponse.id_token;

    if (!idToken) {
      return redirectToLoginWithError(request, 'google_token_missing');
    }

    const profile = await verifyGoogleProfile(idToken, config.clientId);
    const resolution = await resolveGoogleAuth(profile);

    await createUserSession({
      userId: resolution.userId,
      membershipId: resolution.membershipId,
      ipAddress: getRequestIpAddress(request),
      userAgent: request.headers.get('user-agent'),
    });

    if (resolution.membershipId) {
      await markMembershipLoggedIn(resolution.membershipId);
    }

    return NextResponse.redirect(
      new URL(
        resolvePostAuthRedirect({
          platformRole: resolution.platformRole,
          hasActiveCompanyMembership: resolution.hasActiveWorkspace,
        }),
        request.url,
      ),
    );
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Google sign-in failed', error);
    }

    return redirectToLoginWithError(request, 'google_signin_failed');
  }
}

async function resolveGoogleAuth(profile: GoogleUserProfile): Promise<GoogleAuthResolution> {
  const providerAccount = await findGoogleProviderAccount(profile.providerAccountId);

  if (providerAccount) {
    await markGoogleProviderLoggedIn(providerAccount.id, profile);

    return resolveAuthenticatedUser(providerAccount.user.id, providerAccount.user.platformRole, providerAccount.user.isActive, providerAccount.user.memberships[0]?.id ?? null);
  }

  const linkableUser = await findGoogleLinkableUserByEmail(profile.email);

  if (linkableUser) {
    await linkGoogleProviderToUser(linkableUser.id, profile);

    return resolveAuthenticatedUser(linkableUser.id, linkableUser.platformRole, linkableUser.isActive, linkableUser.memberships[0]?.id ?? null);
  }

  const user = await createGoogleOnlyUser(profile);

  return resolveAuthenticatedUser(user.id, user.platformRole, user.isActive, user.memberships[0]?.id ?? null);
}

function resolveAuthenticatedUser(userId: string, platformRole: GoogleAuthResolution['platformRole'], isActive: boolean, membershipId: string | null): GoogleAuthResolution {
  if (!isActive) {
    throw new Error('Inactive Google user.');
  }

  return {
    userId,
    platformRole,
    membershipId,
    hasActiveWorkspace: Boolean(membershipId),
  };
}

async function exchangeGoogleCodeForTokens(code: string, config: GoogleOAuthConfig) {
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uri: config.redirectUri,
      grant_type: 'authorization_code',
    }),
  });

  const payload = (await response.json().catch(() => ({}))) as GoogleTokenResponse;

  if (!response.ok || payload.error) {
    throw new Error(payload.error_description || 'Google token exchange failed.');
  }

  return payload;
}

async function verifyGoogleProfile(idToken: string, audience: string) {
  const { payload } = await jwtVerify(idToken, googleJwks, {
    audience,
    issuer: ['https://accounts.google.com', 'accounts.google.com'],
  });

  const providerAccountId = typeof payload.sub === 'string' ? payload.sub : '';
  const email = typeof payload.email === 'string' ? payload.email.toLowerCase() : '';
  const emailVerified = payload.email_verified === true;

  if (!providerAccountId || !email || !emailVerified) {
    throw new Error('Google account email is not verified.');
  }

  return {
    providerAccountId,
    email,
    emailVerified,
    displayName: typeof payload.name === 'string' && payload.name.trim() ? payload.name.trim() : email,
    avatarUrl: typeof payload.picture === 'string' ? payload.picture : null,
  };
}

function getGoogleOAuthConfig(request: NextRequest): GoogleOAuthConfig | null {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return null;
  }

  return {
    clientId,
    clientSecret,
    redirectUri: process.env.GOOGLE_REDIRECT_URI || new URL('/api/auth/google/callback', request.url).toString(),
  };
}

async function clearGoogleStateCookie() {
  const cookieStore = await cookies();

  cookieStore.delete(GOOGLE_OAUTH_STATE_COOKIE);
}

function redirectToLoginWithError(request: NextRequest, errorCode: string) {
  const redirectUrl = new URL('/login', request.url);
  redirectUrl.searchParams.set('error', errorCode);

  return NextResponse.redirect(redirectUrl);
}

function getRequestIpAddress(request: NextRequest) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || null;
}
