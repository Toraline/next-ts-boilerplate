import { NotFoundError } from "lib/http/errors";
import type {
  AuthProvider,
  SignInParams,
  SignOutParams,
  SignInResult,
  SignOutResult,
} from "server/auth/provider";
import { buildSessionClearCookie, buildSessionCookie } from "server/auth/cookies";
import { loginRequestSchema, loginResponseSchema } from "server/auth/schemas";
import { getClientIp, getUserAgent } from "server/auth/requestUtils";
import {
  createUserSession,
  getActiveSessionContext,
  revokeSessionById,
} from "server/auth/sessionService";
import { recordAuditLog } from "modules/audit";
import * as userRepo from "modules/users/server/repo";
import { mapUserToPublic } from "server/auth/userMapper";
import { trackLoginAttempt } from "server/auth/rateLimit";

function safeIp(value: string | null) {
  return value === "unknown" ? undefined : (value ?? undefined);
}

async function handleSignIn(params: SignInParams): Promise<SignInResult> {
  const { request, body } = params;

  const clientIp = getClientIp(request) ?? "unknown";
  trackLoginAttempt(clientIp);

  const payload = loginRequestSchema.parse(body);

  const user =
    payload.email != null
      ? await userRepo.userByEmail(payload.email)
      : await userRepo.userById(payload.userId!);

  if (!user || user.deletedAt) {
    throw new NotFoundError("User not found");
  }

  const session = await createUserSession({
    userId: user.id,
    userAgent: getUserAgent(request),
    ipAddress: safeIp(clientIp) ?? null,
  });

  const responsePayload = loginResponseSchema.parse({
    user: mapUserToPublic(user),
    sessionId: session.id,
  });

  await recordAuditLog({
    actorType: "USER",
    actorUserId: user.id,
    action: "auth.session.created",
    targetType: "session",
    targetId: session.id,
    metadata: {
      sessionId: session.id,
      userId: user.id,
    },
    ip: safeIp(clientIp),
    userAgent: getUserAgent(request) ?? undefined,
  });

  return {
    user: responsePayload.user,
    session: {
      id: responsePayload.sessionId,
      expiresAt: session.expiresAt,
    },
    cookies: [buildSessionCookie(session.id, session.expiresAt)],
  };
}

async function handleSignOut(params: SignOutParams): Promise<SignOutResult> {
  const { request, sessionId, actor } = params;
  const resolvedSessionId = actor.session?.id ?? sessionId;
  const responseCookies = [buildSessionClearCookie()];

  if (resolvedSessionId) {
    await revokeSessionById(resolvedSessionId);
  }

  await recordAuditLog({
    actorType: actor.actorType,
    actorUserId: actor.actorUserId,
    action: "auth.session.revoked",
    targetType: "session",
    targetId: resolvedSessionId ?? "unknown",
    metadata: {
      sessionId: resolvedSessionId ?? null,
    },
    ip: getClientIp(request) ?? undefined,
    userAgent: getUserAgent(request) ?? undefined,
  });

  return { cookies: responseCookies };
}

export function createFakeAuthProvider(): AuthProvider {
  return {
    name: "FAKE",
    signIn: handleSignIn,
    signOut: handleSignOut,
    async signUp() {
      throw new Error("FakeAuthProvider.signUp is not implemented");
    },
    getSession: async ({ sessionId, now }) => {
      return getActiveSessionContext(sessionId, now ?? new Date());
    },
    getUser: async (userId) => {
      const user = await userRepo.userById(userId);
      if (!user) return null;
      return mapUserToPublic(user);
    },
    isEmailVerified: async () => true,
  };
}
